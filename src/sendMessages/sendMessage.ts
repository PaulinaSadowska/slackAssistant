import { WebClient, LogLevel } from "@slack/web-api";
import config from "../config";

const client = new WebClient(config.token, {
  logLevel: LogLevel.DEBUG
});

interface SendMessageProps {
  channelId: string;
  messageText: string;
  messageBlocks?: any[];
}

export async function sendMessage({
    channelId,
    messageText,
    messageBlocks = []
}: SendMessageProps): Promise<void> {
  try {
    const result = await client.chat.postMessage({
      channel: channelId,
      text: messageText,
      blocks: messageBlocks
    });
    console.log(result);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
    throw new Error("Unable to send message");
  }
}
