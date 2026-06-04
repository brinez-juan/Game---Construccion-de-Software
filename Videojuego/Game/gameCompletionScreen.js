import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import {canvas} from './Return.js';

// Game completion screen displayed when finishing the game
export default class gameCompletionScreen extends Menus{
constructor(canvasWidth = 0, canvasHeight = 0, stats = { totalTime: 0, enemiesDefeated: 0, cardsObtained: 1, level: 1, totalXP: 0, perfectParries: 0, normalParries: 0, missedParries: 0 }){
    super('', canvasWidth, canvasHeight);
    
    // Dark fantasy watercolor palette (matches lobby CSS)
    this.bgColor = '#1a1410';        // very dark brown/black background
    this.titleColor = '#008b31';     // Dark green
    this.textColor = '#f3ead0';      // parchment
    this.btnColor = '#c9a25a';       // antique gold
    this.btnHoverColor = '#f3d27a';  // bright gold
    
    // Title
    this.title = new TextLabel(canvasWidth/2, 150, '80px Academia', this.titleColor, undefined, 'GAME COMPLETED', false);
    
    // Stats lines (using the passed-in stats object, but defaults are hard-coded)
    this.totalTimeText = new TextLabel(canvasWidth/2, 280, '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.totalTime}`, false);
    this.enemiesText = new TextLabel(canvasWidth/2, 330, '28px Academia', this.textColor, undefined, `Enemies Defeated: ${stats.enemiesDefeated}`, false);
    this.levelText = new TextLabel(canvasWidth/2, 380, '28px Academia', this.textColor, undefined, `Level: ${stats.level}`, false);
    this.cardsObtainedText = new TextLabel(canvasWidth/2, 430, '28px Academia', this.textColor, undefined, `Cards obtained: ${stats.cardsObtained.length}`, false);
    this.xpEarnedText = new TextLabel(canvasWidth/2, 480, '28px Academia', this.textColor, undefined, `XP Earned: ${stats.totalXP}`, false);
    let parryTotal = stats.perfectParries + stats.normalParries + stats.missedParries
    this.xpGainedLabel = new TextLabel(canvasWidth/2, 530, '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
    this.perfectParriesLabel = new TextLabel(canvasWidth/2, 580, '28px Academia', this.textColor, undefined, `Perfect Parries: ${stats.perfectParries/parryTotal*100}%`, false);
    this.normalParriesLabel = new TextLabel(canvasWidth/2, 630, '28px Academia', this.textColor, undefined, `Normal Parries: ${stats.normalParries/parryTotal*100}%`, false);
    this.missedParriesLabel = new TextLabel(canvasWidth/2, 680, '28px Academia', this.textColor, undefined, `Missed Parries: ${stats.missedParries/parryTotal*100}%`, false);
    
    // Continue button
    this.continueBtn = new TextLabel(canvasWidth/2, 730, '30px Academia', this.btnColor, undefined, 'Continue', true);
    
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
        this.totalTimeText.draw(ctx);
        this.enemiesText.draw(ctx);
        this.levelText.draw(ctx);
        this.cardsObtainedText.draw(ctx);
        this.xpEarnedText.draw(ctx)
        
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