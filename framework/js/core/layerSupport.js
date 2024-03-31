import Decimal from "../../js/utils/break_eternity.js";
import AccessHelper from "../utils/accessHelper.js";
import { modConfig } from "../utils/config-utils.js";

/**
 * @type {{[key: string]: import("../../lib/core/layer").LayerOptions}}
 */
export const layersInternal = {};

/**
 * @type {{[key: string]: import("../../lib/core/layer").Layer}}
 */
export const layers = {};

/**
 * @type {string}
 */
export const defaultGlow = "#ff0000";

/**
 * @type {string[]}
 */
export let LAYERS = Object.keys(layers);

/**
 * @type {{[key: number]: {[key: string]: string}, OTHERSIDE: {[key: string]: string}, SIDE: {[key: string]: string}, UNDEFINED: {[key: string]: string}}}
 */
export let ROW_LAYERS = {
    OTHERSIDE: {},
    SIDE: {},
    UNDEFINED: {},
};

/**
 * @type {{[key: number]: string[], OTHERSIDE: string[], SIDE: string[], UNDEFINED: string[]}}
 */
export let TREE_LAYERS = {
    OTHERSIDE: [],
    SIDE: [],
    UNDEFINED: [],
};

/**
 * @type {{[key: number]: string[], OTHERSIDE: string[], SIDE: string[], UNDEFINED: string[]}}
 */
export let OTHER_LAYERS = {
    OTHERSIDE: [],
    SIDE: [],
    UNDEFINED: [],
};

/**
 * @type {{[key: string]: import("../../lib/core/layerFeatures/hotkey").Hotkey}}
 */
export let hotkeys = {};

/**
 * @type {number}
 */
export let maxRow = 0;

/**
 * @returns {void}
 */
export function updateHotkeys()
{
    hotkeys = {};

    for (const layer in layers) {
        const keys = layersInternal[layer].hotkeys;

        if (!keys)
            continue;

        for (const hotkey of keys)
            hotkeys[hotkey.key] = {
                ...hotkey,
                layer: layer,
                unlocked: hotkey.unlocked ?? true,
            };
    }
}

/**
 * @returns {void}
 */
export function updateLayers() {
    LAYERS = Object.keys(layers);
    ROW_LAYERS = {OTHERSIDE:{},SIDE:{},UNDEFINED:{}};
    OTHER_LAYERS = {OTHERSIDE:[],SIDE:[],UNDEFINED:[]};
    TREE_LAYERS = {OTHERSIDE:[],SIDE:[],UNDEFINED:[]};

    for (const layer in layers)
        setupLayer(layer);
    
    Object.values(OTHER_LAYERS).forEach(row => row.sort((a, b) => (layers[a].position ?? 0) > (layers[b].position ?? 0) ? 1 : -1));
    Object.values(TREE_LAYERS).forEach(row => row.sort((a, b) => (layers[a].position ?? 0) > (layers[b].position ?? 0) ? 1 : -1));

    updateHotkeys();
}

/**
 * @param {string} layerId
 * @returns {void}
 */
