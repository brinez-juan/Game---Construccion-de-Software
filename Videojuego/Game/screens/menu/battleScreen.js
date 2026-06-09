import Menus from './Menus.js';
<<<<<<< HEAD:Videojuego/Game/battleScreen.js
import Player from './Player.js';
import { Enemy } from './NonPlayableCharacter.js';
import ParryBar from './parryBar.js';
import ItemCard from './ItemCard.js';
import GameObject from './GameObject.js';
import {canvas} from './Return.js';
import TextLabel from './TextLabel.js';
import { sfxEnabled } from './GlobalVariables.js';
import { normalizeCatalogCard, buildPotions } from './dataAdapter.js';
import battleTutorial from './battleTutorial.js';
=======
import Player from '../../libs/Player.js';
import { Enemy } from '../../libs/NonPlayableCharacter.js';
import ParryBar from '../../libs/parryBar.js';
import ItemCard from '../../libs/ItemCard.js';
import GameObject from '../../libs/GameObject.js';
import {canvas} from '../../Return.js';
import TextLabel from '../../libs/TextLabel.js';
import { sfxEnabled } from '../../libs/GlobalVariables.js';
import { normalizeCatalogCard, buildPotions } from '../../extras/dataAdapter.js';
>>>>>>> Santi:Videojuego/Game/screens/menu/battleScreen.js

// Enemy defense tuning. Mitigation follows the classic armor curve damage*K/(K+def): never
// negative, diminishing returns. K is sized for the DB defense range (~1-21) so a high-armor
// enemy mitigates roughly half. GUARD_DEFENSE_BONUS is the temporary typed bump a defend grants.
const DEFENSE_K = 25;            // lower = armor matters more
const GUARD_DEFENSE_BONUS = 15;  // temporary bonus added by a defend action
// AOE cards hit every enemy, so each hit is throttled: an AOE is crowd utility, not a
// stronger single-target nuke. Combined with their low base damage in the DB.
const AOE_FACTOR = 0.6;
// Pause inserted between the player's action and the enemy turn so the player's
// attack/defend pose gets its own visible beat (mirrors the hold between enemy actions)
// before reverting to idle. Tunable.
const TURN_TRANSITION_MS = 1200;

// Player combat art per archetype. SOLDIER uses the base player_* set; ARCHER and MAGE
// have their own idle/attack/defend poses. Falls back to SOLDIER for an unknown archetype.
const CHARACTER_SPRITE_DIR = '../Assets/Sprites/characters/';
const PLAYER_SPRITES = {
    SOLDIER: { idle: 'player.png',        attack: 'player_attack.png',        defend: 'player_defend.png' },
    ARCHER:  { idle: 'player_archer.png', attack: 'player_archer_attack.png', defend: 'player_archer_defend.png' },
    MAGE:    { idle: 'player_mage.png',   attack: 'player_mage_attack.png',   defend: 'player_mage_defend.png' }
};

