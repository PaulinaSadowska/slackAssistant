import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
  logLevel: LogLevel.DEBUG
});

export async function findChannelId(name: string) : Promise<string | undefined> {
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