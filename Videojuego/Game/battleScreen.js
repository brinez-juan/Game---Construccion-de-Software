import Menus from './Menus.js';
import Player from './Player.js';
import { Enemy } from './NonPlayableCharacter.js';
import ParryBar from './parryBar.js';
import ItemCard from './ItemCard.js';
import {canvas} from './Return.js';
import TextLabel from './TextLabel.js';
import { sfxEnabled } from './GlobalVariables.js';
import { normalizeCatalogCard } from './dataAdapter.js';

// Enemy defense tuning. Mitigation follows the classic armor curve damage*K/(K+def): never
// negative, diminishing returns. K is sized for the DB defense range (~1-21) so a high-armor
// enemy mitigates roughly half. GUARD_DEFENSE_BONUS is the temporary typed bump a defend grants.
const DEFENSE_K = 25;            // lower = armor matters more
const GUARD_DEFENSE_BONUS = 15;  // temporary bonus added by a defend action
// AOE cards hit every enemy, so each hit is throttled: an AOE is crowd utility, not a
// stronger single-target nuke. Combined with their low base damage in the DB.
const AOE_FACTOR = 0.6;

// Maps any attack/defend action type to its damage school.
function damageSchool(actionType){
    return String(actionType).includes('magic') ? 'magic' : 'physic';
}

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
        // Per-battle summary surfaced on the victory screen (gameWonBattleScreen).
        this.cardsWon = []
        this.xpAwardedThisBattle = 0
        this.enemiesDefeatedThisBattle = 0
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
        // School of the defend card the player committed this turn ('physic' | 'magic'). A
        // matching incoming attack auto-perfect-parries; a mismatched one auto-misses.
        this.playerDefenseType = null;
        // The enemy turn resolves one enemy at a time, deciding each action up front
        // (decideEnemyAction): a defend resolves immediately with NO parry bar, while an
        // attack is held in currentDecision/currentDamage until the parry resolves it.
        this.currentDecision = null;
        this.currentDamage = 0;
        this.parryLabel = null;
        this.parryLabelTimer = 0;
        this.failedSelection = new Audio('../Assets/Audio/SYS_buzzer.ogg')
        this.playSfx = (path) => {
            if (!sfxEnabled || !path) return;
            const audio = new Audio(path);
            audio.play().catch(err => console.warn('SFX play failed:', path, err));
        }
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
                        // Remember the school so the enemy turn can type-match the parry.
                        this.playerDefenseType = damageSchool(card.action.actionType)
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.playSfx(card.action.sfxPath)
                        this.turn = 'enemy'
                        this.player.setSprite('../Assets/Sprites/characters/player_defend.png')
                        console.log(this.player.spriteImage)
                        return
                    }
                    else if(card.action.actionType === 'aoe_magic' || card.action.actionType === 'aoe_physic'){
                        let damageDone = card.action.calculateDamage(this.player.attributes) * AOE_FACTOR
                        const attackType = damageSchool(card.action.actionType)
                        for(let enemy of this.enemies){
                            const dealt = this.applyEnemyDefense(enemy, damageDone, attackType)
                            enemy.health -= dealt
                            enemy.healthBar.calculateCurrentIndicatorSubstraction(dealt)
                        }
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.playSfx(card.action.sfxPath)
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
            if (sfxEnabled) this.failedSelection.play()
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
                const attackType = damageSchool(this.cardInAction.action.actionType)
                const dealt = this.applyEnemyDefense(enemy, damageDone, attackType)
                enemy.health -= dealt
                enemy.healthBar.calculateCurrentIndicatorSubstraction(dealt)
                this.player.stamina = this.player.stamina - this.cardInAction.staminaCost > 0 ? this.player.stamina - this.cardInAction.staminaCost : 0
                this.player.staminaBar.calculateCurrentIndicatorSubstraction(this.cardInAction.staminaCost)
                console.log(this.player.staminaBar.missingAttributeBar.width)
                this.playSfx(this.cardInAction.action.sfxPath)
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
        // Only show the parry bar once an ATTACK has actually been decided (currentDecision is
        // set). Without this gate the bar flashes for a frame or two before a defending enemy
        // resolves, since the turn flips to 'enemy' before the decide-first step runs.
        if(this.turn === 'enemy' && this.parryLabelTimer <= 0 && this.currentDecision != null){
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
            this.ParryBar.dispose()
            this.reportEnemiesDefeated()
            this.state = 7
            return
        }
        if(this.enemies.every(enemy => enemy.health <= 0)){
            this.removeEventListeners()
            this.ParryBar.dispose()
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

            // Hold while the previous action's result label is still on screen.
            if(this.parryLabelTimer > 0){ return }

            // Decide THIS enemy's action up front. A defend resolves immediately with no
            // parry minigame (decideEnemyAction returns false); only an attack falls
            // through to spin up the parry bar below.
            if(this.currentDecision == null && !this.decideEnemyAction()){
                return
            }

            // A player defend card auto-resolves the incoming attack by type: a matching school
            // is a guaranteed perfect parry, a mismatched one can't block at all (auto-miss).
            // Only reached when an attack is pending, so currentDecision is an attack type.
            if(this.playerDefending){
                const attackType = damageSchool(this.currentDecision)
                this.ParryBar.state = (attackType === this.playerDefenseType) ? 'perfect' : 'miss'
                this.playerDefending = false;
            }

            if(!this.ParryBar.state){
                this.ParryBar.update(deltaTime, this.player.attributes.DEXTERITY)
            }
            else{
                this.resolveEnemyAttack()
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
            this.enemiesDefeatedThisBattle = killed
            this.game.enemiesDefeated += killed
            // US16: award XP for the enemies defeated this battle (full roster XP on a
            // clear) so the player's level/XP can be persisted in the victory path.
            if(killed > 0 && this.initialEnemyCount > 0 && typeof this.game.awardExperience === 'function'){
                this.xpAwardedThisBattle = Math.round(this.totalEnemyXp * killed / this.initialEnemyCount)
                this.game.awardExperience(this.xpAwardedThisBattle)
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
            this.cardsWon.push(card)
            if(this.game.api && this.game.activeSlotId != null){
                this.game.api.addCard(this.game.activeSlotId, {
                    cardId: card.cardId, isPermanent: false, obtainedAtFloor: floor
                }).catch(err => console.error('Could not persist card drop:', err))
            }
        }
    }

    // Proportional mitigation of one matching-type attack by an enemy's typed defense (base DB
    // stat + any matching defend guard), following the armor curve damage*K/(K+def). A wrong-type
    // guard contributes nothing and is shattered by the attack, so off-type hits land near-full.
    applyEnemyDefense(enemy, damage, attackType){
        if(enemy.guardType && enemy.guardType !== attackType){ enemy.guardType = null }
        const base = (attackType === 'magic' ? enemy.magicDefense : enemy.physicalDefense) || 0
        const bonus = (enemy.guardType === attackType) ? GUARD_DEFENSE_BONUS : 0
        const def = base + bonus
        return Math.max(1, Math.round(damage * DEFENSE_K / (DEFENSE_K + def)))
    }

    // Decides the current enemy's action BEFORE any parry bar appears. A defend raises a typed
    // guard and resolves immediately (no parry minigame), returning false so the caller knows
    // there's nothing to parry this frame. An attack stores its damage and returns true so the
    // caller spins up the parry bar. When every enemy has acted the turn is handed back.
    decideEnemyAction(){
        if(this.currentEnemyIndex >= this.enemies.length){
            this.endEnemyTurn()
            return false
        }
        this.enemyAttacking = this.enemies[this.currentEnemyIndex]
        // Last turn's guard expires when this enemy acts again.
        this.enemyAttacking.guardType = null
        const decision = this.enemyAttacking.decideAction(this.player)
        let damageDone = 0;
        if(decision === 'attack_physic'){
            damageDone = this.enemyAttacking.physicalDamage
        }
        else if(decision === 'attack_magic'){
            damageDone = this.enemyAttacking.magicDamage
        }
        else if(decision === 'defend_physic'){
            this.enemyAttacking.guardType = 'physic'
        }
        else if(decision === 'defend_magic'){
            this.enemyAttacking.guardType = 'magic'
        }

        // No damage means the enemy defended (or has no usable attack): skip the parry bar
        // entirely — no parry, no stamina drain — and move straight to the next enemy. The
        // defend has no message for now; per-enemy attack/defend sprites will be the tell.
        if(damageDone <= 0){
            this.advanceEnemy()
            return false
        }

        this.currentDecision = decision
        this.currentDamage = damageDone
        return true
    }

    // Applies a decided attack through the player's parry result: perfect negates it,
    // normal cuts it to 30%, a miss takes it in full. Stamina is always reconciled, then
    // the result label is shown and the turn advances to the next enemy.
    resolveEnemyAttack(){
        // Mitigate the incoming hit by the player's typed passive armor (same armor curve
        // as enemies) BEFORE the parry multiplier, so STRENGTH/INTELLIGENCE/VIGOR matter.
        const school = damageSchool(this.currentDecision)
        const playerDef = (school === 'magic' ? this.player.magicDefense : this.player.physicalDefense) || 0
        const armoredDamage = this.currentDamage * DEFENSE_K / (DEFENSE_K + playerDef)
        const finalDamage = this.ParryBar.calculateDamagePlayer(this.player, armoredDamage)
        if(finalDamage > 0){
            this.player.health -= finalDamage
            this.player.healthBar.calculateCurrentIndicatorSubstraction(finalDamage)
        }

        const staminaChange = this.ParryBar.calculateStamina(this.player)
        if(staminaChange > 0){
            this.player.stamina = this.player.stamina + staminaChange > this.player.maxStamina ? this.player.maxStamina : this.player.stamina + staminaChange
            this.player.staminaBar.calculateCurrentIndicatorAddition(staminaChange)
        } else if(staminaChange < 0){
            this.player.stamina = this.player.stamina - Math.abs(staminaChange) < 0? 0 : this.player.stamina - Math.abs(staminaChange)
            this.player.staminaBar.calculateCurrentIndicatorSubstraction(Math.abs(staminaChange))
        }

        if (this.ParryBar.state === 'perfect') {
            this.playSfx('../Assets/Audio/SFX_dodge.mp3');
        }
        const labelData = { perfect: ['Perfect!', 'green'], normal: ['Good!', 'yellow'], miss: ['Miss!', 'red'] }
        const [text, color] = labelData[this.ParryBar.state] ?? labelData.miss
        this.showActionLabel(text, color, 1500)

        this.advanceEnemy()
    }

    // Shows a centered combat label for `duration` ms. Also paces the enemy turn: while the
    // label is up the enemy block holds, so consecutive actions don't resolve in one frame.
    showActionLabel(text, color, duration = 1500){
        this.parryLabel = new TextLabel(this.canvasWidth / 2, this.canvasHeight / 2 - 60, 'bold 36px Arial', color, undefined, text)
        this.parryLabelTimer = duration
    }

    // Moves to the next enemy: clears the decision and hands it a fresh parry bar.
    advanceEnemy(){
        this.currentDecision = null
        this.currentDamage = 0
        this.currentEnemyIndex++
        this.ParryBar.dispose()
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
    }

    // Ends the enemy turn: resets the index/bar and returns control to the player.
    endEnemyTurn(){
        this.currentEnemyIndex = 0
        this.currentDecision = null
        this.currentDamage = 0
        this.ParryBar.dispose()
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
        this.turn = 'player'
        this.player.setSprite('../Assets/Sprites/characters/player.png')
    }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, this.canvasHeight/2 + 30, 180, 300, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel)
        this.player.setSprite('../Assets/Sprites/characters/player.png')
    }

    // Instantiates Enemy objects from raw pool data and lays them out on the canvas.
    // Boss rooms always spawn a single enemy; regular rooms spawn 1-3.
    enemyMaker(enemyData, isBoss = false){
        if(!enemyData || enemyData.length === 0){
            console.warn('battleScreen: no enemy data available for this room');
            return;
        }
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
