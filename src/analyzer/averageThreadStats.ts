import { AggregatedThreadStats, AverageThreadStats, AverageThreadStatsPerPeriod, ThreadStats } from "./model/ThreadStats";
import { average, sum } from "./utils/math";

export function averageThreadStats(threadStats: Map<string, ThreadStats[]>): AverageThreadStatsPerPeriod[] {

    console.log(`🧪 Starting analysis`)

    let averageThreadStats: AverageThreadStatsPerPeriod[] = [];

    threadStats.forEach((value: ThreadStats[], key: string) => {

        const initialValue: AggregatedThreadStats = {
            numOfReplies: [],

            timeToResolveSeconds: [],
            timeToRespondSeconds: [],

            keywordsCount: new Map<string, number>(),
            numOfResolvedIssues: 0, // issues with at  least one response
        }

        const aggregated = value.reduce((acc, current) => {
            let keywordsCount = acc.keywordsCount

            current.keywords.forEach((word) => {
                const currentCount = keywordsCount.get(word)
                const count = currentCount ? currentCount + 1 : 1
                keywordsCount.set(word, count)
            })

            return {
                numOfReplies: acc.numOfReplies.concat(current.numOfReplies),

                timeToResolveSeconds: current.timeToResolveSeconds ? acc.timeToResolveSeconds.concat(current.timeToResolveSeconds) : acc.timeToResolveSeconds,
                timeToRespondSeconds: current.timeToRespondSeconds ? acc.timeToRespondSeconds.concat(current.timeToRespondSeconds) : acc.timeToRespondSeconds,

                keywordsCount: keywordsCount,
                numOfResolvedIssues: current.timeToResolveSeconds ? acc.numOfResolvedIssues + 1 : acc.numOfResolvedIssues

            }
        }, initialValue);

        const size = value.length
        const averageStats: AverageThreadStats = {
            numOfIssues: size,
            averageNumberOfRepliesPerThread: average(aggregated.numOfReplies),
            averageTimeToRespondMinutes: average(aggregated.timeToRespondSeconds) / 60,

            totalTimeSpentHours: sum(aggregated.timeToResolveSeconds) / (60 * 60),

            keywordsCount: Array.from(aggregated.keywordsCount.entries()).sort((a, b) => {
                return b[1] - a[1];
            }),

            numOfResolvedIssues: aggregated.numOfResolvedIssues
        }
        averageThreadStats = averageThreadStats.concat({ date: key, stats: averageStats })
    });

    console.log(`✅ Analysys finished`)
    return averageThreadStats

}