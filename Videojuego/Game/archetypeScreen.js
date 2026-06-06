import Menus from "./Menus.js";
import GameObject from "./GameObject.js";
import TextLabel from "./TextLabel.js";
import {ARCHETYPES} from "./GlobalVariables.js"
import {canvas} from "./Return.js";

// Archetype selection screen that shows the three available classes and their
// starting stats. Picking one persists the player_profile (archetype + seeded
// attributes), seeds the starting deck, opens a run, then routes into the Forest
// tutorial via the battle lobby.
export default class archetypeScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, game = null){
        super(background, canvasWidth, canvasHeight)
        this.game = game
        this.fields = []
        this.fieldLabels = []
        this.fieldAmount = 3;
        this.returnButton;
        this.busy = false
        this.initElements()
    }

    initElements(){
        let posX = this.canvasWidth/5
        let posY = this.canvasHeight/2
        let iconWidth = 200;
        let iconHeight = 400;
        let offSetX = 25
        let offSetY = 25
        this.returnButton = new GameObject(this.canvasWidth/11,this.canvasHeight/11, 150, 65, undefined, true, true)
        this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        for(let i= 0; i < this.fieldAmount; i++){
            let element = new GameObject(posX, posY, iconWidth, iconHeight, undefined, true, true)
            element.setSprite('../Assets/Sprites/selection1.jpg')
            this.fields.push(element)
            posX += 200 + offSetX
        }

        const keys = Object.keys(ARCHETYPES)
        for(let i = 0; i < keys.length; i++){
            let currentCol = ARCHETYPES[keys[i]]
            posX = this.canvasWidth/5 + i*(offSetX + iconWidth)
            posY = this.canvasHeight/2 - 30
            for(const [key, value] of Object.entries(currentCol)){
                if(key === 'id'){
                    let text = value.toUpperCase()
                    let label = new TextLabel(posX, posY, '40px Academia', 'black', true, text, true)
                    this.fieldLabels.push(label)
                    posY += 2*offSetY
                }
                else if(key === 'attributes'){
                    for(const [attribute, attributeValue] of Object.entries(value)){
                        let text = attribute + ': ' + attributeValue
                        let label = new TextLabel(posX, posY, '20px Academia', 'black', true, text, true)
                        this.fieldLabels.push(label)
                        posY += offSetY
                    }
                }
            }
        }

        // Bound refs so dispose() removes exactly these listeners — the click
        // handler creates a profile/run, so a stale listener firing later would
        // create duplicates.
        this._move = this.handleMove.bind(this)
        this._click = this.handleClick.bind(this)
        canvas.addEventListener('mousemove', this._move)
        canvas.addEventListener('click', this._click)
    }

    handleMove(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for(let element of this.fields){
            element.mouseCollition(mouseX, mouseY)
        }
        this.returnButton.mouseCollition(mouseX, mouseY)
    }

    handleClick(e){
        if(this.busy){ return }
        if(this.returnButton.hovered){
            this.dispose()
            this.state = 0
            return
        }
        for(let i = 0; i < this.fields.length; i++){
            if(this.fields[i].hovered){
                const key = Object.keys(ARCHETYPES)[i]
                if(key){ this.selectArchetype(key) }
                return
            }
        }
    }

    // Lowercases the UPPERCASE attribute keys ARCHETYPES uses to the column names
    // the attributes table / profile endpoint expect.
    lowercasedAttributes(key){
        const out = {}
        for(const [attr, value] of Object.entries(ARCHETYPES[key].attributes)){
            out[attr.toLowerCase()] = value
        }
        return out
    }

    async selectArchetype(key){
        this.busy = true
        this.dispose()
        const game = this.game
        if(!game || game.activeSlotId == null){
            console.error('No active slot to attach the profile to.')
            this.state = 0
            return
        }
        try {
            // archetype enum is the UPPERCASE key (SOLDIER|ARCHER|MAGE).
            await game.api.createProfile(game.activeSlotId, {
                archetype: key,
                attributes: this.lowercasedAttributes(key),
                attributePoints: 0
            })
            // Seed the starting deck (defined as slugs) into the permanent inventory.
            for(const slug of ARCHETYPES[key].startingCards){
                const cardId = game.cardSlugToId?.get(slug)
                if(!cardId){ console.warn('No catalog card for starting slug:', slug); continue }
                try { await game.api.addCard(game.activeSlotId, { cardId, isPermanent: true }) }
                catch(err){ console.warn('Could not seed starting card', slug, err) }
            }
            game.runId = await game.api.startRun(game.activeSlotId)
            await game.loadSlotData(game.activeSlotId)
            // Forced Forest tutorial: prep deck in the lobby, then fight forest_0.
            game.currentRoom = game.getForestRoom()
            this.state = 11
        } catch(err){
            console.error('Archetype setup failed:', err)
            this.state = 0
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        this.returnButton.draw(ctx)
        for(let field of this.fields){
            field.draw(ctx)
        }
        for(let label of this.fieldLabels){
            label.draw(ctx)
        }
    }

    update(deltaTime){
        for(let element of this.fields){
            if(element.hovered){
                element.setSprite('../Assets/Sprites/selection2.png')
            }
            else{
                element.setSprite('../Assets/Sprites/selection1.jpg')
            }
        }
        if(this.returnButton.hovered ){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png')
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        }
    }

    dispose(){
        canvas.removeEventListener('mousemove', this._move)
        canvas.removeEventListener('click', this._click)
    }
}
