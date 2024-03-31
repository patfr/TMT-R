export type UpgradeOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Upgrade = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};