import Menus from './Menus.js';
import Player from './Player.js';
import { Enemy } from './NonPlayableCharacter.js';
import ParryBar from './parryBar.js';
import ItemCard from './ItemCard.js';
import {canvas} from './Return.js';
import TextLabel from './TextLabel.js';
import { normalizeCatalogCard } from './dataAdapter.js';

// Main combat scene that orchestrates player turn, enemy turn, parry timing and end conditions
export default class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, playerData, enemies, game = null, isBoss = false){
        super(background, canvasWidth, canvasHeight)
        // Reference to the top-level Game so end conditions can report kills into the
        // run-wide enemiesDefeated counter shown on the Game Over screen.
        this.game = game
        this.enemies = []
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, playerData.stamina, playerData.maxStamina)
        this.playerMaker(playerData)
        this.player.deckMaker(playerData.activeDeck, this.canvasWidth/2, 4*this.canvasHeight/5, 100*0.75, 100, 15)
        this.enemyMaker(enemies, isBoss)
        // Enemy card drops (US: one card per defeated enemy). enemyMaker records the DB
        // id of every spawned enemy here because this.enemies is emptied by
        // checkEnemyStatus before the victory check fires. Guard so drops grant once.
        this.dropsGranted = false
        // Snapshot how many enemies this room started with so kills can be tallied at
        // the end regardless of how many were filtered out mid-fight.
        this.initialEnemyCount = this.enemies.length
        // US16: snapshot the roster's total XP up front. Dead enemies get filtered out
        // of this.enemies during enemy turns, so the reward can't be summed at the end;
        // we award a slice of this total proportional to how many were defeated.
        this.totalEnemyXp = this.enemies.reduce((sum, enemy) => sum + (enemy.experienceReward || 0), 0)
        this.summaryReported = false
        this.turn = 'player';
        this.cardInAction = undefined;
        this.enemyAttacking = undefined;
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.listenersActive = false
        this.currentEnemyIndex = 0;
        this.playerDefending = false;
        this.parryLabel = null;
        this.parryLabelTimer = 0;
        this.failedSelection = new Audio('../Assets/Audio/SYS_buzzer.ogg')
    }

    // Routes cursor movement to deck cards and to enemies during the targeting phase
    handleMouseMove(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for(let card of this.player.deck){
            card.mouseCollition(mouseX, mouseY)
        }
        if(this.cardInAction){
            for(let enemy of this.enemies){
                enemy.mouseCollition(mouseX, mouseY)
            }
        }
    }

    // Handles card selection, target picking and stamina spending during the player turn
    handleClick(e){
        if(!this.cardInAction){
            for(let card of this.player.deck){
                if(card.hovered && card.staminaCost <= this.player.stamina){
                    if(card.action.actionType === 'defend_physic' || card.action.actionType === 'defend_magic'){
                        this.playerDefending = true;
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.turn = 'enemy'
                        this.player.setSprite('../Assets/Sprites/characters/player_defend.png')
                        console.log(this.player.spriteImage)
                        return
                    }
                    else if(card.action.actionType === 'aoe_magic' || card.action.actionType === 'aoe_physic'){
                        let damageDone = card.action.calculateDamage(this.player.attributes)
                        for(let enemy of this.enemies){
                            enemy.health -= damageDone
                            enemy.healthBar.calculateCurrentIndicatorSubstraction(damageDone)
                        }
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.turn = 'enemy'
                        return
                    }
                    else{
                        this.cardInAction = card
                        this.cardInAction.y -= 15
                        return
                    }
                }
            }
            this.failedSelection.play()
            return
        }

        for(let card of this.player.deck){
            if(card.hovered && card !== this.cardInAction){
                this.cardInAction.y += 15
                this.cardInAction = card
                this.cardInAction.y -= 15
            }
        }

        for(let enemy of this.enemies){
            if(enemy.hovered){
                let damageDone = this.cardInAction.action.calculateDamage(this.player.attributes)
                enemy.health -= damageDone
                enemy.healthBar.calculateCurrentIndicatorSubstraction(damageDone)
                this.player.stamina = this.player.stamina - this.cardInAction.staminaCost > 0 ? this.player.stamina - this.cardInAction.staminaCost : 0
                this.player.staminaBar.calculateCurrentIndicatorSubstraction(this.cardInAction.staminaCost)
                console.log(this.player.staminaBar.missingAttributeBar.width)
                this.cardInAction.y += 15
                this.cardInAction = null
                this.turn = 'enemy'
                return
            }
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        this.player.draw(ctx)
        this.player.healthBar.draw(ctx)
        this.player.staminaBar.draw(ctx)
        for(let enemy of this.enemies){
           enemy.draw(ctx)
            enemy.healthBar.draw(ctx)
            enemy.indicator.draw(ctx)
        }
        for(let card of this.player.deck){
            card.draw(ctx)
        }
        if(this.turn === 'enemy' && this.parryLabelTimer <= 0){
            if(!this.ParryBar.state){
                this.ParryBar.draw(ctx)
            }
        }
        if(this.parryLabel) this.parryLabel.draw(ctx)
    }
    addEventListeners(){
        if(this.listenersActive) return
        canvas.addEventListener('mousemove', this.handleMouseMove)
        canvas.addEventListener('click', this.handleClick)
        this.listenersActive = true
    }

    removeEventListeners(){
        if(!this.listenersActive) return
        canvas.removeEventListener('mousemove', this.handleMouseMove)
        canvas.removeEventListener('click', this.handleClick)
        this.listenersActive = false
    }
    // Per-frame loop that detects end conditions and advances either the player or the enemy turn
    update(deltaTime){
        if(this.parryLabelTimer > 0){
            this.parryLabelTimer -= deltaTime;
            if(this.parryLabelTimer <= 0) this.parryLabel = null;
        }
        if(this.player.health <= 0){
            this.removeEventListeners()
            this.reportEnemiesDefeated()
            this.state = 7
            return
        }
        if(this.enemies.every(enemy => enemy.health <= 0)){
            this.removeEventListeners()
            this.reportEnemiesDefeated()
            this.grantEnemyDrops()
            this.state = 8
            return
        }
        if(this.turn === 'player'){
            this.addEventListeners()
            for(let enemy of this.enemies){
                enemy.update(deltaTime)
            }
        }
        else if(this.turn === 'enemy'){
            this.removeEventListeners()
            this.checkEnemyStatus()
            this.ParryBar.stamina = this.player.stamina
            this.ParryBar.maxStamina = this.player.maxStamina
            if(this.playerDefending){
                this.ParryBar.state = 'perfect'
                this.playerDefending = false;
            }
            
            if(this.parryLabelTimer > 0){
            }
            else if(!this.ParryBar.state){
                this.ParryBar.update(deltaTime, this.player.attributes.dexterity)
            }
            else{
                this.enemyTurn()
            }
        }
    }

    checkEnemyStatus(){
        this.enemies = this.enemies.filter(enemy => enemy.health > 0)
    }

    // Tallies this room's kills (enemies that started minus those still alive) into the
    // run-wide counter. Guarded so it can only fire once per battle even if update()
    // re-detects the end condition before the screen is swapped out.
    reportEnemiesDefeated(){
        if(this.summaryReported){ return }
        this.summaryReported = true
        if(this.game){
            const alive = this.enemies.filter(enemy => enemy.health > 0).length
            const killed = this.initialEnemyCount - alive
            this.game.enemiesDefeated += killed
            // US16: award XP for the enemies defeated this battle (full roster XP on a
            // clear) so the player's level/XP can be persisted in the victory path.
            if(killed > 0 && this.initialEnemyCount > 0 && typeof this.game.awardExperience === 'function'){
                this.game.awardExperience(Math.round(this.totalEnemyXp * killed / this.initialEnemyCount))
            }
        }
    }

    // Grants one card per enemy defeated when the room is cleared. For each spawned
    // enemy, looks up the cards linked to it (cards.enemy) and adds exactly one — chosen
    // at random — to the player's inventory, even if several cards are linked. Enemies
    // with no linked card drop nothing. Only fires on full victory (the state-8 path);
    // guarded so it grants once. The in-memory push makes the card show up immediately
    // in the next Battle Lobby; the addCard call persists it to player_cards (run-scoped)
    // so it survives a Continue. Persistence is best-effort (fire-and-forget).
    grantEnemyDrops(){
        if(this.dropsGranted){ return }
        this.dropsGranted = true
        if(!this.game || !this.game.enemyCardDrops || !this.game.player){ return }
        const player = this.game.player
        const floor = this.game.currentRoom?.floorNumber ?? null
        // Only one copy of each card is ever held, so collect the card ids the player
        // already owns (inventory + active deck) and never drop a duplicate. The set is
        // updated as we grant, so two enemies in the same room can't both drop the same
        // card either.
        const owned = new Set([
            ...(player.inventory || []).map(c => c.cardId),
            ...(player.activeDeck || []).map(c => c.cardId)
        ])
        for(const enemyId of this.spawnedEnemyIds){
            const linked = this.game.enemyCardDrops.get(enemyId)
            if(!linked || linked.length === 0){ continue }
            // Restrict the random roll to linked cards the player doesn't already own; if
            // every linked card is owned, this enemy drops nothing.
            const candidates = linked.filter(c => !owned.has(c.id))
            if(candidates.length === 0){ continue }
            const chosen = candidates[Math.floor(Math.random() * candidates.length)]
            const card = normalizeCatalogCard(chosen)
            owned.add(card.cardId)
            player.inventory.push(card)
            if(this.game.api && this.game.activeSlotId != null){
                this.game.api.addCard(this.game.activeSlotId, {
                    cardId: card.cardId, isPermanent: false, obtainedAtFloor: floor
                }).catch(err => console.error('Could not persist card drop:', err))
            }
        }
    }

    // Resolves one enemy attack per call by combining AI decision, parry result and stat changes
    enemyTurn(){
        if(this.currentEnemyIndex < this.enemies.length){
            this.enemyAttacking = this.enemies[this.currentEnemyIndex]
            let enemyDecision = this.enemyAttacking.decideAction(this.player)
            let damageDone = 0;
            if(enemyDecision === 'attack_physic'){
                damageDone = this.enemyAttacking.physicalDamage
            }
            else if(enemyDecision === 'attack_magic'){
                damageDone = this.enemyAttacking.magicDamage
            }
            else if(enemyDecision === 'defend_physic'){
                damageDone = 0
                this.enemyAttacking.physicalDefense += 5
            }
            else if(enemyDecision === 'defend_magic'){
                damageDone = 0
                this.enemyAttacking.magicDefense += 5
            }

            if(damageDone > 0){
                const finalDamage = this.ParryBar.calculateDamagePlayer(this.player, damageDone)
                if(finalDamage > 0){
                    this.player.health -= finalDamage
                    this.player.healthBar.calculateCurrentIndicatorSubstraction(finalDamage)
                }
            }
            const staminaChange = this.ParryBar.calculateStamina(this.player)
            if(staminaChange > 0){
                this.player.stamina = this.player.stamina + staminaChange > this.player.maxStamina ? this.player.maxStamina : this.player.stamina + staminaChange
                this.player.staminaBar.calculateCurrentIndicatorAddition(staminaChange)
            } else if(staminaChange < 0){
                this.player.stamina = this.player.stamina - Math.abs(staminaChange) < 0? 0 : this.player.stamina - Math.abs(staminaChange)
                this.player.staminaBar.calculateCurrentIndicatorSubstraction(Math.abs(staminaChange))
            }

            const labelData = { perfect: ['Perfect!', 'green'], normal: ['Good!', 'yellow'], miss: ['Miss!', 'red'] }
            const [text, color] = labelData[this.ParryBar.state] ?? labelData.miss
            this.parryLabel = new TextLabel(this.canvasWidth / 2, this.canvasHeight / 2 - 60, 'bold 36px Arial', color, undefined, text)
            this.parryLabelTimer = 1500

            this.currentEnemyIndex++
            if(this.currentEnemyIndex < this.enemies.length){
                this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
            }
        }
        else{
            this.currentEnemyIndex = 0
            this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
            this.turn = 'player' 
            this.player.setSprite('../Assets/Sprites/characters/player.png') 
        }
    }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, this.canvasHeight/2 + 30, 120, 300, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel)
        this.player.setSprite('../Assets/Sprites/characters/player.png')
    }

    // Instantiates Enemy objects from raw pool data and lays them out on the canvas.
    // Boss rooms always spawn a single enemy; regular rooms spawn 1-3.
    enemyMaker(enemyData, isBoss = false){
        // DB ids of every enemy spawned, so a cleared battle can map each defeated
        // enemy back to its droppable cards (this.enemies is filtered down to empty
        // by victory time, so the ids can't be read from it then).
        this.spawnedEnemyIds = []
        let count = isBoss ? 1 : Math.floor(1 + Math.random() * 3);
        if(count > 1){
            let positionY = this.canvasHeight/2
            let positionX = this.canvasWidth/2
            let offSetX = 150
            let offSetY = 50
            for(let i = 0; i < count; i++){
                let enemyIndex = Math.floor(Math.random() * enemyData.length)
                let datum = enemyData[enemyIndex]
                this.enemies.push(this.makeEnemy(datum, positionX, positionY, 120, 300))
                this.spawnedEnemyIds.push(datum.id)
                positionX += offSetX
                positionY += offSetY
            }
        }
        else{
            let enemyIndex = Math.floor(Math.random() * enemyData.length)
            let datum = enemyData[enemyIndex]
            this.enemies.push(this.makeEnemy(datum, 3*this.canvasWidth/4, this.player.y, 200, 300))
            this.spawnedEnemyIds.push(datum.id)
        }
    }

    // Builds one Enemy from a normalized datum, forwarding the DB combat stats the
    // enemy turn reads (physical/magic damage and defenses) and overriding the
    // sprite with the resolved fallback path so missing art doesn't 404.
    makeEnemy(datum, x, y, width, height){
        const enemy = new Enemy(x, y, width, height, datum.name,
            datum.health, datum.maxHealth, datum.stamina, datum.maxStamina, datum.attributes,
            datum.physicalDamage, datum.magicDamage, datum.physicalDefense, datum.magicDefense,
            datum.experienceReward, null, datum.isBoss)
        if(datum.spritePath){ enemy.setSprite(datum.spritePath) }
        return enemy
    }
}
