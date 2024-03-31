export type MilestoneOptions = {
    unlocked?: (() => boolean) | boolean,
};

export type Milestone = {
    layer: string,
    id: string,
    unlocked?: (() => boolean) | boolean,
};