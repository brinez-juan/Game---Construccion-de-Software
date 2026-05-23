// Coordinates new game and load flows by talking to the backend and seeding the game context
export default class SaveManager {
    static activeSaveSlotId = null;

    constructor(db, gameContext, navigateTo) {
        this.db = db;
        this.gameContext = gameContext;
        this.navigateTo = navigateTo;
    }

    // Creates an empty slot on the backend and routes the user to archetype selection
    async newGame() {
        var slotId = await this.db.createSlot();
        SaveManager.activeSaveSlotId = slotId;
        this.navigateTo("archetype-selection");
    }

    // Hydrates the game context with a stored slot snapshot and navigates to the map
    async loadGame(slotId) {
        var slot = await this.db.fetchSlot(slotId);
        SaveManager.activeSaveSlotId = slotId;
        this.gameContext.player = slot.player;
        this.gameContext.mapState = slot.mapState;
        this.gameContext.inventory = slot.inventory;
        this.gameContext.activeDeck = slot.activeDeck;
        this.navigateTo("map");
    }

    // Confirms with the user then deletes the chosen slot and starts a fresh run
    async overwrite(slotId) {
        var ok = confirm("Overwrite this save?");
        if (!ok) return;
        await this.db.deleteSlot(slotId);
        await this.newGame();
    }
}
