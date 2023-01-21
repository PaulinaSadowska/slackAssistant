import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";
import { findChannelId } from "./findChannelId.js";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
    logLevel: LogLevel.DEBUG
});

interface SendMessageProps {
    channelId: string,
    messageText: string
    messageBlocks?: any[]
}

export async function sendMessage({ channelId, messageText, messageBlocks}: SendMessageProps) {
    try {
        const result = await client.chat.postMessage({
            channel: channelId,
            text: messageText,
            blocks: messageBlocks
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}
