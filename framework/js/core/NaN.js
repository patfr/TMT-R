import Decimal from "../utils/break_eternity.js";
import { tickId } from "./game.js";

/**
 * @type {boolean}
 */
export let NaNalert = false;

/**
 * @param {string} object
 * @param {*} data 
 * @returns {void}
 */
export function NaNcheck(object, data) {
	NaNcheckInternal(object, data, data);
}

/**
 * 
 * @param {import("../utils/break_eternity.js").DecimalSource} n
 * @returns {boolean}
 */
export function checkDecimalNaN(n) {
	return Decimal.eq(n, n);
}

/**
 * @param {string} object
 * @param {*} original 
 * @param {*} data 
 * @returns {void}
 */
function NaNcheckInternal(object, original, data) {
    for (const key in data) {
        const item = data[key];

		if (Array.isArray(item))
            NaNcheckInternal(`${object}.${key}`, original, item);
		else if (item !== item || checkDecimalNaN(item)) {
			if (!NaNalert) {
				clearInterval(tickId);

				NaNalert = true;

				alert(`Invalid value was found at ${object}.${key}, please let the creator of this mod know and show them the console! You can refresh the page, and you will be un-NaNed.`);

                console.error(`NaN was detected at ${object}.${key} in `, original);

				return;
			}
		}
		else if ((!!item) && (item.constructor === Object))
			NaNcheckInternal(`${object}.${key}`, original, item);
	}
}