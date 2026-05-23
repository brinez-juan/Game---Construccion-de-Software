import { PARRY_RESULTS } from "./GlobalVariables.js";

export default class StaminaSystem {
    initRun(player) {
        player.stamina = player.maxStamina;
    }

    canUseCard(player, card) {
        return player.stamina >= card.staminaCost;
    }

    useCard(player, card) {
        if (!this.canUseCard(player, card)) {
            console.warn("not enough stamina for " + card.name);
            return false;
        }
        player.spendStamina(card.staminaCost);
        return true;
    }

    applyParryRecovery(player, parryResult) {
        let amount = 0;
        if (parryResult == PARRY_RESULTS.PERFECT) {
            amount = 15;
        } else if (parryResult == PARRY_RESULTS.NORMAL) {
            amount = 5;
        } else if (parryResult == PARRY_RESULTS.POOR) {
            amount = 0;
        }
        player.recoverStamina(amount);
    }

    applyDefensiveCardRecovery(player) {
        player.recoverStamina(15);
    }

    staminaRatio(player) {
        return player.stamina / player.maxStamina;
    }
}
