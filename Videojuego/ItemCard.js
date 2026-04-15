class ItemCard extends GameObject{
    
    constructor() {
        this.name = "";
        this.description = "";
        this.image = null;
    }

    constructor(name, description, image) {
        this.name = name;
        this.description = description;
        this.image = image;
    }
}