export function setupLayer(layerId){
    const layer = layers[layerId];
    const layerInternal = layersInternal[layerId];

    layer.layer = layerId;

    if (layerInternal.upgrades) {
        setRowCol(layerInternal.upgrades);
        
        Object.entries(layerInternal.upgrades).forEach(upgrade => {
            layer.upgrades ??= {};

            layer.upgrades[upgrade[0]].id = upgrade[0];
            layer.upgrades[upgrade[0]].layer = layerId;
            layer.upgrades[upgrade[0]].unlocked ??= true;
        });
    }

    if (layerInternal.milestones)
        Object.entries(layerInternal.milestones).forEach(milestone => {
            layer.milestones ??= {};

            layer.milestones[milestone[0]].id = milestone[0];
            layer.milestones[milestone[0]].layer = layerId;
            layer.milestones[milestone[0]].unlocked ??= true;
        });

    if (layerInternal.achievements) {
        setRowCol(layerInternal.achievements);

        Object.entries(layerInternal.achievements).forEach(achievement => {
            layer.achievements ??= {};

            layer.achievements[achievement[0]].id = achievement[0];
            layer.achievements[achievement[0]].layer = layerId;
            layer.achievements[achievement[0]].unlocked ??= true;
        });
    }

    if (layerInternal.challenges) {
        setRowCol(layerInternal.challenges);

        Object.entries(layerInternal.challenges).forEach(challenge => {
            layer.challenges ??= {};

            layer.challenges[challenge[0]].id = challenge[0];
            layer.challenges[challenge[0]].layer = layerId;
            layer.challenges[challenge[0]].unlocked ??= true;
            layer.challenges[challenge[0]].completetionLimit ??= 1;
            layer.challenges[challenge[0]].marked ??= () => AccessHelper.Challenge.isMaxed(layerId, challenge[0]);
        });
    }

    if (layerInternal.buyables) {
        setRowCol(layerInternal.buyables);

        Object.entries(layerInternal.buyables).forEach(buyable => {
            layer.buyables ??= {};

            layer.buyables[buyable[0]].id = buyable[0];
            layer.buyables[buyable[0]].layer = layerId;
            layer.buyables[buyable[0]].unlocked ??= true;
            layer.buyables[buyable[0]].canBuy ??= () => AccessHelper.Buyable.canBuy(layerId, buyable[0]);
            layer.buyables[buyable[0]].purchaseLimit ??= Decimal.dInf;
        });
    }

    if (layerInternal.clickables) {
        setRowCol(layerInternal.clickables);

        Object.entries(layerInternal.clickables).forEach(clickable => {
            layer.clickables ??= {};

            layer.clickables[clickable[0]].id = clickable[0];
            layer.clickables[clickable[0]].layer = layerId;
            layer.clickables[clickable[0]].unlocked ??= true;
        });  
    }

    if (layerInternal.bars) {
        Object.entries(layerInternal.bars).forEach(bar => {
            layer.bars ??= {};

            layer.bars[bar[0]].id = bar[0];
            layer.bars[bar[0]].layer = layerId;
            layer.bars[bar[0]].unlocked ??= true;
        }); 
    }

    if (layerInternal.infoboxes) {
        Object.entries(layerInternal.infoboxes).forEach(infobox => {
            layer.infoboxes ??= {};

            layer.infoboxes[infobox[0]].id = infobox[0];
            layer.infoboxes[infobox[0]].layer = layerId;
            layer.infoboxes[infobox[0]].unlocked ??= true;
        });
    }
    
    if (layerInternal.grids)
        Object.entries(layerInternal.grids).forEach(grid => {
            layer.grids ??= {};

            layer.grids[grid[0]].id = grid[0];
            layer.grids[grid[0]].layer = layerId;
            layer.grids[grid[0]].unlocked ??= true;
            layer.grids[grid[0]].isUnlocked ??= true;
            layer.grids[grid[0]].canClick ??= true;
        });
    
    if (layerInternal.startData) {
        const data = typeof(layerInternal.startData) === "function" ? layerInternal.startData() : layerInternal.startData;

        if (data.best !== undefined && data.showBest === undefined) layer.showBest = true;
        if (data.total !== undefined && data.showTotal === undefined) layer.showTotal = true;
    }

    layer.symbol ??= layerId.charAt(0).toUpperCase() + layerId.slice(1);
    layer.unlockOrder ??= [];
    layer.gainMultiplier ??= Decimal.dOne;
    layer.gainExponent ??= Decimal.dOne;
    layer.directMultiplier ??= Decimal.dOne;
    layer.type ??= "NONE";
    layer.base ??= Decimal.dTwo;
    layer.displayRow ??= layer.row;
    layer.name ??= layerId.charAt(0).toUpperCase() + layerId.slice(1);
    layer.layerShown ??= true;
    layer.glowColor ??= defaultGlow;

    let row = layer.row;
    let displayRow = layer.displayRow;

    if(!ROW_LAYERS[row]) ROW_LAYERS[row] = {};
    if(!TREE_LAYERS[displayRow] && !isNaN(Number(displayRow))) TREE_LAYERS[displayRow] = [];
    if(!OTHER_LAYERS[displayRow] && isNaN(Number(displayRow))) OTHER_LAYERS[displayRow] = [];

    ROW_LAYERS[row][layerId] = layerId;
    
    if (!isNaN(Number(displayRow)) || Number(displayRow) < 0) TREE_LAYERS[displayRow].push(layerId)
    else OTHER_LAYERS[displayRow].push(layerId);

    if (maxRow < Number(layer.displayRow)) maxRow = Number(layer.displayRow);
}

/**
 * 
 * @param {string} layerId 
 * @param {import("../../lib/core/layer").LayerOptions} layerData 
 */
function addLayer(layerId, layerData) {
    // @ts-ignore
    layers[layerId] = layerData;
    layersInternal[layerId] = layerData;
    layers[layerId].isLayer = true;
}

/**
 * 
 * @param {string} layerId 
 * @param {import("../../lib/core/layer").LayerOptions} layerData 
 */
function addNode(layerId, layerData) {
    // @ts-ignore
    layers[layerId] = layerData;
    layersInternal[layerId] = layerData;
    layers[layerId].isLayer = false;
}

/**
 * @param {any} component
 * @returns {void}
 */
function setRowCol(component) {
    if (component.rows && component.cols) 
        return;

    let maxRow = 0;
    let maxCol = 0;

    for (const key in component) {
        const id = Number(key);

        if (!isNaN(id)) {
            if (Math.floor(id / 10) > maxRow) maxRow = Math.floor(id / 10);
            if (id %10 > maxCol) maxCol = id % 10;
        }
    }

    component.rows = maxRow
    component.cols = maxCol
}

addLayer("info-tab", {
    tabFormat: ["info-tab"],
    row: "OTHERSIDE",
});

addLayer("options-tab", {
    tabFormat: ["options-tab"],
    row: "OTHERSIDE",
});

addLayer("changelog-tab", {
    tabFormat() {return ([["raw-html", modConfig.changelog]])},
    row: "OTHERSIDE",
});