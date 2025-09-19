<<<<<<< HEAD
// This file defines the layers of the game.
// Each layer represents a core mechanic or prestige level.

addLayer("r", { // The unique ID for this layer is "r"
    name: "rest",
    symbol: "R",
    position: 0,
=======
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
>>>>>>> parent of eeb467e (primera mejora)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
<<<<<<< HEAD
    color: "#66b3ff",
    requires() { 
        if (player.inBurnout) 
            return new Decimal(20);
        else 
            return new Decimal(10);
    },
    resource: "rest points",
    baseResource: "Social Interactions",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.75,
    
    gainMult() { 
        let mult = new Decimal(1)
        if (player.s.boostedResetsLeft.gt(0)) {
            mult = mult.times(2);
        }
=======
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
>>>>>>> parent of eeb467e (primera mejora)
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },

    onPrestige(gain) {
        if (player.s.boostedResetsLeft.gt(0)) {
            player.s.boostedResetsLeft = player.s.boostedResetsLeft.sub(1);
        }
    },

    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    // This function is called every game tick.
    update(diff) {
<<<<<<< HEAD
        // This check is crucial for the engine to correctly process the update loop.
        if (canGenPoints()) {
            // Spoon consumption logic.
            let spoonsToSpend = tmp.pointGen.times(diff).div(100);
            player.spoons = player.spoons.sub(spoonsToSpend);
        }

        // Spoon regeneration from the 'Mindful Breathing' upgrade.
        if (hasUpgrade('r', 11)) {
            player.spoons = player.spoons.add(upgradeEffect('r', 11).times(diff));
        }

        // Trigger Burnout state if spoons are depleted and not already in it.
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true;
        }

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    upgrades: {
        11: {
            title: "Mindful Breathing",
            description: "Passively regenerate Spoons based on your total Rest Points.",
            cost: new Decimal(2),
            effect() {
                return player.r.points.times(0.001);
            },
            effectDisplay() { return "+" + format(upgradeEffect('r', 11)) + " Spoons/sec" },
        },
    },
=======
        // Calculate spoons to spend based on interaction gain rate and time passed
        let spoonsToSpend = tmp.pointGen.times(diff).div(100);
        player.spoons = player.spoons.sub(spoonsToSpend);

        // Ensure spoons don't go below zero
        if (player.spoons.lt(0)) {
            player.spoons = new Decimal(0);
        }
    }
>>>>>>> parent of eeb467e (primera mejora)
})

// Add the second layer: Sleep
addLayer("s", {
    name: "sleep",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        boostedResetsLeft: new Decimal(0),
    }},
    color: "#a37cff",
    requires: new Decimal(10),
    resource: "sleep credits",
    baseResource: "rest points",
    baseAmount() {return player.r.points},
    type: "normal",
    exponent: 0.5,
    row: 1,
    layerShown(){return true},

    postReset() {
        player.spoons = player.spoons.add(5).min(getMaxSpoons());
        player.s.boostedResetsLeft = new Decimal(2);
        if (player.spoons.gt(0)) {
            player.inBurnout = false;
        }
    },
})
