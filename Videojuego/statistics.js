import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4/auto/+esm';

// Fetch global statistics from the backend and render charts
async function fetchAndRenderStatistics() {
    try {
        const parryStatsResponse = await fetch('/api/global-stats/parry-stats');
        const parryStatsData = await parryStatsResponse.json();

        const archetypeDistributionResponse = await fetch('/api/global-stats/archetype-distribution');
        const archetypeDistributionData = await archetypeDistributionResponse.json();

        const averageCompletionTimeResponse = await fetch('/api/global-stats/average_completion_time');
        const averageCompletionTimeData = await averageCompletionTimeResponse.json();

        renderParryStatsChart(parryStatsData.parryStats);
        //renderArchetypeDistributionChart(archetypeDistributionData.archetypeDistribution);
        //renderAverageCompletionTime(averageCompletionTimeData.averageCompletionTime);
        //renderCardsCollectedAvg(cardsCollectedAvgData.cardsCollectedAvg);
        //renderTopCompletionTimes(topCompletionTimesData.topCompletionTimes);
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

function renderParryStatsChart(parryStats){
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('parry-wrapper');
    const canvas = document.createElement('canvas');
    chartWrapper.appendChild(canvas);
    document.body.appendChild(chartWrapper);    
    const myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Perfect Parries', 'Normal Parries', 'Poor Parries'],
            datasets: [{
                label: 'Total Parries',
                data: [parryStats.global_perfect_parries, parryStats.global_normal_parries, parryStats.global_poor_parries],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(250, 192, 105, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

fetchAndRenderStatistics();