export type ClickableOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Clickable = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};