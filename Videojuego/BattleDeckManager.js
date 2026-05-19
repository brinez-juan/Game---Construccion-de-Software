import { MAX_DECK_SIZE } from "./GlobalVariables.js";

export default class BattleDeckManager {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.flippedCard = null;
    }

    handleCardClick(card, cardElement) {
        if (this.flippedCard && this.flippedCard != cardElement) {
            this._unflip(this.flippedCard);
        }
        if (this.flippedCard == cardElement) {
            this._attemptAdd(card);
            this._unflip(cardElement);
            this.flippedCard = null;
        } else {
            cardElement.classList.add("flipped");
            this.flippedCard = cardElement;
        }
    }

    _unflip(element) {
        if (element) element.classList.remove("flipped");
    }

    _attemptAdd(card) {
        if (!card.meetsRequirements(this.player.attributes)) {
            alert("requirements not met");
            return;
        }
        if (this.player.activeDeck.length >= MAX_DECK_SIZE) {
            alert("deck is full");
            return;
        }
        if (this.player.activeDeck.find(c => c.name == card.name)) {
            alert("card already in deck");
            return;
        }
        this.player.activeDeck.push(card);
        this.ui.refreshBattleDeck();
    }

    refreshCardRequirements() {
        const container = this.ui.myDeckContainer;
        if (!container) return;
        const cards = container.querySelectorAll(".card");
        cards.forEach(el => {
            const cardName = el.dataset.cardName;
            const card = this.player.inventory.find(c => c.name == cardName);
            if (card) {
                if (card.meetsRequirements(this.player.attributes)) {
                    el.classList.remove("card--disabled");
                } else {
                    el.classList.add("card--disabled");
                }
            }
        });
    }
}
