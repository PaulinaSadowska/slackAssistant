const config = {
    token: process.env["SLACK_BOT_TOKEN"]!,
    channel: {
        id: process.env["CHANNEL_ID"]!
    },
    keywords: ["Android", "iOS", "backend", "Kotlin", "VTE", "PR", "wydanie"],
    google: {
        privateKey: process.env["GOOGLE_PRIVATE_KEY"]!,
        spreadsheetId: process.env["GOOGLE_SPREADSHEET_ID"]!,
        email: process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"]!,
    }
}

export default config;