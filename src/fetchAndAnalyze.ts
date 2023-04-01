
import { averageThreadStats } from "./analyzer/averageThreadStats.js";
import { countMessagesPerMonth } from "./analyzer/countMessages.js";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats.js";
import config from "./config.js";
import { fetchConversations } from "./fetcher/fetchConversations.js";
import sortThreadStats from "./utils/sortThreadStats.js";
import sendToSpreadsheet from "./utils/spreadsheet.js";


const today: Date = new Date();
const firstDayOfLastMonth: Date = new Date(today.getFullYear(), today.getMonth() - 1, 1);

const from = process.env.INPUT_DATEFROM ? new Date(process.env.INPUT_DATEFROM) : firstDayOfLastMonth
const to = process.env.INPUT_DATETO ? new Date(process.env.INPUT_DATETO) : today;

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


