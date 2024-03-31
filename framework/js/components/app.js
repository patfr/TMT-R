import { frameworkConfig } from "../core/framework.js";
import { setupTicking } from "../core/game.js";
import { ctrlDown, mouseX, mouseY, shiftDown } from "../core/input.js";
import { LAYERS, OTHER_LAYERS, hotkeys } from "../core/layerSupport.js";
import { options } from "../core/options.js";
import { load, setupSaving } from "../core/save.js";
import { setupTemp } from "../core/tempSupport.js";
import { getTheme } from "../core/themes.js";
import AccessHelper from "../utils/accessHelper.js";
import { layoutConfig, modConfig } from "../utils/config-utils.js";
import Decimal from "./../utils/break_eternity.js";
import { contentComponents } from "./contentComponents.js";
import { customComponents } from "./customComponents.js";
import { frameworkComponents } from "./frameworkComponents.js";

// @ts-ignore
Object.entries(frameworkComponents).forEach(component => Vue.component(component[0], component[1]));

// @ts-ignore
Object.entries(contentComponents).forEach(component => Vue.component(component[0], component[1]));

// @ts-ignore
Object.entries(customComponents).forEach(component => Vue.component(component[0], component[1]));

//load();

setupTicking();

setupTemp();

setupSaving();

// @ts-ignore
export const app = new Vue({
    el: "#app",
    data: {
        options,
        Decimal,
        getTheme,
        LAYERS,
        OTHER_LAYERS,
        hotkeys,
        mouseX,
        mouseY,
        shiftDown,
        ctrlDown,
        modConfig,
        layoutConfig,
        frameworkConfig,
        AccessHelper,
    },
});
