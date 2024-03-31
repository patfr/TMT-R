import { layers } from "../core/layerSupport.js";
import { player } from "../core/playerSupport.js";
import AccessHelper from "../utils/accessHelper.js";

/**
 * @type {{[key: string]: import("../../lib/components/component").VueComponent}}
 */
export const contentComponents = {
    'display-text': {
		props: ['layer', 'data'],
		template: `
			<span class="instant" v-html="data"></span>
		`
	},

	'raw-html': {
			props: ['layer', 'data'],
			template: `
				<span class="instant"  v-html="data"></span>
			`
    },

	'blank': {
		props: ['layer', 'data'],
		template: `
			<div class = "instant">
			<div class = "instant" v-if="!data" v-bind:style="{'width': '8px', 'height': '17px'}"></div>
			<div class = "instant" v-else-if="Array.isArray(data)" v-bind:style="{'width': data[0], 'height': data[1]}"></div>
			<div class = "instant" v-else v-bind:style="{'width': '8px', 'height': data}"><br></div>
			</div>
		`
	},

	'display-image': {
		props: ['layer', 'data'],
		template: `
			<img class="instant" v-bind:src= "data" v-bind:alt= "data">
		`
	},
		
	'row': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgRow">
				<div v-for="(item, index) in data">
				<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="temp[layer].componentStyles[item]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==3" v-bind:style="[temp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="temp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	},

	'column': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgCol">
				<div v-for="(item, index) in data">
					<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="temp[layer].componentStyles[item]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==3" v-bind:style="[temp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="temp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	},

	'layer-proxy': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `
		<div>
			<column :layer="data[0]" :data="data[1]" :key="key + 'col'"></column>
		</div>
		`
	},

	'infobox': {
		props: ['layer', 'data'],
		template: `
		<div class="story instant" v-if="temp[layer].infoboxes && temp[layer].infoboxes[data]!== undefined && temp[layer].infoboxes[data].unlocked" v-bind:style="[{'border-color': temp[layer].color, 'border-radius': player.infoboxes[layer][data] ? 0 : '8px'}, temp[layer].infoboxes[data].style]">
			<button class="story-title" v-bind:style="[{'background-color': temp[layer].color}, temp[layer].infoboxes[data].titleStyle]"
				v-on:click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="temp[layer].infoboxes[data].title ? temp[layer].infoboxes[data].title : (temp[layer].name)"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" v-bind:style="temp[layer].infoboxes[data].bodyStyle">
				<span v-html="temp[layer].infoboxes[data].body ? temp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>
		`
	},

	'h-line': {
		props: ['layer', 'data'],
			template:`
				<hr class="instant" v-bind:style="data ? {'width': data} : {}" class="hl">
			`
    },

	'v-line': {
		props: ['layer', 'data'],
		template: `
			<div class="instant" v-bind:style="data ? {'height': data} : {}" class="vl2"></div>
		`
	},

	'challenges': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].challenges" class="upgTable">
		<div v-for="row in (data === undefined ? temp[layer].challenges.rows : data)" class="upgRow">
		<div v-for="col in temp[layer].challenges.cols">
					<challenge v-if="temp[layer].challenges[row*10+col]!== undefined && temp[layer].challenges[row*10+col].unlocked" :layer = "layer" :data = "row*10+col" v-bind:style="temp[layer].componentStyles.challenge"></challenge>
				</div>
			</div>
		</div>
		`
	},

	'challenge': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].challenges && temp[layer].challenges[data]!== undefined && temp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, [data]) && !inChallenge(layer, [data]))"
			v-bind:class="['challenge', challengeStyle(layer, data), player[layer].activeChallenge === data ? 'resetNotify' : '']" v-bind:style="temp[layer].challenges[data].style">
			<br><h3 v-html="temp[layer].challenges[data].name"></h3><br><br>
			<button v-bind:class="{ longUpg: true, can: true, [layer]: true }" v-bind:style="{'background-color': temp[layer].color}" v-on:click="startChallenge(layer, data)">{{challengeButtonText(layer, data)}}</button><br><br>
			<span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
			<span v-else>
				<span v-html="temp[layer].challenges[data].challengeDescription"></span><br>
				Goal:  <span v-if="temp[layer].challenges[data].goalDescription" v-html="temp[layer].challenges[data].goalDescription"></span><span v-else>{{format(temp[layer].challenges[data].goal)}} {{temp[layer].challenges[data].currencyDisplayName ? temp[layer].challenges[data].currencyDisplayName : modInfo.pointsName}}</span><br>
				Reward: <span v-html="temp[layer].challenges[data].rewardDescription"></span><br>
				<span v-if="layers[layer].challenges[data].rewardDisplay!==undefined">Currently: <span v-html="(temp[layer].challenges[data].rewardDisplay) ? (run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data])) : format(temp[layer].challenges[data].rewardEffect)"></span></span>
			</span>
			<node-mark :layer='layer' :data='temp[layer].challenges[data].marked' :offset="20" :scale="1.5"></node-mark></span>

		</div>
		`
	},

	'upgrades': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].upgrades" class="upgTable">
			<div v-for="row in (data === undefined ? temp[layer].upgrades.rows : data)" class="upgRow">
				<div v-for="col in temp[layer].upgrades.cols"><div v-if="temp[layer].upgrades[row*10+col]!== undefined && temp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
					<upgrade :layer = "layer" :data = "row*10+col" v-bind:style="temp[layer].componentStyles.upgrade"></upgrade>
				</div></div>
			</div>
			<br>
		</div>
		`
	},

	'upgrade': {
		props: ['layer', 'data'],
		template: `
		<button v-if="temp[layer].upgrades && temp[layer].upgrades[data]!== undefined && temp[layer].upgrades[data].unlocked" :id='"upgrade-" + layer + "-" + data' v-on:click="buyUpg(layer, data)" v-bind:class="{ [layer]: true, tooltipBox: true, upg: true, bought: hasUpgrade(layer, data), locked: (!(canAffordUpgrade(layer, data))&&!hasUpgrade(layer, data)), can: (canAffordUpgrade(layer, data)&&!hasUpgrade(layer, data))}"
			v-bind:style="[((!hasUpgrade(layer, data) && canAffordUpgrade(layer, data)) ? {'background-color': temp[layer].color} : {}), temp[layer].upgrades[data].style]">
			<span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
			<span v-else>
				<span v-if= "temp[layer].upgrades[data].title"><h3 v-html="temp[layer].upgrades[data].title"></h3><br></span>
				<span v-html="temp[layer].upgrades[data].description"></span>
				<span v-if="layers[layer].upgrades[data].effectDisplay"><br>Currently: <span v-html="run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data])"></span></span>
				<br><br>Cost: {{ formatWhole(temp[layer].upgrades[data].cost) }} {{(temp[layer].upgrades[data].currencyDisplayName ? temp[layer].upgrades[data].currencyDisplayName : temp[layer].resource)}}
			</span>
			<tooltip v-if="temp[layer].upgrades[data].tooltip" :text="temp[layer].upgrades[data].tooltip"></tooltip>

			</button>
		`
	},

	'milestones': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].milestones">
			<table>
				<tr v-for="id in (data === undefined ? Object.keys(temp[layer].milestones) : data)" v-if="temp[layer].milestones[id]!== undefined && temp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
					<milestone :layer = "layer" :data = "id" v-bind:style="temp[layer].componentStyles.milestone"></milestone>
				</tr>
			</table>
			<br>
		</div>
		`
	},

	'milestone': {
		props: ['layer', 'data'],
		template: `
		<td v-if="temp[layer].milestones && temp[layer].milestones[data]!== undefined && milestoneShown(layer, data) && temp[layer].milestones[data].unlocked" v-bind:style="[temp[layer].milestones[data].style]" v-bind:class="{milestone: !hasMilestone(layer, data), tooltipBox: true, milestoneDone: hasMilestone(layer, data)}">
			<h3 v-html="temp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data])"></span><br>
			<tooltip v-if="temp[layer].milestones[data].tooltip" :text="temp[layer].milestones[data].tooltip"></tooltip>

		<span v-if="(temp[layer].milestones[data].toggles)&&(hasMilestone(layer, data))" v-for="toggle in temp[layer].milestones[data].toggles"><toggle :layer= "layer" :data= "toggle" v-bind:style="temp[layer].componentStyles.toggle"></toggle>&nbsp;</span></td></tr>
		`
	},

	'toggle': {
		props: ['layer', 'data'],
		template: `
		<button class="smallUpg can" v-bind:style="{'background-color': temp[data[0]].color}" v-on:click="toggleAuto(data)">{{player[data[0]][data[1]]?"ON":"OFF"}}</button>
		`
	},

	'prestige-button': {
		props: ['layer', 'data'],
		template: `
		<button v-if="(temp[layer].type !== 'none')" v-bind:class="{ [layer]: true, reset: true, locked: !temp[layer].canReset, can: temp[layer].canReset}"
			v-bind:style="[temp[layer].canReset ? {'background-color': temp[layer].color} : {}, temp[layer].componentStyles['prestige-button']]"
			v-html="prestigeButtonText(layer)" v-on:click="doReset(layer)">
		</button>
		`
	
	},

	'main-display': {
		props: ['layer', 'data'],
		template: `
		<div><span v-if="player[layer].points.lt('1e1000')">You have </span><h2 v-bind:style="{'color': temp[layer].color, 'text-shadow': '0px 0px 10px ' + temp[layer].color}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2> {{temp[layer].resource}}<span v-if="layers[layer].effectDescription">, <span v-html="run(layers[layer].effectDescription, layers[layer])"></span></span><br><br></div>
		`
	},

	'resource-display': {
		props: ['layer'],
		template: `
		<div style="margin-top: -13px">
			<span v-if="temp[layer].baseAmount"><br>You have {{formatWhole(temp[layer].baseAmount)}} {{temp[layer].baseResource}}</span>
			<span v-if="temp[layer].passiveGeneration"><br>You are gaining {{format(temp[layer].resetGain.times(temp[layer].passiveGeneration))}} {{temp[layer].resource}} per second</span>
			<br><br>
			<span v-if="temp[layer].showBest">Your best {{temp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></span>
			<span v-if="temp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{temp[layer].resource}}<br></span>
		</div>
		`
	},

	'buyables': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].buyables" class="upgTable">
			<respec-button v-if="temp[layer].buyables.respec && !(temp[layer].buyables.showRespec !== undefined && temp[layer].buyables.showRespec == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, temp[layer].componentStyles['respec-button']]"></respec-button>
			<div v-for="row in (data === undefined ? temp[layer].buyables.rows : data)" class="upgRow">
				<div v-for="col in temp[layer].buyables.cols"><div v-if="temp[layer].buyables[row*10+col]!== undefined && temp[layer].buyables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<buyable :layer = "layer" :data = "row*10+col"></buyable>
				</div></div>
				<br>
			</div>
		</div>
	`
	},

	'buyable': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].buyables && temp[layer].buyables[data]!== undefined && temp[layer].buyables[data].unlocked" style="display: grid">
			<button v-bind:class="{ buyable: true, tooltipBox: true, can: temp[layer].buyables[data].canBuy, locked: !temp[layer].buyables[data].canBuy, bought: player[layer].buyables[data].gte(temp[layer].buyables[data].purchaseLimit)}"
			v-bind:style="[temp[layer].buyables[data].canBuy ? {'background-color': temp[layer].color} : {}, temp[layer].componentStyles.buyable, temp[layer].buyables[data].style]"
			v-on:click="if(!interval) buyBuyable(layer, data)" :id='"buyable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
				<span v-if= "temp[layer].buyables[data].title"><h2 v-html="temp[layer].buyables[data].title"></h2><br></span>
				<span v-bind:style="{'white-space': 'pre-line'}" v-html="run(layers[layer].buyables[data].display, layers[layer].buyables[data])"></span>
				<node-mark :layer='layer' :data='temp[layer].buyables[data].marked'></node-mark>
				<tooltip v-if="temp[layer].buyables[data].tooltip" :text="temp[layer].buyables[data].tooltip"></tooltip>

			</button>
			<br v-if="(temp[layer].buyables[data].sellOne !== undefined && !(temp[layer].buyables[data].canSellOne !== undefined && temp[layer].buyables[data].canSellOne == false)) || (temp[layer].buyables[data].sellAll && !(temp[layer].buyables[data].canSellAll !== undefined && temp[layer].buyables[data].canSellAll == false))">
			<sell-one :layer="layer" :data="data" v-bind:style="temp[layer].componentStyles['sell-one']" v-if="(temp[layer].buyables[data].sellOne)&& !(temp[layer].buyables[data].canSellOne !== undefined && temp[layer].buyables[data].canSellOne == false)"></sell-one>
			<sell-all :layer="layer" :data="data" v-bind:style="temp[layer].componentStyles['sell-all']" v-if="(temp[layer].buyables[data].sellAll)&& !(temp[layer].buyables[data].canSellAll !== undefined && temp[layer].buyables[data].canSellAll == false)"></sell-all>
		</div>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				if (!this.interval) {
					// @ts-ignore
					this.interval = setInterval((function() {
						// @ts-ignore
						if(this.time >= 5)
							// @ts-ignore
							AccessHelper.Buyable.buy(this.layer, this.data);

						// @ts-ignore
						this.time = this.time + 1;
					}).bind(this), 50);
                }
			},
			stop() {
				// @ts-ignore
				clearInterval(this.interval);
                
				// @ts-ignore
				this.interval = false;
			  	// @ts-ignore
			  	this.time = 0;
			}
		},
	},

	'respec-button': {
		props: ['layer', 'data'],
		template: `
			<div v-if="temp[layer].buyables && temp[layer].buyables.respec && !(temp[layer].buyables.showRespec !== undefined && temp[layer].buyables.showRespec == false)">
				<div class="tooltipBox respecCheckbox"><input type="checkbox" v-model="player[layer].noRespecConfirm" ><tooltip v-bind:text="'Disable respec confirmation'"></tooltip></div>
				<button v-on:click="respecBuyables(layer)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }" style="margin-right: 18px">{{temp[layer].buyables.respecText ? temp[layer].buyables.respecText : "Respec"}}</button>
			</div>
			`
	},
	
	'clickables': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].clickables" class="upgTable">
			<master-button v-if="temp[layer].clickables.masterButtonPress && !(temp[layer].clickables.showMasterButton !== undefined && temp[layer].clickables.showMasterButton == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, temp[layer].componentStyles['master-button']]"></master-button>
			<div v-for="row in (data === undefined ? temp[layer].clickables.rows : data)" class="upgRow">
				<div v-for="col in temp[layer].clickables.cols"><div v-if="temp[layer].clickables[row*10+col]!== undefined && temp[layer].clickables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<clickable :layer = "layer" :data = "row*10+col" v-bind:style="temp[layer].componentStyles.clickable"></clickable>
				</div></div>
				<br>
			</div>
		</div>
	`
	},

	'clickable': {
		props: ['layer', 'data'],
		template: `
		<button 
			v-if="temp[layer].clickables && temp[layer].clickables[data]!== undefined && temp[layer].clickables[data].unlocked" 
			v-bind:class="{ upg: true, tooltipBox: true, can: temp[layer].clickables[data].canClick, locked: !temp[layer].clickables[data].canClick}"
			v-bind:style="[temp[layer].clickables[data].canClick ? {'background-color': temp[layer].color} : {}, temp[layer].clickables[data].style]"
			v-on:click="if(!interval) clickClickable(layer, data)" :id='"clickable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if= "temp[layer].clickables[data].title"><h2 v-html="temp[layer].clickables[data].title"></h2><br></span>
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
			<node-mark :layer='layer' :data='temp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="temp[layer].clickables[data].tooltip" :text="temp[layer].clickables[data].tooltip"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				// @ts-ignore
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					// @ts-ignore
					this.interval = setInterval((function() {
						// @ts-ignore
						let c = layers[this.layer].clickables[this.data];
                        
						// @ts-ignore
						if(this.time >= 5 && run(c.canClick, c)) {
							// @ts-ignore
							run(c.onHold, c);
						}	

						// @ts-ignore
						this.time = this.time + 1;
					}).bind(this), 50);
                }
			},
			stop() {
				// @ts-ignore
				clearInterval(this.interval);

				// @ts-ignore
				this.interval = false;
			  	// @ts-ignore
			  	this.time = 0;
			}
		},
	},

	'master-button': {
		props: ['layer', 'data'],
		template: `
		<button v-if="temp[layer].clickables && temp[layer].clickables.masterButtonPress && !(temp[layer].clickables.showMasterButton !== undefined && temp[layer].clickables.showMasterButton == false)"
			v-on:click="run(temp[layer].clickables.masterButtonPress, temp[layer].clickables)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{temp[layer].clickables.masterButtonText ? temp[layer].clickables.masterButtonText : "Click me!"}}</button>
	`
	},

	'grid': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].grid" class="upgTable">
			<div v-for="row in (data === undefined ? temp[layer].grid.rows : data)" class="upgRow">
				<div v-for="col in temp[layer].grid.cols"><div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row*100+col)"
					class="upgAlign" v-bind:style="{'margin': '1px',  'height': 'inherit',}">
					<gridable :layer = "layer" :data = "row*100+col" v-bind:style="temp[layer].componentStyles.gridable"></gridable>
				</div></div>
				<br>
			</div>
		</div>
	`
	},

	'gridable': {
		props: ['layer', 'data'],
		template: `
		<button 
		v-if="temp[layer].grid && player[layer].grid[data]!== undefined && run(layers[layer].grid.getUnlocked, layers[layer].grid, data)" 
		v-bind:class="{ tile: true, can: canClick, locked: !canClick, tooltipBox: true,}"
		v-bind:style="[canClick ? {'background-color': temp[layer].color} : {}, gridRun(layer, 'getStyle', player[this.layer].grid[this.data], this.data)]"
		v-on:click="clickGrid(layer, data)"  @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if= "layers[layer].grid.getTitle"><h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br></span>
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
			<tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		computed: {
			canClick() {
				// @ts-ignore
				return gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)}
		},
		methods: {
			start() {
				// @ts-ignore
				if (!this.interval && layers[this.layer].grid.onHold) {
					// @ts-ignore
					this.interval = setInterval((function() {
						// @ts-ignore
						if(this.time >= 5 && gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data))
							// @ts-ignore
							gridRun(this.layer, 'onHold', player[this.layer].grid[this.data], this.data);

                        // @ts-ignore
						this.time = this.time + 1;
					}).bind(this), 50);
                }
			},
			stop() {
				// @ts-ignore
				clearInterval(this.interval);

				// @ts-ignore
				this.interval = false;
			  	// @ts-ignore
			  	this.time = 0;
			}
		},
	},

	'microtabs': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			currentTab() {return player.subtabs[layer][data]}
		},
		template: `
		<div v-if="temp[layer].microtabs" :style="{'border-style': 'solid'}">
			<div class="upgTable instant">
				<tab-buttons :layer="layer" :data="temp[layer].microtabs[data]" :name="data" v-bind:style="temp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="temp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="temp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>

			<column v-else v-bind:style="temp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="temp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>
		`
	},

	'bar': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			style() {return constructBarStyle(this.layer, this.data)}
		},
		template: `
		<div v-if="temp[layer].bars && temp[layer].bars[data].unlocked" v-bind:style="{'position': 'relative'}"><div v-bind:style="[temp[layer].bars[data].style, style.dims, {'display': 'table'}]">
			<div class = "overlayTextContainer barBorder" v-bind:style="[temp[layer].bars[data].borderStyle, style.dims]">
				<span class = "overlayText" v-bind:style="[temp[layer].bars[data].style, temp[layer].bars[data].textStyle]" v-html="run(layers[layer].bars[data].display, layers[layer].bars[data])"></span>
			</div>
			<div class ="barBG barBorder" v-bind:style="[temp[layer].bars[data].style, temp[layer].bars[data].baseStyle, temp[layer].bars[data].borderStyle,  style.dims]">
				<div class ="fill" v-bind:style="[temp[layer].bars[data].style, temp[layer].bars[data].fillStyle, style.fillDims]"></div>
			</div>
		</div></div>
		`
	},

	'achievements': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].achievements" class="upgTable">
			<div v-for="row in (data === undefined ? temp[layer].achievements.rows : data)" class="upgRow">
				<div v-for="col in temp[layer].achievements.cols"><div v-if="temp[layer].achievements[row*10+col]!== undefined && temp[layer].achievements[row*10+col].unlocked" class="upgAlign">
					<achievement :layer = "layer" :data = "row*10+col" v-bind:style="temp[layer].componentStyles.achievement"></achievement>
				</div></div>
			</div>
			<br>
		</div>
		`
	},

	'achievement': {
		props: ['layer', 'data'],
		template: `
		<div v-if="temp[layer].achievements && temp[layer].achievements[data]!== undefined && temp[layer].achievements[data].unlocked" v-bind:class="{ [layer]: true, achievement: true, tooltipBox:true, locked: !hasAchievement(layer, data), bought: hasAchievement(layer, data)}"
			v-bind:style="achievementStyle(layer, data)">
			<tooltip :text="
			(temp[layer].achievements[data].tooltip == '') ? false : hasAchievement(layer, data) ? (temp[layer].achievements[data].doneTooltip ? temp[layer].achievements[data].doneTooltip : (temp[layer].achievements[data].tooltip ? temp[layer].achievements[data].tooltip : 'You did it!'))
			: (temp[layer].achievements[data].goalTooltip ? temp[layer].achievements[data].goalTooltip : (temp[layer].achievements[data].tooltip ? temp[layer].achievements[data].tooltip : 'LOCKED'))
		"></tooltip>
			<span v-if= "temp[layer].achievements[data].name"><br><h3 v-bind:style="temp[layer].achievements[data].textStyle" v-html="temp[layer].achievements[data].name"></h3><br></span>
		</div>
		`
	},

	'tree': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="(node, id) in row" style = "{width: 0px}">
				<tree-node :layer='node' :prev='layer' :abb='temp[node].symbol' :key="key + '-' + r + '-' + id"></tree-node>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>

	`
	},

	'upgrade-tree': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'upgrade'"></thing-tree>`
	},

	'buyable-tree': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'buyable'"></thing-tree>`
	},

	'clickable-tree': {
		props: ['layer', 'data'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'clickable'"></thing-tree>`
	},

	'thing-tree': {
		props: ['layer', 'data', 'type'],
		computed: {
			// @ts-ignore
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="id in row" style = "{width: 0px; height: 0px;}" v-if="temp[layer][type+'s'][id]!== undefined && temp[layer][type+'s'][id].unlocked" class="upgAlign">
				<div v-bind:is="type" :layer = "layer" :data = "id" v-bind:style="temp[layer].componentStyles[type]" class = "treeThing"></div>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>
	`
	},

	'text-input': {
		props: ['layer', 'data'],
		template: `
			<input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" v-on:focus="focused(true)" v-on:blur="focused(false)"
			v-on:change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">
		`
	},

	'slider': {
		props: ['layer', 'data'],
		template: `
			<div class="tooltipBox">
			<tooltip :text="player[layer][data[0]]"></tooltip><input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]"></div>
		`
	},

	'drop-down': {
		props: ['layer', 'data'],
		template: `
			<select v-model="player[layer][data[0]]">
				<option v-for="item in data[1]" v-bind:value="item">{{item}}</option>
			</select>
		`
	},

	'sell-one': {
		props: ['layer', 'data'],
		template: `
			<button v-if="temp[layer].buyables && temp[layer].buyables[data].sellOne && !(temp[layer].buyables[data].canSellOne !== undefined && temp[layer].buyables[data].canSellOne == false)" v-on:click="run(temp[layer].buyables[data].sellOne, temp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{temp[layer].buyables.sellOneText ? temp[layer].buyables.sellOneText : "Sell One"}}</button>
	`
	},

	'sell-all': {
		props: ['layer', 'data'],
		template: `
			<button v-if="temp[layer].buyables && temp[layer].buyables[data].sellAll && !(temp[layer].buyables[data].canSellAll !== undefined && temp[layer].buyables[data].canSellAll == false)" v-on:click="run(temp[layer].buyables[data].sellAll, temp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{temp[layer].buyables.sellAllText ? temp[layer].buyables.sellAllText : "Sell All"}}</button>
	`
	},
};