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