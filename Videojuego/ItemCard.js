import { attributes } from "./GlobalVariables"; 

class ItemCard extends GameObject{

    constructor(name, description, image, statistics, requirements, 
                rarity, staminaCost, actionType, action) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.stats = statistics;
        this.requirements = requirements;
        this.rarity = rarity;
        this.staminaCost = staminaCost;
        this.actionType = actionType;
        this.action = action;
    }

    


}