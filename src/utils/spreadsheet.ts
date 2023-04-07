import { GoogleSpreadsheet } from 'google-spreadsheet';
import { AverageThreadStatsPerPeriod } from '../analyzer/model/ThreadStats.js';
import config from '../config.js';

export default function sendToSpreadsheet(threadStats: AverageThreadStatsPerPeriod[], sheetTitle: string) {
  const doc = new GoogleSpreadsheet(config.google.spreadsheetId);
  const rows: any[] = threadStats.map((data: AverageThreadStatsPerPeriod) => {
    return [
      data.date,
      data.stats.numOfIssues,
      data.stats.numOfResolvedIssues,
      data.stats.averageNumberOfRepliesPerThread,
      data.stats.totalTimeSpentHours,
      data.stats.fte
    ]
  })

  const credentials = config.google.credentials

  async function accessSpreadsheet() {
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });

    await doc.loadInfo();
  }

  async function writeToSpreadsheet() {
    const sheet = doc.sheetsByTitle[sheetTitle]

    await sheet.addRows(rows);
  }

  accessSpreadsheet().then(writeToSpreadsheet);
}