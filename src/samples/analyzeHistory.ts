import fs = require('fs');
import { Thread } from '../fetchConversations';
import { countMessagesPerDay, countMessagesPerMonth, countMessagesPerYear } from '../countMessages';
import { averageThreadStats } from '../averageThreadStats';


fs.readFile('output/history.json', (err, data) => {
    if (err) throw err;
    let threads: Thread[] = JSON.parse(data.toString());

    console.log("DAILY ANALYSIS")
    const analysisPerDay = countMessagesPerDay({ threads: threads, excludeBots: true })
    const averagePerDay = averageThreadStats(analysisPerDay)
    console.log(averagePerDay);

    console.log("MONTHLY ANALYSIS")
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true })
    const averagePerMonth = averageThreadStats(analysisPerMonth)
    console.log(averagePerMonth);

    console.log("YEARLY ANALYSIS")
    const analysisPerYear = countMessagesPerYear({ threads: threads, excludeBots: true })
    const averagePerYear = averageThreadStats(analysisPerYear)
    console.log(averagePerYear);
});
