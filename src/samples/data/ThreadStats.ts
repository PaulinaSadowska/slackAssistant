export interface AverageThreadStatsPerPeriod {
    date: string,
    stats: AverageThreadStats,
}

export interface ThreadStats {
    numOfReplies: number,
    keywords: string[],
    timeToResolveSeconds?: number,
    timeToRespondSeconds?: number,
}

export interface AggregatedThreadStats {
    numOfReplies: number[],

    timeToResolveSeconds: number[],
    timeToRespondSeconds: number[],

    keywordsCount: Map<string, number>,

    numOfResolvedIssues: number, // issues with at  least one response
}

export interface AverageThreadStats {
    numOfIssues: number,

    averageNumberOfRepliesPerThread: number,
    medianNumberOfRepliesPerThread: number,

    averageTimeToResolveMinutes: number,
    averageTimeToRespondMinutes: number,
    
    medianTimeToResolveMinutes: number,

    totalTimeSpentUsingMedianHours: number,

    keywordsCount: [string, number][],

    numOfResolvedIssues: number,
}
