import * as dotenv from 'dotenv' 
dotenv.config()

const config = {
    token: process.env["SLACK_BOT_TOKEN"],
    channels: new Map<string, string>([
        ["channel1", "C04L1360RRA"],
        ["channel2", "C05818QGTGX"]
    ]),
    keywords: ["Android", "iOS", "backend", "Kotlin", "VTE", "PR", "wydanie"],
    google: {
        spreadsheetId: "1WXh5bmwIcM-ZqDkg3dU4sRkAHmM8lj5m3rVnO0H3Y_I",
        credentials: JSON.parse(process.env.GOOGLE_CERT!)
    }
}

export default config;