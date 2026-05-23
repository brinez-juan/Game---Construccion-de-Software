export default class AttributePointSystem {
    constructor(player, ui, deckManager, attributeAPI) {
        this.player = player;
        this.ui = ui;
        this.deckManager = deckManager;
        this.attributeAPI = attributeAPI;
        this.availablePoints = 0;
    }

    setPoints(points) {
        this.availablePoints = points;
        this.ui.setAvailablePoints(points);
    }

    spendPoint(attributeName) {
        if (this.availablePoints <= 0) return;
        this.availablePoints--;
        this.player.attributes[attributeName]++;
        this.ui.setAvailablePoints(this.availablePoints);
        this.ui.refreshAttribute(attributeName, this.player.attributes[attributeName]);
        this._recalculateCards(attributeName);
    }

    _recalculateCards(changedAttribute) {
        const cards = this.player.inventory.filter(
            card => card.action.scalingAttribute == changedAttribute
        );
        for (const card of cards) {
            const newEffect = card.calculateEffect(this.player.attributes);
            this.ui.refreshCardEffect(card.name, newEffect);
        }
        if (this.deckManager) {
            this.deckManager.refreshCardRequirements();
        }
    }

    async saveAttributes(saveSlotId) {
        await this.attributeAPI.saveAttributes(saveSlotId, this.player.attributes);
    }
}
