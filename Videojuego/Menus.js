"use strict"; 
//Move each of the classes to an independent file to make a cleaner structure
//Change Menus name to screens because it will be the base class for all the screens in the game
class Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.background = new GameObject(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight)
        this.background.setSprite(background)
        this.state; 
    }

    

    //Base update and initElelemtns methods to avoid crashes
    update(deltaTime){
    }

    initElements(){

    }

    draw(ctx){

    }
}

class mainMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, btnSize, playerProfiles){
        super(background, canvasWidth, canvasHeight, canvas)
        this.textY = this.canvasHeight/2 + 100
        this.buttonSize = btnSize
        this.textElements = []
        this.imgElements = []
        this.playerData = playerProfiles; 
        this.initElements()
        
    }

    update(deltaTime){
        for(let element of this.textElements){
            if(element.hovered){
                this.imgElements[this.imgElements.length - 1] = new GameObject(element.x - element.width, element.y - element.height/2, 560, 330)
                this.imgElements[this.imgElements.length - 1].setSprite("../Assets/Sprites/Selector.png")
            }
        }
    }

    initElements(){

        //Adding static elements for the main menu
        let buttons = ['New Game', 'Continue', 'Options', 'Credits']
        this.addElement('img', this.canvasWidth/2, this.canvasHeight/2 -60, 1024, 575, true,  '', false, '../Assets/Sprites/Logo.png')
        this.addElement('img')
        for(let button of buttons){
            this.addElement('text', this.canvasWidth/2, this.textY, this.buttonSize, this.buttonSize, true, button, true, undefined)
            this.textY += this.buttonSize + 10
        }

        //Event listener to hear for hovers in the main menu
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let element of this.textElements){
                element.mouseCollition(mouseX, mouseY)
            }
        })

        canvas.addEventListener('click', (e) =>{
            this.selectionChecker(); 
        })
    }
    //To add text and image elements to menu
    addElement(elementType = '', x, y, width, height, open = undefined, text = '', click, sprite = ''){
        let element; 
        if(elementType === 'text'){
            element = new TextLabel(x, y, `${width}px Academy`, 'black', open, text, click)
            this.textElements.push(element)
        }
        else if(elementType = 'img'){
            element = new GameObject(x, y, width, height, undefined, open, click)
            element.setSprite(sprite)
            this.imgElements.push(element)
        }
    }

    //Draw method for all menus
    draw(ctx){
        this.background.draw(ctx)
        for(let element of this.textElements){
            element.draw(ctx)
        }

        for(let element of this.imgElements){
            element.draw(ctx)
        }
    }

    selectionChecker(){
        for(let element of this.textElements){
            if(element.hovered){
                if(element.text === 'New Game'){
                    this.state = 1
                }
                else if(element.text === 'Continue' && this.playerData.length != 0){
                    this.state = 2
                    console.log(this.playerData)
                }
                else if(element.text === 'Options'){
                    this.state = 3
                }
                else if(element.text === 'Credits'){
                    this.state = 4
                }
            }
        }
    }
}


