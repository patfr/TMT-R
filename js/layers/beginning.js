addLayer('beg', {
    symbol: 'B',
    color: '#5bbbbd',
    position: 0,
    row: 0,
    tooltip: 'The Beginning',
    startData() { return {
        unlocked: true,
        hydrogen: {
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        },
        carbon: {
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        },
        nitrogen: {
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        },
        oxygen: {
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        },
        phosphorus: {
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        },
    }},
    elements: {
        hydrogen: {
            color: '#646400',
            unlocked() {
                return hasUpgrade('beg', 21)
            },
            gain() {
                let gain = new Decimal(1)

                if (hasUpgrade('beg', 22)) gain = gain.mul(2)
                if (hasUpgrade('beg', 23)) gain = gain.mul(2)
                if (hasUpgrade('beg', 24)) gain = gain.mul(upgradeEffect('beg', 24))
                if (hasUpgrade('beg', 34)) gain = gain.mul(upgradeEffect('beg', 34))
                if (hasUpgrade('beg', 42)) gain = gain.mul(1.5)
                if (hasUpgrade('beg', 61)) gain = gain.mul(2)
                if (hasUpgrade('beg', 25)) gain = gain.pow(2)
                gain = gain.mul(tmp.dna.effect)

                return gain
            },
        },
        carbon: {
            color: '#3C9009',
            unlocked() {
                return hasUpgrade('beg', 31)
            },
            gain() {
                let gain = new Decimal(1)

                if (hasUpgrade('beg', 32)) gain = gain.mul(2)
                if (hasUpgrade('beg', 33)) gain = gain.mul(upgradeEffect('beg', 33))
                if (hasUpgrade('beg', 43)) gain = gain.mul(1.5)
                if (hasUpgrade('beg', 53)) gain = gain.mul(upgradeEffect('beg', 53))
                if (hasUpgrade('beg', 61)) gain = gain.mul(2)
                gain = gain.mul(tmp.dna.effect)

                return gain
            },
        },
        nitrogen: {
            color: '#99582E',
            unlocked() {
                return hasUpgrade('beg', 41)
            },
            gain() {
                let gain = new Decimal(1)

                if (hasUpgrade('beg', 44)) gain = gain.mul(1.5)
                if (hasUpgrade('beg', 45)) gain = gain.mul(upgradeEffect('beg', 45))
                if (hasUpgrade('beg', 54)) gain = gain.mul(upgradeEffect('beg', 54))
                if (hasUpgrade('beg', 61)) gain = gain.mul(2)
                gain = gain.mul(tmp.dna.effect)

                return gain
            },
        },
        oxygen: {
            color: '#58E3F1',
            unlocked() {
                return hasUpgrade('beg', 51)
            },
            gain() {
                let gain = new Decimal(1)

                if (hasUpgrade('beg', 52)) gain = gain.mul(upgradeEffect('beg', 52))
                if (hasUpgrade('beg', 55)) gain = gain.mul(upgradeEffect('beg', 55))
                if (hasUpgrade('beg', 61)) gain = gain.mul(2)
                if (hasUpgrade('beg', 64)) gain = gain.mul(upgradeEffect('beg', 64))
                gain = gain.mul(tmp.dna.effect)

                return gain
            },
        },
        phosphorus: {
            color: '#466BA2',
            unlocked() {
                return hasUpgrade('beg', 61)
            },
            gain() {
                let gain = new Decimal(1)

                if (hasUpgrade('beg', 62)) gain = gain.mul(1.5)
                if (hasUpgrade('beg', 63)) gain = gain.mul(upgradeEffect('beg', 63))
                gain = gain.mul(tmp.dna.effect)

                return gain
            },
        },
    },
    tabFormat: {
        Beginning: {
            content() {
                return [
                    tmp.beg.elements.hydrogen.unlocked ? ['raw-html', resourceDisplay(player.beg.hydrogen.points, 'Hydrogen', tmp.beg.elements.hydrogen.color)] : [],
                    tmp.beg.elements.carbon.unlocked ? ['raw-html', resourceDisplay(player.beg.carbon.points, 'Carbon', tmp.beg.elements.carbon.color)] : [],
                    tmp.beg.elements.nitrogen.unlocked ? ['raw-html', resourceDisplay(player.beg.nitrogen.points, 'Nitrogen', tmp.beg.elements.nitrogen.color)] : [],
                    tmp.beg.elements.oxygen.unlocked ? ['raw-html', resourceDisplay(player.beg.oxygen.points, 'Oxygen', tmp.beg.elements.oxygen.color)] : [],
                    tmp.beg.elements.phosphorus.unlocked ? ['raw-html', resourceDisplay(player.beg.phosphorus.points, 'Phosphorus', tmp.beg.elements.phosphorus.color)] : [],
                    'blank',
                    ['row', [['upgrade', 11], ['blank', ['17px', '17px']], ['upgrade', 15]]],
                    'blank',
                    ['upgrades', [2, 3, 4, 5, 6]],
                ]
            },
        },
        Hydrogen: {
            buttonStyle() { return {'border-color': tmp.beg.elements.hydrogen.color} },
            content() {
                return [
                    ['raw-html', resourceDisplay(player.beg.hydrogen.points, 'Hydrogen', tmp.beg.elements.hydrogen.color)],
                    'blank',
                    ['upgrades', [2]]
                ]
            },
            unlocked() {
                return hasUpgrade('beg', 11)
            },
        },
        Carbon: {
            buttonStyle() { return {'border-color': tmp.beg.elements.carbon.color} },
            content() {
                return [
                    ['raw-html', resourceDisplay(player.beg.carbon.points, 'Carbon', tmp.beg.elements.carbon.color)],
                    'blank',
                    ['upgrades', [3]]
                ]
            },
            unlocked() {
                return hasUpgrade('beg', 25)
            },
        },
        Nitrogen: {
            buttonStyle() { return {'border-color': tmp.beg.elements.nitrogen.color} },
            content() {
                return [
                    ['raw-html', resourceDisplay(player.beg.nitrogen.points, 'Nitrogen', tmp.beg.elements.nitrogen.color)],
                    'blank',
                    ['upgrades', [4]]
                ]
            },
            unlocked() {
                return hasUpgrade('beg', 35)
            },
        },
        Oxygen: {
            buttonStyle() { return {'border-color': tmp.beg.elements.oxygen.color} },
            content() {
                return [
                    ['raw-html', resourceDisplay(player.beg.oxygen.points, 'Oxygen', tmp.beg.elements.oxygen.color)],
                    'blank',
                    ['upgrades', [5]]
                ]
            },
            unlocked() {
                return hasUpgrade('beg', 45)
            },
        },
        Phosphorus: {
            buttonStyle() { return {'border-color': tmp.beg.elements.phosphorus.color} },
            content() {
                return [
                    ['raw-html', resourceDisplay(player.beg.phosphorus.points, 'Phosphorus', tmp.beg.elements.phosphorus.color)],
                    'blank',
                    ['upgrades', [6]]
                ]
            },
            unlocked() {
                return hasUpgrade('beg', 15)
            },
        },
    },
    upgrades: {
        11: {
            title: 'The big bang',
            description: 'Start the universe by causing a big bang',
            cost: new Decimal(0),
            currencyDisplayName: '',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
        },
        15: {
            title: 'Supernova',
            description: 'Your star goes supernova creating new elements',
            cost: new Decimal(1000),
            currencyDisplayName: 'Oxygen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.oxygen,
            onPurchase() {
                player.beg.upgrades = [11, 15]

                const elements = Object.keys(tmp.beg.elements)

                elements.forEach(element => {
                    player.beg[element].points = new Decimal(0)
                    player.beg[element].total = new Decimal(0)
                    player.beg[element].best = new Decimal(0)
                })
            }
        },
        21: {
            title: 'Hydrogen I',
            description: 'Hydrogen starts attracting each other. Making you start gaining Hydrogen',
            cost: new Decimal(0),
            currencyDisplayName: '',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 11) },
        },
        22: {
            title: 'Hydrogen II',
            description: 'Double Hydrogen gain',
            cost: new Decimal(10),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 21) },
        },
        23: {
            title: 'Hydrogen III',
            description: 'Double Hydrogen gain. Why?',
            cost: new Decimal(15),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 22) },
        },
        24: {
            title: 'Hydrogen IV',
            description: 'Hydrogen boosts itself by a little',
            cost: new Decimal(35),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            tooltip: 'Log10(Hydrogen + 10)',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 23) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.hydrogen.points.add(10).log10() },
        },
        25: {
            title: 'Hydrogen V',
            description: 'Raise Hydrogen gain to the 2nd power',
            cost: new Decimal(100),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 24) },
        },
        31: {
            title: 'Carbon I',
            description: 'Your Hydrogen has formed a star and is fusing together atoms giving you Carbon',
            cost: new Decimal(1000),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 25) },
        },
        32: {
            title: 'Carbon II',
            description: 'Double Carbon gain. Seriously? Another one???',
            cost: new Decimal(10),
            currencyDisplayName: 'Carbon',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.carbon,
            unlocked() { return hasUpgrade('beg', 31) },
        },
        33: {
            title: 'Carbon III',
            description: 'Hydrogen boosts Carbon',
            cost: new Decimal(15),
            currencyDisplayName: 'Carbon',
            currencyInternalName: 'points',
            tooltip: 'Cube root(Hydrogen + 1)',
            currencyLocation: () => player.beg.carbon,
            unlocked() { return hasUpgrade('beg', 32) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.hydrogen.points.add(1).cbrt() },
        },
        34: {
            title: 'Carbon IV',
            description: 'Carbon boosts Hydrogen',
            cost: new Decimal(1000),
            currencyDisplayName: 'Carbon',
            currencyInternalName: 'points',
            tooltip: 'Cube root(Carbon + 1)',
            currencyLocation: () => player.beg.carbon,
            unlocked() { return hasUpgrade('beg', 33) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.carbon.points.add(1).cbrt() },
        },
        35: {
            title: 'Carbon V',
            description: 'Number of upgrades boosts Carbon gain',
            cost: new Decimal(2000),
            currencyDisplayName: 'Carbon',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.carbon,
            unlocked() { return hasUpgrade('beg', 34) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return Math.max(1, player.beg.upgrades.length) },
        },
        41: {
            title: 'Nitrogen I',
            description: 'Your star now creates Nitrogen as well',
            cost: new Decimal(1e4),
            currencyDisplayName: 'Carbon',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.carbon,
            unlocked() { return hasUpgrade('beg', 35) },
        },
        42: {
            title: 'Nitrogen II',
            description: 'Gain 50% more Hydrogen',
            cost: new Decimal(10),
            currencyDisplayName: 'Nitrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.nitrogen,
            unlocked() { return hasUpgrade('beg', 41) },
        },
        43: {
            title: 'Nitrogen III',
            description: 'Gain 50% more Carbon',
            cost: new Decimal(10),
            currencyDisplayName: 'Nitrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.nitrogen,
            unlocked() { return hasUpgrade('beg', 42) },
        },
        44: {
            title: 'Nitrogen IV',
            description: 'Gain 50% more Nitrogen',
            cost: new Decimal(10),
            currencyDisplayName: 'Nitrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.nitrogen,
            unlocked() { return hasUpgrade('beg', 43) },
        },
        45: {
            title: 'Nitrogen V',
            description: 'Carbon boosts Nitrogen gain',
            cost: new Decimal(15),
            currencyDisplayName: 'Nitrogen',
            currencyInternalName: 'points',
            tooltip: 'Floor(Log10(Carbon + 10))',
            currencyLocation: () => player.beg.nitrogen,
            unlocked() { return hasUpgrade('beg', 44) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.carbon.points.add(10).log10().floor() },
        },
        51: {
            title: 'Oxygen I',
            description: 'Your star now creates Oxygen as well',
            cost: new Decimal(250),
            currencyDisplayName: 'Nitrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.nitrogen,
            unlocked() { return hasUpgrade('beg', 45) },
        },
        52: {
            title: 'Oxygen II',
            description: 'Nitrogen boosts Oxygen gain',
            cost: new Decimal(10),
            currencyDisplayName: 'Oxygen',
            currencyInternalName: 'points',
            tooltip: 'Log10(Nitrogen + 10)',
            currencyLocation: () => player.beg.oxygen,
            unlocked() { return hasUpgrade('beg', 51) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.nitrogen.points.add(10).log10() },
        },
        53: {
            title: 'Oxygen III',
            description: 'Nitrogen boosts Carbon gain',
            cost: new Decimal(50),
            currencyDisplayName: 'Oxygen',
            currencyInternalName: 'points',
            tooltip: 'Cube root(Nitrogen + 1)',
            currencyLocation: () => player.beg.oxygen,
            unlocked() { return hasUpgrade('beg', 52) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.nitrogen.points.add(1).cbrt() },
        },
        54: {
            title: 'Oxygen IV',
            description: 'Oxygen boosts Nitrogen gain',
            cost: new Decimal(50),
            currencyDisplayName: 'Oxygen',
            currencyInternalName: 'points',
            tooltip: 'Cube root(Oxygen + 1)',
            currencyLocation: () => player.beg.oxygen,
            unlocked() { return hasUpgrade('beg', 53) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.oxygen.points.add(1).cbrt() },
        },
        55: {
            title: 'Oxygen V',
            description: 'Number of upgrades boosts Oxygen gain',
            cost: new Decimal(100),
            currencyDisplayName: 'Oxygen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.oxygen,
            unlocked() { return hasUpgrade('beg', 54) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return Math.max(1, player.beg.upgrades.length) },
        },
        61: {
            title: 'Phosphorus I',
            description: 'From the Supernova you now gain Phosphorus. Phosphorus gives x2 to all previous gasses',
            cost: new Decimal(1000),
            currencyDisplayName: 'Hydrogen',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.hydrogen,
            unlocked() { return hasUpgrade('beg', 15) },
        },
        62: {
            title: 'Phosphorus II',
            description: 'Gain 50% more Phosphorus',
            cost: new Decimal(100),
            currencyDisplayName: 'Phosphorus',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.phosphorus,
            unlocked() { return hasUpgrade('beg', 61) && hasUpgrade('beg', 55) },
        },
        63: {
            title: 'Phosphorus III',
            description: 'Oxygen boosts Phosphorus gain',
            cost: new Decimal(50),
            currencyDisplayName: 'Phosphorus',
            currencyInternalName: 'points',
            tooltip: 'Cube root(Oxygen + 1)',
            currencyLocation: () => player.beg.phosphorus,
            unlocked() { return hasUpgrade('beg', 62) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.oxygen.points.add(1).cbrt() },
        },
        64: {
            title: 'Phosphorus IV',
            description: 'Phosphorus boosts Oxygen gain',
            cost: new Decimal(1000),
            currencyDisplayName: 'Phosphorus',
            currencyInternalName: 'points',
            tooltip: 'Squre root(Phosphorus + 1)',
            currencyLocation: () => player.beg.phosphorus,
            unlocked() { return hasUpgrade('beg', 63) },
            effectDisplay() { return `x${format(tmp.beg.upgrades[this.id].effect)}` },
            effect() { return player.beg.phosphorus.points.add(1).sqrt() },
        },
        65: {
            title: 'Phosphorus V',
            description: 'Unlock DNA',
            cost: new Decimal(1e4),
            currencyDisplayName: 'Phosphorus',
            currencyInternalName: 'points',
            currencyLocation: () => player.beg.phosphorus,
            unlocked() { return hasUpgrade('beg', 64) },
        },
    },
    update(delta) {
        const elements = Object.keys(tmp.beg.elements)

        elements.forEach(element => {
            if (!tmp.beg.elements[element].unlocked)
                return

            const gain = tmp.beg.elements[element].gain.mul(delta)

            player.beg[element].points = player.beg[element].points.add(gain)
            player.beg[element].total = player.beg[element].total.add(gain)
            player.beg[element].best = player.beg[element].best.max(player.beg[element].points)
        })
    },
    doReset(resetLayer) {
        if (layers[resetLayer].row <= this.row)
            return

        layerDataReset('beg', [])

        const upgrades = []

        if (hasMilestone('dna', 2)) upgrades.push(11, 15, 21, 22, 23, 24, 25)
        if (hasMilestone('dna', 3)) upgrades.push(31, 32, 33, 34, 35)
        if (hasMilestone('dna', 4)) upgrades.push(41, 42, 43, 44, 45)
        if (hasMilestone('dna', 5)) upgrades.push(51, 52, 53, 54, 55)
        if (hasMilestone('dna', 6)) upgrades.push(61, 62, 63, 64, 65)

        player.beg.upgrades = upgrades
    },
})
