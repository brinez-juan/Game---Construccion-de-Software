"use strict"; 

class Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, canva){
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.background = new GameObject(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight)
        this.background.setSprite(background)
        this.textElements = []
        this.imgElements = []
        this.canvas = canva
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

    //Base update and initElelemtns methods to avoid crashes
    update(deltaTime){
    }

    initElements(){

    }

    mouseCollider(element){
        const rect = this.canvas.getBoundingClientRect();
    }
}

class mainMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, btnSize, canvas){
        super(background, canvasWidth, canvasHeight, canvas)
        this.textY = this.canvasHeight/2 + 100
        this.buttonSize = btnSize
        this.initElements()
        
    }

    update(deltaTime){
        
    }

    initElements(){
        let buttons = ['New Game', 'Continue', 'Options', 'Credits']
        this.addElement('img', this.canvasWidth/2, this.canvasHeight/2 -60, 1024, 575, true,  '', false, '../Assets/Sprites/Logo.png')
        for(let button of buttons){
            this.addElement('text', this.canvasWidth/2, this.textY, this.buttonSize, this.buttonSize, true, button, true, undefined)
            this.textY += this.buttonSize + 10
        }
    }
}