### Setup

Create config.ts file:

``` typescript
const config = {
    token: "your-slack-token"
    channel: {
        id: "<id>",
        name: "<name>"
    },
    filenames: {
        history: "output/history.json",
        historyWithoutReplies: "output/historyWithoutReplies.json"
    },
    keywords: ["word1", "word2"],
    sleepTimeSeconds: 50

}

export default config;
```

run following scripts:

`ts-node fetchHistory.ts`
`ts-node analyzeHistory.ts`

