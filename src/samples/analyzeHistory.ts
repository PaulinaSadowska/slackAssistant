import { Thread } from '../fetchConversations';
import { countMessagesPerDay, countMessagesPerMonth, countMessagesPerYear } from '../countMessages';
import { averageThreadStats } from '../averageThreadStats';
import config from '../config';
import { readJsonFromFile, writeJsonToFile } from '../fileAccess';


readJsonFromFile(config.filenames.history, (threads: Thread[]) => { 
    console.log("MONTHLY ANALYSIS")
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords })
    const averagePerMonth = averageThreadStats(analysisPerMonth)

    writeJsonToFile("output/stats.json", averagePerMonth)
});
