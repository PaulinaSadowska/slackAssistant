import token from "./token.js";
import { WebClient, LogLevel } from "@slack/web-api";


// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const client = new WebClient(token, {
  logLevel: LogLevel.DEBUG
});

async function findConversation(name) {
  try {
    const result = await client.conversations.list({
      token: token
    });

    for (const channel of result.channels) {
      console.log("Channel: " + channel.name);
      if (channel.name === name) {
        return channel.id;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function sendMessage(channelName) {
    try {
    const channelId = await findConversation(channelName);
    console.log("Found conversation ID: " + channelId);
    const result = await client.chat.postMessage({
        channel: channelId,
        text: "fallback",
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Hello world! \n*<https://google.com|Some awesome link>*"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Approve"
                        },
                        "style": "primary",
                        "action_id": "approve",
                        "value": "click_me_123"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Deny"
                        },
                        "style": "danger",
                        "action_id": "deny",
                        "value": "click_me_123"
                    }
                ]
            }
        ]  
    });
     console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}

sendMessage("meow-bussiness");