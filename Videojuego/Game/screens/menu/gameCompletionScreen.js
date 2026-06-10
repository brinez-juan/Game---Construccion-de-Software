import Menus from './Menus.js';
import TextLabel from '../../libs/TextLabel.js';
import { canvas } from '../../Return.js';
import GameObject from '../../libs/GameObject.js';

// Pixels a selected card lifts above its row to signal selection (mirrors the lobby/Game Over).
const SELECT_RAISE = 15;

// Final screen shown when the castle's last boss room is cleared and the whole game is
// beaten. Dark-fantasy styled to match the lobby. Summarizes the run and shows the
// card(s) the two final bosses (Eldric + Lysara) dropped. Per US25, it also lets the
// player promote ONE of those boss cards to the permanent (cross-run) inventory — the
// same interaction the Game Over screen offers — before returning to the main menu.
export default class gameCompletionScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, stats = { enemiesDefeated: 0, finalLevel: 1, totalXP: 0 }, cardsObtained = [], api = null, slotId = null, game = null){
        super('', canvasWidth, canvasHeight);

        // Dark fantasy watercolor palette (matches lobby CSS)
        this.bgColor = '#1a1410';        // very dark brown/black background
        this.titleColor = '#008b31';     // dark green
        this.textColor = '#f3ead0';      // parchment
        this.btnColor = '#c9a25a';       // antique gold
        this.btnHoverColor = '#f3d27a';  // bright gold
        this.disabledColor = '#6b5a3a';  // dimmed gold for the inactive keep button

        this.api = api;
        this.slotId = slotId;
        this.game = game;

        // Card(s) dropped by the final bosses (already added to the inventory by the battle
        // screen). Shown here both as a reward summary and as the pool to keep one from.
        this.cards = [];          // GameObject sprite per obtained card
        this.selectedCard = null; // the highlighted (not yet confirmed) sprite
        this.confirmed = false;   // true once a card has been made permanent
        this.saving = false;      // guards the async keep handler
        this.leaving = false;     // guards the async Continue handler against double-clicks
        this.keptName = null;     // name of the card kept, for the confirmation line
        this.confirmLabel = null;

        const list = Array.isArray(cardsObtained) ? cardsObtained.filter(Boolean) : [];
        this.hasCards = list.length > 0;

        this.title = new TextLabel(canvasWidth/2, 90, '72px Academia', this.titleColor, undefined, 'GAME COMPLETED', false);