// Resolves an archetype's sprite set to full idle/attack/defend paths.
function playerSpriteStatesFor(archetype){
    const set = PLAYER_SPRITES[archetype] ?? PLAYER_SPRITES.SOLDIER;
    return {
        idle:   CHARACTER_SPRITE_DIR + set.idle,
        attack: CHARACTER_SPRITE_DIR + set.attack,
        defend: CHARACTER_SPRITE_DIR + set.defend
    };
}

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
        this.player.deckMaker(playerData.activeDeck, this.canvasWidth/2, 4*this.canvasHeight/5 + 50, 100*0.75, 100, 15)
        // The castle's final room (floor 3 boss) is a TWO-STAGE fight: Eldric first, then
        // Lysara appears in the same battle once he falls — both must die in one attempt.
        // enemyMaker spawns Eldric and parks Lysara in pendingBoss; update()'s victory check
        // brings her in via spawnSecondBoss() instead of ending the battle.
        this.isFinalBossFight = !!(isBoss && this.game?.currentRoom?.floorNumber === 3)
        this.pendingBoss = null
        this.enemyMaker(enemies, isBoss)
        // Once-per-battle potion: the lobby hands the equipped potion via playerData.potion;
        // default to the health potion so EVERY battle (including the floor-0 tutorial, which may
        // be entered without a lobby choice) still has a usable potion. A fresh battleScreen per
        // battle resets potionUsed automatically, enforcing the 1-per-battle limit.
        this.potion = playerData.potion ?? buildPotions(this.game?.cardCatalog).HEALTH
        this.potionUsed = false
        this.potionCard = new GameObject(70, this.canvasHeight - 90, 75, 100)
        this.potionCard.setSprite(this.potion.spritePath)
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
        this.tutorialActive = false;
        this.cardInAction = undefined;
        this.enemyAttacking = undefined;
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.listenersActive = false
        this.currentEnemyIndex = 0;
        if(battleTutorial.shouldShow()){
            this.tutorialActive = true;
            battleTutorial.show(() => { this.tutorialActive = false; });
        }
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
        // An enemy that just defended, awaiting revert to its idle pose once its
        // "Defends!" tell (the parry label hold) clears. See update() / decideEnemyAction.
        this.pendingIdleEnemy = null;
        // True while the player→enemy transition hold is running, so the player's action
        // pose reverts to idle when that hold ends (see beginEnemyTurn / update).
        this.pendingIdlePlayer = false;
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
        if(this.potionCard){
            this.potionCard.mouseCollition(mouseX, mouseY)
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
            // Drink the equipped potion (once per battle); drinking costs the turn.
            if(this.potionCard && this.potionCard.hovered && !this.potionUsed){
                this.usePotion()
                return
            }
            for(let card of this.player.deck){
                if(card.hovered && card.staminaCost <= this.player.stamina){
                    if(card.action.actionType === 'defend_physic' || card.action.actionType === 'defend_magic'){
                        this.playerDefending = true;
                        // Remember the school so the enemy turn can type-match the parry.
                        this.playerDefenseType = damageSchool(card.action.actionType)
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.player.playState('defend')
                        this.playSfx(card.action.sfxPath)
                        this.beginEnemyTurn()
                        return
                    }
                    else if(card.action.actionType === 'aoe_magic' || card.action.actionType === 'aoe_physic'){
                        let damageDone = card.action.calculateDamage(this.player.attributes) * AOE_FACTOR
                        const attackType = damageSchool(card.action.actionType)
                        for(let enemy of this.enemies){
                            const dealt = this.applyEnemyDefense(enemy, damageDone, attackType)
                            enemy.health -= dealt
                            enemy.healthBar.calculateCurrentIndicatorSubstraction(dealt)
                            enemy.shake()   // every enemy hit by the AOE recoils
                        }
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.playSfx(card.action.sfxPath)
                        this.player.playState('attack')
                        this.player.lunge(1)   // hop toward the enemies on the right
                        this.beginEnemyTurn()
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
                this.playSfx(this.cardInAction.action.sfxPath)
                this.player.playState('attack')
                this.player.lunge(1)        // hop toward the enemies on the right
                enemy.shake()               // the struck enemy recoils
                this.cardInAction.y += 15
                this.cardInAction = null
                this.beginEnemyTurn()
                return
            }
        }
    }

    // Drinks the equipped potion: restores a % of the relevant max stat, marks it spent for the
    // rest of the battle, and ends the player's turn (the enemy then acts). The restore percent
    // comes from the potion (DB base_damage, or the POTIONS fallback). HP/stamina are clamped to
    // their caps; the HUD bar's addition indicator mirrors the gain.
    usePotion(){
        const pct = this.potion.restorePct || 0
        if(this.potion.actionType === 'recover_stamina'){
            const amount = Math.round(this.player.maxStamina * pct / 100)
            this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + amount)
            this.player.staminaBar.calculateCurrentIndicatorAddition(amount)
            this.showActionLabel('Stamina!', 'lime', 1200)
        } else {
            const amount = Math.round(this.player.maxHealth * pct / 100)
            this.player.health = Math.min(this.player.maxHealth, this.player.health + amount)
            this.player.healthBar.calculateCurrentIndicatorAddition(amount)
            this.showActionLabel('Healed!', 'lime', 1200)
        }
        this.potionUsed = true
        this.playSfx('../Assets/Audio/SFX_potion.mp3')
        this.beginEnemyTurn()
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
        // The once-per-battle potion, dimmed once it's been drunk so it reads as spent.
        if(this.potionCard){
            if(this.potionUsed){
                ctx.save()
                ctx.globalAlpha = 0.35
                this.potionCard.draw(ctx)
                ctx.restore()
            } else {
                this.potionCard.draw(ctx)
            }
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
        if(this.tutorialActive) return;
        // Advance the cosmetic lunge/shake offsets for everyone every frame, regardless of
        // whose turn it is, so attack hops and hurt shakes play out smoothly to completion.
        this.player.updateAnimation(deltaTime)
        for(let enemy of this.enemies){
            enemy.updateAnimation(deltaTime)
        }
        if(this.parryLabelTimer > 0){
            this.parryLabelTimer -= deltaTime;
            if(this.parryLabelTimer <= 0){
                this.parryLabel = null;
                // A defending enemy's "Defends!" tell has run its course — revert its pose.
                if(this.pendingIdleEnemy){
                    this.pendingIdleEnemy.playState('idle')
                    this.pendingIdleEnemy = null
                }
                // The player's action pose has had its beat — drop back to idle before the
                // enemy turn actually plays out.
                if(this.pendingIdlePlayer){
                    this.player.playState('idle')
                    this.pendingIdlePlayer = false
                }
            }
        }
        if(this.player.health <= 0){
            this.removeEventListeners()
            this.ParryBar.dispose()
            this.reportEnemiesDefeated()
            this.state = 7
            return
        }
        if(this.enemies.every(enemy => enemy.health <= 0)){
            // Final room: when the first boss falls, the second takes the stage instead of
            // ending the battle. Only once BOTH are down (pendingBoss cleared) does the
            // victory path run, so kills/XP/drops are tallied for the whole two-stage fight.
            if(this.pendingBoss){
                this.spawnSecondBoss()
                return
            }
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
        let defended = false;
        if(decision === 'attack_physic'){
            damageDone = this.enemyAttacking.physicalDamage
        }
        else if(decision === 'attack_magic'){
            damageDone = this.enemyAttacking.magicDamage
        }
        else if(decision === 'attack_special'){
            // Boss special: ignores the enemy's normal damage stats and threatens HALF the
            // player's current health. It still flows through the parry/armor pipeline below,
            // so a good parry can still cut it down — the only difference from a normal attack
            // is the damage amount and the _special pose.
            damageDone = Math.max(1, Math.round(this.player.health * 0.5))
        }
        else if(decision === 'defend_physic'){
            this.enemyAttacking.guardType = 'physic'
            defended = true
        }
        else if(decision === 'defend_magic'){
            this.enemyAttacking.guardType = 'magic'
            defended = true
        }

        // No damage means the enemy defended (or has no usable attack): skip the parry bar
        // entirely — no parry, no stamina drain — and move straight to the next enemy. A
        // defend shows its pose for a brief hold (no text label), reverting to idle once the
        // hold clears (handled in update via pendingIdleEnemy). The pose itself is the tell.
        if(damageDone <= 0){
            if(defended){
                this.enemyAttacking.playState('defend')
                this.pendingIdleEnemy = this.enemyAttacking
                this.parryLabelTimer = 900
            }
            this.advanceEnemy()
            return false
        }

        // An attack holds its pose through the whole parry window; reverted in resolveEnemyAttack.
        // A boss special telegraphs with its dedicated _special pose (falls back to attack/idle
        // if that art is missing); everything else uses the normal attack pose.
        this.enemyAttacking.playState(decision === 'attack_special' ? 'special' : 'attack')
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
        // The attacker hops toward the player (left) at the moment of impact; the player only
        // recoils if the hit actually landed (a perfect parry takes no damage = no shake).
        if(this.enemyAttacking){ this.enemyAttacking.lunge(-1) }
        if(finalDamage > 0){
            this.player.health -= finalDamage
            this.player.healthBar.calculateCurrentIndicatorSubstraction(finalDamage)
            this.player.shake()
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
        // Keep the attacker in its ATTACK pose through the lunge + result-label hold, then
        // revert to idle once the label clears (handled in update via pendingIdleEnemy). This
        // way the lunge plays in the attack stance instead of snapping to idle first.
        if(this.enemyAttacking){ this.pendingIdleEnemy = this.enemyAttacking }

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

    // Hands control to the enemies after a short pause, so the player's just-played
    // attack/defend pose gets a visible beat of its own (the same hold used between enemy
    // actions) instead of lingering for the whole enemy turn. update() reverts the player
    // to idle when this hold elapses.
    beginEnemyTurn(){
        this.turn = 'enemy'
        this.pendingIdlePlayer = true
        this.parryLabelTimer = TURN_TRANSITION_MS
    }

    // Ends the enemy turn: resets the index/bar and returns control to the player.
    endEnemyTurn(){
        this.currentEnemyIndex = 0
        this.currentDecision = null
        this.currentDamage = 0
        this.ParryBar.dispose()
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
        this.turn = 'player'
        this.player.playState('idle')
    }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, this.canvasHeight/2 + 30, 150, 260, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel)
        this.player.setSpriteStates(playerSpriteStatesFor(playerData.archetype))
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
        // Every enemy is drawn at the same full size as a lone enemy — no shrinking when the
        // room is crowded (the attack/defend poses share this box, so they stay full size too).
        const ENEMY_WIDTH = 160
        const ENEMY_HEIGHT = 260
        // Floor 1 / room 1's background has a wall the topmost enemy of a diagonal lands on,
        // which reads oddly. Nudge that room's enemies down a touch; every other room is fine.
        const room = this.game?.currentRoom
        const wallYOffset = (room?.floorNumber === 1 && room?.roomNumber === 1) ? 40 : 0
        // Two-stage final boss: spawn Eldric now and hold Lysara in pendingBoss so she can be
        // spawned (spawnSecondBoss) when he dies. Both are floor-3 bosses in the same pool, so
        // pick them out by name rather than at random; the second stage is skipped if Lysara
        // isn't present (e.g. fallback data with a single boss).
        if(this.isFinalBossFight){
            const eldric = enemyData.find(e => /eldric/i.test(e.name)) ?? enemyData[0]
            const lysara = enemyData.find(e => /lysara/i.test(e.name))
            this.pendingBoss = (lysara && lysara !== eldric)
                ? { datum: lysara, width: ENEMY_WIDTH, height: ENEMY_HEIGHT } : null
            this.enemies.push(this.makeEnemy(eldric, 3*this.canvasWidth/4, this.player.y, ENEMY_WIDTH, ENEMY_HEIGHT))
            this.spawnedEnemyIds.push(eldric.id)
            return
        }
        let count = isBoss ? 1 : Math.floor(1 + Math.random() * 3);
        if(count > 1){
            // Lay the group out CENTERED on the right side instead of pinning the outermost
            // enemies to the player (left) and the canvas edge (right) — that left two enemies
            // split awkwardly with one on top of the player and one on the far edge. Use a
            // fixed spacing, clamped so the cluster always fits in the region between the
            // player and the right edge, and center the row in that region. The diagonal is
            // also centered vertically on the player's line so the cluster reads as a group.
            const regionLeft = this.player.x + this.player.width/2 + ENEMY_WIDTH/2
            const regionRight = this.canvasWidth - ENEMY_WIDTH/2
            const regionCenter = (regionLeft + regionRight) / 2
            const offSetX = Math.min(150, (regionRight - regionLeft) / (count - 1))
            const offSetY = 50
            let positionX = regionCenter - offSetX * (count - 1) / 2
            let positionY = this.player.y - offSetY * (count - 1) / 2 + wallYOffset
            for(let i = 0; i < count; i++){
                let enemyIndex = Math.floor(Math.random() * enemyData.length)
                let datum = enemyData[enemyIndex]
                this.enemies.push(this.makeEnemy(datum, positionX, positionY, ENEMY_WIDTH, ENEMY_HEIGHT))
                this.spawnedEnemyIds.push(datum.id)
                positionX += offSetX
                positionY += offSetY
            }
        }
        else{
            let enemyIndex = Math.floor(Math.random() * enemyData.length)
            let datum = enemyData[enemyIndex]
            this.enemies.push(this.makeEnemy(datum, 3*this.canvasWidth/4, this.player.y + wallYOffset, ENEMY_WIDTH, ENEMY_HEIGHT))
            this.spawnedEnemyIds.push(datum.id)
        }
    }

    // Brings in the second final boss (Lysara) after the first (Eldric) falls, in the SAME
    // battle: the player keeps their current HP/stamina (that's the challenge), the turn
    // resets to the player with a fresh parry bar, and the end-of-battle tallies are extended
    // so she counts toward kills + XP. Called from update()'s victory check while a pendingBoss
    // is queued.
    spawnSecondBoss(){
        const { datum, width, height } = this.pendingBoss
        this.pendingBoss = null
        // Drop the just-defeated first boss (still in the array on the player turn, where the
        // victory check fires before checkEnemyStatus runs) so it isn't drawn behind Lysara.
        this.checkEnemyStatus()
        const boss = this.makeEnemy(datum, 3*this.canvasWidth/4, this.player.y, width, height)
        this.enemies.push(boss)
        this.spawnedEnemyIds.push(datum.id)
        // Extend the snapshots taken at construction so the second boss is counted at the end.
        this.initialEnemyCount += 1
        this.totalEnemyXp += boss.experienceReward || 0
        // Reset the per-enemy turn state and hand control back to the player.
        this.currentEnemyIndex = 0
        this.currentDecision = null
        this.currentDamage = 0
        this.enemyAttacking = undefined
        this.pendingIdleEnemy = null
        this.pendingIdlePlayer = false
        this.turn = 'player'
        this.player.playState('idle')
        this.ParryBar.dispose()
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
        // Dramatic tell that the fight isn't over.
        this.showActionLabel('Lysara appears!', 'magenta', 1600)
    }

    // Builds one Enemy from a normalized datum, forwarding the DB combat stats the
    // enemy turn reads (physical/magic damage and defenses) and overriding the
    // sprite with the resolved fallback path so missing art doesn't 404.
    makeEnemy(datum, x, y, width, height){
        const enemy = new Enemy(x, y, width, height, datum.name,
            datum.health, datum.maxHealth, datum.stamina, datum.maxStamina, datum.attributes,
            datum.physicalDamage, datum.magicDamage, datum.physicalDefense, datum.magicDefense,
            datum.experienceReward, null, datum.isBoss)
        if(datum.spritePaths){ enemy.setSpriteStates(datum.spritePaths) }
        else if(datum.spritePath){ enemy.setSprite(datum.spritePath) }
        return enemy
    }
}
