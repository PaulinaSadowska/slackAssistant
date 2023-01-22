import { Thread } from "./fetchConversations";


interface CountMessagesProps {
    threads: Thread[],
    excludeBots?: boolean
}

export function countMessagesPerDay({ threads, excludeBots = false }: CountMessagesProps) : Map<string, number> {
    return countMessages(threads, excludeBots, Mode.Daily)
}

export function countMessagesPerMonth({ threads, excludeBots = false }: CountMessagesProps) : Map<string, number> {
    return countMessages(threads, excludeBots, Mode.Monthly)
}

export function countMessagesPerYear({ threads, excludeBots = false}: CountMessagesProps) : Map<string, number> {
    return countMessages(threads, excludeBots, Mode.Yearly)
}

function countMessages(threads: Thread[], excludeBots: boolean, mode: Mode) : Map<string, number> {

    let threadPerDay = new Map<string, number>();

    threads.forEach((thread) => {
        if(!excludeBots || !thread.message.isBot){
            const date = toDateString(thread.message.timestamp, mode)
            const prev = threadPerDay.get(date)
            threadPerDay.set(date, prev ? prev + 1 : 1)
        }
    })

    return threadPerDay
}

function toDateString(timestamp: string, mode: Mode) : string {
    const slice = (mode == Mode.Daily) ? 10 : (mode == Mode.Monthly) ? 7 : 4
    return new Date(+timestamp.split(".")[0] * 1_000).toJSON().slice(0, slice);
}

enum Mode {
    Daily,
    Monthly,
    Yearly
  }