
// Account model holding credentials, persistent cards and roguelite run statistics
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

    // Updates aggregate statistics with the result of a finished run
     recordRunEnd(floorsReached, enemiesDefeated, bossesDefeated, runCompletionTime) {
        this.stats.totalRuns++;
        this.stats.bestFloor = Math.max(this.stats.bestFloor, floorsReached);
        this.stats.totalEnemiesDefeated += enemiesDefeated;
        this.stats.totalBossesDefeated += bossesDefeated;
        // Rolling average of the completion time across all runs
        const n = this.stats.totalRuns;
        this.stats.averageCompletionTime =
            (this.stats.averageCompletionTime * (n - 1) + runCompletionTime) / n;
    }
 
    // Increments the per-quality parry counter for the supplied result
    recordParry(result) {
        if (result === "perfect") this.stats.perfectParries++;
        if (result === "normal") this.stats.normalParries++;
        if (result === "poor") this.stats.poorParries++;
    }
 

    // Saves a card to the roguelite collection that survives between runs
    addPermanentCard(card) {
        this.permanentCards.push(card);
    }
}