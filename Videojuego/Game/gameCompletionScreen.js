import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import { canvas } from './Return.js';
import GameObject from './GameObject.js';

// Final screen shown when the castle's last boss room is cleared and the whole game is
// beaten. Dark-fantasy styled to match the lobby. Summarizes the run and shows the
// card(s) the final boss dropped, then returns to the main menu on Continue.
export default class gameCompletionScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, stats = { enemiesDefeated: 0, finalLevel: 1, totalXP: 0 }, cardsObtained = []){
        super('', canvasWidth, canvasHeight);

        // Dark fantasy watercolor palette (matches lobby CSS)
        this.bgColor = '#1a1410';        // very dark brown/black background
        this.titleColor = '#008b31';     // dark green
        this.textColor = '#f3ead0';      // parchment
        this.btnColor = '#c9a25a';       // antique gold
        this.btnHoverColor = '#f3d27a';  // bright gold

        this.title       = new TextLabel(canvasWidth/2, 120, '72px Academia', this.titleColor, undefined, 'GAME COMPLETED', false);
        this.enemiesText = new TextLabel(canvasWidth/2, 220, '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
        this.levelText   = new TextLabel(canvasWidth/2, 265, '28px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
        this.xpText      = new TextLabel(canvasWidth/2, 310, '28px Academia', this.textColor, undefined, `Total XP: ${stats.totalXP}`, false);

        // Card(s) dropped by the final boss (already added to the inventory by the battle
        // screen). Shown here purely as a reward summary.
        this.cards = [];
        const list = Array.isArray(cardsObtained) ? cardsObtained.filter(Boolean) : [];
        if(list.length > 0){
            this.cardsLabel = new TextLabel(canvasWidth/2, 380, '26px Academia', this.textColor, undefined,
                list.length === 1 ? 'Card obtained:' : 'Cards obtained:', false);
            this.spawnCards(list);
        }

        this.continueBtn = new TextLabel(canvasWidth/2, canvasHeight - 50, '30px Academia', this.btnColor, undefined, 'Continue', true);

        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundClick = this.handleClick.bind(this);
        canvas.addEventListener('mousemove', this.boundMouseMove);
        canvas.addEventListener('click', this.boundClick);
    }

    // Lays the obtained cards out centered in a row, each showing its real art.
    spawnCards(list){
        const cardWidth = 90;
        const cardHeight = 120;
        const gap = 20;
        const rowWidth = list.length * cardWidth + (list.length - 1) * gap;
        let posX = this.canvasWidth/2 - rowWidth/2 + cardWidth/2;
        const posY = 380 + 40 + cardHeight/2;
        for(const card of list){
            const sprite = new GameObject(posX, posY, cardWidth, cardHeight);
            sprite.setSprite(card.spritePath ?? '../Assets/Sprites/cards/knight_shield.jpeg');
            this.cards.push(sprite);
            posX += cardWidth + gap;
        }
    }

    handleMouseMove(e){
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.continueBtn.mouseCollition(mx, my);
    }

    handleClick(e){
        if(this.continueBtn.hovered){
            this.dispose();
            this.state = 0;   // back to the main menu
        }
    }

    draw(ctx){
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.title.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);
        this.xpText.draw(ctx);

        if(this.cards.length > 0){
            this.cardsLabel.draw(ctx);
            for(const sprite of this.cards){
                // Guard against drawing an image that hasn't finished loading yet.
                if(sprite.spriteImage && sprite.spriteImage.complete){
                    sprite.draw(ctx);
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
