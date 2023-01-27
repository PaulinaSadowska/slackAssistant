import Chart from 'chart.js/auto'
import { threadStats } from './chartInputData';
import { AverageThreadStatsPerPeriod } from './samples/data/ThreadStats';


(async function() {

  const data : AverageThreadStatsPerPeriod[] = threadStats.sort((a, b) => {
    const yearA =  Number(a.date.slice(0, 4))
    const yearB =  Number(b.date.slice(0, 4))
    if(yearA != yearB){
      return yearA - yearB;
    }else {
      const monthA =  Number(a.date.slice(5, 7))
      const monthB =  Number(b.date.slice(5, 7))
      return monthA - monthB
    }
  })

  createChart(data, 'Resolved issues per month', 'resolvedIssues', 'numOfResolvedIssues')
  createChart(data, 'Median number of replies per thread', 'medianNumberOfRepliesPerThread', 'medianNumberOfRepliesPerThread')
  createChart(data, 'Average time to resolve [minutes]', 'averageTimeToResolveMinutes', 'averageTimeToResolveMinutes')
})();

function createChart(data: AverageThreadStatsPerPeriod[], title: string, elementId: string, field: string){
  new Chart(
    document.getElementById(elementId) as any,
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.date),
        datasets: [
          {
            label: title,
            data: data.map(row => row.stats[field])
          }
        ]
      }
    }
  );

}