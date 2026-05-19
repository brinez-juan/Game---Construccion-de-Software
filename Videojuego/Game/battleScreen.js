class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, player, enemies){
        super(background, canvasWidth, canvasHeight)
        this.player = player; 
        this.enemies = enemies; 
    }

}
