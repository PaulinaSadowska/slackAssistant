
import { averageThreadStats } from "./analyzer/averageThreadStats.js";
import { countMessagesPerMonth } from "./analyzer/countMessages.js";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats.js";
import config from "./config.js";
import { fetchConversations } from "./fetcher/fetchConversations.js";
import sortThreadStats from "./utils/sortData.js";
import sendToSpreadsheet from "./utils/spreadsheet.js";

const from = new Date("01/03/2023")
const to = new Date("04/01/2023")

fetchConversations({
    channelId: config.channel.id!,
    withReplies: true,
    latest: to,
    oldest: from
}).then((threads) => {
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords });
    const stats: AverageThreadStatsPerPeriod[] = averageThreadStats(analysisPerMonth)
    const sortedStats = sortThreadStats(stats)

    console.log("stats ready!")
    sortedStats.forEach((stat) => {
        console.log(stat.date + " => " + stat.stats.numOfIssues)
    })
    sendToSpreadsheet(sortedStats)
})


