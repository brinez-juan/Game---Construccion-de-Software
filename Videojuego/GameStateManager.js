export default class GameStateManager {
    constructor(controllers) {
        this.audioController = controllers.audioController || {};
        this.i18n = controllers.i18n || {};
        this.timerController = controllers.timerController || {};
        this.enemyAIController = controllers.enemyAIController || {};
        this.progressAPI = controllers.progressAPI || {};
        this.userId = controllers.userId || null;
        this.navigateTo = controllers.navigateTo || function(){};
    }

    openMenu() {
        if (this.timerController.pauseAll) {
            this.timerController.pauseAll();
        }
        if (this.enemyAIController.pauseAll) {
            this.enemyAIController.pauseAll();
        }
    }

    closeMenu() {
        if (this.timerController.resumeAll) {
            this.timerController.resumeAll();
        }
        if (this.enemyAIController.resumeAll) {
            this.enemyAIController.resumeAll();
        }
    }

    setMusicVolume(value) {
        if (this.audioController.setMusicVolume) {
            this.audioController.setMusicVolume(value);
        }
    }

    setSFXVolume(value) {
        if (this.audioController.setSFXVolume) {
            this.audioController.setSFXVolume(value);
        }
    }

    setLanguage(lang) {
        if (this.i18n.setLanguage) {
            this.i18n.setLanguage(lang);
        }
    }

    async deleteAllProgress() {
        var ok = confirm("Delete all progress?");
        if (!ok) return;
        if (this.progressAPI.deleteAllProgress) {
            await this.progressAPI.deleteAllProgress(this.userId);
        }
        this.navigateTo("title-screen");
    }
}
