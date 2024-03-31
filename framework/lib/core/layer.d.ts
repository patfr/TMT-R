import Decimal, { DecimalSource } from "../../js/utils/break_eternity";
import { Achievement, AchievementOptions, TempAchievement } from "./layerFeatures/achievements";
import { Bar, BarOptions } from "./layerFeatures/bars";
import { Buyable, BuyableOptions, TempBuyable } from "./layerFeatures/buyables";
import { Challenge, ChallengeOptions, TempChallenge } from "./layerFeatures/challenges";
import { Clickable, ClickableOptions } from "./layerFeatures/clickables";
import { Grid, GridOptions } from "./layerFeatures/grid";
import { HotkeyOptions } from "./layerFeatures/hotkey";
import { Infobox, InfoboxOptions } from "./layerFeatures/infoboxes";
import { Milestone, MilestoneOptions } from "./layerFeatures/milestone";
import { Upgrade, UpgradeOptions } from "./layerFeatures/upgrade";

export type LayerType = "NORMAL" | "STATIC" | "CUSTOM" | "NONE";
export type LayerRow = "SIDE" | "OTHERSIDE" | number;

export type TempLayer = {
    type: LayerType,
    resetGain: DecimalSource,
    nextAt: DecimalSource,
    nextAtDisp: DecimalSource,
    passiveGeneration: DecimalSource,
    autoReset: boolean,
    autoUpgrade: boolean,
    canReset: boolean,
    notify: boolean,
    prestigeNotify: boolean,
    trueGlowColor: string,
    glowColor: string,
    backgroundStyle: {[key: string]: string},
    deactivated: boolean,
    achievements?: {[key: string]: TempAchievement},
    buyables?: {[key: string]: TempBuyable},
    challenges?: {[key: string]: TempChallenge},
};

export type PlayerLayer = {
    points: DecimalSource,
    total?: DecimalSource,
    best?: DecimalSource,
    resetTime: DecimalSource,
    unlocked: boolean,
    activeChallenge?: string,
    achievements?: {[key: string]: boolean},
    buyables?: {[key: string]: DecimalSource},
    challenges?: {[key: string]: DecimalSource},
};

export type LayerOptions = {
    row: LayerRow,
    displayRow?: LayerRow,
    symbol?: string,
    name?: string,
    type?: (() => LayerType) | LayerType,
    base?: (() => DecimalSource) | DecimalSource,
    glowColor?: (() => string) | string,
    startData?: (() => object) | object,
    update?: (diff: number) => void,
    automate?: () => void,
    layerShown?: (() => boolean) | boolean,
    gainMultiplier?: (() => DecimalSource) | DecimalSource,
    gainExponent?: (() => DecimalSource) | DecimalSource,
    directMultiplier?: (() => DecimalSource) | DecimalSource,
    upgrades?: {[key: string]: UpgradeOptions},
    milestones?: {[key: string]: MilestoneOptions},
    achievements?: {[key: string]: AchievementOptions},
    challenges?: {[key: string]: ChallengeOptions},
    buyables?: {[key: string]: BuyableOptions},
    clickables?: {[key: string]: ClickableOptions},
    bars?: {[key: string]: BarOptions},
    infoboxes?: {[key: string]: InfoboxOptions},
    grids?: {[key: string]: GridOptions},
    position?: number,
    hotkeys?: HotkeyOptions[],
    tabFormat?: any,
};

export type Layer = {
    layer: string,
    isLayer: boolean,
    row: LayerRow,
    displayRow?: LayerRow,
    symbol?: string,
    name?: string,
    type?: LayerType,
    base?: (() => DecimalSource) | DecimalSource,
    showBest?: boolean,
    showTotal?: boolean,
    unlockOrder?: string[],
    glowColor?: (() => string) | string,
    startData?: (() => object) | object,
    update?: (diff: number) => void,
    automate?: () => void,
    layerShown?: (() => boolean) | boolean,
    gainMultiplier?: (() => DecimalSource) | DecimalSource,
    gainExponent?: (() => DecimalSource) | DecimalSource,
    directMultiplier?: (() => DecimalSource) | DecimalSource,
    upgrades?: {[key: string]: Upgrade},
    milestones?: {[key: string]: Milestone},
    achievements?: {[key: string]: Achievement},
    challenges?: {[key: string]: Challenge},
    buyables?: {[key: string]: Buyable},
    clickables?: {[key: string]: Clickable},
    bars?: {[key: string]: Bar},
    infoboxes?: {[key: string]: Infobox},
    grids?: {[key: string]: Grid},
    position?: number,
    tabFormat?: any,
};