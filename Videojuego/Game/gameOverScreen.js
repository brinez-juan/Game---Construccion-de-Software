import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import { canvas } from './Return.js';

// End screen shown when the player's health reaches zero. Dark-fantasy styled to match
// the battle lobby. Summarizes the run, then returns to the main menu on Continue (the
// run has already been wiped/reset by the screen manager before this screen appears).
export default class gameOverScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, stats = { floorsCompleted: 0, enemiesDefeated: 0, finalLevel: 1 }){
        super('', canvasWidth, canvasHeight);

        // Dark fantasy watercolor palette (matches lobby CSS)
        this.bgColor = '#1a1410';        // very dark brown/black background
        this.titleColor = '#8b0000';     // blood red
        this.textColor = '#f3ead0';      // parchment
        this.btnColor = '#c9a25a';       // antique gold
        this.btnHoverColor = '#f3d27a';  // bright gold

        this.title       = new TextLabel(canvasWidth/2, canvasHeight/2 - 150, '80px Academia', this.titleColor, undefined, 'GAME OVER', false);
        this.floorsText  = new TextLabel(canvasWidth/2, canvasHeight/2 - 30,  '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
        this.enemiesText = new TextLabel(canvasWidth/2, canvasHeight/2 + 20,  '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
        this.levelText   = new TextLabel(canvasWidth/2, canvasHeight/2 + 70,  '28px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
        this.continueBtn = new TextLabel(canvasWidth/2, canvasHeight - 70,    '30px Academia', this.btnColor, undefined, 'Continue', true);

        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundClick = this.handleClick.bind(this);
        canvas.addEventListener('mousemove', this.boundMouseMove);
        canvas.addEventListener('click', this.boundClick);
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
            this.state = 0;   // back to the main menu (the run was already reset on death)
        }
    }

    draw(ctx){
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.title.draw(ctx);
        this.floorsText.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);

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
