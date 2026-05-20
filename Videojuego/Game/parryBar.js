import GameObject from "./GameObject";

export default class ParryBar{
    constructor(stamina){
        this.perfectParryIndicator; 
        this.normalParryIndicator;
        this.missParryIndicator;
        this.parryIcon; 
        this.state; 
        this.stamina = stamina;
    }

    draw(ctx){
        this.perfectParryIndicator.draw(ctx)
        this.normalParryIndicator.draw(ctx)
        this.missParryIndicator.draw(ctx)
        this.parryIcon.draw(ctx)
    }

    update(deltaTime){
        
    }
}