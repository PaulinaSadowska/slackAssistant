### About:

This project allows you to analyze your slack channel and export basic stats to the spreadsheet.

It calculates:

- number of issues
- number of resolved issues (issues with at least one reply)
- average number of replies in thread
- total time spent in the thread
- FTE (TBD)

### Setup:
1. Fork the repository.

2. Set up the following data in Github secrets:
    - `CHANNEL_ID`: ID of the Slack channel you want to analyze.
    - `SLACK_BOT_TOKEN`: Token of the bot that is added to the Slack channel and can read messages.
    - `GOOGLE_CERT`: JSON certificate file with service account email and private key that supports the Spreadsheets API.
    - `GOOGLE_SPREADSHEET_ID`: ID that can be found in the URL (spreadsheets/d/{GOOGLE_SPREADSHEET_ID}/edit#gid=0).

3. Run the Slack Channel Report action or wait for cron to run it (3AM on the first day of the month).


