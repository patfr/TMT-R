export type InfoboxOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Infobox = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};