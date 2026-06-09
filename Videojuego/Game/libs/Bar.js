import GameObject from './GameObject.js';

// HUD bar that renders a fillable indicator over a missing-value background
export default class Bar{
    constructor(x, y, width, height, indicatorSprite, stat){
        this.indicatorBar = new GameObject(x, y, width, height); 
        this.missingAttributeBar = new GameObject(x, y, width, height); 
        this.indicatorBar.setSprite(indicatorSprite)
        this.missingAttributeBar.setSprite('../Assets/Sprites/mising_bar.png')
        this.stat = stat;
    }

    // Shrinks the indicator by the percentage of the stat that was just lost
    calculateCurrentIndicatorSubstraction(substractionValue){
        let percentage = substractionValue/this.stat;
        const oldWidth = this.indicatorBar.width;
        this.indicatorBar.width -= this.missingAttributeBar.width * percentage;
        if(this.indicatorBar.width < 0) {
            this.indicatorBar.width = 0;
        }
        const actualDelta = oldWidth - this.indicatorBar.width;
        this.indicatorBar.x -= actualDelta / 2;
    }

    // Grows the indicator by the percentage of the stat that was just recovered
    calculateCurrentIndicatorAddition(additionValue){
        let percentage = additionValue/this.stat;
        const oldWidth = this.indicatorBar.width;
        this.indicatorBar.width += this.missingAttributeBar.width * percentage;
        if(this.indicatorBar.width > this.missingAttributeBar.width) {
            this.indicatorBar.width = this.missingAttributeBar.width;
        }
        const actualDelta = this.indicatorBar.width - oldWidth;
        this.indicatorBar.x += actualDelta / 2;
    }
    
    draw(ctx){
        this.missingAttributeBar.draw(ctx)
        this.indicatorBar.draw(ctx)
    }
}