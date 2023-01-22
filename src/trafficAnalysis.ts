import { Message, Thread } from "./fetchConversations";


interface CountMessagesProps {
    threads: Thread[],
    excludeBots?: boolean
}

export function countMessagesPerDay({ threads, excludeBots = false }: CountMessagesProps) : Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, Mode.Daily)
}

export function countMessagesPerMonth({ threads, excludeBots = false }: CountMessagesProps) : Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, Mode.Monthly)
}

export function countMessagesPerYear({ threads, excludeBots = false}: CountMessagesProps) : Map<string, ThreadStats[]> {
    return countMessages(threads, excludeBots, Mode.Yearly)
}

function countMessages(threads: Thread[], excludeBots: boolean, mode: Mode) : Map<string, ThreadStats[]> {

    let threadPerDay = new Map<string, ThreadStats[]>();

    threads.forEach((thread) => {
        if(!excludeBots || !thread.message.isBot){
            const date = toDateString(thread.message.timestamp, mode)
            const prevStats = threadPerDay.get(date)
            const numOfReplies = thread.replies.length - 1
            const timeToResolve = (numOfReplies > 0) ? timeDifference(thread.replies.at(-1), thread.replies[0]) : undefined
            const timeToRespond = (numOfReplies > 0) ? timeDifference(thread.replies[1], thread.replies[0]) : undefined
            
            const newStat : ThreadStats = {
                numOfReplies: numOfReplies,
                timeToResolveSeconds: timeToResolve,
                timeToRespondSeconds: timeToRespond
            }
            const newStats : ThreadStats[] = prevStats ? prevStats.concat(newStat) : [newStat]
            threadPerDay.set(date, newStats)
        }
    })

    return threadPerDay
}

function toDateString(timestamp: string, mode: Mode) : string {
    const slice = (mode == Mode.Daily) ? 10 : (mode == Mode.Monthly) ? 7 : 4
    return new Date(toTimestampInSeconds(timestamp) * 1_000).toJSON().slice(0, slice);
}

function timeDifference(message1: Message, message2: Message) : number {
    return (toTimestampInSeconds(message1.timestamp) - toTimestampInSeconds(message2.timestamp))
}

function toTimestampInSeconds(timestamp: string) : number {
    return +timestamp.split(".")[0];
}

enum Mode {
    Daily,
    Monthly,
    Yearly
  }

  interface ThreadStats {
    numOfReplies: number,
    // keywords
    timeToResolveSeconds?: number,
    timeToRespondSeconds?: number, 
}