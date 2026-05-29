import Menus from "./Menus.js";
import Bar from "./Bar.js";
import itemCard from "./ItemCard.js";
import textLabel from "./textLabel.js";
import Attribute from "./attribute.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";
import { canvas } from "./Return.js";
import GameObject from "./GameObject.js";
//import { text } from "express";

// Lobby menu displayed between battles to show player progression and allow attribute upgrades

export default class battleLobby extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0,experienceToNextLevel,  experience, level, attributes, deck, inventory = []){
        super(background, canvasWidth, canvasHeight)
        this.originalAttributes = attributes
        this.attributes = attributes
        this.experienceBarElements = [];
        this.attributeElements = [];
        this.deck = []
        this.inventory = []
        this.inventoryStack = []
        this.experienceBarSpawn(experience, level, experienceToNextLevel)
        this.attributeSectionSpawn(attributes)
        this.deckSectionSpawn(deck, this.canvasWidth/10*3 + 20, this.canvasHeight/5, 80*0.75, 80, 10)
        this.inventorySectionSpawn(inventory, this.canvasWidth/10*3 + 20, this.canvasHeight/5*3, 80*0.75, 80, 10)
        this.movetoRightButton = new GameObject(this.inventoryStack[this.inventoryStack.length - 1].x + 60,  this.inventoryStack[this.inventoryStack.length - 1].y, 35, 35)
        this.movetoLeftButton = new GameObject(this.inventoryStack[0].x - 60,  this.inventoryStack[0].y, 35, 35)
        this.movetoRightButton.setSprite('../Assets/Sprites/move_right.png')
        this.movetoLeftButton.setSprite('../Assets/Sprites/move_left.png')
        this.cardSelectedDeck = null
        this.cardSelectedInventory = null
        this.inventoryCurrentIndex = 0
        this.selectionField = {frame: undefined, info: [], ok: undefined}
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
        let offsetX = 40;
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
        }
    }

    deckSectionSpawn(activeDeck, positionX, positionY, cardWidth, cardHeight, offSetX){
        this.deckLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Deck', false)
        let posX = positionX - 2 * (cardWidth + offSetX)
        let posY = positionY + 60
        for(let card of activeDeck){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(`../Assets/Sprites/${card.name}.jpeg`)
            this.deck.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }

    inventorySectionSpawn(inventory, positionX, positionY, cardWidth, cardHeight, offSetX){
        this.inventoryLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Inventory', false)
        let posX = positionX - 2 * (cardWidth + offSetX)
        let posY = positionY + 60
        for(let card of inventory){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(`../Assets/Sprites/${card.name}.jpeg`)
            console.log(cardInstance.action.scaleFactor)
            this.inventory.push(cardInstance)
            posX += cardWidth + offSetX
        }

        for(let i = 0; i < 5; i++){
            let element = this.inventory[i]
            this.inventoryStack.push(element)
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
        if(this.selectionField.frame){
            this.selectionField.ok.mouseCollition(mouseX, mouseY)
        }
        else{
            for(let element of this.deck){
                element.mouseCollition(mouseX, mouseY)
            }
            for(let element of this.inventoryStack){
                element.mouseCollition(mouseX, mouseY)
            }
            this.movetoLeftButton.mouseCollition(mouseX, mouseY)
            this.movetoRightButton.mouseCollition(mouseX, mouseY)
            //Add mouseCollition for the + buttons in attributes
        }
    }

    handleClick(e){
        if(this.selectionField.frame){
            if(this.selectionField.ok.hovered){
                this.selectionField = {frame: undefined, info: [], ok: undefined}
            }
        }
        else{
                if(this.movetoLeftButton.hovered){
                this.inventoryCurrentIndex -= 5
                if(this.inventoryCurrentIndex < 0){
                    this.inventoryCurrentIndex = (this.inventory.length - 1)+ this.inventoryCurrentIndex
                }
                const slotPositions = this.inventoryStack.map(card => card.x)
                let indexCurrentShowingCards = 0
                for(let i = this.inventoryCurrentIndex; i < this.inventoryCurrentIndex + 5; i++){
                    let indexInventory = i%this.inventory.length
                    this.inventory[indexInventory].x = slotPositions[indexCurrentShowingCards] 
                    this.inventoryStack[indexCurrentShowingCards] = this.inventory[indexInventory]
                    indexCurrentShowingCards++;
                }
                return;
            }

            if(this.movetoRightButton.hovered){
                this.inventoryCurrentIndex += 5
                if(this.inventoryCurrentIndex >= this.inventory.length){
                    this.inventoryCurrentIndex = this.inventoryCurrentIndex%this.inventory.length
                }
                const slotPositions = this.inventoryStack.map(card => card.x)
                let indexCurrentShowingCards = 0;
                for(let i = this.inventoryCurrentIndex; i < this.inventoryCurrentIndex + 5; i++){
                    let indexInventory = i%this.inventory.length
                    this.inventory[indexInventory].x = slotPositions[indexCurrentShowingCards]
                    this.inventoryStack[indexCurrentShowingCards] = this.inventory[indexInventory]
                    indexCurrentShowingCards++;
                }
                return; 
            }

            for(let card of this.inventoryStack){
                if(card.hovered){
                    if(!this.cardSelectedInventory){
                        this.cardSelectedInventory = card
                        return
                    }
                    else if(card === this.cardSelectedInventory){
                        this.attributeShow(card)
                        return
                    }
                    else{
                        this.cardSelectedInventory = card
                        return
                    }
                }
            }

            for(let card of this.deck){
                if(card.hovered){
                    if(!this.cardSelectedDeck){
                        this.cardSelectedDeck = card
                        return
                    }
                    else if(card === this.cardSelectedDeck){
                        this.attributeShow(card)
                        return
                    }
                    else{
                        this.cardSelectedDeck = card
                        return
                    }
                }
            }

            if(this.cardSelectedDeck && this.cardSelectedInventory){
                let deckIndex = this.deck.indexOf(this.cardSelectedDeck)
                let inventoryIndex = this.inventory.indexOf(this.cardSelectedInventory)
                let stackIndex = this.inventoryStack.indexOf(this.cardSelectedInventory)

                let deckX = this.cardSelectedDeck.x 
                let deckY = this.cardSelectedDeck.y
                this.cardSelectedDeck.x = this.cardSelectedInventory.x
                this.cardSelectedDeck.y = this.cardSelectedInventory.y
                this.cardSelectedInventory.x = deckX
                this.cardSelectedInventory.y = deckY

                this.deck[deckIndex] = this.cardSelectedInventory                                                                              
                this.inventory[inventoryIndex] = this.cardSelectedDeck                                                                         
                if(stackIndex !== -1){                                                                                                         
                    this.inventoryStack[stackIndex] = this.cardSelectedDeck                                                                    
                }                                                                                                                              
                                                                                                                                             
                this.cardSelectedDeck = null                                                                                                   
                this.cardSelectedInventory = null  
            }
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        this.inventoryLabel.draw(ctx)
        this.deckLabel.draw(ctx)
        this.movetoLeftButton.draw(ctx)
        this.movetoRightButton.draw(ctx)
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

        if(this.selectionField.frame){
            this.selectionField.frame.draw(ctx)
            for(let label of this.selectionField.info){
                label.draw(ctx)
            }
            this.selectionField.ok.draw(ctx)
        }
    }

    attributeShow(card){
        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
        this.selectionField.info = []
        let offSetY = 25
        let nameLabel = new textLabel(this.canvasWidth/2, this.canvasHeight/2 - 3*offSetY, '25px Academia', 'black', undefined, 'Name: ' + card.name.replace("_", " "))
        let actionType = new textLabel(this.canvasWidth/2, this.canvasHeight/2 - 2*offSetY, '25px Academia', 'black', undefined, 'Type: ' + card.action.actionType.replace("_", " "))
        let baseDamage = new textLabel(this.canvasWidth/2, this.canvasHeight/2 - 1*offSetY, '25px Academia', 'black', undefined, 'Base damage: ' + card.action.baseDamage)
        let scaleAtt = new textLabel(this.canvasWidth/2, this.canvasHeight/2, '25px Academia', 'black', undefined, 'Required att: ' + card.action.scalingAttribute)
        let scaleFact = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + 1*offSetY, '25px Academia', 'black', undefined, 'Scale factor: ' + card.action.scaleFactor)
        let scaleReq = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + 2*offSetY, '25px Academia', 'black', undefined, 'Attribute nec. val: ' + card.requirements)
        this.selectionField.info.push(nameLabel, actionType, baseDamage, scaleAtt, scaleFact, scaleReq)
        this.selectionField.ok = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'ok', true)
    }
}