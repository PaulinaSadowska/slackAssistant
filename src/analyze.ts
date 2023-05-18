
import { averageThreadStats } from "./analyzer/averageThreadStats.js";
import { countMessagesPerMonth } from "./analyzer/countMessages.js";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats.js";
import config from "./config.js";
import { channelName } from "./fetch.js";
import { Thread } from "./fetcher/model/Thread.js";
import { readJsonFromFile } from "./utils/fileAccess.js";
import sortThreadStats from "./utils/sortThreadStats.js";
import sendToSpreadsheet from "./utils/spreadsheet.js";

const files = [
    "history.json",
    "history2.json"
]

const threads: Thread[] = files.flatMap((name) => readJsonFromFile(`output/${name}`))

const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords });
const stats: AverageThreadStatsPerPeriod[] = averageThreadStats(analysisPerMonth)
const sortedStats = sortThreadStats(stats)

console.log("stats ready!")
sortedStats.forEach((stat) => {
    console.log(stat.date + " => " + stat.stats.numOfIssues)
})
sendToSpreadsheet(sortedStats, channelName)


