import { AverageThreadStatsPerPeriod } from './analyzer/model/ThreadStats.js';

function sortData(threadStats: AverageThreadStatsPerPeriod[]) {

  const data: AverageThreadStatsPerPeriod[] = threadStats.sort((a: AverageThreadStatsPerPeriod, b: AverageThreadStatsPerPeriod) => {
    const yearA = Number(a.date.slice(0, 4))
    const yearB = Number(b.date.slice(0, 4))
    if (yearA != yearB) {
      return yearA - yearB;
    } else {
      const monthA = Number(a.date.slice(5, 7))
      const monthB = Number(b.date.slice(5, 7))
      return monthA - monthB
    }
  })

  return data
}