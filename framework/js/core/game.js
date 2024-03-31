import AccessHelper from "../utils/accessHelper.js"
import Decimal from "../utils/break_eternity.js"
import { modConfig } from "../utils/config-utils.js"
import { stateHasChanged, tryUpdateCanvas } from "./canvasSupport.js"
import { OTHER_LAYERS, TREE_LAYERS, layers, maxRow } from "./layerSupport.js"
import { options } from "./options.js"
import { player } from "./playerSupport.js"
import { temp, updateTemp } from "./tempSupport.js"

/**
 * @type {boolean}
 */
export let ticking = false;

/**
 * @type {number}
 */
export let tickId = -1;

/**
 * @param {number} time 
 * @returns {void}
 */
export function setupTicking(time = 50) {
	if (tickId !== -1)
    	clearInterval(tickId);

    ticking = false;

    tickId = setInterval(tick, time);
}

/**
 * 
 * @param {string} layerId 
 * @param {import("../utils/break_eternity").DecimalSource} gain 
 */
function addPoints(layerId, gain) {
    const layer = player.layers[layerId];

	layer.points = Decimal.add(layer.points, gain).max(0);
    
	if (layer.best) layer.best = Decimal.max(layer.best, layer.points);
	if (layer.total) layer.total = Decimal.add(layer.total, gain);
}

/**
 * 
 * @param {string} layer 
 * @param {import("../utils/break_eternity").DecimalSource} diff 
 */
function generatePoints(layer, diff) {
	addPoints(layer, Decimal.mul(temp.layers[layer].resetGain, diff));
}

/**
 * 
 * @param {number} diff 
 */
function gameLoop(diff) {
    const ended = typeof(modConfig.isEndgame) === "function" ? modConfig.isEndgame() : modConfig.isEndgame;

	if (ended || temp.gameEnded) {
		temp.gameEnded = true;

		clearParticles();
	}

	if (isNaN(diff) || diff < 0) diff = 0;

	if (temp.gameEnded && !player.keepGoing) {
		diff = 0;

		clearParticles();
	}

	if (modConfig.maxTickLength) {
		const limit = typeof(modConfig.maxTickLength) === "function" ? modConfig.maxTickLength() : modConfig.maxTickLength;

		if(diff > limit)
			diff = limit;
	}

	AccessHelper.addTime(diff);

	player.points = Decimal.add(player.points, Decimal.mul(temp.pointGen, diff)).max(0);

	for (let x = 0; x <= maxRow; x++) {
		for (const item in TREE_LAYERS[x]) {
			const layer = TREE_LAYERS[x][item];

			player.layers[layer].resetTime = Decimal.add(player.layers[layer].resetTime, diff);

			if (temp.layers[layer].passiveGeneration) generatePoints(layer, Decimal.mul(temp.layers[layer].passiveGeneration, diff));

            // @ts-ignore
			if (layers[layer].update) layers[layer].update(diff);
		}
	}

	for (let row in OTHER_LAYERS){
		for (const item in OTHER_LAYERS[row]) {
			const layer = OTHER_LAYERS[row][item];

			player.layers[layer].resetTime = Decimal.add(player.layers[layer].resetTime, diff);

			if (temp.layers[layer].passiveGeneration) generatePoints(layer, Decimal.mul(temp.layers[layer].passiveGeneration, diff));

            // @ts-ignore
			if (layers[layer].update) layers[layer].update(diff);
		}
	}	

	for (let x = maxRow; x >= 0; x--){
		for (const item in TREE_LAYERS[x]) {
			const layer = TREE_LAYERS[x][item];

			if (temp.layers[layer].autoReset && temp.layers[layer].canReset) AccessHelper.Layer.doReset(layer);
			if (temp.layers[layer].autoUpgrade) autobuyUpgrades(layer);

            // @ts-ignore
			if (layers[layer].automate) layers[layer].automate();
		}
	}

	for (const row in OTHER_LAYERS){
		for (const item in OTHER_LAYERS[row]) {
			const layer = OTHER_LAYERS[row][item];

			if (temp.layers[layer].autoReset && temp.layers[layer].canReset) doReset(layer);
			if (temp.layers[layer].autoUpgrade) autobuyUpgrades(layer);

            // @ts-ignore
			if (layers[layer].automate) layers[layer].automate();
            
            if (player.layers[layer].best)
                // @ts-ignore
                player.layers[layer].best = Decimal.max(player.layers[layer].best, player.layers[layer].points);
		}
	}

	for (const layer in layers){
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer);
	}

}

/**
 * 
 * @param {boolean} resetOptions 
 * @returns {void}
 */
function hardReset(resetOptions = false) {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return;

	// @ts-ignore
	player = null;

	if(resetOptions) options = null;

	save(true);

	window.location.reload();
}

function tick() {
	if (ticking) return;
	if (temp.gameEnded && !player.keepGoing) return;

	ticking = true;

	let now = Date.now();
	let diff = (now - player.time) / 1e3;
	let trueDiff = diff;

	if (!options.offlineProd || player.offTime <= 0) 
		player.offTime = 0;
    
	if (player.offTime > (modConfig.info.offlineLimit ?? 0) * 3600) 
		player.offTime = (modConfig.info.offlineLimit ?? 0) * 3600;

	if (player.offTime > 0) {
		let offlineDiff = Math.max(player.offTime / 10, diff);

		player.offTime -= offlineDiff;
		diff += offlineDiff;
	}

	if (player.devSpeed) 
		diff *= player.devSpeed;

	player.time = now;

	tryUpdateCanvas();

	const treeTab = document.getElementById('treeTab');

	temp.scrolled = treeTab ? treeTab.scrollTop > 30 : false;

	updateTemp();
	updateOomps(diff);
	updateWidth();
	updateTabFormats();
	gameLoop(diff);
	fixNaNs();
	adjustPopupTime(trueDiff);
	updateParticles(trueDiff);

	ticking = false;
}

setInterval(stateHasChanged, 500);