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

        const cardsCollectedAvgResponse = await fetch('/api/global-stats/cards-collected-avg');
        const cardsCollectedAvgData = await cardsCollectedAvgResponse.json();

        const topPlayersResponse = await fetch('/api/global-stats/top-players');
        const topPlayersData = await topPlayersResponse.json();

        renderParryStatsChart(parryStatsData.parryStats);
        renderAverageCompletionTime(averageCompletionTimeData.averageCompletionTime);
        renderCardsCollectedAvg(cardsCollectedAvgData.cardsCollectedAvg);
        renderTopPlayersLeaderboard(topPlayersData.topPlayers);
        renderArchetypeDistributionChart(archetypeDistributionData.archetypeDistribution);
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

function renderParryStatsChart(parryStats){
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('parry-wrapper');
    const canvas = document.createElement('canvas');
    const chartText = document.createElement('h2');
    chartText.textContent = 'Global Parry Statistics';
    chartWrapper.appendChild(chartText);
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
            animations: {
                y: {
                    easing: 'easeInOutQuart',
                    duration: (ctx) => ctx.dataIndex * 400 + 600,
                    from: 500
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderArchetypeDistributionChart(archetypeDistribution){
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('archetype-wrapper');
    const canvas = document.createElement('canvas');
    const chartText = document.createElement('h2');
    chartText.textContent = 'Global Archetype Distribution';
    chartWrapper.appendChild(chartText);
    chartWrapper.appendChild(canvas);
    document.body.appendChild(chartWrapper);  
    const myChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: archetypeDistribution.map(item => item.archetype),
            datasets: [{
                label: 'Archetype Distribution',
                data: archetypeDistribution.map(item => item.amount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            animations: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function renderAverageCompletionTime(averageCompletionTime){
    const statsWrapper = document.createElement('div');
    statsWrapper.classList.add('stats-wrapper');
    statsWrapper.id = 'stats-wrapper1';
    document.body.appendChild(statsWrapper);

    const statCard = document.createElement('div');
    statCard.classList.add('stat-card');
    const canvas = document.createElement('canvas');
    const textDiv = document.createElement('div');
    textDiv.classList.add('stat-text');
    const statText = document.createElement('h2');
    statText.textContent = 'Average Completion Time';
    const statValue = document.createElement('p');
    statValue.textContent = `${Math.floor(averageCompletionTime / 3600)} hours`;
    textDiv.appendChild(statText);
    textDiv.appendChild(statValue);
    statCard.appendChild(canvas);
    statCard.appendChild(textDiv);
    statsWrapper.appendChild(statCard);

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0.25*averageCompletionTime, averageCompletionTime],
                backgroundColor: [ 'rgba(255, 99, 132, 0)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 0)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        }
    });
}

function renderCardsCollectedAvg(cardsCollectedAvg){
    const statsWrapper = document.getElementById('stats-wrapper1');

    const statCard = document.createElement('div');
    statCard.classList.add('stat-card');
    const canvas = document.createElement('canvas');
    const textDiv = document.createElement('div');
    textDiv.classList.add('stat-text');
    const statText = document.createElement('h2');
    statText.textContent = 'Average Cards Collected';
    const statValue = document.createElement('p');
    statValue.textContent = `${cardsCollectedAvg.split('.')[0]} cards`;
    textDiv.appendChild(statText);
    textDiv.appendChild(statValue);
    statCard.appendChild(canvas);
    statCard.appendChild(textDiv);
    statsWrapper.appendChild(statCard);

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0.25 * cardsCollectedAvg, cardsCollectedAvg.split('.')[0]],
                backgroundColor: ['rgba(54, 162, 235, 0)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 0)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        }
    });
}

function renderTopPlayersLeaderboard(topPlayers){
    const leaderboardWrapper = document.createElement('div');
    leaderboardWrapper.classList.add('leaderboard-wrapper');
    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.textContent = 'Top Players';
    leaderboardWrapper.appendChild(leaderboardTitle);
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Username';
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Completion Time';
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(timeHeader);
    table.appendChild(headerRow);

    topPlayers.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = player.username;
        const timeCell = document.createElement('td');
        timeCell.textContent = `${Math.floor(player.best_completion_time_seconds / 3600)}h ${Math.floor((player.best_completion_time_seconds % 3600) / 60)}m ${player.best_completion_time_seconds % 60}s`;
        row.appendChild(nameCell);
        row.appendChild(timeCell);
        table.appendChild(row);
    });

    leaderboardWrapper.appendChild(table);
    document.body.appendChild(leaderboardWrapper);
}

fetchAndRenderStatistics();