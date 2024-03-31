function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}