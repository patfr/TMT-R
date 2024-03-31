export default class UpgradeHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static has(layer, id) {
        return ((player[layer].upgrades.includes(id) || player[layer].upgrades.includes(id)) && !tmp[layer].deactivated)
    }

    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {import("../break_eternity").DecimalSource}
     */
    static effect(layer, id) {
        return (tmp[layer].upgrades[id].effect)
    }

    static autobuyUpgrades(layer){
        if (!temp[layer].upgrades) return
        for (id in temp[layer].upgrades)
            if (isPlainObject(temp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || layers[layer].upgrades[id].canAfford() === true))
                buyUpg(layer, id) 
    }

    static canAffordUpgrade(layer, id) {
        let upg = tmp[layer].upgrades[id]
        if(tmp[layer].deactivated) return false
        if (tmp[layer].upgrades[id].canAfford === false) return false
        let cost = tmp[layer].upgrades[id].cost
        if (cost !== undefined) 
            return canAffordPurchase(layer, upg, cost)
    
        return true
    }

    static buyUpgrade(layer, id) {
        if (!tmp[layer].upgrades || !tmp[layer].upgrades[id]) return
        let upg = tmp[layer].upgrades[id]
        if (!player[layer].unlocked || player[layer].deactivated) return
        if (!tmp[layer].upgrades[id].unlocked) return
        if (player[layer].upgrades.includes(id)) return
        if (upg.canAfford === false) return
        let pay = layers[layer].upgrades[id].pay
        if (pay !== undefined)
            run(pay, layers[layer].upgrades[id])
        else {
            let cost = tmp[layer].upgrades[id].cost
    
            if (upg.currencyInternalName) {
                let name = upg.currencyInternalName
                if (upg.currencyLocation) {
                    if (upg.currencyLocation[name].lt(cost)) return
                    upg.currencyLocation[name] = upg.currencyLocation[name].sub(cost)
                }
                else if (upg.currencyLayer) {
                    let lr = upg.currencyLayer
                    if (player[lr][name].lt(cost)) return
                    player[lr][name] = player[lr][name].sub(cost)
                }
                else {
                    if (player[name].lt(cost)) return
                    player[name] = player[name].sub(cost)
                }
            }
            else {
                if (player[layer].points.lt(cost)) return
                player[layer].points = player[layer].points.sub(cost)
            }
        }
        player[layer].upgrades.push(id);
        if (upg.onPurchase != undefined)
            run(upg.onPurchase, upg)
        needCanvasUpdate = true
    }
}