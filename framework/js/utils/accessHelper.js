import { options } from "../core/options.js";
import { player } from "../core/playerSupport.js";
import { temp } from "../core/tempSupport.js";
import AchievementHelper from "./accessHelpers/achievementHelper.js";
import BarHelper from "./accessHelpers/barHelper.js";
import BuyableHelper from "./accessHelpers/buyableHelper.js";
import ChallengeHelper from "./accessHelpers/challengeHelper.js";
import ClickableHelper from "./accessHelpers/clickableHelper.js";
import GridHelper from "./accessHelpers/gridHelper.js";
import LayerHelper from "./accessHelpers/layerHelper.js";
import MilestoneHelper from "./accessHelpers/milestoneHelper.js";
import ParticleHelper from "./accessHelpers/particleHelper.js";
import PopupHelper from "./accessHelpers/popupHelper.js";
import TabHelper from "./accessHelpers/tabHelper.js";
import UpgradeHelper from "./accessHelpers/upgradeHelper.js";

export default class AccessHelper {
    static Achievement = AchievementHelper;
    static Bar = BarHelper;
    static Buyable = BuyableHelper;
    static Challenge = ChallengeHelper;
    static Clickable = ClickableHelper;
    static Grid = GridHelper;
    static Layer = LayerHelper;
    static Milestone = MilestoneHelper;
    static Particle = ParticleHelper;
    static Popup = PopupHelper;
    static Tab = TabHelper;
    static Upgrade = UpgradeHelper;

    static softcap(value, cap, power = 0.5) {
        if (value.lte(cap)) return value
        else
            return value.pow(power).times(cap.pow(decimalOne.sub(power)))
    }

    static canAffordPurchase(layer, thing, cost) {
        if (thing.currencyInternalName) {
            let name = thing.currencyInternalName
            if (thing.currencyLocation) {
                return !(thing.currencyLocation[name].lt(cost))
            }
            else if (thing.currencyLayer) {
                let lr = thing.currencyLayer
                return !(player[lr][name].lt(cost))
            }
            else {
                return !(player[name].lt(cost))
            }
        }
        else {
            return !(player[layer].points.lt(cost))
        }
    }

    static onFocused = false;

    static layOver(obj1, obj2) {
        for (let x in obj2) {
            if (obj2[x] instanceof Decimal) obj1[x] = new Decimal(obj2[x])
            else if (obj2[x] instanceof Object) layOver(obj1[x], obj2[x]);
            else obj1[x] = obj2[x];
        }
    }

    static keepGoing() {
        player.keepGoing = true;
        needCanvasUpdate = true;
    }

    static addTime(diff, layer) {
        let data = player
        let time = data.timePlayed
        if (layer) {
            data = data[layer]
            time = data.time
        }

        if (time + 0 !== time) {
            console.log("Memory leak detected. Trying to fix...")
            time = toNumber(time)
            if (isNaN(time) || time == 0) {
                console.log("Couldn't fix! Resetting...")
                time = layer ? player.timePlayed : 0
                if (!layer) player.timePlayedReset = true
            }
        }
        time += toNumber(diff)

        if (layer) data.time = time
        else data.timePlayed = time
    }

    static focused(x) {
        this.onFocused = x;
    }

    static run(func, target, args = null) {
        if (isFunction(func)) {
            let bound = func.bind(target)
            return bound(args)
        }
        else
            return func;
    }

    static gridRun(layer, func, data, id) {
        if (isFunction(layers[layer].grid[func])) {
            let bound = layers[layer].grid[func].bind(layers[layer].grid)
            return bound(data, id)
        }
        else
            return layers[layer].grid[func];
    }

    static updateWidth() {
        let screenWidth = window.innerWidth;
        let splitScreen = screenWidth >= 1024;

        if (options.forceOneTab) splitScreen = false;
        if (player.navTab === "none") splitScreen = true;

        temp.other.screenWidth = screenWidth;
        temp.other.screenHeight = window.innerHeight;
    
        temp.other.splitScreen = splitScreen;
        temp.other.lastPoints = player.points;
    }
}