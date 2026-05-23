export default class BattleLobbyUI {
    constructor(container, player, callbacks) {
        this.container = container;
        this.player = player;
        this.onCardClick = callbacks.onCardClick || function(){};
        this.onAttrPlus = callbacks.onAttrPlus || function(){};
        this.onContinue = callbacks.onContinue || function(){};
        this.availablePoints = 0;
        this.myDeckContainer = null;
        this._render();
    }

    _render() {
        this.container.innerHTML = "";
        var html = '<div class="battle-lobby">';

        // character info
        html += '<div class="char-section">';
        html += '<div class="char-portrait"></div>';
        html += '<div class="char-info">';
        html += '<div class="char-name">' + (this.player.name || "Player") + '</div>';
        html += '<div>Level ' + this.player.level + '</div>';
        var xpPct = (this.player.experience / this.player.experienceToNextLevel) * 100;
        html += '<div class="xp-bar"><div class="xp-fill" style="width:' + xpPct + '%"></div></div>';
        html += '</div></div>';

        // battle deck
        html += '<div class="battle-deck"><h3>Battle Deck</h3><div class="deck-slots">';
        for (var i = 0; i < 5; i++) {
            html += '<div class="deck-slot" data-index="' + i + '">Slot ' + (i+1) + '</div>';
        }
        html += '</div></div>';

        // my deck
        html += '<div class="my-deck"><h3>My Deck</h3><div class="my-deck-grid">';
        for (var j = 0; j < this.player.inventory.length; j++) {
            var card = this.player.inventory[j];
            var disabled = card.meetsRequirements(this.player.attributes) ? "" : " card--disabled";
            html += '<div class="card' + disabled + '" data-card-name="' + card.name + '">' + card.name + '</div>';
        }
        html += '</div></div>';

        // attributes
        html += '<div class="attrs"><h3>Attributes <span>Points: <span id="pts">0</span></span></h3>';
        for (var key in this.player.attributes) {
            html += '<div class="attr-row" data-attr="' + key + '">';
            html += '<span>' + key + '</span> ';
            html += '<span class="attr-val">' + this.player.attributes[key] + '</span> ';
            html += '<button class="plus-btn" data-attr="' + key + '">+</button>';
            html += '</div>';
        }
        html += '</div>';

        // continue
        var disabledBtn = this.player.activeDeck.length == 0 ? "disabled" : "";
        html += '<button class="continue-btn" ' + disabledBtn + '>Continue</button>';

        html += '</div>';
        this.container.innerHTML = html;

        // hook up events after render
        var self = this;
        var cards = this.container.querySelectorAll('.card');
        cards.forEach(function(el) {
            var cardName = el.dataset.cardName;
            var card = self.player.inventory.find(function(c) { return c.name == cardName; });
            el.addEventListener('click', function() {
                self.onCardClick(card, el);
            });
        });

        var pluses = this.container.querySelectorAll('.plus-btn');
        pluses.forEach(function(btn) {
            var attr = btn.dataset.attr;
            btn.addEventListener('click', function() {
                self.onAttrPlus(attr);
            });
        });

        this.continueBtn = this.container.querySelector('.continue-btn');
        this.continueBtn.addEventListener('click', function() {
            self.onContinue();
        });

        this.battleDeckSlots = this.container.querySelector('.deck-slots');
        this.myDeckContainer = this.container.querySelector('.my-deck-grid');
    }

    refreshBattleDeck() {
        var slots = this.battleDeckSlots.querySelectorAll('.deck-slot');
        var self = this;
        slots.forEach(function(slot, i) {
            var card = self.player.activeDeck[i];
            if (card) {
                slot.textContent = card.name;
                slot.classList.add('filled');
            } else {
                slot.textContent = 'Slot ' + (i + 1);
                slot.classList.remove('filled');
            }
        });
        if (this.continueBtn) {
            this.continueBtn.disabled = this.player.activeDeck.length == 0;
        }
    }

    refreshAttribute(attrName, newValue) {
        var rows = this.container.querySelectorAll('.attr-row');
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].dataset.attr == attrName) {
                rows[i].querySelector('.attr-val').textContent = newValue;
                break;
            }
        }
    }

    setAvailablePoints(n) {
        this.availablePoints = n;
        var counter = this.container.querySelector('#pts');
        if (counter) counter.textContent = n;
        var buttons = this.container.querySelectorAll('.plus-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = n <= 0;
        }
    }

    refreshCardEffect(cardName, newEffect) {
        var cards = this.myDeckContainer.querySelectorAll('.card');
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].dataset.cardName == cardName) {
                var effectEl = cards[i].querySelector('.card-effect');
                if (effectEl) effectEl.textContent = newEffect;
            }
        }
    }
}
