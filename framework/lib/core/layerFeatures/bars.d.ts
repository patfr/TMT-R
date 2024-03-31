export type BarOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Bar = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};