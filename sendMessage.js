import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
  logLevel: LogLevel.DEBUG
});

async function findChannelId(name) {
  try {
    const result = await client.conversations.list({
      token: token
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        return channel.id;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

export async function sendMessage({
    channelId,
    channelName,
    messageText,
    messageBlocks
}) {
    try {
        const _channelId = channelId ? channelId : await findChannelId(channelName);
        console.log("sends message to channelId: " + _channelId);
        const result = await client.chat.postMessage({
            channel: _channelId,
            text: messageText,
            blocks: messageBlocks
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}