import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";
import { verifyRequestRate } from "./requestRate.js";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
    logLevel: LogLevel.WARN
});

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

            hasMore = result.has_more
            nextCursor = result.response_metadata.next_cursor

            var threadsWithReplies: Thread[] = await Promise.all(result.messages.map(async (message): Promise<Thread> => {
                const replies = await fetchReplies(channelId, message.ts)
                
                return {
                    message: {
                        type: message.type,
                        subtype: message.subtype,
                        text: message.text,
                        user: message.user,
                        isBot: message.bot_id != undefined,
                        timestamp: message.ts
                    },
                    replies: replies
                };
            }));
            console.log("fetched messages with replies: " + threadsWithReplies.length)
            await verifyRequestRate();

            threads = threads.concat(threadsWithReplies)
        }

        console.log(`ThreadsWithReplies count: ${threads.length}`);
        return threads;
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
            const result = await client.conversations.replies({
                channel: channelId,
                ts: ts,
                cursor: nextCursor,
            })

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
            }))
        };
        return messages;
    }
    catch (error) {
        console.error(error);
    }
    return []
}

