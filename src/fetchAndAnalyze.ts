
import { averageThreadStats } from "./analyzer/averageThreadStats";
import { countMessagesPerMonth } from "./analyzer/countMessages";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats";
import config from "./config";
import { fetchConversations } from "./fetcher/fetchConversations";
import { writeJsonToFile } from "./utils/fileAccess";

const from = new Date("01/01/2023")
const to = new Date("04/01/2023")

fetchConversations({
    channelId: config.channel.id,
    withReplies: true,
    latest: to,
    oldest: from
}).then((threads) => {  
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords });
    const stats : AverageThreadStatsPerPeriod[] = averageThreadStats(analysisPerMonth)

    writeJsonToFile(config.filenames.stats, stats)
})

