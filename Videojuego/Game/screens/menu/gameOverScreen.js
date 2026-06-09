import Menus from './Menus.js';
import TextLabel from '../../libs/TextLabel.js';
import { canvas } from '../../Return.js';
import GameObject from '../../libs/GameObject.js';
import ItemCard from '../../libs/ItemCard.js';
import Action from '../../libs/Action.js';

// Pixels a selected card lifts above its row to signal selection (mirrors the lobby).
const SELECT_RAISE = 15;

// End screen shown when the player's health reaches zero. Dark-fantasy styled to match
// the battle lobby. Summarizes the run and, per US25, lets the player rescue ONE card
// collected this run (anything that isn't a starting/permanent card) by promoting it to
// permanent before the rest of the run inventory is wiped. The wipe (game.resetRunOnDeath)
// is deferred to the Continue button so the cards are still present to choose from here.
export default class gameOverScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, stats = { floorsCompleted: 0, enemiesDefeated: 0, finalLevel: 1 }, eligibleCards = [], api = null, slotId = null, game = null){
        super('', canvasWidth, canvasHeight);

        // Dark fantasy watercolor palette (matches lobby CSS)
        this.bgColor = '#1a1410';        // very dark brown/black background
        this.titleColor = '#8b0000';     // blood red
        this.textColor = '#f3ead0';      // parchment
        this.btnColor = '#c9a25a';       // antique gold
        this.btnHoverColor = '#f3d27a';  // bright gold
        this.disabledColor = '#6b5a3a';  // dimmed gold for the inactive keep button

        this.api = api;
        this.slotId = slotId;
        this.game = game;
        this.leaving = false;     // guards the async Continue handler against double-clicks

        // US25 selection state.
        this.cards = [];          // every eligible card as an ItemCard
        this.cardStack = [];      // the up-to-5 currently shown
        this.slotPositions = [];  // the x of each visible slot, for paging
        this.currentIndex = 0;
        this.selectedCard = null; // the highlighted (not yet confirmed) card
        this.confirmed = false;   // true once a card has been made permanent
        this.keptName = null;     // name of the card kept, for the confirmation line
        this.saving = false;      // guards the async keep handler

        const hasCards = Array.isArray(eligibleCards) && eligibleCards.length > 0;
        this.hasCards = hasCards;

