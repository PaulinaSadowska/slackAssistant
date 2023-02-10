### Setup

Create config.ts file:

``` typescript
const config = {
    token: "your-slack-token"
    channel: {
        id: "<id>",
    },
    keywords: ["keyword1", "keyword2"],
    filenames: {
        inputData: ["output/history.json", "output/history2.json"],
        stats: "output/stats.json"
    }
}

export default config;
```

run following scripts:

`ts-node fetchAndAnalyze.ts`

or

`ts-node fetchHistory.ts`

`ts-node analyzeHistory.ts`

