import config from "./config.js";
import { fetchConversations } from "./fetcher/fetchConversations.js";
import { writeJsonToFile } from "./utils/fileAccess.js";

const from = new Date("01/01/2023")
const to = new Date("03/01/2023")

fetchConversations({
    channelId: config.channel.id!,
    withReplies: true,
    latest: to,
    oldest: from
}).then((threads) => {
    writeJsonToFile("output/history2.json", threads)
})