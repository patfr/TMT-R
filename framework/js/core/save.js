import { layoutConfig, modConfig } from "../utils/config-utils.js";
import { NaNalert, NaNcheck } from "./nan.js";
import { options } from "./options.js";
import { player } from "./playerSupport.js";
import { temp } from "./tempSupport.js";

/**
 * @type {number}
 */
export let saveId = -1;

/**
 * @param {boolean} force 
 * @returns {void}
 */
export function save(force = false) {
	NaNcheck("player", player);
    
	if (NaNalert && !force) return;

	localStorage.setItem(modConfig.info.id, btoa(encodeURIComponent(JSON.stringify(player))));
	localStorage.setItem(modConfig.info.id + "_options", btoa(encodeURIComponent(JSON.stringify(options))));
}

/**
 * @returns {void}
 */
export function load() {
	let get = localStorage.getItem(modConfig.info.id);

	if (!get) {
        setStartPlayerData();
        setStartOptionData();
	}
	else {
        setPlayerData(Object.assign(getStartPlayerData(), JSON.parse(decodeURIComponent(atob(get)))));
		fixSave();
		loadOptions();
	}

	if (options.offlineProd) {
		if (!player.offTime)
			player.offTime = 0;

		player.offTime += (Date.now() - player.time) / 1000;
	}

	player.time = Date.now();

	versionCheck();
	changeTheme();
	changeTreeQuality();
	updateLayers();
	setupModInfo();

	setupTemp();
	updateTemp();
	updateTemp();
	updateTabFormats()
	loadVue();
}

/**
 * @returns {void}
 */
function loadOptions() {
	let get = localStorage.getItem(modConfig.info.id + "_options");

	if (get)
        setOptionData(Object.assign(getStartOptionData(), JSON.parse(decodeURIComponent(atob(get)))));
	else 
        setStartOptionData();

	if (themes.indexOf(options.theme) < 0) 
        setTheme("default");

	fixData(options, getStartOptionData());
}

/**
 * @returns {void}
 */
export function saveData() {
    if (player === undefined)
		return;

	if (temp.gameEnded && !player.keepGoing)
		return;

	if (options.autosave)
		save();
}

/**
 * @param {number} time
 * @returns {void}
 */
export function setupSaving(time = 5000) {
    if (saveId !== -1)
        clearInterval(saveId);

    saveId = setInterval(saveData, time);

    window.onbeforeunload = () => {
        if (!NaNalert)
            save();
    };
}

function startPlayerBase() {
	return {
		tab: layoutConfig.startTab,
		navTab: (layoutConfig.showTree ? layoutConfig.startNavTab : "none"),
		time: Date.now(),
		notify: {},
		versionType: modConfig.info.id,
		version: modConfig.info.name,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,

		points: modConfig.initialStartPoints,
		subtabs: {},
		lastSafeTab: (readData(layoutConfig.showTree) ? "none" : layoutConfig.startTab)
	};
}

