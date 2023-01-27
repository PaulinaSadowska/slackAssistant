import config from "./config";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function verifyRequestRate(){
    console.log(`Sleeping for ${config.sleepTimeSeconds} seconds due to rate limit on Slack server side`)
    await sleep(config.sleepTimeSeconds * 1_000)
}
