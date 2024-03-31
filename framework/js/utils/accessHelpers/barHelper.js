export default class BarHelper {
    static constructBarStyle(layer, id) {
        let bar = tmp[layer].bars[id]
        let style = {}
        if (bar.progress instanceof Decimal)
            bar.progress = bar.progress.toNumber()
        bar.progress = (1 -Math.min(Math.max(bar.progress, 0), 1)) * 100
    
        style.dims = {'width': bar.width + "px", 'height': bar.height + "px"}
        let dir = bar.direction
        style.fillDims = {'width': (bar.width + 0.5) + "px", 'height': (bar.height + 0.5)  + "px"}
    
        switch(bar.direction) {
            case UP:
                style.fillDims['clip-path'] = 'inset(' + bar.progress + '% 0% 0% 0%)'
                style.fillDims.width = bar.width + 1 + 'px'
                break;
            case DOWN:
                style.fillDims['clip-path'] = 'inset(0% 0% ' + bar.progress + '% 0%)'
                style.fillDims.width = bar.width + 1 + 'px'
    
                break;
            case RIGHT:
                style.fillDims['clip-path'] = 'inset(0% ' + bar.progress + '% 0% 0%)'
                break;
            case LEFT:
                style.fillDims['clip-path'] = 'inset(0% 0% 0% ' + bar.progress + '%)'
                break;
            case DEFAULT:
                style.fillDims['clip-path'] = 'inset(0% 50% 0% 0%)'
        }
    
        if (bar.instant) {
            style.fillDims['transition-duration'] = '0s'
        }
        return style
    }
}