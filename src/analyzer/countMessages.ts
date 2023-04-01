
import { Message, Thread } from "../fetcher/model/Thread.js";
import { ThreadStats } from "./model/ThreadStats.js";


interface CountMessagesProps {
    threads: Thread[],
    excludeBots?: boolean,
    keywords?: string[]
}

export function countMessagesPerMonth({ threads, excludeBots = false, keywords = [] }: CountMessagesProps): Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, keywords, Mode.Monthly)
}

export function countMessages(threads: Thread[], excludeBots: boolean, keywords = [] as string[], mode: Mode): Map<string, ThreadStats[]> {

    console.log(`🧮 Counting all messages`)

    let threadStatsPerPeriod = new Map<string, ThreadStats[]>();
    const lowercaseKeywords = keywords.map((word) => word.toLowerCase())

    function findKeywords(message: string): string[] {
        let foundKeywords: string[] = []
        lowercaseKeywords.forEach((word) => {
            if (message.indexOf(word.toLowerCase()) > 0) {
                foundKeywords = foundKeywords.concat(word.toLowerCase())
            }
        })
        return foundKeywords;
    }

    threads.forEach((thread) => {
        if (!excludeBots || !thread.message.isBot) {
            const date = toDateString(thread.message.timestamp, mode)
            const prevStats = threadStatsPerPeriod.get(date)
            const numOfReplies = thread.replies.length - 1
            const timeToResolve = (numOfReplies > 0) ? calculateTotalTimeSpentInThreadSeconds(thread.replies) : undefined
            const timeToRespond = (numOfReplies > 0) ? timeDifference(thread.replies[1], thread.replies[0]) : undefined

            const newStat: ThreadStats = {
                numOfReplies: numOfReplies,
                keywords: findKeywords(thread.message.text),
                timeToResolveSeconds: timeToResolve,
                timeToRespondSeconds: timeToRespond
            }
            const newStats: ThreadStats[] = prevStats ? prevStats.concat(newStat) : [newStat]
            threadStatsPerPeriod.set(date, newStats)
        }
    })

    return threadStatsPerPeriod
}

function toDateString(timestamp: string, mode: Mode): string {
    const slice = (mode == Mode.Daily) ? 10 : (mode == Mode.Monthly) ? 7 : 4
    return new Date(toTimestampInSeconds(timestamp) * 1_000).toJSON().slice(0, slice);
}

function timeDifference(message1: Message, message2: Message): number {
    return (toTimestampInSeconds(message1.timestamp) - toTimestampInSeconds(message2.timestamp))
}

function toTimestampInSeconds(timestamp: string): number {
    return +timestamp.split(".")[0];
}

enum Mode {
    Daily,
    Monthly,
    Yearly
}

function calculateTotalTimeSpentInThreadSeconds(replies: Message[]) {
    const timestamps: Date[] = replies.map((message: Message) => new Date(toTimestampInSeconds(message.timestamp) * 1_000))
    const result = calculateTotalTimeSpentMs(timestamps) / 1_000
    console.log("time spent hours: " + result / 3600)
    return result
}

function calculateTotalTimeSpentMs(timestamps: Date[]): number {
    let totalTimeSpent: number = 0;
    let previousTimestamp: Date | null = null;

    for (const timestamp of timestamps) {
        if (previousTimestamp !== null) {
            const timeDiff = timestamp.getTime() - previousTimestamp.getTime();
            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

            if (hoursDiff < 8) {
                totalTimeSpent += timeDiff;
            } else {
                console.log("💤 Conversation was moved to the next day")
            }
        }
        previousTimestamp = timestamp;
    }
    return totalTimeSpent;
}