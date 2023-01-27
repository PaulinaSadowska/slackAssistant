import { Thread } from '../fetchConversations';
import { countMessagesPerDay, countMessagesPerMonth, countMessagesPerYear } from '../countMessages';
import { averageThreadStats } from '../averageThreadStats';
import config from '../config';
import { readJsonFromFile, writeJsonToFile } from '../utils/fileAccess';
import { AverageThreadStatsPerPeriod } from './data/ThreadStats';


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
