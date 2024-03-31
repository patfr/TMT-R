export type HotkeyOptions = {
    key: string,
    description: string,
    onPress: (() => void) | (() => boolean),
    unlocked?: (() => boolean) | boolean,
};

export type Hotkey = HotkeyOptions & {
    layer: string,
};