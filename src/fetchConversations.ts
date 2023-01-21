import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";
import { findChannelId } from "./findChannelId.js";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
    logLevel: LogLevel.WARN
});

let requestCount = 1

interface Thread {
    message: Message,
    replies: Message[]
}

interface Message {
    type: string,
    subtype?: string,
    text: string,
    user: string,
    isBot: boolean,
    timestamp: string,
}

function delay(seconds: number) {
    return new Promise( resolve => setTimeout(resolve, seconds * 1000) );
}

export async function fetchConversations({
    channelId,
}): Promise<Thread[]> {

    let threads: Thread[] = []
    let hasMore: boolean | undefined = true
    let nextCursor: string | undefined = undefined

    try {
        while (hasMore) {
            const result = await client.conversations.history({
                channel: channelId,
                cursor: nextCursor,
            });

            requestCount += 1;
            if(requestCount % 100 == 0){
                requestCount = 0
                console.log('Sleeping for 60 seconds due to rate limit on Slack server side')
                await delay(60)
            }


            hasMore = result.has_more
            nextCursor = result.response_metadata.next_cursor

            threads = threads.concat(result.messages.map((message) => {
                const thread = {
                    type: message.type,
                    subtype: message.subtype,
                    text: message.text,
                    user: message.user,
                    isBot: message.bot_id != undefined,
                    timestamp: message.ts
                }
                return {
                    message: thread,
                    replies: []
                }
            }));
        }

        const threadsWithReplies = await mapToThreadWithReplies(channelId, threads)

        console.log(`Threads count: ${threads.length}`);
        console.log(`ThreadsWithReplies count: ${threadsWithReplies.length}`);
        return threadsWithReplies;
    }
    catch (error) {
        console.error(error);
    }
    return []
}

async function mapToThreadWithReplies(
    channelId: string,
    threads: Thread[]
): Promise<Thread[]> {
    try {
        threads.map((thread) => {
            const ts = thread.message.timestamp
            if (ts != undefined) {
                const replies = fetchReplies(channelId, ts)
                
                return {
                    message: thread.message,
                    replies: replies
                };
            }
            return thread
        })

    }
    catch (error) {
        console.error(error);
    }
    return []
}

async function fetchReplies(
    channelId: string,
    ts: string,
): Promise<Message[]> {

    let messages: Message[] = []
    let hasMore: boolean | undefined = true
    let nextCursor: string | undefined = undefined

    try {
        while (hasMore) {
            await client.conversations.replies({
                channel: channelId,
                ts: ts,
                cursor: nextCursor,
            }).then((result) => {
                requestCount += 1;
                if(requestCount % 100 == 0){
                    requestCount = 0
                    console.log('Sleeping for 60 seconds due to rate limit on Slack server side')
                    delay(60)
                }

                hasMore = result.has_more
                nextCursor = result.response_metadata.next_cursor

                messages = messages.concat(result.messages.map((message) => {
                return {
                    type: message.type,
                    text: message.text,
                    user: message.user,
                    isBot: message.bot_id != undefined,
                    timestamp: message.ts
                }
            }));
            });
        }
        if(messages.length > 1){
            console.log(messages)
        }
        return messages;
    }
    catch (error) {
        console.error(error);
    }
    return []
}

