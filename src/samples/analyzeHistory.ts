import fs = require('fs');
import { Thread } from '../fetchConversations';
import { countMessagesPerDay, countMessagesPerMonth, countMessagesPerYear } from '../countMessages';
import { averageThreadStats } from '../averageThreadStats';
import config from '../config';


fs.readFile(config.filenames.history, (err, data) => {
    if (err) throw err;
    let threads: Thread[] = JSON.parse(data.toString());

    console.log("MONTHLY ANALYSIS")
    const analysisPerMonth = countMessagesPerMonth({ threads: threads, excludeBots: true, keywords: config.keywords })
    const averagePerMonth = averageThreadStats(analysisPerMonth)
    console.log(averagePerMonth);
});
