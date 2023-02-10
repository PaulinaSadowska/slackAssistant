
import { WebClient, LogLevel } from "@slack/web-api";
import config from "../config";
import { Message, Thread } from "./model/Thread";

const client = new WebClient(config.token, {
    logLevel: LogLevel.WARN
});

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

    console.log("⏳ Fetching messages")
    console.log("from: " + oldest.toString())
    console.log("to: " + latest.toString())

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
                console.log(`Fetched ${threadsWithReplies.length} messages with replies`)
                if (hasMore) {
                    await limitRequestRate();
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

        console.log(`✅ Fetching messaged finished (${threads.length})`)
        return threads;
    }
    catch (error) {
        console.log("❌ Something went wrong:")
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
        messages.shift() // remove first element to not duplicate thread message
        return messages;
    }
    catch (error) {
        console.log("❌ Something went wrong:")
        console.error(error);
    }
    return []
}

async function limitRequestRate(){
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const sleepTimeSeconds = 50

    console.log(`💤 Sleeping for ${sleepTimeSeconds}s due to rate limit on Slack server side`)
    await sleep(sleepTimeSeconds * 1_000)
}
