import { AggregatedThreadStats, AverageThreadStats, AverageThreadStatsPerPeriod, ThreadStats } from "./samples/data/ThreadStats";
import { average, median } from "./utils/stats";

export function averageThreadStats(threadStats: Map<string, ThreadStats[]>) : AverageThreadStatsPerPeriod[] {

    let averageThreadStats : AverageThreadStatsPerPeriod[] = [];

    threadStats.forEach((value: ThreadStats[], key: string) => {

        const initialValue : AggregatedThreadStats = {
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
        const medianTimeToResolveSeconds = median(aggregated.timeToResolveSeconds)
        const averageStats : AverageThreadStats = {
            numOfIssues: size,
            averageNumberOfRepliesPerThread: average(aggregated.numOfReplies),
            medianNumberOfRepliesPerThread: median(aggregated.numOfReplies),

            averageTimeToResolveMinutes: average(aggregated.timeToResolveSeconds) / 60,
            averageTimeToRespondMinutes: average(aggregated.timeToRespondSeconds) / 60,

            medianTimeToResolveMinutes: medianTimeToResolveSeconds / 60,

            totalTimeSpentUsingMedianHours: (medianTimeToResolveSeconds * aggregated.numOfResolvedIssues) / 3_600,

            keywordsCount: Array.from(aggregated.keywordsCount.entries()).sort((a, b) => {
                return b[1] - a[1];
            }),

            numOfResolvedIssues: aggregated.numOfResolvedIssues
        }
        averageThreadStats = averageThreadStats.concat({date: key, stats: averageStats})
    });

    return  averageThreadStats

}

