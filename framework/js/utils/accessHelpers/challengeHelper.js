import { stateHasChanged } from "../../core/canvasSupport.js";
import { layers } from "../../core/layerSupport.js";
import { player } from "../../core/playerSupport.js";
import { temp } from "../../core/tempSupport.js";
import Decimal from "../break_eternity.js";
import LayerHelper from "./layerHelper.js";

export default class ChallengeHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static hasCompletion(layer, id) {
        if (!player.layers[layer].challenges)
            return false;

        // @ts-ignore
        return player.layers[layer].challenges[id] && !temp.layers[layer].deactivated;
    }
    
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static isMaxed(layer, id) {
        if (!player.layers[layer].challenges || temp.layers[layer].challenges)
            return false;

        // @ts-ignore
        return Decimal.gte(player.layers[layer].challenges[id], temp.layers[layer].challenges[id].completetionLimit) && !temp.layers[layer].deactivated;
    }
    
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static get(layer, id) {
        if (!player.layers[layer].challenges)
            return Decimal.dZero;

        // @ts-ignore
        return player.layers[layer].challenges[id];
    }

    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static effect(layer, id) {
        // @ts-ignore
        if (!temp.layers[layer].challenges || !temp.layers[layer].challenges[id].effect)
            return Decimal.dZero;

        // @ts-ignore
        return temp.layers[layer].challenges[id].effect;
    }

    /**
     * 
     * @param {string} layer 
     * @param {string} id
     * @returns {void}
     */
    static start(layer, id) {
        let enter = false;

        // @ts-ignore
        if (!temp.layers[layer].challenges || !temp.layers[layer].challenges[id])
            return;

        // @ts-ignore
        if (!temp.layers[layer].challenges[id].unlocked) 
            return;

        if (player.layers[layer].activeChallenge === id) {
            this.complete(layer, id);

            // @ts-ignore
            Vue.set(player.layers[layer], "activeChallenge", null);
        } else
            enter = true;

        LayerHelper.doReset(layer, true);

        if (enter) {
            // @ts-ignore
            Vue.set(player.layers[layer], "activeChallenge", id);
            
            run(layers[layer].challenges[id].onEnter, layers[layer].challenges[id])
        }
        
        updateChallengeTemp(layer);
    }
    
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static canComplete(layer, id)
    {
        // @ts-ignore
        if (temp.layers[layer].challenges || temp.layers[layer].challenges[id])
            return false;

        if (id != player.layers[layer].activeChallenge) 
            return false;

        // @ts-ignore        
        return temp.layers[layer].challenges[id].canComplete; 
    }
    
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {void}
     */
    static complete(layer, id) {
        let active = player.layers[layer].activeChallenge;

        if (!active) 
            return;

        // @ts-ignore
        if (!player.layers[layer].challenges || !temp.layers[layer].challenges || !player.layers[layer].challenges[id] || !temp.layers[layer].challenges[id])
            return;
        
        const canComplete = this.canComplete(layer, id);

        if (!canComplete) {
            // @ts-ignore
            Vue.set(player.layers[layer], "activeChallenge", null);

            run(layers[layer].challenges[id].onExit, layers[layer].challenges[id]);

            return;
        }

        // @ts-ignore
        if (Decimal.lt(player.layers[layer].challenges[id], temp.layers[layer].challenges[id].completetionLimit)) {
            stateHasChanged();

            // @ts-ignore
            player.layers[layer].challenges[id] = Decimal.add(player.layers[layer].challenges[id], temp.layers[layer].challenges[id].completionsPer);
            // @ts-ignore
            player.layers[layer].challenges[id] = Decimal.min(player.layers[layer].challenges[id], temp.layers[layer].challenges[id].completionLimit);

            if (layers[layer].challenges[id].onComplete) 
                run(layers[layer].challenges[id].onComplete, layers[layer].challenges[id])
        }

        // @ts-ignore
        Vue.set(player.layers[layer], "activeChallenge", null);

        run(layers[layer].challenges[id].onExit, layers[layer].challenges[id]);

        updateChallengeTemp(layer);
    }

    static inChallenge(layer, id) {
        let challenge = player[layer].activeChallenge
        if (!challenge) return false
        id = toNumber(id)
        if (challenge == id) return true
    
        if (layers[layer].challenges[challenge].countsAs)
            return tmp[layer].challenges[challenge].countsAs.includes(id) || false
        return false
    }

    static challengeStyle(layer, id) {
        if (player[layer].activeChallenge == id && canCompleteChallenge(layer, id)) return "canComplete"
        else if (hasChallenge(layer, id)) return "done"
        return "locked"
    }

    static challengeButtonText(layer, id) {
        return (player[layer].activeChallenge==(id)?(canCompleteChallenge(layer, id)?"Finish":"Exit Early"):(hasChallenge(layer, id)?"Completed":"Start"))
    
    }
}