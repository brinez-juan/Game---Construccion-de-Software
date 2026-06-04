import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import {canvas} from './Return.js';
import ItemCard from './ItemCard.js';
import Action from './Action.js';

// End screen displayed when the player health drops to zero
export default class gameWonScreen extends Menus{
constructor(canvasWidth = 0, canvasHeight = 0, stats = { xpGained: 0, perfectParries: 0, normalParries: 0, missedParries: 0 }, cardsObtained = {}){
    super('', canvasWidth, canvasHeight);
    
    // Dark fantasy watercolor palette (matches lobby CSS)
    this.bgColor = '#1a1410';        // very dark brown/black background
    this.titleColor = '#008b31';    // Dark green
    this.textColor = '#f3ead0';      // parchment
    this.btnColor = '#c9a25a';       // antique gold
    this.btnHoverColor = '#f3d27a';  // bright gold
    
    // Title
    this.title = new TextLabel(canvasWidth/2, 150, '80px Academia', this.titleColor, undefined, 'GAME WON', false);
    
    // Stats lines (using the passed-in stats object, but defaults are hard-coded)
    let parryTotal = stats.perfectParries + stats.normalParries + stats.missedParries
    this.xpGainedLabel = new TextLabel(canvasWidth/2, 280, '28px Academia', this.textColor, undefined, `Floors Completed: ${stats.floorsCompleted}`, false);
    this.perfectParriesLabel = new TextLabel(canvasWidth/2, 330, '28px Academia', this.textColor, undefined, `Perfect Parries: ${stats.perfectParries/parryTotal*100}%`, false);
    this.normalParriesLabel = new TextLabel(canvasWidth/2, 380, '28px Academia', this.textColor, undefined, `Normal Parries: ${stats.normalParries/parryTotal*100}%`, false);
    this.missedParriesLabel = new TextLabel(canvasWidth/2, 430, '28px Academia', this.textColor, undefined, `Missed Parries: ${stats.missedParries/parryTotal*100}%`, false);

    //Show cards won in the battle
    this.hasCards = cardsObtained != null &&
        !(Array.isArray(cardsObtained) && cardsObtained.length === 0) &&
        !(typeof cardsObtained === 'object' && !Array.isArray(cardsObtained) && Object.keys(cardsObtained).length === 0);

    if(this.hasCards){
        this.cardsObtained = []
        this.cardSpawn(cardsObtained)
        //To know which card was chosen or obtained
        this.cardChosen = undefined
    }


    // Continue button
    this.continueBtn = new TextLabel(canvasWidth/2, hasCards ? 580 : 480, '30px Academia', this.btnColor, undefined, 'Continue', true);
    
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
        if(this.hasCards){
            for(let card of this.cardsObtained){
                card.mouseCollition(mx, my)
            }
        }
    }

    handleClick(e){
        if(this.continueBtn.hovered){
            this.state = 4;  // placexholder state for permanent card selection
        }
        if(this.hasCards && this.cardsObtained.length > 1){
            for(let card of this.cardsObtained){
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

        if(this.hasCards){
            this.cardLabel.draw(ctx)
            for(let card of this.cardsObtained){
                card.draw(ctx)
            }
        }

    }
    cardSpawn(cardsObtained){

        if(!Array.isArray(cardsObtained)){
            this.cardLabel = new TextLabel(this.canvasWidth/2, 480, '28px Academia', this.textColor, undefined, 'You obtained: ', undefined)
            let action = new Action(cardsObtained.name, cardsObtained.description, cardsObtained.action_type, cardsObtained.stamina_cost, cardsObtained.base_damage, 0,0,0, cardsObtained.scales_with, cardsObtained.scaling_factor, null)
            let cardInstance = new ItemCard(this.canvasWidth/2, 530, 30, 50, cardsObtained.name, cardsObtained.description, action, cardsObtained.required_value, cardsObtained.rarity, cardsObtained.stamina_cost, cardsObtained.isPermanent)
            cardInstance.setSprite(`../Assets/Sprites/${cardInstance.name}`)
            this.cardsObtained.push(cardInstance)
            this.cardChosen = cardInstance
        }
        else{
            this.cardLabel = new TextLabel(this.canvasWidth/2, 480, '28px Academia', this.textColor, undefined, 'Choose from: ', undefined)
            let offSetX = 20
            let posX = this.canvasWidth/2 -30 - offSetX
            let posY = 530
            for(let card of cardsObtained){
                let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
                let cardInstance = new ItemCard(posX, posY, 30, 50, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
                cardInstance.setSprite(`../Assets/Sprites/${cardInstance.name}`)
                this.cardsObtained.push(cardInstance)
                posX += cardInstance.width + offSetX
            }
        }
    }
    update(deltaTime){
    }
}