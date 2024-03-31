export type GridOptions = {
    isUnlocked?: ((id: string) => boolean) | boolean,
    canClick?: ((data: { interval: boolean, time: number}, id: string) => boolean) | boolean,
    unlocked?: (() => boolean) | boolean,
};

export type Grid = {
    layer: string,
    id: string,
    isUnlocked?: ((id: string) => boolean) | boolean,
    canClick?: ((data: { interval: boolean, time: number}, id: string) => boolean) | boolean,
    unlocked?: (() => boolean) | boolean,
};