export default class ClickableHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {any}
     */
    static get(layer, id) {
        return (player[layer].clickables[id])
    }
    
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @param {any} state 
     */
    static set(layer, id, state) {
        player[layer].clickables[id] = state
    }

    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static effect(layer, id) {
        return (tmp[layer].clickables[id].effect)
    }

    static clickClickable(layer, id) {
        if (!player[layer].unlocked || tmp[layer].deactivated) return
        if (!tmp[layer].clickables[id].unlocked) return
        if (!tmp[layer].clickables[id].canClick) return
    
        run(layers[layer].clickables[id].onClick, layers[layer].clickables[id])
        updateClickableTemp(layer)
    }
}