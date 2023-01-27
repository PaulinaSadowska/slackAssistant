import { fetchConversations } from "../fetchConversations";
import config from "../config";
import { writeJsonToFile } from "../fileAccess";

fetchConversations({
    channelId: config.channel.id,
    withReplies: true,
    latest: new Date(2023, 0, 23),
    oldest: new Date(2023, 0, 0)
}).then((result) => {
    writeJsonToFile(config.filenames.history, result)
})


fetchConversations({
    channelId: config.channel.id,
    withReplies: false,
    latest: new Date(2023, 0, 23),
    oldest: new Date(2023, 0, 0)
}).then((result) => {
    writeJsonToFile(config.filenames.historyWithoutReplies, result)
})
