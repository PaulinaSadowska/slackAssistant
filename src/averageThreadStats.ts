import { ThreadStats } from "./countMessages";

export function averageThreadStats(threadStats: Map<string, ThreadStats[]>) : [string, AverageThreadStats][] {

    let averageThreadStats : [string, AverageThreadStats][] = [];

    threadStats.forEach((value: ThreadStats[], key: string) => {

        const initialValue : AggregatedThreadStats = {
            numOfReplies: [],
        
            timeToResolveSeconds: [],
            timeToRespondSeconds: [],
        
            keywordsCount: new Map<string, number>(),
            numOfResolvedIssues: 0, // issues with at  least one response
        }

        const sum = value.reduce((acc, current) => {
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
        const averageStats : AverageThreadStats = {
            numOfIssues: value.length,
            averageNumberOfRepliesPerThread: average(sum.numOfReplies),
            medianNumberOfRepliesPerThread: median(sum.numOfReplies),

     
            averageTimeToResolveSeconds: average(sum.timeToResolveSeconds),
            averageTimeToRespondSeconds: average(sum.timeToRespondSeconds),

            medianTimeToResolveSeconds: median(sum.timeToResolveSeconds),

            keywordsCount: Array.from(sum.keywordsCount.entries()),

            numOfResolvedIssues: sum.numOfResolvedIssues
        }
        averageThreadStats = averageThreadStats.concat([key, averageStats])
    });

    return  averageThreadStats

}

const average = (arr: any[]) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
function median(values: any[]){
    if(values.length ===0) throw new Error("No inputs");
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
    
    if (values.length % 2)
      return values[half];
    
    return (values[half - 1] + values[half]) / 2.0;
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

    averageTimeToResolveSeconds: number,
    averageTimeToRespondSeconds: number,
    
    medianTimeToResolveSeconds: number,

    keywordsCount: [string, number][],

    numOfResolvedIssues: number,
}
