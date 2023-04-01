import { GoogleSpreadsheet } from 'google-spreadsheet';
import { AverageThreadStatsPerPeriod } from '../analyzer/model/ThreadStats.js';
import config from '../config.js';

export default function sendToSpreadsheet(threadStats: AverageThreadStatsPerPeriod[]) {
    const doc = new GoogleSpreadsheet(config.google.spreadsheetId);
    const rows = threadStats.map( (data: AverageThreadStatsPerPeriod) => {
        [
          data.date,
          data.stats.numOfResolvedIssues,
          data.stats.averageNumberOfRepliesPerThread,
          data.stats.totalTimeSpentHours,
        ]
    })

    const credsString = process.env["GOOGLE_CERT"]!;
    const creds = JSON.parse(credsString)
    console.log(config.google.spreadsheetId)

    async function accessSpreadsheet() {
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      
      await doc.loadInfo();
    }
    
    async function writeToSpreadsheet() {
      const sheet = doc.sheetsByIndex[0];
      
      await sheet.addRows(rows);
    }
    
    accessSpreadsheet().then(writeToSpreadsheet);
}