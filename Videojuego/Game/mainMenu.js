import Menus from './Menus.js';
import GameObject from './GameObject.js';
import TextLabel from './TextLabel.js';
import AudioManager from './AudioManager.js';

// Title screen that exposes navigation entries for new game, continue, options and credits
export default class mainMenu extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, btnSize, data){
        super(background, canvasWidth, canvasHeight, canvas)
        this.textY = this.canvasHeight/2 + 100
        this.buttonSize = btnSize
        this.playerData = data
        this.textElements = []
        this.imgElements = []
        this.initElements()
        AudioManager.playMusic('intro')
    }

    update(deltaTime){
        for(let element of this.textElements){
            if(element.hovered){
                this.imgElements[this.imgElements.length - 1] = new GameObject(element.x - element.width, element.y - element.height/2, 560, 330)
                this.imgElements[this.imgElements.length - 1].setSprite("../Assets/Sprites/Selector.png")
            }
        }
    }

    // Builds the static UI tree and wires hover and click listeners on the canvas
    initElements(){

        // Add static elements for the main menu
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
    // Helper used by initElements to push either a TextLabel or a GameObject into its bucket
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

    // Paints the background followed by every text and image element on top
    draw(ctx){
        this.background.draw(ctx)
        for(let element of this.textElements){
            element.draw(ctx)
        }

        for(let element of this.imgElements){
            element.draw(ctx)
        }
    }

    // Sets the next state code based on which menu entry is currently hovered
    selectionChecker(){
        for(let element of this.textElements){
            if(element.hovered){
                if(element.text === 'New Game'){
                    this.state = 1
                }
                else if(element.text === 'Continue' && this.playerData.length != 0){
                    this.state = 2
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