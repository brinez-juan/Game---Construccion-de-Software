
export default class User {
    constructor(
        username = "",
        email = "",
        password = "",
        permanentCards = [],
        stats = {
            totalRuns: 0,
            totalRunCompletions: 0,
            bestFloor: 0,
            totalEnemiesDefeated: 0,
            totalBossesDefeated: 0,
            perfectParries: 0,
            normalParries: 0,
            poorParries: 0,
            runCompletionTime: 0,
            averageCompletionTime: 0, // en segundos
        }
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.permanentCards = permanentCards; // roguelite persistence — sobreviven a la muerte
        this.stats = stats;
    }

     recordRunEnd(floorsReached, enemiesDefeated, bossesDefeated, runCompletionTime) {
        this.stats.totalRuns++;
        this.stats.bestFloor = Math.max(this.stats.bestFloor, floorsReached);
        this.stats.totalEnemiesDefeated += enemiesDefeated;
        this.stats.totalBossesDefeated += bossesDefeated;
        // Media móvil del tiempo de completación
        const n = this.stats.totalRuns;
        this.stats.averageCompletionTime =
            (this.stats.averageCompletionTime * (n - 1) + runCompletionTime) / n;
    }
 
    recordParry(result) {
        if (result === "perfect") this.stats.perfectParries++;
        if (result === "normal") this.stats.normalParries++;
        if (result === "poor") this.stats.poorParries++;
    }
 

    addPermanentCard(card) {
        this.permanentCards.push(card);
    }
}