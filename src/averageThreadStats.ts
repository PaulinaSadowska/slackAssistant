import { ThreadStats } from "./countMessages";
import { Message, Thread } from "./fetchConversations";

export function averageThreadStats(threadStats: Map<string, ThreadStats[]>) : Map<string, AverageThreadStats> {

    let averageThreadStats = new Map<string, AverageThreadStats>();

    threadStats.forEach((value: ThreadStats[], key: string) => {

        const initialValue : AverageThreadStats = {
            numOfIssues: value.length,
            numOfRepliesPerThread: 0,
        
            averageTimeToResolveSeconds: 0,
            averageTimeToRespondSeconds: 0,
        
            numOfResolvedIssues: 0,
            numOfRespondedIssues: 0,
        }

        const sum = value.reduce((accumulator, currentValue) => {
            return {
                numOfIssues: accumulator.numOfIssues,
                numOfRepliesPerThread: accumulator.numOfRepliesPerThread + currentValue.numOfReplies,
         
                averageTimeToResolveSeconds: accumulator.averageTimeToResolveSeconds + currentValue.timeToResolveSeconds ? currentValue.timeToResolveSeconds : 0,
                averageTimeToRespondSeconds: accumulator.averageTimeToRespondSeconds + currentValue.timeToRespondSeconds ? currentValue.timeToRespondSeconds : 0,
            
                numOfResolvedIssues: currentValue.timeToRespondSeconds ? accumulator.numOfResolvedIssues + 1 : accumulator.numOfResolvedIssues,
                numOfRespondedIssues: currentValue.timeToRespondSeconds ? accumulator.numOfRespondedIssues + 1 : accumulator.numOfRespondedIssues,
            }
        }, initialValue);
        const size = value.length
        const averageStats : AverageThreadStats = {
            numOfIssues: sum.numOfIssues,
            numOfRepliesPerThread: sum.numOfRepliesPerThread / size,
     
            averageTimeToResolveSeconds: sum.averageTimeToResolveSeconds / sum.numOfResolvedIssues,
            averageTimeToRespondSeconds: sum.averageTimeToRespondSeconds / sum.numOfRespondedIssues,
        
            numOfResolvedIssues: sum.numOfResolvedIssues,
            numOfRespondedIssues: sum.numOfRespondedIssues
        }
        averageThreadStats.set(key, averageStats)
    });

    return averageThreadStats;

}

export interface AverageThreadStats {
    numOfIssues: number,
    numOfRepliesPerThread: number,

    averageTimeToResolveSeconds: number,
    averageTimeToRespondSeconds: number, 

    numOfResolvedIssues: number,
    numOfRespondedIssues: number,
}