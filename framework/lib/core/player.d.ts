import { DecimalSource } from "../../js/utils/break_eternity";
import { PlayerLayer } from "./layer";

export type Player = {
    points: DecimalSource,
    layers: {[key: string]: PlayerLayer},
    keepGoing: boolean,
    time: number,
    offTime: number,
    devSpeed?: number,
};