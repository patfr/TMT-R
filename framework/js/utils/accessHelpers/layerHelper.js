import { layers } from "../../core/layerSupport.js";
import { temp } from "../../core/tempSupport.js";

export default class LayerHelper {
    /**
     * 
     * @param {string} layer 
     * @param {*} useType 
     * @returns 
     */
    static getResetGain(layer, useType = null) {
        let type = useType;

        if (!useType){ 
            type = temp.layers[layer].type;
            
            if (layers[layer].getResetGain !== undefined)
                return layers[layer].getResetGain()
        } 
        if(temp[layer].type == "none")
            return new Decimal (0)
        if (temp[layer].gainExp.eq(0)) return decimalZero
        if (type=="static") {
            if ((!temp[layer].canBuyMax) || temp[layer].baseAmount.lt(temp[layer].requires)) return decimalOne
            let gain = temp[layer].baseAmount.div(temp[layer].requires).div(temp[layer].gainMult).max(1).log(temp[layer].base).times(temp[layer].gainExp).pow(Decimal.pow(temp[layer].exponent, -1))
            gain = gain.times(temp[layer].directMult)
            return gain.floor().sub(player[layer].points).add(1).max(1);
        } else if (type=="normal"){
            if (temp[layer].baseAmount.lt(temp[layer].requires)) return decimalZero
            let gain = temp[layer].baseAmount.div(temp[layer].requires).pow(temp[layer].exponent).times(temp[layer].gainMult).pow(temp[layer].gainExp)
            if (gain.gte(temp[layer].softcap)) gain = gain.pow(temp[layer].softcapPower).times(temp[layer].softcap.pow(decimalOne.sub(temp[layer].softcapPower)))
            gain = gain.times(temp[layer].directMult)
            return gain.floor().max(0);
        } else if (type=="custom"){
            return layers[layer].getResetGain()
        } else {
            return decimalZero
        }
    }
    
    static getNextAt(layer, canMax=false, useType = null) {
        let type = useType
        if (!useType) {
            type = temp[layer].type
            if (layers[layer].getNextAt !== undefined)
                return layers[layer].getNextAt(canMax)
    
            }
        if(temp[layer].type == "none")
            return new Decimal (Infinity)
    
        if (temp[layer].gainMult.lte(0)) return new Decimal(Infinity)
        if (temp[layer].gainExp.lte(0)) return new Decimal(Infinity)
    
        if (type=="static") 
        {
            if (!temp[layer].canBuyMax) canMax = false
            let amt = player[layer].points.plus((canMax&&temp[layer].baseAmount.gte(temp[layer].nextAt))?temp[layer].resetGain:0).div(temp[layer].directMult)
            let extraCost = Decimal.pow(temp[layer].base, amt.pow(temp[layer].exponent).div(temp[layer].gainExp)).times(temp[layer].gainMult)
            let cost = extraCost.times(temp[layer].requires).max(temp[layer].requires)
            if (temp[layer].roundUpCost) cost = cost.ceil()
            return cost;
        } else if (type=="normal"){
            let next = temp[layer].resetGain.add(1).div(temp[layer].directMult)
            if (next.gte(temp[layer].softcap)) next = next.div(temp[layer].softcap.pow(decimalOne.sub(temp[layer].softcapPower))).pow(decimalOne.div(temp[layer].softcapPower))
            next = next.root(temp[layer].gainExp).div(temp[layer].gainMult).root(temp[layer].exponent).times(temp[layer].requires).max(temp[layer].requires)
            if (temp[layer].roundUpCost) next = next.ceil()
            return next;
        } else if (type=="custom"){
            return layers[layer].getNextAt(canMax)
        } else {
            return decimalZero
        }}
    
