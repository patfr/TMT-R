export type VueComponent = {
    template: string,
    props?: string[] | object,
    computed?: {[key: string]: () => any},
    data?: () => object,
    methods?: {[key: string]: () => any | void}
}