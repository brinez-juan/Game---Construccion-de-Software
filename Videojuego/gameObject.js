
class GameObject {
    constructor(x = 0, y = 0, width = 0, height = 0, type = undefined, open_ = undefined, click = undefined) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = 1.0;
        this.type = type; 

        // Sprite properties
        this.spriteImage = undefined;

        this.open = open_
        this.clickcable = click
        this.hovered; 
    }

    setSprite(imagePath) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
    }

    draw(ctx) {
        if (this.spriteImage) {
            ctx.drawImage(this.spriteImage,
                          // The position to draw the image
                          (this.x - this.width/2 * this.scale),
                          (this.y - this.height/2 * this.scale),
                          this.width * this.scale,
                          this.height * this.scale);
        }
    }

    mouseCollition(mouseX, mouseY){
        let left = this.x - this.width/2
        let right = this.x + this.width/2
        let top = this.y - this.height/2
        let bottom = this.y + this.height/2
        this.hovered = left <= mouseX && mouseX <= right && mouseY <= bottom && top <= mouseY        
    }
}