import AccessHelper from "../utils/accessHelper.js";
import Decimal from "../utils/break_eternity.js";
import { modConfig } from "../utils/config-utils.js";
import { layers } from "./layerSupport.js";
import { player } from "./playerSupport.js";

/**
 * @type {import("../../lib/core/temp").Temp}
 */
// @ts-ignore
export let temp = {};

/**
 * @type {string[]}
 */
const boolNames = ["unlocked", "deactivated"]

let funcs = {}

/**
 * @type {string[]}
*/
let doNotCallFunctions = [
    "startData", "onPrestige", "doReset", "update", "automate",
	"buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
	"sellOne", "sellAll", "pay", "actualCostFunction", "actualEffectFunction",
	"effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
	"tabFormat", "content",
	"onComplete", "onPurchase", "onEnter", "onExit", "done",
	"getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay"
];

for (const item of modConfig.doNotCallTheseFunctionsEveryTick ?? [])
	doNotCallFunctions.push(item);

/**
 * @type {string[]}
 */
let traversableClasses = [];

/**
 * @returns {void}
 */
export function setupTemp() {
    // @ts-ignore
	temp = {
		layers: {},
		// @ts-ignore
		other: {},
	};
	funcs = {};

	// @ts-ignore
	window.temp = temp;

	temp.pointGen = Decimal.dZero;
	temp.backgroundStyle = modConfig.backgroundStyle ?? {};
	temp.displayThings = [];
	temp.scrolled = false;
	temp.gameEnded = false;
	
	setupTempData(layers, temp.layers, funcs);
    
	for (const layer in layers){
		temp.layers[layer].resetGain = Decimal.dZero;
		temp.layers[layer].nextAt = Decimal.dZero;
		temp.layers[layer].nextAtDisp = Decimal.dZero;
		temp.layers[layer].canReset = false;
		temp.layers[layer].notify = false;
		temp.layers[layer].prestigeNotify = false;
		temp.layers[layer].trueGlowColor = "";

		setupBuyables(layer);
	}

	temp.other.lastPoints = player.points || Decimal.dZero;
	temp.other.oomps = Decimal.dZero;
	temp.other.splitScreen ??= false;
	temp.other.screenWidth = 0;
	temp.other.screenHeight = 0;

	AccessHelper.updateWidth();
}

/**
 * 
 * @param {*} layerData 
 * @param {*} tempData 
 * @param {*} funcsData 
 */
export function setupTempData(layerData, tempData, funcsData) {
	for (const item in layerData) {
		if (layerData[item] == null)
			tempData[item] = null;
		else if (layerData[item] instanceof Decimal)
			tempData[item] = layerData[item];
		else if (Array.isArray(layerData[item])) {
			tempData[item] = [];
			funcsData[item] = [];

			setupTempData(layerData[item], tempData[item], funcsData[item]);
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object)) {
			tempData[item] = {};
			funcsData[item] = [];

			setupTempData(layerData[item], tempData[item], funcsData[item]);
		}
		else if ((!!layerData[item]) && (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			tempData[item] = new layerData[item].constructor();
			funcsData[item] = new layerData[item].constructor();
		}
		else if (typeof(layerData[item]) === "function" && !doNotCallFunctions.includes(item)){
			funcsData[item] = layerData[item];

			if (boolNames.includes(item))
				tempData[item] = false;
			else
				tempData[item] = Decimal.dZero;
		} else
			tempData[item] = layerData[item];
	}	
}

/**
 * @returns {void}
 */
export function updateTemp() {
	updateTempData(layers, temp, funcs);

	for (const layer in layers) {
		temp.layers[layer].resetGain = AccessHelper.Layer.getResetGain(layer)
		temp.layers[layer].nextAt = AccessHelper.Layer.getNextAt(layer)
		temp.layers[layer].nextAtDisp = AccessHelper.Layer.getNextAt(layer, true)
		temp.layers[layer].canReset = AccessHelper.Layer.canReset(layer)
		temp.layers[layer].trueGlowColor = temp.layers[layer].glowColor
		temp.layers[layer].notify = AccessHelper.Layer.shouldNotify(layer)
		temp.layers[layer].prestigeNotify = AccessHelper.Layer.prestigeNotify(layer)
		temp.layers[layer].passiveGeneration = Decimal.dZero;
	}

	temp.pointGen = (typeof(modConfig.getPointGain) === "function" ? modConfig.getPointGain() : modConfig.getPointGain) ?? Decimal.dZero;
	temp.backgroundStyle = modConfig.backgroundStyle ?? {};

	temp.displayThings = [];

	for (const thing in modConfig.displayThings){
		let text = modConfig.displayThings[thing];

		if (typeof(text) === "function") text = text();

		temp.displayThings.push(text);
	}
}

/**
 * 
 * @param {*} layerData 
 * @param {*} tempData 
 * @param {*} funcsData 
 * @param {*} useThis 
 */
function updateTempData(layerData, tempData, funcsData, useThis = undefined) {
	for (const item in funcsData){
		if (Array.isArray(layerData[item])) {
			if (item !== "tabFormat" && item !== "content")
				updateTempData(layerData[item], tempData[item], funcsData[item], useThis);
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object) || (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name))
			updateTempData(layerData[item], tempData[item], funcsData[item], useThis);
		else if (typeof(layerData[item]) === "function" && !(typeof(tempData[item]) === "function")) {
			let value;

			if (useThis !== undefined) value = layerData[item].bind(useThis)();
			else value = layerData[item]();

            // @ts-ignore
			Vue.set(tempData, item, value)
		}
	}	
}

function updateChallengeTemp(layer)
{
	updateTempData(layers[layer].challenges, temp[layer].challenges, funcs[layer].challenges)
}


function updateBuyableTemp(layer)
{
	updateTempData(layers[layer].buyables, temp[layer].buyables, funcs[layer].buyables)
}

function updateClickableTemp(layer)
{
	updateTempData(layers[layer].clickables, temp[layer].clickables, funcs[layer].clickables)
}

function setupBuyables(layer) {
	for (id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) {
			let b = layers[layer].buyables[id]
			b.actualCostFunction = b.cost
			b.cost = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualCostFunction(x)
			}
			b.actualEffectFunction = b.effect
			b.effect = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualEffectFunction(x)
			}
		}
	}
}