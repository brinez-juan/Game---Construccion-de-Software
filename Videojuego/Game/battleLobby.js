import Menus from "./Menus.js";
import Bar from "./Bar.js";
import itemCard from "./ItemCard.js";
import textLabel from "./textLabel.js";
import Attribute from "./attribute.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";
import { canvas } from "./Return.js";
import GameObject from "./GameObject.js";
import { MAX_DECK_SIZE } from "./GlobalVariables.js";
//import { text } from "express";

// Pixels a selected card lifts above its row to signal selection (mirrors battleScreen's
// cardInAction lift).
const SELECT_RAISE = 15

// Lobby menu displayed between battles to show player progression and allow attribute upgrades

export default class battleLobby extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0,experienceToNextLevel,  experience, level, attributes, deck, inventory = [], availablePoints = 0, slotId = null, api = null, game = null){
        super(background, canvasWidth, canvasHeight)
        this.originalAttributes = attributes
        this.attributes = attributes
        this.availablePoints = availablePoints
        this.slotId = slotId
        this.api = api
        // The lobby is the prep step before a battle: it knows the chosen room and
        // the active run so "Start battle" can persist the deck and enter combat.
        this.game = game
        this.currentRoom = game?.currentRoom ?? null
        this.runId = game?.runId ?? null
        this.starting = false
        this.experienceBarElements = [];
        this.attributeElements = [];
        this.attributeByKey = {}
        this.deck = []
        this.inventory = []
        this.inventoryStack = []
        // A restored run arrives with its saved Battle Deck already split out of the
        // inventory (US22 Task 4) — honour it verbatim so the deck keeps exactly the
        // cards and order the player committed to. A fresh slot has no saved deck, so
        // seed one from the inventory (up to MAX_DECK_SIZE) to guarantee a playable
        // starting deck. Either way deck and inventory stay disjoint.
        let effectiveDeck, effectiveInventory
        if(deck && deck.length){
            effectiveDeck = deck.slice(0, MAX_DECK_SIZE)
            effectiveInventory = inventory || []
        } else {
            const inv = inventory || []
            effectiveDeck = inv.slice(0, MAX_DECK_SIZE)
            effectiveInventory = inv.slice(MAX_DECK_SIZE)
        }
        this.experienceBarSpawn(experience, level, experienceToNextLevel)
        this.attributeSectionSpawn(attributes)
        this.deckSectionSpawn(effectiveDeck, this.canvasWidth/10*3 + 20, this.canvasHeight/5, 80*0.75, 80, 10)
        this.inventorySectionSpawn(effectiveInventory, this.canvasWidth/10*3 + 20, this.canvasHeight/5*3, 80*0.75, 80, 10)
        // Buttons are placed from the row layout, not from card instances, so an
        // inventory with fewer than 5 cards (or none) doesn't blow up.
        this.movetoRightButton = new GameObject(this.inventoryRightX + 60, this.inventoryRowY, 35, 35)
        this.movetoLeftButton = new GameObject(this.inventoryLeftX - 60, this.inventoryRowY, 35, 35)
        this.movetoRightButton.setSprite('../Assets/Sprites/move_right.png')
        this.movetoLeftButton.setSprite('../Assets/Sprites/move_left.png')
        this.cardSelectedDeck = null
        this.cardSelectedInventory = null
        this.inventoryCurrentIndex = 0
        this.selectionField = {frame: undefined, info: [], ok: undefined}
        // "Start battle" enters the chosen room. Bottom-centre, clickable label.
        this.startButton = new textLabel(this.canvasWidth/2, this.canvasHeight - 30, '34px Academia', 'black', undefined, 'Start battle', true)
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
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0,0, card.scales_with, card.scaling_factor, null)
            // Build a real { ATTR: minValue } requirements object (keys are UPPERCASE,
            // matching this.attributes) so ItemCard.meetsRequirements() can gate equips.
            const requirements = card.required_attribute ? { [card.required_attribute]: card.required_value } : {}
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, requirements, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/${card.name}.jpeg`)
            // Keep the DB id + raw normalized card so "Start battle" can persist the
            // chosen deck (card ids) and hand the battle screen real card data.
            cardInstance.cardId = card.cardId
            cardInstance.sourceCard = card
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
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0,0, card.scales_with, card.scaling_factor, null)
            // Build a real { ATTR: minValue } requirements object (keys are UPPERCASE,
            // matching this.attributes) so ItemCard.meetsRequirements() can gate equips.
            const requirements = card.required_attribute ? { [card.required_attribute]: card.required_value } : {}
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, action, requirements, card.rarity, card.stamina_cost, card.isPermanent)
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/${card.name}.jpeg`)
            cardInstance.cardId = card.cardId
            cardInstance.sourceCard = card
            this.inventory.push(cardInstance)
            posX += cardWidth + offSetX
        }

        // Only the first page (up to 5) of real cards is shown at once.
        for(let i = 0; i < Math.min(5, this.inventory.length); i++){
            this.inventoryStack.push(this.inventory[i])
        }
    }

    addEventListeners(){
        // Store bound refs so dispose() can remove exactly these listeners when the
        // lobby hands off to the battle screen (otherwise stale clicks would keep
        // firing startSession on a screen that's no longer active).
        this._hover = this.handleHover.bind(this)
        this._click = this.handleClick.bind(this)
        canvas.addEventListener('mousemove', this._hover)
        canvas.addEventListener('click', this._click)
    }

    dispose(){
        canvas.removeEventListener('mousemove', this._hover)
        canvas.removeEventListener('click', this._click)
    }

    // Collects the chosen deck (or falls back to the first inventory cards),
    // persists the room session + deck, hands the battle screen real card data,
    // then transitions to the room's battle state.
    async startBattle(){
        if(this.starting){ return }
        this.starting = true
        const chosen = this.deck.map(c => c.sourceCard).filter(Boolean)
        let pool = chosen.length > 0 ? chosen : this.inventory.map(c => c.sourceCard).filter(Boolean)
        const seen = new Set()
        const deckCards = []
        for(const card of pool){
            if(card && !seen.has(card.cardId)){ seen.add(card.cardId); deckCards.push(card) }
            if(deckCards.length === 5){ break }
        }
        if(deckCards.length === 0){ console.error('Cannot start battle: empty deck.'); this.starting = false; return }

        try {
            if(this.api && this.runId != null && this.currentRoom){
                await this.api.startSession(this.runId, { roomId: this.currentRoom.id, deck: deckCards.map(c => c.cardId) })
            }
        } catch(err){
            console.error('Could not persist room session/deck:', err)
        }

        // Hand the assembled deck to the battle screen via the shared player object, and
        // keep the inventory DISJOINT from it: the lobby's this.inventory already excludes
        // the deck cards, so the player's run inventory becomes those cards minus anything
        // that ended up in the deck (the fallback can pull deck cards from the inventory).
        // Without this the next lobby (post-battle) would list the deck cards in BOTH the
        // Deck and Inventory rows — the duplication that only cleared on a reload, because
        // loadSlotData re-splits the saved deck out of the inventory the same way.
        if(this.game?.player){
            this.game.player.activeDeck = deckCards
            const deckIds = new Set(deckCards.map(c => c.cardId))
            this.game.player.inventory = this.inventory
                .map(c => c.sourceCard)
                .filter(card => card && !deckIds.has(card.cardId))
        }
        this.dispose()
        this.state = this.currentRoom ? this.currentRoom.stateCode : 6
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
            this.startButton.mouseCollition(mouseX, mouseY)
            this.movetoLeftButton.mouseCollition(mouseX, mouseY)
            this.movetoRightButton.mouseCollition(mouseX, mouseY)
            for(const key in this.attributeByKey){
                this.attributeByKey[key].additionButton.mouseCollition(mouseX, mouseY)
            }
        }
    }

    async handleClick(e){
        if(this.selectionField.frame){
            if(this.selectionField.ok.hovered){
                this.selectionField = {frame: undefined, info: [], ok: undefined}
            }
        }
        else{
            // Start battle takes priority over the card/attribute interactions.
            if(this.startButton.hovered){
                await this.startBattle()
                return
            }
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

                if(this.movetoLeftButton.hovered){
                this.inventoryCurrentIndex -= 5
                if(this.inventoryCurrentIndex < 0){
                    this.inventoryCurrentIndex = this.inventory.length + this.inventoryCurrentIndex
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

            // Card exchange (US: 5-card deck <-> inventory). The player clicks one card,
            // then clicks the card to exchange it for: clicking a card in one zone while a
            // card in the OTHER zone is already selected falls through to the swap block
            // below, so the exchange happens on that second click. Clicking the same
            // selected card reopens its info popup; clicking a different card in the same
            // zone just moves the selection.
            for(let card of this.inventoryStack){
                if(card.hovered){
                    if(card === this.cardSelectedInventory){
                        this.attributeShow(card)
                        this.lowerSelection('inventory')
                        return
                    }
                    this.raiseSelection('inventory', card)
                    if(!this.cardSelectedDeck){ return }  // wait for the deck card to swap with
                    break
                }
            }

            for(let card of this.deck){
                if(card.hovered){
                    if(card === this.cardSelectedDeck){
                        this.attributeShow(card)
                        this.lowerSelection('deck')
                        return
                    }
                    this.raiseSelection('deck', card)
                    if(!this.cardSelectedInventory){ return }  // wait for the inventory card
                    break
                }
            }

            if(this.cardSelectedDeck && this.cardSelectedInventory){
                // Gate the equip: an inventory card can only enter the Battle Deck when
                // the player meets its attribute requirement (US22 Task 2). Block the
                // swap and tell the player which attribute is short.
                if(!this.cardSelectedInventory.meetsRequirements(this.attributes)){
                    this.requirementWarning(this.cardSelectedInventory)
                    this.lowerSelection('inventory')
                    this.lowerSelection('deck')
                    return
                }
                let deckIndex = this.deck.indexOf(this.cardSelectedDeck)
                let inventoryIndex = this.inventory.indexOf(this.cardSelectedInventory)
                let stackIndex = this.inventoryStack.indexOf(this.cardSelectedInventory)

                let deckX = this.cardSelectedDeck.x 
                let deckY = this.cardSelectedDeck.y
                this.cardSelectedDeck.x = this.cardSelectedInventory.x
                this.cardSelectedDeck.y = this.cardSelectedInventory.y
                this.cardSelectedInventory.x = deckX
                this.cardSelectedInventory.y = deckY
                // Both cards are still lifted from being selected; drop them back so they
                // sit flat in their new slots.
                this.cardSelectedDeck.y += SELECT_RAISE
                this.cardSelectedInventory.y += SELECT_RAISE

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

    // Lifts the newly selected card slightly above its row to signal selection (mirrors
    // the battle screen's cardInAction lift). Lowers the previously selected card in the
    // same zone first, so only one card per zone is ever raised.
    raiseSelection(zone, card){
        const key = zone === 'deck' ? 'cardSelectedDeck' : 'cardSelectedInventory'
        if(this[key] === card){ return }
        if(this[key]){ this[key].y += SELECT_RAISE }
        card.y -= SELECT_RAISE
        this[key] = card
    }

    // Drops the currently selected card in a zone back onto its row and clears the selection.
    lowerSelection(zone){
        const key = zone === 'deck' ? 'cardSelectedDeck' : 'cardSelectedInventory'
        if(this[key]){
            this[key].y += SELECT_RAISE
            this[key] = null
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
        this.startButton.draw(ctx)

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
        // requirements is now an { ATTR: minValue } object; surface the threshold from
        // the raw card so the popup keeps reading as a single attribute requirement.
        const reqAttr = card.sourceCard?.required_attribute
        const reqValue = card.sourceCard?.required_value ?? 0
        const reqText = reqAttr ? `${reqAttr} ${reqValue}` : 'none'
        let scaleReq = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + 2*offSetY, '25px Academia', 'black', undefined, 'Attribute nec. val: ' + reqText)
        this.selectionField.info.push(nameLabel, actionType, baseDamage, scaleAtt, scaleFact, scaleReq)
        this.selectionField.ok = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'ok', true)
    }

    // Popup shown when the player tries to equip a card they don't meet the attribute
    // requirement for (US22 Task 2). Reuses the same selectionField info dialog so the
    // existing hover/click routing to selectionField.ok dismisses it.
    requirementWarning(card){
        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
        this.selectionField.info = []
        let offSetY = 25
        const reqAttr = card.sourceCard?.required_attribute
        const reqValue = card.sourceCard?.required_value ?? 0
        let title = new textLabel(this.canvasWidth/2, this.canvasHeight/2 - 2*offSetY, '28px Academia', 'black', undefined, 'Requirement not met', true)
        let nameLabel = new textLabel(this.canvasWidth/2, this.canvasHeight/2 - offSetY, '22px Academia', 'black', undefined, String(card.name).replace("_", " "), true)
        let needLabel = new textLabel(this.canvasWidth/2, this.canvasHeight/2, '22px Academia', 'black', undefined, `Needs ${reqAttr} ${reqValue}`, true)
        let haveLabel = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + offSetY, '22px Academia', 'black', undefined, `You have ${reqAttr}: ${this.attributes[reqAttr] ?? 0}`, true)
        this.selectionField.info.push(title, nameLabel, needLabel, haveLabel)
        this.selectionField.ok = new textLabel(this.canvasWidth/2, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'ok', true)
    }
}