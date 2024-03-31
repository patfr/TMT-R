import { DecimalSource } from "../../js/utils/break_eternity";

export type ChangelogEntryType = 'ADDED' | 'CHANGED' | 'REMOVED' | 'FIXED' | 'OTHER';

export type ChangelogEntry = {
    type: ChangelogEntryType,
    description: string,
}[];

export type Changelog = { [key: string]: ChangelogEntry };

export type ModConfig = {
    info: {
        name: string,
        id: string,
        author: string,
        version: {
            number: string | number,
            name: string,
        }
        
        initialStartPoints?: number,
        offlineLimit?: 0,
        pointsName?: string,
        winMessage?: string,
        extraFiles?: string[],
        discord?: {
            discordName: string,
            discordLink: string,
        }
    },
    changelog: Changelog,
    isEndgame: (() => boolean) | boolean,
    extraPlayerData?: () => object,
    canGainPoints?: (() => boolean) | boolean,
    getPointGain?: (() => DecimalSource) | DecimalSource,
    fixOldSave?: (oldVersion: string | number) => void,
    getStartPoints?: (() => number) | number,
    maxTickLength?: (() => number) | number,
    doNotCallTheseFunctionsEveryTick?: string[],
    backgroundStyle?: { [key: string]: string },
    displayThings?: any,
    [key: string | number | symbol]: any,
};

export type LayoutConfig = {
    startTab: "NONE" | string,
    startNavTab: "TREE-TAB" | string,
	showTree: (() => boolean) | boolean,
    treeLayout: string,
};