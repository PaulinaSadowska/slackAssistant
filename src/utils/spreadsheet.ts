import { GoogleSpreadsheet } from 'google-spreadsheet';
import { AverageThreadStatsPerPeriod } from '../analyzer/model/ThreadStats.js';
import config from '../config.js';

export default function sendToSpreadsheet(threadStats: AverageThreadStatsPerPeriod[]) {
  const doc = new GoogleSpreadsheet(config.google.spreadsheetId);
  const rows: any[] = threadStats.map((data: AverageThreadStatsPerPeriod) => {
    return [
      data.date,
      data.stats.numOfResolvedIssues,
      data.stats.averageNumberOfRepliesPerThread,
      data.stats.totalTimeSpentHours
    ]
  })

  const credentials = JSON.parse(process.env["GOOGLE_CERT"]!)
  console.log(config.google.spreadsheetId)

  async function accessSpreadsheet() {
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });

    await doc.loadInfo();
  }

  async function writeToSpreadsheet() {
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRows(rows);
  }

  accessSpreadsheet().then(writeToSpreadsheet);
}