import Chart from 'chart.js/auto'
import { threadStats } from './chartInputData';
import { AverageThreadStatsPerPeriod } from './samples/data/ThreadStats';


(async function() {

  const data : AverageThreadStatsPerPeriod[] = threadStats
  console.log(data)


  new Chart(
    document.getElementById('resolvedIssues') as any,
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.date),
        datasets: [
          {
            label: 'Resolved issues per month',
            data: data.map(row => row.stats.numOfResolvedIssues)
          }
        ]
      }
    }
  );
})();