import Menus from './Menus.js';
import GameObject from '../../libs/GameObject.js';
import TextLabel from '../../libs/TextLabel.js';
import { canvas } from '../../Return.js';

// Save slot picker used for both new-game creation and continuing a stored run.
// Slots come from the backend (GET /api/saved-games); the three on-screen fields
// map to slot_number 1..3.
export default class selectionMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, game, menu){
        super(background, canvasWidth, canvasHeight)
        this.game = game
        this.menuType = menu
        this.fields = []
        this.fieldLabels = []
        this.fieldAmount = 3;
        this.returnButton;
        this.slotsByNumber = new Map()   // slot_number (1..3) -> slot
        this.busy = false
        this.selectionField = {frame: undefined, yes: undefined, no: undefined, question: undefined, ok: undefined}
        this.elementSelected = undefined
        this.pendingSlot = null          // { slotNumber, existing } awaiting overwrite confirm
        this.initElements()
        this.loadSlots()
    }

    initElements(){
        let posX = this.canvasWidth/5
        let posY = this.canvasHeight/2
        let iconWidth = 200;
        let iconHeight = 400;
        let offSetX = 25
        this.returnButton = new GameObject(this.canvasWidth/11,this.canvasHeight/11, 150, 65, undefined, true, true)
        this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        for(let i = 0; i < this.fieldAmount; i++){
            let element = new GameObject(posX, posY, iconWidth, iconHeight, undefined, true, true)
            element.setSprite('../Assets/Sprites/selection1.jpg')
            this.fields.push(element)
            posX += iconWidth + offSetX
        }

        this._move = this.handleMove.bind(this)
        this._click = this.handleClick.bind(this)
        canvas.addEventListener('mousemove', this._move)
        canvas.addEventListener('click', this._click)
    }

    // Pulls the user's slots and (re)builds the per-slot labels.
    async loadSlots(){
        try {
            const slots = await this.game.api.listSlots()
            this.slotsByNumber.clear()
            for(const slot of slots){ this.slotsByNumber.set(slot.slotNumber, slot) }
        } catch(err){
            console.error('Could not load save slots:', err)
        }
        this.buildLabels()
    }

    buildLabels(){
        this.fieldLabels = []
        let iconWidth = 200;
        let offSetX = 25
        let offSetY = 25
        for(let i = 0; i < this.fieldAmount; i++){
            const slotNumber = i + 1
            const slot = this.slotsByNumber.get(slotNumber)
            let posX = this.canvasWidth/5 + i*(iconWidth + offSetX)
            let posY = this.canvasHeight/2 - 60
            this.fieldLabels.push(new TextLabel(posX, posY, '60px Academia', 'black', true, `${slotNumber}`, true))
            posY += 3*offSetY
            if(slot && slot.profile){
                const lines = [
                    slot.name,
                    `Lvl ${slot.profile.level}`,
                    slot.profile.archetype,
                    `Floor ${slot.run?.floor ?? 0}`
                ]
                for(const line of lines){
                    this.fieldLabels.push(new TextLabel(posX, posY, '20px Academia', 'black', true, line, true))
                    posY += offSetY
                }
            }
            else if(slot){
                this.fieldLabels.push(new TextLabel(posX, posY, '20px Academia', 'black', true, slot.name, true))
                posY += offSetY
                this.fieldLabels.push(new TextLabel(posX, posY, '20px Academia', 'black', true, 'No archetype', true))
            }
            else{
                this.fieldLabels.push(new TextLabel(posX, posY, '20px Academia', 'black', true, 'No data', true))
            }
        }
    }

    handleMove(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for(let element of this.fields){
            element.mouseCollition(mouseX, mouseY)
        }
        this.returnButton.mouseCollition(mouseX, mouseY)
        if(this.selectionField.frame){
            Object.entries(this.selectionField).forEach(([key,value]) =>{
                if(value && (key === 'no' || key === 'yes' || key === 'ok')){
                    value.mouseCollition(mouseX, mouseY)
                }
            })
        }
    }

    handleClick(e){
        if(this.busy){ return }
        if(this.selectionField.frame){
            this.dialogSelection()
            return
        }
        if(this.returnButton.hovered){
            this.dispose()
            this.state = 0
            return
        }
        this.fieldSelection()
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
        if(this.selectionField.frame){
            Object.values(this.selectionField).forEach(value =>{
                if(value){ value.draw(ctx) }
            })
        }
    }

    update(deltaTime){
        for(let element of this.fields){
            if(element.hovered && !this.selectionField.frame){
                element.setSprite('../Assets/Sprites/selection2.png')
            }
            else{
                element.setSprite('../Assets/Sprites/selection1.jpg')
            }
        }
        if(this.returnButton.hovered && !this.selectionField.frame){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png')
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        }
    }

    // Click on a slot: branch on new vs. continue and on whether the slot is taken.
    fieldSelection(){
        for(let i = 0; i < this.fields.length; i++){
            if(!this.fields[i].hovered){ continue }
            const slotNumber = i + 1
            const slot = this.slotsByNumber.get(slotNumber)
            if(this.menuType === 'new'){
                if(slot){ this.askOverwrite(slotNumber, slot) }
                else { this.startNewGame(slotNumber, null) }
            }
            else{ // continue
                if(slot && slot.profile){ this.continueGame(slot) }
                else { this.showCantContinue() }
            }
            return
        }
    }

    askOverwrite(slotNumber, existing){
        this.pendingSlot = { slotNumber, existing }
        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
        this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, 'Overwrite?', true)
        this.selectionField.yes = new TextLabel(this.canvasWidth/2 - 100, this.canvasHeight/2 + 100, '25px Academia', 'black', undefined, 'yes', true)
        this.selectionField.no  = new TextLabel(this.canvasWidth/2 + 100, this.canvasHeight/2 + 100, '25px Academia', 'black', undefined, 'no', true)
    }

    showCantContinue(){
        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
        this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, "Can't continue", true)
        this.selectionField.ok = new TextLabel(this.canvasWidth/2, this.canvasHeight/2 + 100, '25px Academia', 'black', undefined, 'ok', true)
    }

    closeDialog(){
        this.selectionField = {frame: undefined, yes: undefined, no: undefined, question: undefined, ok: undefined}
        this.pendingSlot = null
    }

    dialogSelection(){
        if(this.selectionField.yes && this.selectionField.yes.hovered){
            const pending = this.pendingSlot
            this.startNewGame(pending.slotNumber, pending.existing)
        }
        else if((this.selectionField.no && this.selectionField.no.hovered) ||
                (this.selectionField.ok && this.selectionField.ok.hovered)){
            this.closeDialog()
        }
    }

    // Creates a fresh slot (deleting an existing one first) and routes to archetype.
    async startNewGame(slotNumber, existing){
        this.busy = true
        this.dispose()
        try {
            if(existing){ await this.game.api.deleteSlot(existing.id) }
            this.game.activeSlotId = await this.game.api.createSlot({ slotNumber })
            this.game.runId = null
            this.state = 9   // archetype selection
        } catch(err){
            console.error('Could not start a new game:', err)
            this.state = 0
        }
    }

    // Loads an existing run and opens the map. Starts a run if the slot has a
    // profile but no in-progress run.
    async continueGame(slot){
        this.busy = true
        this.dispose()
        try {
            this.game.activeSlotId = slot.id
            await this.game.loadSlotData(slot.id)
            if(this.game.runId == null){
                this.game.runId = await this.game.api.startRun(slot.id)
            }
            // Rebuild the map from the run's saved progress so it resumes where the
            // player left off instead of restarting at the first room.
            this.game.startMap(true, this.game.runProgress)
            this.state = 10
        } catch(err){
            console.error('Could not continue this save:', err)
            this.state = 0
        }
    }

    dispose(){
        canvas.removeEventListener('mousemove', this._move)
        canvas.removeEventListener('click', this._click)
    }
}
