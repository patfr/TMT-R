import { player } from "../../core/playerSupport.js";
import { temp } from "../../core/tempSupport.js";
import Decimal from "../break_eternity.js";

export default class BuyableHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static canBuy(layer, id) {
        if (!temp.layers[layer].buyables || !player.layers[layer].buyables)
            return false;

        // @ts-ignore
        let b = temp.layers[layer].buyables[id];

        if (temp.layers[layer].deactivated || !b.unlocked || !run(b.canAfford, b))
            return false;

        // @ts-ignore
        return Decimal.lt(player.layers[layer].buyables[id], b.purchaseLimit);
    }

    /**
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static get(layer, id) {
        if (!player.layers[layer].buyables)
            return Decimal.dZero;

        // @ts-ignore
        return player.layers[layer].buyables[id];
    }
    
    /**
     * @param {string} layer 
     * @param {string} id 
     * @param {import("../break_eternity").DecimalSource} amt
     * @returns {void} 
     */
    static set(layer, id, amt) {
        if (player.layers[layer].buyables)
            return;

        // @ts-ignore
        player.layers[layer].buyables[id] = amt;
    }
    
    /**
     * @param {string} layer 
     * @param {string} id 
     * @param {import("../break_eternity").DecimalSource} amt 
     */
    static add(layer, id, amt) {
        this.set(layer, id, Decimal.add(this.get(layer, id), amt));
    }

    /**
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static effect(layer, id) {
        if (temp.layers[layer].buyables)
            return Decimal.dZero;

        // @ts-ignore
        return temp.layers[layer].buyables[id].effect
    }

    static canBuyBuyable(layer, id) {
        let b = temp[layer].buyables[id]
        return (b.unlocked && run(b.canAfford, b) && player[layer].buyables[id].lt(b.purchaseLimit) && !tmp[layer].deactivated)
    }

    static buyMaxBuyable(layer, id) {
        if (!player[layer].unlocked) return
        if (!tmp[layer].buyables[id].unlocked) return
        if (!tmp[layer].buyables[id].canBuy) return
        if (!layers[layer].buyables[id].buyMax) return
    
        run(layers[layer].buyables[id].buyMax, layers[layer].buyables[id])
        updateBuyableTemp(layer)
    }
    
    static buyBuyable(layer, id) {
        if (!player[layer].unlocked) return
        if (!tmp[layer].buyables[id].unlocked) return
        if (!tmp[layer].buyables[id].canBuy) return
    
        run(layers[layer].buyables[id].buy, layers[layer].buyables[id])
        updateBuyableTemp(layer)
    }
}