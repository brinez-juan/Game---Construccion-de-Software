import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import {canvas} from './Return.js';

// End screen displayed when the player health drops to zero
export default class gameOverScreen extends Menus{
constructor(canvasWidth = 0, canvasHeight = 0, stats = { floorsCompleted: 0, enemiesDefeated: 0, finalLevel: 1 }){
    super('', canvasWidth, canvasHeight);
    
    // Dark fantasy watercolor palette (matches lobby CSS)
    this.bgColor = '#1a1410';        // very dark brown/black background
    this.titleColor = '#8b0000';     // blood red
    this.textColor = '#f3ead0';      // parchment
    this.btnColor = '#c9a25a';       // antique gold
    this.btnHoverColor = '#f3d27a';  // bright gold
    
    // Title
    this.title = new TextLabel(canvasWidth/2, 150, '80px Academia', this.titleColor, undefined, 'GAME OVER', false);
    
    // Stats lines (using the passed-in stats object, but defaults are hard-coded)
    this.floorsText = new TextLabel(canvasWidth/2, 280, '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
    this.enemiesText = new TextLabel(canvasWidth/2, 330, '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
    this.levelText = new TextLabel(canvasWidth/2, 380, '28px Academia', this.textColor, undefined, `Final Level: ${stats.finalLevel}`, false);
    
    // Continue button
    this.continueBtn = new TextLabel(canvasWidth/2, 480, '30px Academia', this.btnColor, undefined, 'Continue', true);
    
    // Wire up canvas listeners for hover and click
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
            this.state = 4;  // placexholder state for permanent card selection
        }
    }
    draw(ctx){
        // Background fill
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw static text elements
        this.title.draw(ctx);
        this.floorsText.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);
        
        // Draw Continue button with hover glow
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

    update(deltaTime){
    }
}
