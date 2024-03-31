import { player } from "../../core/playerSupport.js";
import { temp } from "../../core/tempSupport.js";
import Decimal from "../break_eternity.js";

export default class AchievementHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static has(layer, id) {
        if (!player.layers[layer].achievements)
            return false;

        // @ts-ignore
        return player.layers[layer].achievements[id] && !temp.layers[layer].deactivated;
    }

    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static effect(layer, id) {
        // @ts-ignore
        if (!temp.layers[layer].achievements || !temp.layers[layer].achievements[id].effect)
            return Decimal.dZero;

        // @ts-ignore
        return temp.layers[layer].achievements[id].effect;
    }

    static updateAchievements(layer) {
        if (tmp[layer].deactivated) return
        for (id in layers[layer].achievements) {
            if (isPlainObject(layers[layer].achievements[id]) && !(hasAchievement(layer, id)) && layers[layer].achievements[id].done()) {
                player[layer].achievements.push(id)
                if (layers[layer].achievements[id].onComplete) layers[layer].achievements[id].onComplete()
                if (tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) doPopup("achievement", tmp[layer].achievements[id].name, "Achievement Gotten!", 3, tmp[layer].color);
            }
        }
    }
}