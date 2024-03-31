import { DecimalSource } from "../../../js/utils/break_eternity";

export type TempAchievement = {
    effect?: DecimalSource,
};

export type AchievementOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Achievement = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};