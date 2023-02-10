import { averageThreadStats } from "./analyzer/averageThreadStats";
import { countMessagesPerMonth } from "./analyzer/countMessages";
import { AverageThreadStatsPerPeriod } from "./analyzer/model/ThreadStats";
import config from "./config";
import { readJsonFromFile, writeJsonToFile } from "./utils/fileAccess";



let averagePerMonth : AverageThreadStatsPerPeriod[] = []
const filenames : string[] = config.filenames.inputData

filenames.forEach( function (filename: string) {
    const threads = readJsonFromFile(filename);
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords });
    const stats = averageThreadStats(analysisPerMonth)

    averagePerMonth = averagePerMonth.concat(stats)
    console.log("analyzed file:" + filename)
})

writeJsonToFile(config.filenames.stats, averagePerMonth)
