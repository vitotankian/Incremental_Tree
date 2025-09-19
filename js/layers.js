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
    
    // This function calculates the multiplier for Rest Point gain.
    gainMult() { 
        let mult = new Decimal(1)
        // If the Sleep bonus is active, multiply gain by 2.
        if (player.s.boostedResetsLeft.gt(0)) {
            mult = mult.times(2);
        }
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },

    // This function is called every time a prestige reset happens in this layer.
    onPrestige(gain) {
        // If the Sleep bonus is active, decrement the counter.
        if (player.s.boostedResetsLeft.gt(0)) {
            player.s.boostedResetsLeft = player.s.boostedResetsLeft.sub(1);
        }
    },

    row: 0,
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    update(diff) {
        // DIAGNOSTIC TEST: Hardcode spoon consumption to isolate the bug.
        // This will subtract 1 spoon per second, ignoring point generation.
        player.spoons = player.spoons.sub(new Decimal(1).times(diff));

        // The rest of the logic remains to check for interactions
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true;
        }

        if (hasUpgrade('r', 11)) {
            player.spoons = player.spoons.add(upgradeEffect('r', 11).times(diff));
        }

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
        unlocked: false, // Starts locked until the player can afford it.
		points: new Decimal(0),
        boostedResetsLeft: new Decimal(0), // Counter for the temporary Rest Point bonus.
    }},
    color: "#a37cff",
    requires: new Decimal(10), // Requires 10 Rest Points to unlock.
    resource: "sleep credits", // The currency of this layer.
    baseResource: "rest points", // This layer resets Rest Points.
    baseAmount() {return player.r.points},
    type: "normal",
    exponent: 0.5,
    row: 1, // This is a tier 2 layer.
    layerShown(){return true},

    // This function is called after a prestige reset in this layer.
    postReset() {
        // Grant 5 spoons, but not exceeding the maximum.
        player.spoons = player.spoons.add(5).min(getMaxSpoons());
        // Activate the bonus for the next 2 Rest resets.
        player.s.boostedResetsLeft = new Decimal(2);
        // If spoons are now positive, exit Burnout.
        if (player.spoons.gt(0)) {
            player.inBurnout = false;
        }
    },
})
