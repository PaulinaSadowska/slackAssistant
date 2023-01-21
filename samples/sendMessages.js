import { sendMessage } from "../sendMessage.js";

// text message, by channelName
sendMessage({
    channelName: "meow-bussiness",
    messageText: "test"
});

// block message, by channelId
sendMessage({
    channelId: "C04L1360RRA",
    messageText: "test",
    messageBlocks: [
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