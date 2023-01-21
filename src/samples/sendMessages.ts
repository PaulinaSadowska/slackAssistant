import { findChannelId } from "../findChannelId";
import { sendMessage } from "../sendMessage";
import channel from "./channel";

["test", "Apka mi nie działa, pomocy!", "Poprosze CR"].forEach((text) => 
    sendMessage({
        channelId: channel.id,
        messageText: text
    })
)