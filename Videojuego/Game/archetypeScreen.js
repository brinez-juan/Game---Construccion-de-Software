import Menus from "./menus.js";
import GameObject from "./GameObject.js";
import TextLabel from "./TextLabel.js";
import {ARCHETYPES} from "./GlobalVariables.js"

// Archetype selection screen that shows the three available classes and their starting stats
export default class archetypeScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight)
        this.fields = []
        this.fieldLabels = []
        this.fieldAmount = 3; 
        this.returnButton; 
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


        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let element of this.fields){
                element.mouseCollition(mouseX, mouseY)
            }
            this.returnButton.mouseCollition(mouseX, mouseY)
        })

        canvas.addEventListener('click', (e) =>{
            if(this.returnButton.hovered){
                this.state = 5
            }

            this.checkElementSelected(); 
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

    checkElementSelected(){
        for(let element of this.fields){
            if(element.hovered){
                this.selectedArchetype = ARCHETYPES[this.fields.indexOf(element)].id
                state = 6
            }
        }
    }
}