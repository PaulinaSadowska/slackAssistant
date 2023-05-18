### About:

This project allows you to analyze your slack channel and export basic stats to the spreadsheet.

It calculates:

- number of issues
- number of resolved issues (issues with at least one reply)
- average number of replies in thread
- total time spent in the thread
- FTE

### Setup:
1. Fork the repository.

2. Set up the following data in Github secrets:
    - `SLACK_BOT_TOKEN`: Token of the bot that is added to the Slack channel and can read messages.
    - `GOOGLE_CERT`: JSON certificate file with service account email and private key that supports the Spreadsheets API.

3. Modify `config.ts` file by adding 
- spreadsheetId (ID that can be found in the URL (`spreadsheets/d/{GOOGLE_SPREADSHEET_ID}/edit#gid=0`))
- channels map:
    - key - identifier that you can use to run workflow locally. It's also used as a `sheetTitle`.
    - value - channelId found on slack.

3. Create spreadsheet with comulns for the following data:
- date,
- numOfIssues,
- numOfResolvedIssues,
- averageNumberOfRepliesPerThread,
- totalTimeSpentHours,
- fte

4. Run the Slack Channel Report action or wait for cron to run it (3AM on the first day of the month).

### Local setup:

1. create `.env` file:
```
SLACK_BOT_TOKEN="XXXX"
GOOGLE_CERT={ ... }
```


2. Run `npm run build`

3. Run:
- `node dist/src/fetch.js` to fetch data for given date and saave to file in `output/` directory. Modify script if you want to change dates or output file name.
- `node dist/src/analyze.js` to analyze local files. Modify script if you want to analyze different files.
