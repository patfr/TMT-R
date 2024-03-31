import { DecimalSource } from "../../../js/utils/break_eternity";

export type TempChallenge = {
    completetionLimit: DecimalSource,
    unlocked: boolean,
    canComplete: boolean,
    completionsPer: DecimalSource,
    effect?: DecimalSource,
};

export type ChallengeOptions = {
    completetionLimit?: (() => DecimalSource) | DecimalSource,
    marked?: (() => boolean) | boolean,
    unlocked?: (() => boolean) | boolean,
};

export type Challenge = {
    layer: string,
    id: string,
    completetionLimit?: (() => DecimalSource) | DecimalSource,
    marked?: (() => boolean) | boolean,
    unlocked?: (() => boolean) | boolean,
};