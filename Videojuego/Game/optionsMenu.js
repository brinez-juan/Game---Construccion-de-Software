import Menus from './Menus.js';
import GameObject from './GameObject.js';

export default class optionsMenu extends Menus{
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