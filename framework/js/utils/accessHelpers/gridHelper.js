export default class GridHelper {
    static clickGrid(layer, id) {
        if (!player[layer].unlocked  || tmp[layer].deactivated) return
        if (!run(layers[layer].grid.getUnlocked, layers[layer].grid, id)) return
        if (!gridRun(layer, 'getCanClick', player[layer].grid[id], id)) return
    
        gridRun(layer, 'onClick', player[layer].grid[id], id)
    }
}