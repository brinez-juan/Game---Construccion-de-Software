
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
        this.spriteRect = undefined;

        this.open = open_
        this.clickcable = click
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
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
}