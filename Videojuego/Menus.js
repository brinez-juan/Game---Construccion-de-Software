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
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, btnSize){
        super(background, canvasWidth, canvasHeight, canvas)
        this.textY = this.canvasHeight/2 + 100
        this.buttonSize = btnSize
        this.textElements = []
        this.imgElements = []
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
                //console.log('sexo')
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
                            this.state = 0; 
                        }
                    }
                    else{
                        console.log('hola')
                        if(this.menuType === 'new'){
                            //Modify this when adding states in game
                            this.state = 0; 
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
                console.log('sex')
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

class loadingScreen extends Menus{
    
}