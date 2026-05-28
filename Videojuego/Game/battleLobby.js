import Menus from "./Menus.js";
import Bar from "./Bar.js";
import itemCard from "./ItemCard.js";
import textLabel from "./textLabel.js";
import Attribute from "./attribute.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";
import { canvas } from "./Return.js";
import GameObject from "./GameObject.js";

// Lobby menu displayed between battles to show player progression and allow attribute upgrades

export default class battleLobby extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0,experienceToNextLevel,  experience, level, attributes, deck, inventory = [], availablePoints = 0, slotId = null, api = null){
        super(background, canvasWidth, canvasHeight)
        this.originalAttributes = attributes
        this.attributes = attributes
        this.availablePoints = availablePoints
        this.slotId = slotId
        this.api = api
        this.experienceBarElements = [];
        this.attributeElements = [];
        this.attributeByKey = {}
        this.deck = []
        this.inventory = []
        this.inventoryStack = []
        this.experienceBarSpawn(experience, level, experienceToNextLevel)
        this.attributeSectionSpawn(attributes)
        this.deckSectionSpawn(deck, this.canvasWidth/10*3 + 20, this.canvasHeight/5, 80*0.75, 80, 10)
        this.inventorySectionSpawn(inventory, this.canvasWidth/10*3 + 20, this.canvasHeight/5*3, 80*0.75, 80, 10)
        // Buttons are placed from the row layout, not from card instances, so an
        // inventory with fewer than 5 cards (or none) doesn't blow up.
        this.movetoRightButton = new GameObject(this.inventoryRightX + 60, this.inventoryRowY, 35, 35)
        this.movetoLeftButton = new GameObject(this.inventoryLeftX - 60, this.inventoryRowY, 35, 35)
        this.movetoRightButton.setSprite('../Assets/Sprites/move_right.png')
        this.movetoLeftButton.setSprite('../Assets/Sprites/move_left.png')
        this.cardSelectedDeck = null
        this.cardSelectedInventory = null
        this.inventoryCurrentIndex = 0
        this.addEventListeners()
    }

    experienceBarSpawn(exp, level, expToNextLevel){
        let offSetY = 30;
        let offSetX = 40; 
        let initialPosX = this.canvasWidth/5*4 - offSetX
        let initialPosY = this.canvasHeight/5 - offSetY
        let expLabel = new textLabel(initialPosX, initialPosY, '30px Academia', 'black', undefined, 'Experience', false)
        this.experienceBarElements.push(expLabel)
        initialPosY += offSetY
        let expBar = new Bar(initialPosX, initialPosY, 250, 20, '../Assets/Sprites/stamina_bar.png', expToNextLevel)
        expBar.calculateCurrentIndicatorSubstraction(expToNextLevel - (expToNextLevel - exp))
        this.experienceBarElements.push(expBar)
        initialPosY += offSetY
        let initialExp = new textLabel(initialPosX - expBar.missingAttributeBar.width/2, initialPosY, '20px Academia', 'black', undefined, 0, false)
        this.experienceBarElements.push(initialExp)
        let finalExp = new textLabel(initialPosX + expBar.missingAttributeBar.width/2, initialPosY, '20px Academia', 'black', undefined, expToNextLevel, false)
        this.experienceBarElements.push(finalExp)
        let levelLabel = new textLabel(initialPosX, initialPosY, '20px Academia', 'black', undefined, `Level ${level}`, false)
        this.experienceBarElements.push(levelLabel)
    }

    attributeSectionSpawn(attributes){
        let offSetY = 30;
        let offsetX = 55;
        let initialPosX = this.canvasWidth/5*4 - offsetX
        let initialPosY = this.canvasHeight/2
        let attributeSectionLabel = new textLabel(initialPosX, initialPosY, '30px Academia', 'black', undefined, 'Attributes', false)
        this.attributeElements.push(attributeSectionLabel)
        initialPosX += 2*offsetX
        initialPosY += offSetY/2
        for(const [key, value] of Object.entries(attributes)){
            initialPosY += offSetY
            let attribute = new Attribute(initialPosX, initialPosY, 20, key, value)
            this.attributeElements.push(attribute)
            this.attributeByKey[key] = attribute
        }
        initialPosY += offSetY
        this.pointsLabel = new textLabel(initialPosX, initialPosY, '20px Academia', 'black', undefined, `Points: ${this.availablePoints}`, false)
        this.attributeElements.push(this.pointsLabel)
    }

    deckSectionSpawn(activeDeck, positionX, positionY, cardWidth, cardHeight, offSetX){
        this.deckLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Deck', false)
        let posX = positionX - 2 * (cardWidth + offSetX)
        let posY = positionY + 60
        for(let card of activeDeck){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/${card.name}.jpeg`)
            this.deck.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }

    inventorySectionSpawn(inventory, positionX, positionY, cardWidth, cardHeight, offSetX){
        this.inventoryLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Inventory', false)
        let posX = positionX - 2 * (cardWidth + offSetX)
        let posY = positionY + 60
        // Remember the row layout so the paging buttons can be placed even when the
        // inventory has fewer than 5 cards (or is empty).
        this.inventoryLeftX = posX
        this.inventoryRightX = positionX + 2 * (cardWidth + offSetX)
        this.inventoryRowY = posY
        for(let card of inventory){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/${card.name}.jpeg`)
            this.inventory.push(cardInstance)
            posX += cardWidth + offSetX
        }

        // Only the first page (up to 5) of real cards is shown at once.
        for(let i = 0; i < Math.min(5, this.inventory.length); i++){
            this.inventoryStack.push(this.inventory[i])
        }
    }

    addEventListeners(){
        canvas.addEventListener('mousemove', this.handleHover.bind(this))
        canvas.addEventListener('click', this.handleClick.bind(this))
    }

    handleHover(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for(let element of this.deck){
            element.mouseCollition(mouseX, mouseY)
        }
        for(let element of this.inventoryStack){
            element.mouseCollition(mouseX, mouseY)
        }
        this.movetoLeftButton.mouseCollition(mouseX, mouseY)
        this.movetoRightButton.mouseCollition(mouseX, mouseY)
        for(const key in this.attributeByKey){
            this.attributeByKey[key].additionButton.mouseCollition(mouseX, mouseY)
        }
    }

    async handleClick(e){
        // Spend an attribute point: persist via PATCH, then refresh the value + counter.
        if(this.availablePoints > 0 && this.api && this.slotId != null){
            for(const key in this.attributeByKey){
                const attribute = this.attributeByKey[key]
                if(attribute.additionButton.hovered){
                    try {
                        const res = await this.api.spendAttribute(this.slotId, key)
                        this.availablePoints = res.availablePoints
                        this.attributes[key] = res.attributes[key]
                        attribute.attributeValueLabel.text = res.attributes[key]
                        this.pointsLabel.text = `Points: ${this.availablePoints}`
                    } catch(err){
                        console.error('Could not spend attribute point:', err)
                    }
                    return;
                }
            }
        }

        // Inventory paging only makes sense with more than one page of cards.
        if(this.inventory.length <= 5) return;

        if(this.movetoLeftButton.hovered){
            this.inventoryCurrentIndex -= 5
            if(this.inventoryCurrentIndex < 0){
                this.inventoryCurrentIndex = this.inventory.length - this.inventoryCurrentIndex
            }
            let indexCurrentShowingCards = 0
            for(let i = this.inventoryCurrentIndex; i < this.inventoryCurrentIndex + 5; i++){
                let indexInventory = i%this.inventory.length
                this.inventory[indexInventory].x = this.inventoryStack[indexCurrentShowingCards].x
                this.inventoryStack[indexCurrentShowingCards] = this.inventory[indexInventory]
                indexCurrentShowingCards++;
            }
            return;
        }

        if(this.movetoRightButton.hovered){
            this.inventoryCurrentIndex += 5
            if(this.inventoryCurrentIndex > this.inventory.length){
                this.inventoryCurrentIndex = this.inventoryCurrentIndex%this.inventory.length
            }
            let indexCurrentShowingCards = 0;
            for(let i = this.inventoryCurrentIndex; i < this.inventoryCurrentIndex + 5; i++){
                let indexInventory = i%this.inventory.length
                this.inventory[indexInventory].x = this.inventoryStack[indexCurrentShowingCards].x
                this.inventoryStack[indexCurrentShowingCards] = this.inventory[indexInventory]
                indexCurrentShowingCards++;
            }
            return;
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        this.inventoryLabel.draw(ctx)
        this.deckLabel.draw(ctx)
        if(this.inventory.length > 5){
            this.movetoLeftButton.draw(ctx)
            this.movetoRightButton.draw(ctx)
        }
        for(let element of this.experienceBarElements){
            element.draw(ctx)
        }
        for(let attribute of this.attributeElements){
            attribute.draw(ctx)
        }
        for(let element of this.deck){
            element.draw(ctx)
        }
        for(let element of this.inventoryStack){
            element.draw(ctx)
        }

    }
}