function getStartPlayer() {
	playerdata = startPlayerBase();

	if (addedPlayerData) {
		extradata = addedPlayerData();
		for (thing in extradata)
			playerdata[thing] = extradata[thing];
	}

	playerdata.infoboxes = {};
	for (layer in layers) {
		playerdata[layer] = getStartLayerData(layer);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerdata.subtabs[layer] = {};
			playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			if (playerdata.subtabs[layer] == undefined)
				playerdata.subtabs[layer] = {};
			for (item in layers[layer].microtabs)
				playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
		if (layers[layer].infoboxes) {
			if (playerdata.infoboxes[layer] == undefined)
				playerdata.infoboxes[layer] = {};
			for (item in layers[layer].infoboxes)
				playerdata.infoboxes[layer][item] = false;
		}

	}
	return playerdata;
}
function getStartLayerData(layer) {
	layerdata = {};
	if (layers[layer].startData)
		layerdata = layers[layer].startData();

	if (layerdata.unlocked === undefined)
		layerdata.unlocked = true;
	if (layerdata.total === undefined)
		layerdata.total = decimalZero;
	if (layerdata.best === undefined)
		layerdata.best = decimalZero;
	if (layerdata.resetTime === undefined)
		layerdata.resetTime = 0;
	if (layerdata.forceTooltip === undefined)
		layerdata.forceTooltip = false;

	layerdata.buyables = getStartBuyables(layer);
	if (layerdata.noRespecConfirm === undefined) layerdata.noRespecConfirm = false
	if (layerdata.clickables == undefined)
		layerdata.clickables = getStartClickables(layer);
	layerdata.spentOnBuyables = decimalZero;
	layerdata.upgrades = [];
	layerdata.milestones = [];
	layerdata.lastMilestone = null;
	layerdata.achievements = [];
	layerdata.challenges = getStartChallenges(layer);
	layerdata.grid = getStartGrid(layer);
	layerdata.prevTab = ""

	return layerdata;
}
function getStartBuyables(layer) {
	let data = {};
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (isPlainObject(layers[layer].buyables[id]))
				data[id] = decimalZero;
	}
	return data;
}
function getStartClickables(layer) {
	let data = {};
	if (layers[layer].clickables) {
		for (id in layers[layer].clickables)
			if (isPlainObject(layers[layer].clickables[id]))
				data[id] = "";
	}
	return data;
}
function getStartChallenges(layer) {
	let data = {};
	if (layers[layer].challenges) {
		for (id in layers[layer].challenges)
			if (isPlainObject(layers[layer].challenges[id]))
				data[id] = 0;
	}
	return data;
}
function getStartGrid(layer) {
	let data = {};
	if (! layers[layer].grid) return data
	if (layers[layer].grid.maxRows === undefined) layers[layer].grid.maxRows=layers[layer].grid.rows
	if (layers[layer].grid.maxCols === undefined) layers[layer].grid.maxCols=layers[layer].grid.cols

	for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
		for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
			data[100*y + x] = layers[layer].grid.getStartData(100*y + x)
		}
	}
	return data;
}

function fixSave() {
	defaultData = getStartPlayer();
	fixData(defaultData, player);

	for (layer in layers) {
		if (player[layer].best !== undefined)
			player[layer].best = new Decimal(player[layer].best);
		if (player[layer].total !== undefined)
			player[layer].total = new Decimal(player[layer].total);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {

			if (!Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs))
				player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			for (item in layers[layer].microtabs)
				if (!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item]))
					player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
	}
}
function fixData(defaultData, newData) {
	for (item in defaultData) {
		if (defaultData[item] == null) {
			if (newData[item] === undefined)
				newData[item] = null;
		}
		else if (Array.isArray(defaultData[item])) {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else
				newData[item] = new Decimal(newData[item]);
		}
		else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
			if (newData[item] === undefined || (typeof defaultData[item] !== "object"))
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];
		}
	}
}

function exportSave() {
	//if (NaNalert) return
	let str = btoa(JSON.stringify(player));

	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}
function importSave(imported = undefined, forced = false) {
	if (imported === undefined)
		imported = prompt("Paste your save here");
	try {
		tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)));
		if (tempPlr.versionType != modInfo.id && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?")) // Wrong save (use "Forced" to force it to accept.)
			return;
		player = tempPlr;
		player.versionType = modInfo.id;
		fixSave();
		versionCheck();
		NaNcheck(save)
		save();
		window.location.reload();
	} catch (e) {
		return;
	}
}
function versionCheck() {
	let setVersion = true;

	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = modInfo.id;
		player.version = 0;
	}

	if (setVersion) {
		if (player.versionType == modInfo.id && VERSION.num > player.version) {
			player.keepGoing = false;
			if (fixOldSave)
				fixOldSave(player.version);
		}
		player.versionType = getStartPlayer().versionType;
		player.version = VERSION.num;
		player.beta = VERSION.beta;
	}
}