
import { averageThreadStats } from "./analyzer/averageThreadStats";
import { countMessagesPerMonth } from "./analyzer/countMessages";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats";
import config from "./config";
import { fetchConversations } from "./fetcher/fetchConversations";
import { writeJsonToFile } from "./utils/fileAccess";

const to = new Date(2023, 0, 23)
const from = new Date(2023, 0, 0)

fetchConversations({
    channelId: config.channel.id,
    withReplies: true,
    latest: to,
    oldest: from
}).then((threads) => {  
    console.log(`${threads.length} mesaages fetched successfully\nStarting analysis 🧪`)  
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords });
    const stats : AverageThreadStatsPerPeriod[] = averageThreadStats(analysisPerMonth)

    console.log(`Analysys finished!`)  

    writeJsonToFile(config.filenames.stats, stats)
})

