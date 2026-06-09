import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4/auto/+esm';

// Bearer header for the access-controlled admin endpoints (requireAuth + requireAdmin).
function authHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Fetch global statistics from the backend and render charts
async function fetchAndRenderStatistics() {
    try {
        const parryStatsResponse = await fetch('/api/global-stats/parry-stats');
        const parryStatsData = await parryStatsResponse.json();

        const averageCompletionTimeResponse = await fetch('/api/global-stats/average_completion_time');
        const averageCompletionTimeData = await averageCompletionTimeResponse.json();

        const cardsCollectedAvgResponse = await fetch('/api/global-stats/cards-collected-avg');
        const cardsCollectedAvgData = await cardsCollectedAvgResponse.json();

        const topPlayersResponse = await fetch('/api/global-stats/top-players');
        const topPlayersData = await topPlayersResponse.json();

        renderSectionLabel('Global Statistics', 'section-label');
        renderParryStatsChart(parryStatsData.parryStats);
        renderAverageCompletionTime(averageCompletionTimeData.averageCompletionTime);
        renderCardsCollectedAvg(cardsCollectedAvgData.cardsCollectedAvg);
        renderTopPlayersLeaderboard(topPlayersData.topPlayers);

        // Admin panel — gated on the DB-backed isAdmin flag stored at login. The admin
        // endpoints are fetched (with the Bearer token) and rendered only for admins; they
        // also enforce requireAuth + requireAdmin server-side, so hiding them here is just
        // UX and the data itself is genuinely access-controlled.
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        if(authUser.isAdmin){
            const archetypeDistributionResponse = await fetch('/api/global-stats/archetype-distribution', { headers: authHeaders() });
            const archetypeDistributionData = await archetypeDistributionResponse.json();

            const parrySuccessByFloorResponse = await fetch('/api/global-stats/parry-success-by-floor', { headers: authHeaders() });
            const parrySuccessByFloorData = await parrySuccessByFloorResponse.json();

            const abandonmentResponse = await fetch('/api/global-stats/abandonment-rate', { headers: authHeaders() });
            const abandonmentData = await abandonmentResponse.json();

            renderSectionLabel('Admin Panel', 'section-label section-label--admin');
            renderArchetypeDistributionChart(archetypeDistributionData.archetypeDistribution);
            renderParrySuccessByfloorChart(parrySuccessByFloorData.parrySuccessByFloor);
            renderAbandonmentRateChart(abandonmentData.abandonmentByRoom);
        }
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
            labels: ['Perfect Parries', 'Normal Parries', 'Missed Parries'],
            datasets: [{
                label: 'Total Parries',
                data: [parryStats.global_perfect_parries, parryStats.global_normal_parries, parryStats.global_missed_parries],
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
    const perfeCtParriesHeader = document.createElement('th');
    perfeCtParriesHeader.textContent = 'Perfect Parries';
    const cardsCollectedHeader = document.createElement('th');
    cardsCollectedHeader.textContent = 'Cards Collected';
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(timeHeader);
    headerRow.appendChild(perfeCtParriesHeader);
    headerRow.appendChild(cardsCollectedHeader);
    table.appendChild(headerRow);

    topPlayers.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = player.username;
        const timeCell = document.createElement('td');
        timeCell.textContent = `${Math.floor(player.best_completion_time_seconds / 3600)}h ${Math.floor((player.best_completion_time_seconds % 3600) / 60)}m ${player.best_completion_time_seconds % 60}s`;

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        const perfectParriesCell = document.createElement('td');
        perfectParriesCell.textContent = player.total_perfect_parries;
        row.appendChild(perfectParriesCell);
        const cardsCollectedCell = document.createElement('td');
        cardsCollectedCell.textContent = player.total_cards_collected;
        row.appendChild(cardsCollectedCell);
        table.appendChild(row);
    });

    leaderboardWrapper.appendChild(table);
    document.body.appendChild(leaderboardWrapper);
}

function renderParrySuccessByfloorChart(parrySuccessByFloor){
    console.log(parrySuccessByFloor);
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('parry-floor-wrapper');
    const canvas = document.createElement('canvas');
    const chartText = document.createElement('h2');
    chartText.textContent = 'Parry Success Rate by Floor';
    chartWrapper.appendChild(chartText);
    chartWrapper.appendChild(canvas);
    document.body.appendChild(chartWrapper);
    const myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            // Map straight off the rows (one per floor) instead of hardcoding indices, so this
            // is robust to however many floors the view returns and never reads undefined.
            labels: parrySuccessByFloor.map(item => `Floor ${item.floor_number}`),
            datasets: [{
                label: 'Perfect parries',
                data: parrySuccessByFloor.map(item => item.perfect_parries),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Normal parries',
                data: parrySuccessByFloor.map(item => item.normal_parries),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'Missed parries',
                data: parrySuccessByFloor.map(item => item.missed_parries),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
}

// Session abandonment rate: how many room sessions were started but never finished
// (end_time IS NULL) versus completed. A doughnut reads the proportion at a glance and
// matches the other admin doughnuts; the exact rate is shown in the title.
// Per-room session abandonment rate: for each room, the share of its sessions that were
// started but never finished (end_time IS NULL). A bar per room makes rooms comparable at a
// glance; a room with no plays shows 0%. The tooltip carries the raw "abandoned / total".
function renderAbandonmentRateChart(abandonmentByRoom){
    const rooms = abandonmentByRoom || [];
    const labels = rooms.map(r => `F${r.floor_number}·R${r.room_number}`);
    const rates = rooms.map(r => r.total_sessions > 0
        ? Math.round((r.abandoned_sessions / r.total_sessions) * 100)
        : 0);

    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('abandonment-wrapper');
    const canvas = document.createElement('canvas');
    const chartText = document.createElement('h2');
    chartText.textContent = 'Session Abandonment Rate by Room';
    chartWrapper.appendChild(chartText);
    chartWrapper.appendChild(canvas);
    document.body.appendChild(chartWrapper);
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Abandonment rate (%)',
                data: rates,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: (ctx) => {
                            const room = rooms[ctx.dataIndex];
                            return `${room.abandoned_sessions} abandoned / ${room.total_sessions} sessions`;
                        }
                    }
                }
            }
        }
    });
}

function renderSectionLabel(text, className){
    const label = document.createElement('div');
    label.className = className;
    const title = document.createElement('h1');
    title.textContent = text;
    label.appendChild(title);
    document.body.appendChild(label);
}

fetchAndRenderStatistics();