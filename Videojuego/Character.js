import GameObject from "./gameObject.js";
import {BASE_ATTRIBUTES} from "./GlobalVariables";


export default class Character extends GameObject {
    constructor(name, health, stamina, attributes) {
        this.name = name;
        this.health = health;
        this.stamina = stamina;
        this.attributes = attributes;
    }
}