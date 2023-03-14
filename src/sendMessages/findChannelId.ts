import config from "../config";
import { WebClient, LogLevel } from "@slack/web-api";

const client = new WebClient(config.token, {
  logLevel: LogLevel.DEBUG
});

export async function findChannelId(name: string): Promise<string | undefined> {
  try {
    const result = await client.conversations.list({
      token: config.token
    });

    const channel = result.channels.find(c => c.name === name);
    if (channel) {
      return channel.id;
    } else {
      throw new Error(`Channel '${name}' not found`);
    }
  } catch (error) {
    console.error(`Error finding channel '${name}': ${error.message}`);
    throw new Error("Unable to find channel");
  }
}
