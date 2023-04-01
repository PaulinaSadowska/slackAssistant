
import { GoogleSpreadsheet } from 'google-spreadsheet';
import config from '../config.js';

export default function sendToSpreadsheet() {
    const doc = new GoogleSpreadsheet(config.google.spreadsheetId);
    const rows = [
      ['John', 'Doe', 'john.doe@example.com'],
      ['Jane', 'Smith', 'jane.smith@example.com'],
      ['Bob', 'Jones', 'bob.jones@example.com'],
    ];

    console.log(config.google.privateKey.slice(0, 5))
    
    async function accessSpreadsheet() {
      await doc.useServiceAccountAuth({
        client_email: config.google.email,
        private_key: config.google.privateKey,
      });
      
      await doc.loadInfo();
    }
    
    async function writeToSpreadsheet() {
      const sheet = doc.sheetsByIndex[0];
      
      await sheet.addRows(rows);
    }
    
    accessSpreadsheet().then(writeToSpreadsheet);
}