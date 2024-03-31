import { DecimalSource } from "../../../js/utils/break_eternity";

export type TempBuyable = {
    canAfford: boolean,
    purchaseLimit: DecimalSource,
    effect: DecimalSource,
    unlocked: boolean,
};

export type BuyableOptions = {
    canBuy?: (() => boolean) | boolean,
    purchaseLimit?: (() => DecimalSource) | DecimalSource,
    unlocked?: (() => boolean) | boolean,
};

export type Buyable = {
    layer: string,
    id: string,
    canBuy?: (() => boolean) | boolean,
    purchaseLimit?: (() => DecimalSource) | DecimalSource,
    unlocked?: (() => boolean) | boolean,
};