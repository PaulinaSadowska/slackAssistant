import { Message, Thread } from "./fetchConversations";


interface CountMessagesProps {
    threads: Thread[],
    excludeBots?: boolean,
    keywords?: string[]
}

export function countMessagesPerDay({ threads, excludeBots = false, keywords = [] }: CountMessagesProps): Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, keywords, Mode.Daily)
}

export function countMessagesPerMonth({ threads, excludeBots = false, keywords = [] }: CountMessagesProps): Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, keywords, Mode.Monthly)
}

export function countMessagesPerYear({ threads, excludeBots = false, keywords = [] }: CountMessagesProps): Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, keywords, Mode.Yearly)
}

function countMessages(threads: Thread[], excludeBots: boolean, keywords = [], mode: Mode): Map<string, ThreadStats[]> {

    let threadStatsPerPeriod = new Map<string, ThreadStats[]>();
    const lowercaseKeywords = keywords.map((word) => word.toLowerCase())

    function findKeywords(message: string): string[] {
        let foundKeywords = []
        lowercaseKeywords.forEach((word) => {
            if (message.indexOf(word.toLowerCase()) > 0) {
                foundKeywords = foundKeywords.concat(word.toLowerCase())
            }
        })
        return lowercaseKeywords;
    }

    threads.forEach((thread) => {
        if (!excludeBots || !thread.message.isBot) {
            const date = toDateString(thread.message.timestamp, mode)
            const prevStats = threadStatsPerPeriod.get(date)
            const numOfReplies = thread.replies.length - 1
            const timeToResolve = (numOfReplies > 0) ? timeDifference(thread.replies.at(-1), thread.replies[0]) : undefined
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

export interface ThreadStats {
    numOfReplies: number,
    keywords: string[],
    timeToResolveSeconds?: number,
    timeToRespondSeconds?: number,
}