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
                            this.state = 0; 
                        }
                    }
                    else{
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
