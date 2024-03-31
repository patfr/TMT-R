let modInfo = {
	name: "The Tree of Evolution",
	id: "TheTreeOfEvolution",
	author: "patfr",
	pointsName: "Evolution Points",
	modFiles: ["layers/layerUtils.js", "layers/beginning.js", "layers/dna.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0),
	offlineLimit: 0,
}

let VERSION = {
	num: "0.1.0",
	name: "Pre-DNA",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><br><h3 style='color:green'>v0.2.0</h3><br><br>
		- Added a layer.<br>
		- Added a side layer.<br>
		- Added ten milestones.<br>
		- Added five upgrades.<br>
		- Added three buyables.<br>
		  Endgame: ???.<br>
	<br><br><h3 style='color:green'>v0.1.0</h3><br><br>
		- Added Hydrogen.<br>
		- Added Carbon.<br>
		- Added Nitrogen.<br>
		- Added Oxygen.<br>
		- Added Phosphorus.<br>
		- Added twenty-seven upgrades.<br>
		- Added a layer.<br>
		  Endgame: Phosphorus V.<br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return false
}

function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

function addedPlayerData() { return {
}}

var displayThings = [
]

function isEndgame() {
	return hasUpgrade('beg', 65)
}

var backgroundStyle = {

}

function maxTickLength() {
	return(3600)
}

function fixOldSave(oldVersion){
}