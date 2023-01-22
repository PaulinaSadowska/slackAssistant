import fs = require('fs');
import { Thread } from '../fetchConversations';
import { countMessagesPerDay, countMessagesPerMonth, countMessagesPerYear } from '../trafficAnalysis';


fs.readFile('output/history.json', (err, data) => {
    if (err) throw err;
    let threads: Thread[] = JSON.parse(data.toString());

    const analysisPerDay = countMessagesPerDay({ threads: threads })
    console.log(analysisPerDay);

    const analysisPerMonth = countMessagesPerMonth({ threads: threads })
    console.log(analysisPerMonth);

    const analysisPerYear = countMessagesPerYear({ threads: threads, excludeBots: true })
    console.log(analysisPerYear);
});