//You guys can modify ui aspects if you want to but ensure UI keeps clean after
class selectionMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, playerData, menu){
        super(background, canvasWidth, canvasHeight)
        this.fields = []
        this.fieldLabels = []
        this.fieldAmount = 3; 
        this.returnButton; 
        this.menuType = menu; 
        //TODO: Replace with player data gotten from the database
        this.fieldData = playerData
        this.initElements()
        this.selectionField = {frame: undefined, yes: undefined, no: undefined, question: undefined, ok:undefined}
        this.elementSelected= undefined
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
        for(let j = 0; j < this.fieldAmount; j++){
            const currentCol = this.fieldData[j]
            if(currentCol){
                posX = this.canvasWidth/5 + currentCol['field']*(offSetX + iconWidth)
                posY = this.canvasHeight/2 - 30
                for(const [key, value] of Object.entries(currentCol)){
                    if(key != 'field'){
                        let text = key + ': ' + value
                        let label = new TextLabel(posX, posY, '20px Academia', 'black', true, text, true)
                        this.fieldLabels.push(label)
                        posY += offSetY
                    }
                    else{
                        let text = value + 1
                        let label = new TextLabel(posX, posY, '60px Academia', 'black', true, text, true)
                        this.fieldLabels.push(label)
                        posY += 2*offSetY
                    }
                }
            }
            else{
                for(let i = 0; i < this.fieldAmount; i++){
                    let fieldExists = false; 
                    posX = this.canvasWidth/5 + i*(offSetX + iconWidth)
                    posY = this.canvasHeight/2 - 30
                    for(let element of this.fieldLabels){
                        if(element.x === posX){
                            fieldExists = true;
                            break; 
                        }
                    }
                    if(!fieldExists){
                        let numberLabel = new TextLabel(posX, posY, '60px Academia', 'black', true, `${i + 1}`, true)
                        posY += 3*offSetY
                        let label = new TextLabel(posX, posY, '20px Academia', 'black', true, 'No data', true)
                        this.fieldLabels.push(numberLabel)
                        this.fieldLabels.push(label)
                    }
                }
            }
        }

        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let element of this.fields){
                element.mouseCollition(mouseX, mouseY)
            }
            this.returnButton.mouseCollition(mouseX, mouseY)
            if(this.elementSelected && this.selectionField.frame){
                Object.entries(this.selectionField).forEach(([key,value]) =>{
                    if(value && (key === 'no' || key === 'yes' || key === 'ok')){
                        value.mouseCollition(mouseX, mouseY)
                    }
                })
            }
        })

        canvas.addEventListener('click', (e) =>{
            if(!this.elementSelected){
                this.checkElementSelected()
            }else{
                this.elementFieldSelection()
            }
            if(this.returnButton.hovered && !this.elementSelected){
                this.state = 0
            }
        })
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
        if(this.elementSelected && this.selectionField.frame){
            Object.values(this.selectionField).forEach(value =>{
                if(value){
                    value.draw(ctx)
                }
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

    checkElementSelected(){
        for(let element of this.fields){
            if(element.hovered){
                this.elementSelected= element
                    if(this.fieldData.find(data => data.field === this.fields.indexOf(this.elementSelected))){
                        if(this.menuType === 'new'){
                            this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
                            this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
                            this.selectionField.yes = new TextLabel(this.canvasWidth/2 - this.selectionField.frame.width/3, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'yes', true) 
                            this.selectionField.no = new TextLabel(this.canvasWidth/2 + this.selectionField.frame.width/3, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'no', true) 
                            this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, 'Overwrite?', true)
                        }
                        else{
                            //Modify this when adding states in game
                            this.state = 7; 
                        }
                    }
                    else{
                        if(this.menuType === 'new'){
                            //Modify this when adding states in game
                            this.state = 7; 
                        }
                        else{
                            this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined)
                            this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg')
                            this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, 'Can\'t continue', true)
                            this.selectionField.ok = new TextLabel(this.canvasWidth/2, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'ok', true)
                        }
                    }
            }
        }
    }

    elementFieldSelection(){
        Object.entries(this.selectionField).forEach(([key,value]) =>{
            if(value && value.hovered){
                if(key === 'yes'){
                    //add logic to overwrite data
                    this.state = 7
                    this.elementSelected = undefined
                    this.selectionField = Object.fromEntries(Object.keys(this.selectionField).map(key => [key, null]));
                }
                else if(key === 'no' || key === 'ok'){                   
                    this.elementSelected = undefined
                    this.selectionField = Object.fromEntries(Object.keys(this.selectionField).map(key => [key, null]));
                }
            }
        })
    }
}

class creditScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight)
        this.returnButton = this.returnButton = new GameObject(this.canvasWidth/10,this.canvasHeight/7, 150, 65, undefined, true, true)
        this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        this.initElements()
    }

    initElements(){
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY)
        })

        canvas.addEventListener('click', (e) =>{
            if(this.returnButton.hovered){
                //Change this when adding states
                this.state = 0
            }
        })
    }

    draw(ctx){
        this.background.draw(ctx)
        this.returnButton.draw(ctx)
    }

    update(deltaTime){
        if(this.returnButton.hovered){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png')
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        }
    }
}

