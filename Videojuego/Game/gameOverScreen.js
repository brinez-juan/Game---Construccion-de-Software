import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import {canvas} from './Return.js';
import ItemCard from './ItemCard.js';
import Action from './Action.js';

// End screen displayed when the player health drops to zero
export default class gameOverScreen extends Menus{
constructor(canvasWidth = 0, canvasHeight = 0, stats = { floorsCompleted: 0, enemiesDefeated: 0, finalLevel: 1 }, inventory = []){
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
    
    //Spawn cards to choose if the inventory is not empty after checking isPermanent
    this.inventoryNotPermament = inventory.filter(item => item.isPermanent)
    if(this.inventoryNotPermament.length > 0){
        this.cards = []
        this.cardChosen = undefined
        cardSpawn(inventory)
    }

    // Continue button
    this.continueBtn = new TextLabel(canvasWidth/2, inventoryNotPermament.length > 0? 430:580, '30px Academia', this.btnColor, undefined, 'Continue', true);
    
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
    if(this.inventoryNotPermament.length > 0){
        for(let card of this.cards){
            card.mouseCollition(mx, my)
        }
    }
    }

    handleClick(e){
        if(this.continueBtn.hovered){
            this.state = 4;  // placexholder state for permanent card selection
        }
        if(this.inventoryNotPermament.length > 0){
            for(let card of this.cards){
                if(card.hovered){
                    card.y -= 10
                    this.cardChosen = card
                }
                else{
                    card.y += 10
                    this.cardChosen = undefined
                }
            }
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
        if(this.inventoryNotPermament.length > 0){
            this.cardLabel.draw(ctx)
            for(let card of this.cards){
                card.draw(ctx)
            }
        }
    }

    cardSpawn(inventory){a
        this.cardLabel = new TextLabel(this.canvasWidth/2, 480, '28px Academia', this.textColor, undefined, 'Choose from: ', undefined)
        let cardWidth = 30
        let offSetX = 15
        let cardRetro = (inventory.length - 1)%2 === 0? (inventory.length - 1 )/2*(cardWidth + offSetX) :  (cardWidth/2 + offSetX/2) + (inventory.length/2-1)*(cardWidth + offSetX)
        let posX = this.canvasWidth/2 - cardRetro
        let posY = 530
        for(let card of invetory){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)                
            let cardInstance = new ItemCard(posX, posY, 30, 50, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)                           
            cardInstance.setSprite(`../Assets/Sprites/${cardInstance.name}`)                          
            this.cards.push(cardInstance)  
            posX += cardInstance.width + offSetX
        }

    }

    update(deltaTime){
    }
}
