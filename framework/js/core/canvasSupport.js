/**
 * @type {boolean}
 */
export let needsCanvasUpdate = false;

/**
 * @param {boolean} state 
 * @returns {void}
 */
export function stateHasChanged(state = true) {
    needsCanvasUpdate = state;
}

export function tryUpdateCanvas() {
    if (needsCanvasUpdate)
        resizeCanvas();
}