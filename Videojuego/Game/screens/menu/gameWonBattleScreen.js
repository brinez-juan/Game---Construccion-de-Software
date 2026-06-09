import Menus from './Menus.js';
import TextLabel from '../../libs/TextLabel.js';
import { canvas } from '../../Return.js';
import GameObject from '../../libs/GameObject.js';

// Victory screen shown after every battle is cleared. Dark-fantasy styled to match the
// lobby. Summarizes the battle (XP gained, kills, level) and shows the card(s) the
// defeated enemies dropped, then returns to the castle map on Continue.
export default class gameWonBattleScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, stats = { xpGained: 0, enemiesDefeated: 0, finalLevel: 1 }, cardsObtained = []){
        super('', canvasWidth, canvasHeight);

        // Dark fantasy watercolor palette (matches lobby CSS)
        this.bgColor = '#1a1410';        // very dark brown/black background
        this.titleColor = '#008b31';     // dark green
        this.textColor = '#f3ead0';      // parchment
        this.btnColor = '#c9a25a';       // antique gold
        this.btnHoverColor = '#f3d27a';  // bright gold

        this.title       = new TextLabel(canvasWidth/2, 100, '80px Academia', this.titleColor, undefined, 'VICTORY', false);
        this.xpText      = new TextLabel(canvasWidth/2, 185, '28px Academia', this.textColor, undefined, `XP Gained: ${stats.xpGained}`, false);
        this.enemiesText = new TextLabel(canvasWidth/2, 225, '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
        this.levelText   = new TextLabel(canvasWidth/2, 265, '28px Academia', this.textColor, undefined, `Level: ${stats.finalLevel}`, false);

        // Cards dropped by the defeated enemies (already added to the inventory by the
        // battle screen). Shown here purely as a reward summary.
        this.cards = [];
        const list = Array.isArray(cardsObtained) ? cardsObtained.filter(Boolean) : [];
        if(list.length > 0){
            this.cardsLabel = new TextLabel(canvasWidth/2, 320, '26px Academia', this.textColor, undefined,
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
        const posY = 320 + 40 + cardHeight/2;
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
            this.state = 10;   // back to the castle map
        }
    }

    draw(ctx){
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.title.draw(ctx);
        this.xpText.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);

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
