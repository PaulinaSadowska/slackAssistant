const config = {
    token: process.env["SLACK_BOT_TOKEN"],
    channel: {
        id: process.env["CHANNEL_ID"]
    },
    keywords: ["Android", "iOS", "backend", "Kotlin", "VTE", "PR", "wydanie"],
    filenames: {
        inputData: ["output/history.json", "output/history2.json"],
        stats: "output/stats.json"
    },
}

export default config;