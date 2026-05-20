import Menus from './Menus.js';
import GameObject from './GameObject.js';

export default class creditScreen extends Menus{
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