        if(hasCards){
            // Compact layout to make room for the roulette + keep button below the stats.
            this.title       = new TextLabel(canvasWidth/2, 70,  '70px Academia', this.titleColor, undefined, 'GAME OVER', false);
            this.floorsText  = new TextLabel(canvasWidth/2, 118, '24px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
            this.enemiesText = new TextLabel(canvasWidth/2, 148, '24px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
            this.levelText   = new TextLabel(canvasWidth/2, 178, '24px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
            this.selectLabel = new TextLabel(canvasWidth/2, 228, '30px Academia', this.btnColor, undefined, 'Select permanent card', false);
            this.keepBtn     = new TextLabel(canvasWidth/2, 430, '28px Academia', this.disabledColor, undefined, 'Keep this card', true);
            this.confirmLabel = null;
            this.spawnCards(eligibleCards);
            this.continueBtn = new TextLabel(canvasWidth/2, canvasHeight - 40, '30px Academia', this.btnColor, undefined, 'Continue', true);
        } else {
            // No collected cards to choose from: render exactly like the plain Game Over.
            this.title       = new TextLabel(canvasWidth/2, canvasHeight/2 - 150, '80px Academia', this.titleColor, undefined, 'GAME OVER', false);
            this.floorsText  = new TextLabel(canvasWidth/2, canvasHeight/2 - 30,  '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
            this.enemiesText = new TextLabel(canvasWidth/2, canvasHeight/2 + 20,  '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
            this.levelText   = new TextLabel(canvasWidth/2, canvasHeight/2 + 70,  '28px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
            this.continueBtn = new TextLabel(canvasWidth/2, canvasHeight - 70,    '30px Academia', this.btnColor, undefined, 'Continue', true);
        }

        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundClick = this.handleClick.bind(this);
        canvas.addEventListener('mousemove', this.boundMouseMove);
        canvas.addEventListener('click', this.boundClick);
    }

    // Builds an ItemCard per eligible card laid out left-to-right (same construction as
    // battleLobby.inventorySectionSpawn) and shows the first five, with paging arrows when
    // there are more. Cards beyond the first five are positioned off the visible slots and
    // only swapped in via the arrows.
    spawnCards(eligibleCards){
        const cardWidth = 70;
        const cardHeight = 95;
        const gap = 14;
        const rowY = 330;
        const visible = Math.min(5, eligibleCards.length);
        const rowWidth = visible * cardWidth + (visible - 1) * gap;
        const firstX = this.canvasWidth/2 - rowWidth/2 + cardWidth/2;
        const step = cardWidth + gap;

        let posX = firstX;
        for(const card of eligibleCards){
            const action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0,0, card.scales_with, card.scaling_factor, null);
            const requirements = card.required_attribute ? { [card.required_attribute]: card.required_value } : {};
            const cardInstance = new ItemCard(posX, rowY, cardWidth, cardHeight, card.name, card.description, action, requirements, card.rarity, card.stamina_cost, card.isPermanent);
            cardInstance.setSprite(card.spritePath ?? '../Assets/Sprites/cards/knight_shield.jpeg');
            cardInstance.cardId = card.cardId;
            cardInstance.sourceCard = card;
            this.cards.push(cardInstance);
            posX += step;
        }

        for(let i = 0; i < visible; i++){
            this.cardStack.push(this.cards[i]);
            this.slotPositions.push(this.cards[i].x);
        }

        // Paging arrows sit just outside the row of visible slots.
        const leftX = firstX - step;
        const rightX = firstX + (visible - 1) * step + step;
        this.moveLeftButton = new GameObject(leftX, rowY, 35, 35);
        this.moveRightButton = new GameObject(rightX, rowY, 35, 35);
        this.moveLeftButton.setSprite('../Assets/Sprites/move_left.png');
        this.moveRightButton.setSprite('../Assets/Sprites/move_right.png');
    }

    // Shifts the visible window by 5, wrapping around, and re-seats the cards onto the
    // fixed slot positions (mirrors battleLobby's paging).
    page(direction){
        const n = this.cards.length;
        if(n <= 5){ return; }
        this.currentIndex += direction * 5;
        this.currentIndex = ((this.currentIndex % n) + n) % n;
        for(let i = 0; i < this.slotPositions.length; i++){
            const card = this.cards[(this.currentIndex + i) % n];
            card.x = this.slotPositions[i];
            // A card paged out while selected/lifted must sit flat again in its new slot.
            card.y = 330;
            this.cardStack[i] = card;
        }
        // Paging away from the highlighted card clears the lift visually; keep the
        // selection only if it's still on screen.
        if(this.selectedCard && !this.cardStack.includes(this.selectedCard)){
            this.selectedCard.y = 330;
        }
    }

    handleMouseMove(e){
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.continueBtn.mouseCollition(mx, my);
        if(this.hasCards && !this.confirmed){
            for(const card of this.cardStack){ card.mouseCollition(mx, my); }
            this.keepBtn.mouseCollition(mx, my);
            if(this.cards.length > 5){
                this.moveLeftButton.mouseCollition(mx, my);
                this.moveRightButton.mouseCollition(mx, my);
            }
        }
    }

    async handleClick(e){
        // Continue: defer the run wipe to here so the cards stayed available to pick from.
        if(this.continueBtn.hovered){
            if(this.leaving){ return; }
            this.leaving = true;
            try {
                if(this.game){ await this.game.resetRunOnDeath(); }
            } catch(err){
                console.error('Could not reset run on death:', err);
            }
            this.dispose();
            this.state = 0;   // back to the main menu
            return;
        }

        if(!this.hasCards || this.confirmed){ return; }

        if(this.cards.length > 5){
            if(this.moveLeftButton.hovered){ this.page(-1); return; }
            if(this.moveRightButton.hovered){ this.page(1); return; }
        }

        // Confirm: promote the highlighted card to permanent, then lock the selection.
        if(this.keepBtn.hovered && this.selectedCard){
            await this.keepSelectedCard();
            return;
        }

        // Highlight a card (lift it; lower any previously highlighted one).
        for(const card of this.cardStack){
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

    // Persists the highlighted card as permanent (DB), keeps the matching in-memory card so
    // the imminent run wipe doesn't drop it, then locks further selection.
    async keepSelectedCard(){
        if(this.saving || !this.selectedCard){ return; }
        this.saving = true;
        const cardId = this.selectedCard.cardId;
        try {
            if(this.api && this.slotId != null){
                await this.api.makeCardPermanent(this.slotId, cardId);
            }
            // Remember the kept card so resetRunOnDeath records it as the run's
            // permanent_card_chosen_id when it finishes the run.
            if(this.game){ this.game.pendingPermanentCardId = cardId; }
            // Flag the card permanent on the shared player objects so resetRunOnDeath's
            // `filter(c => c.isPermanent)` keeps it in the in-memory inventory too.
            const pools = [this.game?.player?.inventory, this.game?.player?.activeDeck];
            for(const pool of pools){
                for(const c of (pool || [])){
                    if(c && c.cardId === cardId){ c.isPermanent = true; }
                }
            }
            this.confirmed = true;
            this.keptName = String(this.selectedCard.name || '').replace(/_/g, ' ');
            this.confirmLabel = new TextLabel(this.canvasWidth/2, 430, '26px Academia', this.titleColor, undefined, `Kept: ${this.keptName}`, false);
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
        this.floorsText.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);

        if(this.hasCards){
            this.selectLabel.draw(ctx);
            for(const card of this.cardStack){
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
            if(this.cards.length > 5){
                if(this.moveLeftButton.spriteImage && this.moveLeftButton.spriteImage.complete){ this.moveLeftButton.draw(ctx); }
                if(this.moveRightButton.spriteImage && this.moveRightButton.spriteImage.complete){ this.moveRightButton.draw(ctx); }
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
