export default class TabHelper {
    static onTreeTab = true;

    static showTab(name, prev) {
        if (LAYERS.includes(name) && !layerunlocked(name)) return
        if (player.tab !== name) clearParticles(function(p) {return p.layer === player.tab})
        if (tmp[name] && player.tab === name && isPlainObject(tmp[name].tabFormat)) {
            player.subtabs[name].mainTabs = Object.keys(layers[name].tabFormat)[0]
        }
        var toTreeTab = name == "none"
        player.tab = name
        if (tmp[name] && (tmp[name].row !== "side") && (tmp[name].row !== "otherside")) player.lastSafeTab = name
        updateTabFormats()
        needCanvasUpdate = true
        document.activeElement.blur()

    }

    static showNavTab(name, prev) {
        console.log(prev)
        if (LAYERS.includes(name) && !layerunlocked(name)) return
        if (player.navTab !== name) clearParticles(function(p) {return p.layer === player.navTab})
        if (tmp[name] && tmp[name].previousTab !== undefined) prev = tmp[name].previousTab
        var toTreeTab = name == "tree-tab"
        console.log(name + prev)
        if (name!== "none" && prev && !tmp[prev]?.leftTab == !tmp[name]?.leftTab) player[name].prevTab = prev
        else if (player[name])
            player[name].prevTab = ""
        player.navTab = name
        updateTabFormats()
        needCanvasUpdate = true
    }

    static goBack(layer) {
        let nextTab = "none"
    
        if (player[layer].prevTab) nextTab = player[layer].prevTab
        if (player.navTab === "none" && (tmp[layer]?.row == "side" || tmp[layer].row == "otherside")) nextTab = player.lastSafeTab
    
        if (tmp[layer].leftTab) showNavTab(nextTab, layer)
        else showTab(nextTab, layer)
    
    }

    static subtabShouldNotify(layer, family, id) {
        let subtab = {}
        if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
        else subtab = tmp[layer].microtabs[family][id]
        if (!subtab.unlocked) return false
        if (subtab.embedLayer) return tmp[subtab.embedLayer].notify
        else return subtab.shouldNotify
    }
    
    static subtabResetNotify(layer, family, id) {
        let subtab = {}
        if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
        else subtab = tmp[layer].microtabs[family][id]
        if (subtab.embedLayer) return tmp[subtab.embedLayer].prestigeNotify
        else return subtab.prestigeNotify
    }
}