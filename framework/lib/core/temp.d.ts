import { DecimalSource } from "../../js/utils/break_eternity";
import { TempLayer } from "./layer";

export type Temp = {
	pointGen: DecimalSource,
	backgroundStyle: {[key: string]: string},
	displayThings: any,
	scrolled: boolean,
	gameEnded: boolean,
	layers: {[key: string]: TempLayer},
	other: {
		lastPoints: DecimalSource,
		oomps: DecimalSource,
		splitScreen: boolean,
		screenWidth: number,
		screenHeight: number,
	},
};