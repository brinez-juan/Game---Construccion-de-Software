import Menus from './Menus.js';
import GameObject from '../../libs/GameObject.js';
import { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled } from '../../libs/GlobalVariables.js';
import musicManager from '../../extras/MusicManager.js';

// Settings screen that toggles audio fields and adds an exit shortcut in pause mode
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
        // Initialise toggles from the live global state so they survive re-entry.
        this.sfxField = new GameObject(this.canvasWidth/2, 2*this.canvasHeight/4, 180, 80, sfxEnabled ? 'on' : 'off', undefined, undefined);
        this.soundField = new GameObject(this.canvasWidth/2, this.sfxField.y + this.sfxField.height + offsetY, 180, 80, musicEnabled ? 'on' : 'off', undefined, undefined);
        this.sfxField.setSprite(sfxEnabled ? '../Assets/Sprites/sfx_on.png' : '../Assets/Sprites/sfx_off.png')
        this.soundField.setSprite(musicEnabled ? '../Assets/Sprites/music_on.png' : '../Assets/Sprites/music_off.png')
        if(this.type === 'pause'){
            this.exitField = new GameObject(this.canvasWidth/2, this.soundField.y + this.soundField.height + offsetY, 180, 80, undefined, undefined, undefined);
            this.exitField.setSprite('../Assets/Sprites/exit_button.png')
        }

        // Bound refs so dispose() removes exactly these listeners — otherwise every
        // new optionsMenu instance leaks another pair of handlers on the canvas.
        this._onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY)
            this.sfxField.mouseCollition(mouseX, mouseY)
            this.soundField.mouseCollition(mouseX, mouseY)
            if(this.exitField){
                this.exitField.mouseCollition(mouseX, mouseY)
            }
        }

        this._onClick = (e) => {
            this.fieldChecker()
        }

        canvas.addEventListener('mousemove', this._onMouseMove)
        canvas.addEventListener('click', this._onClick)
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
        if(this.returnButton.hovered){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png')
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png')
        }
    }

    // Switches the hovered audio toggle sprite and updates its on or off type tag
    fieldChecker(){
        if(this.sfxField.hovered && this.sfxField.type === 'on'){
            this.sfxField.setSprite('../Assets/Sprites/sfx_off.png')
            this.sfxField.type = 'off'
            setSfxEnabled(false);
        }
        else if(this.sfxField.hovered && this.sfxField.type === 'off'){
            this.sfxField.setSprite('../Assets/Sprites/sfx_on.png')
            this.sfxField.type = 'on'
            setSfxEnabled(true);
        }
        if(this.soundField.hovered && this.soundField.type === 'on'){
            this.soundField.setSprite('../Assets/Sprites/music_off.png')
            this.soundField.type = 'off'
            setMusicEnabled(false);
            musicManager.refresh();
        }
        else if(this.soundField.hovered && this.soundField.type === 'off'){
            this.soundField.setSprite('../Assets/Sprites/music_on.png')
            this.soundField.type = 'on'
            setMusicEnabled(true);
            musicManager.refresh();
        }

        if(this.exitField && this.exitField.hovered){
            this.dispose();
            this.state = 0
        }
        if(this.returnButton.hovered){
            this.dispose();
            this.state = 0
        }
    }

    dispose(){
        canvas.removeEventListener('mousemove', this._onMouseMove)
        canvas.removeEventListener('click', this._onClick)
    }
}
