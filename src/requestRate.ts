
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function verifyRequestRate(){
    console.log('Sleeping for 60 seconds due to rate limit on Slack server side')
    await sleep(60 * 1_000)
}
