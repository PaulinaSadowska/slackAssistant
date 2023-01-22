import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";
import { verifyRequestRate } from "./requestRate";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
    logLevel: LogLevel.WARN
});

export interface Thread {
    message: Message,
    replies: Message[]
}

export interface Message {
    type: string,
    text: string,
    user: string,
    isBot: boolean,
    timestamp: string,
}

interface FetchHistoryProps {
    channelId: string
    withReplies: boolean,
    latest: Date
    oldest: Date
}

export async function fetchConversations({ channelId, withReplies, latest, oldest }: FetchHistoryProps): Promise<Thread[]> {

    let threads: Thread[] = []
    let hasMore: boolean | undefined = true
    let nextCursor: string | undefined = undefined

    console.log("latest " + latest.toString())
    console.log("oldest " + oldest.toString())

    try {
        while (hasMore) {
            const result = await client.conversations.history({
                channel: channelId,
                limit: 50,
                cursor: nextCursor,
                latest: latest ? (latest.getTime() / 1000).toString() : "0",
                oldest: oldest ? (oldest.getTime() / 1000).toString() : "0"
            });

            hasMore = result.has_more
            nextCursor = result.response_metadata.next_cursor

            const messages : Message[] = result.messages.map((message) => {
                return {
                        type: message.type,
                        text: message.text,
                        user: message.user,
                        isBot: message.bot_id != undefined,
                        timestamp: message.ts
                    }
            });

            if (withReplies) {
                const threadsWithReplies: Thread[] = await Promise.all(messages.map(async (message): Promise<Thread> => {
                    const replies = await fetchReplies(channelId, message.timestamp)

                    return {
                        message: message,
                        replies: replies
                    };
                }));
                console.log("fetched messages with replies: " + threadsWithReplies.length)
                if (hasMore) {
                    await verifyRequestRate();
                }
                threads = threads.concat(threadsWithReplies)
            } else {
                const threadsWithReplies: Thread[] = messages.map((message) => {
                    return {
                        message: message,
                        replies: []
                    }
                });
                threads = threads.concat(threadsWithReplies)
            }
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

