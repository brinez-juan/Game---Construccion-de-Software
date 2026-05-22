import GameObject from './GameObject.js';

export default class Bar{
    constructor(x, y, width, height, indicatorSprite, stat){
        this.indicatorBar = new GameObject(x, y, width, height); 
        this.missingAttributeBar = new GameObject(x, y, width, height); 
        this.indicatorBar.setSprite(indicatorSprite)
        this.missingAttributeBar.setSprite('../Assets/Sprites/mising_bar.png')
        this.stat = stat;
    }

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