class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight)
        this.menuOpen = false
        this.menuBtn = {x: this.canvasWidth/2, y: 30, w: 30, h: 30}
        this.menuHovered = false
        this.menuOptions = [
            new TextLabel(this.canvasWidth/2, this.canvasHeight/2 - 30, '30px Academia', 'white', true, 'Continue', true),
            new TextLabel(this.canvasWidth/2, this.canvasHeight/2 + 30, '30px Academia', 'white', true, 'Quit Battle', true)
        ]
        this.playerKnight = new GameObject(180, 380, 278, 422)
        this.playerKnight.setSprite('../Assets/backgrounds/player_knight.png')
        this.enemySprite = new GameObject(620, 380, 306, 422)
        this.enemySprite.setSprite('../Assets/Sprites/Enemie_caballero.png')
        // player and enemy stats
        this.player = {health: 100, maxHealth: 100, stamina: 100, maxStamina: 100, attributes: {STRENGTH: 2, INTELLIGENCE: 1}, experience: 0, experienceToNextLevel: 100}
        this.enemy = {health: 80, maxHealth: 80, stamina: 50, maxStamina: 50, physicalDamage: 25, magicDamage: 20, physicalDefense: 5, magicDefense: 3, experienceReward: 50}
        // combat state
        this.turn = 'player'
        this.playerGuard = false
        this.enemyGuard = false
        this.enemyGuardType = null
        this.selectedCard = null
        this.parryResult = null
        this.enemyAction = null
        this.enemyMessage = ''
        this.enemyMessageTimer = 0
        // parry bar stuff
        this.parryBar = {x: 200, y: 280, w: 400, h: 30}
        this.parryIndicatorX = 200
        this.parryIndicatorDir = 1
        this.parrySpeed = 1.2
        this.parryActive = false
        // placeholder cards (5)
        this.cards = [
            {name: 'Basic Attack', staminaCost: 25, actionType: 'attack_physic', baseDamage: 15, scaleFactor: 1.0, color: 'red'},
            {name: 'Fireball', staminaCost: 35, actionType: 'attack_magic', baseDamage: 20, scaleFactor: 1.2, color: 'purple'},
            {name: 'Shield Block', staminaCost: 8, actionType: 'defend_physic', baseDamage: 0, scaleFactor: 0, color: 'blue'},
            {name: 'Magic Shield', staminaCost: 8, actionType: 'defend_magic', baseDamage: 0, scaleFactor: 0, color: 'cyan'},
            {name: 'Heavy Strike', staminaCost: 50, actionType: 'attack_physic', baseDamage: 30, scaleFactor: 1.5, color: 'orange'}
        ]
        this.cardSlots = []
        this.hoveredCardIndex = -1
        this.initElements()
    }

    initElements(){
        var self = this
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            self.checkMenuHover(mouseX, mouseY)
            if(self.menuOpen){
                for(let option of self.menuOptions){
                    option.mouseCollition(mouseX, mouseY)
                }
            }
            else if(self.turn == 'player' || self.turn == 'victory' || self.turn == 'gameover'){
                self._checkCardHover(mouseX, mouseY)
            }
        })

        canvas.addEventListener('click', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if(self.menuOpen){
                for(let option of self.menuOptions){
                    if(option.hovered){
                        if(option.text === 'Continue'){
                            self.menuOpen = false
                        }
                        else if(option.text === 'Quit Battle'){
                            self.state = 0
                        }
                    }
                }
            }
            else if(self.menuHovered){
                self.menuOpen = true
            }
            else if(self.turn == 'player'){
                self._handleCardClick(mouseX, mouseY)
            }
            else if(self.turn == 'victory' || self.turn == 'gameover'){
                self.state = 0
            }
        })

        // spacebar for parry
        window.addEventListener('keydown', function(e){
            if(e.code == 'Space' && self.turn == 'parry' && self.parryActive){
                self._resolveParry()
            }
        })
    }

    checkMenuHover(mouseX, mouseY){
        let left = this.menuBtn.x - this.menuBtn.w/2
        let right = this.menuBtn.x + this.menuBtn.w/2
        let top = this.menuBtn.y - this.menuBtn.h/2
        let bottom = this.menuBtn.y + this.menuBtn.h/2
        this.menuHovered = left <= mouseX && mouseX <= right && mouseY <= bottom && top <= mouseY        
    }

    _checkCardHover(mouseX, mouseY){
        this.hoveredCardIndex = -1
        for(var i = 0; i < this.cardSlots.length; i++){
            var slot = this.cardSlots[i]
            if(mouseX >= slot.x && mouseX <= slot.x + slot.w && mouseY >= slot.y && mouseY <= slot.y + slot.h){
                this.hoveredCardIndex = i
            }
        }
    }

    _handleCardClick(mouseX, mouseY){
        for(var i = 0; i < this.cardSlots.length; i++){
            var slot = this.cardSlots[i]
            if(mouseX >= slot.x && mouseX <= slot.x + slot.w && mouseY >= slot.y && mouseY <= slot.y + slot.h){
                var card = this.cards[i]
                if(this.player.stamina < card.staminaCost){
                    console.log("not enough stamina")
                    return
                }
                this._playCard(card)
            }
        }
    }

    _playCard(card){
        this.player.stamina -= card.staminaCost
        if(this.player.stamina < 0) this.player.stamina = 0
        var damage = 0
        if(card.actionType == 'attack_physic'){
            damage = card.baseDamage + (this.player.attributes.STRENGTH * card.scaleFactor)
            // check enemy guard
            if(this.enemyGuard && this.enemyGuardType == 'defend_physic'){
                damage = Math.floor(damage / 2)
                this.enemyMessage = 'Enemy blocked physical!'
                console.log("enemy guard reduced damage")
            }
            this.enemy.health -= damage
            console.log("player dealt " + damage + " phys damage")
        }
        else if(card.actionType == 'attack_magic'){
            damage = card.baseDamage + (this.player.attributes.INTELLIGENCE * card.scaleFactor)
            // check enemy guard
            if(this.enemyGuard && this.enemyGuardType == 'defend_magic'){
                damage = Math.floor(damage / 2)
                this.enemyMessage = 'Enemy blocked magic!'
                console.log("enemy guard reduced damage")
            }
            this.enemy.health -= damage
            console.log("player dealt " + damage + " magic damage")
        }
        else if(card.actionType == 'defend_physic' || card.actionType == 'defend_magic'){
            this.playerGuard = true
            this.player.stamina += 15
            if(this.player.stamina > this.player.maxStamina) this.player.stamina = this.player.maxStamina
            console.log("player guards")
        }
        // clear guards after player acts
        this.enemyGuard = false
        this.enemyGuardType = null
        this.playerGuard = false
        if(this.enemy.health <= 0){
            this.enemy.health = 0
            this.turn = 'victory'
            this.player.experience += this.enemy.experienceReward
            console.log("victory! xp gained: " + this.enemy.experienceReward)
            return
        }
        this.turn = 'enemy'
        this.enemyAction = this._decideEnemyAction()
    }

    _decideEnemyAction(){
        var ratio = this.enemy.health / this.enemy.maxHealth
        var options = []
        if(this.enemy.physicalDamage > 0) options.push('attack_physic')
        if(this.enemy.magicDamage > 0) options.push('attack_magic')
        if(this.enemy.physicalDefense > 0) options.push('defend_physic')
        if(this.enemy.magicDefense > 0) options.push('defend_magic')
        // 20% random
        if(Math.random() < 0.2 && options.length > 0){
            return options[Math.floor(Math.random() * options.length)]
        }
        // state based
        if(ratio > 0.6){
            // aggressive
            if(this.enemy.physicalDamage > this.enemy.magicDamage) return 'attack_physic'
            return 'attack_magic'
        }
        else if(ratio > 0.3){
            // neutral
            return options[Math.floor(Math.random() * options.length)]
        }
        else {
            // defensive
            if(this.enemy.physicalDefense > 0) return 'defend_physic'
            if(this.enemy.magicDefense > 0) return 'defend_magic'
            return options[0]
        }
    }

    _enemyTurn(){
        if(this.enemyAction == 'attack_physic' || this.enemyAction == 'attack_magic'){
            this.enemyMessage = 'Enemy attacks!'
            this.enemyMessageTimer = 1500
            this.turn = 'parry'
            this.parryActive = true
            this.parryIndicatorX = this.parryBar.x
            this.parryIndicatorDir = 1
        }
        else {
            // enemy defends
            this.enemyGuard = true
            this.enemyGuardType = this.enemyAction
            this.enemyMessage = 'Enemy defends!'
            this.enemyMessageTimer = 1500
            console.log("enemy defends")
            this.turn = 'player'
        }
    }

    _resolveParry(){
        this.parryActive = false
        var bar = this.parryBar
        var greenW = bar.w * (this.player.stamina / this.player.maxStamina) * 0.12
        if(greenW < 15) greenW = 15
        var greenCenter = bar.x + bar.w/2
        var greenLeft = greenCenter - greenW/2
        var greenRight = greenCenter + greenW/2
        var yellowW = 18
        var yellowLeft = greenLeft - yellowW
        var yellowRight = greenRight + yellowW
        // guard override: shield guarantees NORMAL (half dmg), not PERFECT (0 dmg)
        if(this.playerGuard){
            this.parryResult = 'normal'
        }
        else if(this.parryIndicatorX >= greenLeft && this.parryIndicatorX <= greenRight){
            this.parryResult = 'perfect'
        }
        else if(this.parryIndicatorX >= yellowLeft && this.parryIndicatorX <= yellowRight){
            this.parryResult = 'normal'
        }
        else {
            this.parryResult = 'poor'
        }
        // apply damage based on parry
        var baseDmg = 0
        if(this.enemyAction == 'attack_physic') baseDmg = this.enemy.physicalDamage
        else baseDmg = this.enemy.magicDamage
        var dmg = baseDmg
        var staminaRec = 0
        if(this.parryResult == 'perfect'){
            dmg = 0
            staminaRec = 15
        }
        else if(this.parryResult == 'normal'){
            dmg = Math.floor(baseDmg / 2)
            staminaRec = 5
        }
        else {
            dmg = baseDmg
            staminaRec = 0
        }
        this.player.health -= dmg
        this.player.stamina += staminaRec
        if(this.player.stamina > this.player.maxStamina) this.player.stamina = this.player.maxStamina
        if(this.player.health < 0) this.player.health = 0
        console.log("parry: " + this.parryResult + " dmg: " + dmg + " stamina rec: " + staminaRec)
        this.playerGuard = false
        if(this.player.health <= 0){
            this.turn = 'gameover'
            console.log("game over")
            return
        }
        this.turn = 'player'
    }

    draw(ctx){
        this.background.draw(ctx)
        this.playerKnight.draw(ctx)
        this.enemySprite.draw(ctx)
        // Health bar (top left, MK style)
        let barX = 20
        let barY = 20
        let barW = 300
        let barH = 20
        ctx.fillStyle = 'black'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = 'red'
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.player.health / this.player.maxHealth), barH - 4)
        // Stamina bar
        barY += 26
        ctx.fillStyle = 'black'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = '#00ccff'
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.player.stamina / this.player.maxStamina), barH - 4)
        // Pause button (two vertical lines) in the center
        ctx.fillStyle = this.menuHovered ? 'yellow' : 'white';
        let pauseX = this.menuBtn.x;
        let pauseY = this.menuBtn.y;
        let lineW = 6;
        let lineH = 24;
        let gap = 8;
        ctx.fillRect(pauseX - gap/2 - lineW, pauseY - lineH/2, lineW, lineH);
        ctx.fillRect(pauseX + gap/2, pauseY - lineH/2, lineW, lineH);

        // Enemy bars (top right)
        barX = this.canvasWidth - 20 - barW
        barY = 20
        ctx.fillStyle = 'black'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = 'red'
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.enemy.health / this.enemy.maxHealth), barH - 4)
        barY += 26
        ctx.fillStyle = 'black'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = '#00ccff'
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.enemy.stamina / this.enemy.maxStamina), barH - 4)
        ctx.textAlign = 'center'

        // draw cards at bottom
        this._drawCards(ctx)

        // draw parry bar if active
        if(this.parryActive){
            this._drawParryBar(ctx)
        }

        // draw turn indicator
        ctx.fillStyle = 'white'
        ctx.font = '20px Academia'
        ctx.textAlign = 'center'
        var turnText = this.turn.toUpperCase() + " TURN"
        if(this.turn == 'parry') turnText = "PARRY!"
        if(this.turn == 'victory') turnText = "VICTORY!"
        if(this.turn == 'gameover') turnText = "GAME OVER"
        ctx.fillText(turnText, this.canvasWidth/2, 100)
        // draw enemy action message
        if(this.enemyMessageTimer > 0){
            ctx.fillStyle = 'yellow'
            ctx.font = '24px Academia'
            ctx.fillText(this.enemyMessage, this.canvasWidth/2, 140)
        }

        // victory / gameover overlay
        if(this.turn == 'victory'){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
            ctx.fillStyle = 'gold'
            ctx.font = '50px Academia'
            ctx.fillText("VICTORY!", this.canvasWidth/2, this.canvasHeight/2)
            ctx.fillStyle = 'white'
            ctx.font = '20px Academia'
            ctx.fillText("Click to continue", this.canvasWidth/2, this.canvasHeight/2 + 50)
        }
        if(this.turn == 'gameover'){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
            ctx.fillStyle = 'red'
            ctx.font = '50px Academia'
            ctx.fillText("GAME OVER", this.canvasWidth/2, this.canvasHeight/2)
            ctx.fillStyle = 'white'
            ctx.font = '20px Academia'
            ctx.fillText("Click to retry", this.canvasWidth/2, this.canvasHeight/2 + 50)
        }

        if(this.menuOpen){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            for(let option of this.menuOptions){
                option.draw(ctx)
            }
        }
    }

    _drawCards(ctx){
        var cardW = 100
        var cardH = 60
        var gap = 15
        var startX = this.canvasWidth/2 - ((cardW + gap) * 5)/2 + gap/2
        var startY = this.canvasHeight - 80
        this.cardSlots = []
        for(var i = 0; i < this.cards.length; i++){
            var card = this.cards[i]
            var x = startX + i * (cardW + gap)
            var y = startY
            this.cardSlots.push({x: x, y: y, w: cardW, h: cardH})
            // card background
            if(this.player.stamina < card.staminaCost){
                ctx.fillStyle = '#444'
            }
            else if(this.hoveredCardIndex == i){
                ctx.fillStyle = '#666'
            }
            else {
                ctx.fillStyle = '#222'
            }
            ctx.fillRect(x, y, cardW, cardH)
            // border
            ctx.strokeStyle = card.color
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, cardW, cardH)
            // name
            ctx.fillStyle = 'white'
            ctx.font = '12px Academia'
            ctx.textAlign = 'center'
            ctx.fillText(card.name, x + cardW/2, y + 20)
            // cost
            ctx.fillStyle = '#00ccff'
            ctx.font = '10px Academia'
            ctx.fillText(card.staminaCost + " SP", x + cardW/2, y + 40)
        }
    }

    _drawParryBar(ctx){
        var bar = this.parryBar
        // background
        ctx.fillStyle = '#333'
        ctx.fillRect(bar.x, bar.y, bar.w, bar.h)
        // zones
        var greenW = bar.w * (this.player.stamina / this.player.maxStamina) * 0.12
        if(greenW < 15) greenW = 15
        var greenCenter = bar.x + bar.w/2
        var greenLeft = greenCenter - greenW/2
        var yellowW = 18
        var yellowLeft = greenLeft - yellowW
        var yellowRight = greenCenter + greenW/2 + yellowW
        // red zones (outer)
        ctx.fillStyle = 'red'
        ctx.fillRect(bar.x, bar.y, yellowLeft - bar.x, bar.h)
        ctx.fillRect(yellowRight, bar.y, bar.x + bar.w - yellowRight, bar.h)
        // yellow zones
        ctx.fillStyle = 'yellow'
        ctx.fillRect(yellowLeft, bar.y, greenLeft - yellowLeft, bar.h)
        ctx.fillRect(greenCenter + greenW/2, bar.y, yellowRight - (greenCenter + greenW/2), bar.h)
        // green zone
        ctx.fillStyle = 'green'
        ctx.fillRect(greenLeft, bar.y, greenW, bar.h)
        // indicator
        ctx.fillStyle = 'white'
        ctx.fillRect(this.parryIndicatorX - 3, bar.y - 5, 6, bar.h + 10)
        // instruction
        ctx.fillStyle = 'white'
        ctx.font = '16px Academia'
        ctx.textAlign = 'center'
        ctx.fillText("PRESS SPACEBAR!", this.canvasWidth/2, bar.y - 15)
    }

    update(deltaTime){
        for(let option of this.menuOptions){
            if(option.hovered){
                option.color = 'yellow'
            }
            else{
                option.color = 'white'
            }
        }
        // enemy turn trigger
        if(this.turn == 'enemy'){
            this._enemyTurn()
        }
        // parry indicator movement
        if(this.parryActive){
            this.parryIndicatorX += this.parryIndicatorDir * this.parrySpeed * deltaTime
            if(this.parryIndicatorX >= this.parryBar.x + this.parryBar.w){
                this.parryIndicatorDir = -1
            }
            if(this.parryIndicatorX <= this.parryBar.x){
                this.parryIndicatorDir = 1
            }
        }
        // enemy message timer
        if(this.enemyMessageTimer > 0){
            this.enemyMessageTimer -= deltaTime
            if(this.enemyMessageTimer < 0) this.enemyMessageTimer = 0
        }
    }
}

class loadingScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight)
        this.loading = new GameObject(this.canvasWidth/2, this.canvasHeight/3 + 20, 100, 100, undefined, undefined, undefined)
        this.loadingWidth = 1024
        this.loadingHeight = 1024
        this.loading.setSprite('../Assets/Sprites/loading_animation.png', {x: 0, y: 0, width:this.loadingWidth/4, height: this.loadingHeight/4})
    }

    draw(ctx){
        this.background.draw(ctx)
        this.loading.draw(ctx)
    }

    update(deltaTime){
        this.loading.spriteRect.x += this.loading.spriteRect.width
        if(this.loading.spriteRect.x >= this.loadingWidth){
            this.loading.spriteRect.x = 0
            this.loading.spriteRect.y += this.loading.spriteRect.height
        }
        if(this.loading.spriteRect.y >= this.loadingHeight){
            this.loading.spriteRect.x = 0
            this.loading.spriteRect.y = 0
        }
    }
}

class optionsMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, menuType){
        super(background, canvasWidth, canvasHeight)
        this.type = menuType 
        this.volumeMusic;
        this.volumeSFX; 
        this.initElements(); 
    }

    initElements(){
        this.returnButton = new GameObject(this.canvasWidth/10,this.canvasHeight/7, 150, 65, undefined, true, true)
        this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        let offsetY = 30
        this.sfxField = new GameObject(this.canvasWidth/2, 2*this.canvasHeight/4, 180, 80, 'on', undefined, undefined);
        this.soundField = new GameObject(this.canvasWidth/2, this.sfxField.y + this.sfxField.height + offsetY, 180, 80, 'on', undefined, undefined);
        this.sfxField.setSprite('../Assets/Sprites/sfx_on.png')
        this.soundField.setSprite('../Assets/Sprites/music_on.png')
        if(this.type === 'pause'){
            this.exitField = new GameObject(this.canvasWidth/2, this.soundField.y + this.soundField.height + offsetY, 180, 80, undefined, undefined, undefined);
            this.exitField.setSprite('../Assets/Sprites/exit_button.png')
        }
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY)
            this.sfxField.mouseCollition(mouseX, mouseY)
            this.soundField.mouseCollition(mouseX, mouseY)
        })

        canvas.addEventListener('click', (e) =>{
            if(this.returnButton.hovered){
                //Change this when adding states
                this.state = 0
            }
            this.fieldChecker()
        })
    }

    draw(ctx){
        this.background.draw(ctx)
        this.sfxField.draw(ctx)
        this.soundField.draw(ctx)
        this.returnButton.draw(ctx)
        if(this.exitField){
            this.exitField.draw(ctx)
        }
    }

    update(deltaTime){

    }

    fieldChecker(){
        if(this.sfxField.hovered && this.sfxField.type === 'on'){
                this.sfxField.setSprite('../Assets/Sprites/sfx_off.png')
                this.sfxField.type = 'off'
                //Add logic to set volume
        }
        else if(this.sfxField.hovered){
            this.sfxField.setSprite('../Assets/Sprites/sfx_on.png')
            this.sfxField.type = 'on'
            //Add logic to set volume
        }
        if(this.soundField.hovered && this.soundField.type === 'on'){
                this.soundField.setSprite('../Assets/Sprites/music_off.png')
                this.soundField.type = 'off'
                //Add logic to set volume
        }
        else if(this.soundField.hovered){
            this.soundField.setSprite('../Assets/Sprites/music_on.png')
            this.soundField.type = 'on'
            //Add logic to set volume
        }
        if(this.exitField && this.exitField.hovered){
            this.state = 0
        }
        if(this.returnButton.hovered){
            this.state = 0
        }
    }
}