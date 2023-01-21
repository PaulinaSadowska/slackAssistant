import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";
import { findChannelId } from "./findChannelId.js";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
    logLevel: LogLevel.DEBUG
});

interface Message {
    type: string,
    text:string,
    user: string,
    isBot: boolean,
    timestamp: string
}

export async function fetchConversations({
    channelId,
}) : Promise<Message[]> {

    let messages : Message[]= []
    let hasMore : boolean | undefined = true
    let nextCursor : string | undefined = undefined

    try {
        while (hasMore) {
            const result = await client.conversations.history({
                channel: channelId,
                cursor: nextCursor,
            });
            console.log(result)

            hasMore = result.has_more
            nextCursor = result.response_metadata.next_cursor

            messages = messages.concat(result.messages.map((message) => {
                return {
                    type: message.type,
                    text: message.text,
                    user: message.user,
                    isBot: message.bot_id != undefined,
                    timestamp: message.ts
                };
            }));
        }

        console.log(`Messages count: ${messages.length}`);
        return messages;
    }
    catch (error) {
        console.error(error);
    }
    return []
}

