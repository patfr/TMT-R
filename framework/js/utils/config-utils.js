/**
 * @type {import("../../lib/utils/config").ModConfig}
 */
export let modConfig;

/**
 * @type {import("../../lib/utils/config").LayoutConfig}
 */
export let layoutConfig;

/**
 * @param {import("../../lib/utils/config").ModConfig} config
 * @description Sets the config for the TMT-R Mod
 */
export function setModConfig(config) { modConfig = config; }

/**
 * 
 * @param {import("../../lib/utils/config").LayoutConfig} config 
 */
export function setLayoutConfig(config) { layoutConfig = config; }