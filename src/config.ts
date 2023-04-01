const config = {
    token: process.env["SLACK_BOT_TOKEN"],
    channel: {
        id: process.env["CHANNEL_ID"]!
    },
    keywords: ["Android", "iOS", "backend", "Kotlin", "VTE", "PR", "wydanie"],
    google: {
        spreadsheetId: process.env["GOOGLE_SPREADSHEET_ID"]!,
        credentials: JSON.parse(process.env["GOOGLE_CERT"]!)
    }
}

export default config;