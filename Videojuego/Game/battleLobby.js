import Menus from "./Menus.js";
import Bar from "./Bar.js";
import itemCard from "./ItemCard.js";
import textLabel from "./textLabel.js";
import Attribute from "./attribute.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";

// Lobby menu displayed between battles to show player progression and allow attribute upgrades

export default class battleLobby extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0,experienceToNextLevel,  experience, level, attributes, deck){
        super(background, canvasWidth, canvasHeight)
        this.experienceBarElements = []; 
        this.attributeElements = []; 
        this.deck = []
        this.inventory = []
        this.experienceBarSpawn(experience, level, experienceToNextLevel)
        this.attributeSectionSpawn(attributes)
        this.deckSectionSpawn(deck, this.canvasWidth/10*3, this.canvasHeight/5, 80*0.75, 80, 10)
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
        let deckLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Deck', false)
        this.deck.push(deckLabel)
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
        let inventoryLabel = new textLabel(positionX, positionY - 30, '30px Academia', 'black', undefined, 'Inventory', false)
        this.inventory.push(inventoryLabel)
        let posX = positionX - 2 * (cardWidth + offSetX)
        let posY = positionY + 60
        for(let card of inventory){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(`../Assets/Sprites/${card.name}.jpeg`)
            this.inventory.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        for(let element of this.experienceBarElements){
            element.draw(ctx)
        }
        for(let attribute of this.attributeElements){
            attribute.draw(ctx)
        }
        for(let element of this.deck){
            element.draw(ctx)
        }
    }
}