export default class SaveManager {
    static activeSaveSlotId = null;

    constructor(db, gameContext, navigateTo) {
        this.db = db;
        this.gameContext = gameContext;
        this.navigateTo = navigateTo;
    }

    async newGame() {
        var slotId = await this.db.createSlot();
        SaveManager.activeSaveSlotId = slotId;
        this.navigateTo("archetype-selection");
    }

    async loadGame(slotId) {
        var slot = await this.db.fetchSlot(slotId);
        SaveManager.activeSaveSlotId = slotId;
        this.gameContext.player = slot.player;
        this.gameContext.mapState = slot.mapState;
        this.gameContext.inventory = slot.inventory;
        this.gameContext.activeDeck = slot.activeDeck;
        this.navigateTo("map");
    }

    async overwrite(slotId) {
        var ok = confirm("Overwrite this save?");
        if (!ok) return;
        await this.db.deleteSlot(slotId);
        await this.newGame();
    }
}
