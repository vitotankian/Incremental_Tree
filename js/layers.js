// This file defines the layers of the game.
// Each layer represents a core mechanic or prestige level.

addLayer("r", { // The unique ID for this layer is "r"
    name: "rest",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
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
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    // This function is called every game tick.
    update(diff) {
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
