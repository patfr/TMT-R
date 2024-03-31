import AccessHelper from "../utils/accessHelper.js";
import { hotkeys } from "./layerSupport.js";
import { player } from "./playerSupport.js";
import { temp } from "./tempSupport.js";

export let shiftDown = false;
export let ctrlDown = false;
export let mouseX = 0;
export let mouseY = 0;

document.addEventListener("keydown", event => {
	shiftDown = event.shiftKey;
	ctrlDown = event.ctrlKey;

	if (temp.gameEnded && !player.keepGoing) return;

	let key = event.key;

	if (ctrlDown) key = "ctrl+" + key;
	if (AccessHelper.onFocused) return;
	if (ctrlDown && hotkeys[key]) event.preventDefault();
	if (hotkeys[key]) {
		let k = hotkeys[key];

		if (player.layers[k.layer].unlocked && temp.layers[k.layer].hotkeys[k.id].unlocked)
			k.onPress()
	}
});

document.addEventListener("keyup", event => {
	shiftDown = event.shiftKey;
	ctrlDown = event.ctrlKey;
});

document.body.addEventListener("mousemove", event => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});