        if(this.hasCards){
            // Compact layout to make room for the card row + keep button below the stats.
            this.enemiesText = new TextLabel(canvasWidth/2, 160, '26px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
            this.levelText   = new TextLabel(canvasWidth/2, 195, '26px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
            this.xpText      = new TextLabel(canvasWidth/2, 230, '26px Academia', this.textColor, undefined, `Total XP: ${stats.totalXP}`, false);
            this.cardsLabel  = new TextLabel(canvasWidth/2, 280, '26px Academia', this.btnColor, undefined,
                list.length === 1 ? 'Keep this card?' : 'Select a card to keep', false);
            this.keepBtn     = new TextLabel(canvasWidth/2, 470, '28px Academia', this.disabledColor, undefined, 'Keep this card', true);
            this.spawnCards(list, 360);
        } else {
            // No cards to choose from (e.g. both boss cards already owned): plain summary.
            this.enemiesText = new TextLabel(canvasWidth/2, 220, '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
            this.levelText   = new TextLabel(canvasWidth/2, 265, '28px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
            this.xpText      = new TextLabel(canvasWidth/2, 310, '28px Academia', this.textColor, undefined, `Total XP: ${stats.totalXP}`, false);
        }

        this.continueBtn = new TextLabel(canvasWidth/2, canvasHeight - 50, '30px Academia', this.btnColor, undefined, 'Continue', true);

        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundClick = this.handleClick.bind(this);
        canvas.addEventListener('mousemove', this.boundMouseMove);
        canvas.addEventListener('click', this.boundClick);
    }

    // Lays the obtained cards out centered in a row at rowY, each showing its real art and
    // carrying the data needed to promote it to permanent on selection.
    spawnCards(list, rowY){
        const cardWidth = 90;
        const cardHeight = 120;
        const gap = 20;
        const rowWidth = list.length * cardWidth + (list.length - 1) * gap;
        let posX = this.canvasWidth/2 - rowWidth/2 + cardWidth/2;
        for(const card of list){
            const sprite = new GameObject(posX, rowY, cardWidth, cardHeight);
            sprite.setSprite(card.spritePath ?? '../Assets/Sprites/cards/knight_shield.jpeg');
            sprite.cardId = card.cardId;
            sprite.name = card.name;
            sprite.sourceCard = card;
            this.cards.push(sprite);
            posX += cardWidth + gap;
        }
    }

    handleMouseMove(e){
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.continueBtn.mouseCollition(mx, my);
        if(this.hasCards && !this.confirmed){
            for(const card of this.cards){ card.mouseCollition(mx, my); }
            this.keepBtn.mouseCollition(mx, my);
        }
    }

    async handleClick(e){
        // Continue: beating the final boss resets the run like a death — keep level/XP and
        // permanent cards (incl. any boss card just kept), drop everything else. Deferred to
        // here so the keep choice above lands before the run-only wipe.
        if(this.continueBtn.hovered){
            if(this.leaving){ return; }
            this.leaving = true;
            try {
                if(this.game){ await this.game.resetRunOnCompletion(); }
            } catch(err){
                console.error('Could not reset run on completion:', err);
            }
            this.dispose();
            this.state = 0;   // back to the main menu
            return;
        }

        if(!this.hasCards || this.confirmed){ return; }

        // Confirm: promote the highlighted card to permanent, then lock the selection.
        if(this.keepBtn.hovered && this.selectedCard){
            await this.keepSelectedCard();
            return;
        }

        // Highlight a card (lift it; lower any previously highlighted one).
        for(const card of this.cards){
            if(card.hovered){
                this.selectCard(card);
                return;
            }
        }
    }

    selectCard(card){
        if(this.selectedCard === card){ return; }
        if(this.selectedCard){ this.selectedCard.y += SELECT_RAISE; }
        card.y -= SELECT_RAISE;
        this.selectedCard = card;
        this.keepBtn.color = this.btnColor;   // enable the keep button visually
    }

    // Persists the highlighted card as permanent (DB), flags the matching in-memory card so
    // the active deck/inventory keep it across runs, then locks further selection.
    async keepSelectedCard(){
        if(this.saving || !this.selectedCard){ return; }
        this.saving = true;
        const cardId = this.selectedCard.cardId;
        try {
            if(this.api && this.slotId != null){
                await this.api.makeCardPermanent(this.slotId, cardId);
            }
            if(this.game){ this.game.pendingPermanentCardId = cardId; }
            // Flag the card permanent on the shared player objects so it survives across runs.
            const pools = [this.game?.player?.inventory, this.game?.player?.activeDeck];
            for(const pool of pools){
                for(const c of (pool || [])){
                    if(c && c.cardId === cardId){ c.isPermanent = true; }
                }
            }
            this.confirmed = true;
            this.keptName = String(this.selectedCard.name || '').replace(/_/g, ' ');
            this.confirmLabel = new TextLabel(this.canvasWidth/2, 470, '26px Academia', this.titleColor, undefined, `Kept: ${this.keptName}`, false);
        } catch(err){
            console.error('Could not save permanent card:', err);
        } finally {
            this.saving = false;
        }
    }

    draw(ctx){
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.title.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);
        this.xpText.draw(ctx);

        if(this.hasCards){
            this.cardsLabel.draw(ctx);
            for(const card of this.cards){
                // Guard against drawing art that hasn't finished loading yet.
                if(card.spriteImage && card.spriteImage.complete){ card.draw(ctx); }
                // Highlight ring around the selected card.
                if(card === this.selectedCard){
                    ctx.save();
                    ctx.strokeStyle = this.btnHoverColor;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(card.x - card.width/2 - 3, card.y - card.height/2 - 3, card.width + 6, card.height + 6);
                    ctx.restore();
                }
            }

            if(this.confirmed){
                this.confirmLabel.draw(ctx);
            } else {
                // Dim the keep button until a card is highlighted.
                this.keepBtn.color = this.selectedCard ? this.btnColor : this.disabledColor;
                if(this.keepBtn.hovered && this.selectedCard){
                    ctx.save();
                    ctx.shadowColor = this.btnHoverColor;
                    ctx.shadowBlur = 12;
                    this.keepBtn.draw(ctx);
                    ctx.restore();
                } else {
                    this.keepBtn.draw(ctx);
                }
            }
        }

        if(this.continueBtn.hovered){
            ctx.save();
            ctx.shadowColor = this.btnHoverColor;
            ctx.shadowBlur = 12;
            this.continueBtn.draw(ctx);
            ctx.restore();
        } else {
            this.continueBtn.draw(ctx);
        }
    }

    update(deltaTime){}

    dispose(){
        canvas.removeEventListener('mousemove', this.boundMouseMove);
        canvas.removeEventListener('click', this.boundClick);
    }
}
