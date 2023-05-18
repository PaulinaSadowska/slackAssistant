import config from "./config.js";
import { fetchConversations } from "./fetcher/fetchConversations.js";
import { writeJsonToFile } from "./utils/fileAccess.js";

const from = new Date("01/01/2023")
const to = new Date("06/01/2023")
export const channelName = "channel1"

const channelId = config.channels.get(channelName)
if (!channelId) {
    throw new Error(`
    No id found for channel ${channelName}. 
    Check config file to make sure channel with given name is defined.`);
}

console.log("channelId=" + channelId)

fetchConversations({
    channelId: channelId,
    withReplies: true,
    latest: to,
    oldest: from
}).then((threads) => {
    writeJsonToFile("output/history2.json", threads)
})