        static shouldNotify(layer){
            for (id in temp[layer].upgrades){
                if (isPlainObject(layers[layer].upgrades[id])){
                    if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && temp[layer].upgrades[id].unlocked){
                        return true
                    }
                }
            }
            if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) {
                return true
            }
        
            if (temp[layer].shouldNotify)
                return true
        
            if (isPlainObject(temp[layer].tabFormat)) {
                for (subtab in temp[layer].tabFormat){
                    if (subtabShouldNotify(layer, 'mainTabs', subtab)) {
                        temp[layer].trueGlowColor = temp[layer].tabFormat[subtab].glowColor || defaultGlow
        
                        return true
                    }
                }
            }
        
            for (family in temp[layer].microtabs) {
                for (subtab in temp[layer].microtabs[family]){
                    if (subtabShouldNotify(layer, family, subtab)) {
                        temp[layer].trueGlowColor = temp[layer].microtabs[family][subtab].glowColor
                        return true
                    }
                }
            }
             
            return false
            
        }
        
        static canReset(layer)
        {	
            if (layers[layer].canReset!== undefined)
                return run(layers[layer].canReset, layers[layer])
            else if(temp[layer].type == "normal")
                return temp[layer].baseAmount.gte(temp[layer].requires)
            else if(temp[layer].type== "static")
                return temp[layer].baseAmount.gte(temp[layer].nextAt) 
            else 
                return false
        }

        static rowReset(row, layer) {
            for (lr in ROW_LAYERS[row]){
                if(layers[lr].doReset) {
                    if (!isNaN(row)) Vue.set(player[lr], "activeChallenge", null) // Exit challenges on any row reset on an equal or higher row
                    run(layers[lr].doReset, layers[lr], layer)
                }
                else
                    if(temp[layer].row > temp[lr].row && !isNaN(row)) layerDataReset(lr)
            }
        }
        
        static layerDataReset(layer, keep = []) {
            let storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab:player[layer].prevTab} // Always keep these
        
            for (thing in keep) {
                if (player[layer][keep[thing]] !== undefined)
                    storedData[keep[thing]] = player[layer][keep[thing]]
            }
        
            Vue.set(player[layer], "buyables", getStartBuyables(layer))
            Vue.set(player[layer], "clickables", getStartClickables(layer))
            Vue.set(player[layer], "challenges", getStartChallenges(layer))
            Vue.set(player[layer], "grid", getStartGrid(layer))
        
            layOver(player[layer], getStartLayerData(layer))
            player[layer].upgrades = []
            player[layer].milestones = []
            player[layer].achievements = []
        
            for (thing in storedData) {
                player[layer][thing] =storedData[thing]
            }
        }
    
        static doReset(layer, force=false) {
            if (temp[layer].type == "none") return
            let row = temp[layer].row
            if (!force) {
                
                if (temp[layer].canReset === false) return;
                
                if (temp[layer].baseAmount.lt(temp[layer].requires)) return;
                let gain = temp[layer].resetGain
                if (temp[layer].type=="static") {
                    if (temp[layer].baseAmount.lt(temp[layer].nextAt)) return;
                    gain =(temp[layer].canBuyMax ? gain : 1)
                } 
        
        
                if (layers[layer].onPrestige)
                    run(layers[layer].onPrestige, layers[layer], gain)
                
                addPoints(layer, gain)
                updateMilestones(layer)
                updateAchievements(layer)
        
                if (!player[layer].unlocked) {
                    player[layer].unlocked = true;
                    stateHasChanged();
        
                    if (temp[layer].increaseUnlockOrder){
                        lrs = temp[layer].increaseUnlockOrder
                        for (lr in lrs)
                            if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++
                    }
                }
            
            }
        
            if (run(layers[layer].resetsNothing, layers[layer])) return
            temp[layer].baseAmount = decimalZero // quick fix
        
        
            for (layerResetting in layers) {
                if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting)
            }
        
            player.points = (row == 0 ? decimalZero : getStartPoints())
        
            for (let x = row; x >= 0; x--) rowReset(x, layer)
            for (r in OTHER_LAYERS){
                rowReset(r, layer)
            }
        
            player[layer].resetTime = 0
        
            updateTemp()
            updateTemp()
        }
        
        static resetRow(row) {
            if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
            let pre_layers = ROW_LAYERS[row-1]
            let layers = ROW_LAYERS[row]
            let post_layers = ROW_LAYERS[row+1]
            rowReset(row+1, post_layers[0])
            doReset(pre_layers[0], true)
            for (let layer in layers) {
                player[layer].unlocked = false
                if (player[layer].unlockOrder) player[layer].unlockOrder = 0
            }
            player.points = getStartPoints()
            updateTemp();
            resizeCanvas();
        }

        static respecBuyables(layer) {
            if (!layers[layer].buyables) return
            if (!layers[layer].buyables.respec) return
            if (!player[layer].noRespecConfirm && !confirm(tmp[layer].buyables.respecMessage || "Are you sure you want to respec? This will force you to do a \"" + (tmp[layer].name ? tmp[layer].name : layer) + "\" reset as well!")) return
            run(layers[layer].buyables.respec, layers[layer].buyables)
            updateBuyableTemp(layer)
            document.activeElement.blur()
        }

        static prestigeNotify(layer) {
            if (layers[layer].prestigeNotify) return layers[layer].prestigeNotify()
            
            if (isPlainObject(tmp[layer].tabFormat)) {
                for (subtab in tmp[layer].tabFormat){
                    if (subtabResetNotify(layer, 'mainTabs', subtab))
                        return true
                }
            }
            for (family in tmp[layer].microtabs) {
                for (subtab in tmp[layer].microtabs[family]){
                    if (subtabResetNotify(layer, family, subtab))
                        return true
                }
            }
            if (tmp[layer].autoPrestige || tmp[layer].passiveGeneration) return false
            else if (tmp[layer].type == "static") return tmp[layer].canReset
            else if (tmp[layer].type == "normal") return (tmp[layer].canReset && (tmp[layer].resetGain.gte(player[layer].points.div(10))))
            else return false
        }
        
        static notifyLayer(name) {
            if (player.tab == name || !layerunlocked(name)) return
            player.notify[name] = 1
        }

        static layerunlocked(layer) {
            if (tmp[layer] && tmp[layer].type == "none") return (player[layer].unlocked)
            return LAYERS.includes(layer) && (player[layer].unlocked || (tmp[layer].canReset && tmp[layer].layerShown))
        }
}