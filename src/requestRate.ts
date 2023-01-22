
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const sleepTimeSeconds = 30

export async function verifyRequestRate(){
    console.log(`Sleeping for ${sleepTimeSeconds} seconds due to rate limit on Slack server side`)
    await sleep(sleepTimeSeconds * 1_000)
}
