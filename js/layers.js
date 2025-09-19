addLayer("r", {
    name: "rest", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#66b3ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "rest points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Cost scales slower as requested
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    update(diff) {
        // Robust spoon consumption logic using a direct point check.
        if (player.points.gt(player.lastSpoonCheck)) {
            let interactionsGained = player.points.sub(player.lastSpoonCheck);
            let spoonsToSpend = interactionsGained.div(100);
            
            player.spoons = player.spoons.sub(spoonsToSpend);
            player.lastSpoonCheck = player.points; // Update the checkpoint to the current points.
        }

        // Spoon regeneration from upgrade
        if (hasUpgrade('r', 11)) {
            player.spoons = player.spoons.add(upgradeEffect('r', 11).times(diff));
        }

        // Clamp spoons to max
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
                return player.r.points.times(0.01);
            },
            effectDisplay() { return "+" + format(upgradeEffect('r', 11)) + " Spoons/sec" },
        },
    },
})
