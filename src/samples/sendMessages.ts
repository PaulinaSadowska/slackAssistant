import { findChannelId } from "../findChannelId";
import { sendMessage } from "../sendMessage";
import config from "../config";

["test", "Apka mi nie działa, pomocy!", "Poprosze CR"].forEach((text) => 
    sendMessage({
        channelId: config.channel.id,
        messageText: text
    })
)