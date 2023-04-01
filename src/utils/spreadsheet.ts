
import { GoogleSpreadsheet } from 'google-spreadsheet';
import config from '../config.js';

export default function sendToSpreadsheet() {
    const doc = new GoogleSpreadsheet("1WXh5bmwIcM-ZqDkg3dU4sRkAHmM8lj5m3rVnO0H3Y_I");
    const rows = [
      ['John', 'Doe', 'john.doe@example.com'],
      ['Jane', 'Smith', 'jane.smith@example.com'],
      ['Bob', 'Jones', 'bob.jones@example.com'],
    ];

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