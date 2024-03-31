addLayer('dna', {
    symbol: 'D',
    color: '#8C3300',
    resource: "DNA",
    position: 0,
    row: 1,
    requires: new Decimal(1e4),
    exponent: 1,
    type: "static",
    branches: ['beg'],
    baseResource: "Phosphorus",
    baseAmount() { return player.beg.phosphorus.points },
    startData() { return {
        points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
        unlocked: false,
    }},
    effect() { return player.dna.points.mul(2).max(1) },
    effectDescription() { return `multiplies all prior currencies by x${format(tmp.dna.effect)} after all prior boosts` },
    layerShown() { return hasUpgrade('beg', 65) || player.dna.unlocked },
    tabFormat: {
        Upgrades: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
            ],
        },
        Milestones: {
            content: [
                "main-display",
                "milestones",
            ],
        },
        Buyables: {
            content: [
                "main-display",
                "buyables",
            ],
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 DNA (1)",
            effectDescription: "Start gaining Evolution Points (EP from now on) and unlock a side layer",
            done() { return player.dna.points.gte(1) },
        },
        2: {
            requirementDescription: "2 DNA (2)",
            effectDescription: "Keep The big bang, Supernova and Hydrogen I-V, unlock DNA upgrades",
            done() { return player.dna.points.gte(2) },
        },
    },
})
