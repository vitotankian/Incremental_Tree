// This file defines the layers of the game.
// Each layer represents a core mechanic or prestige level.

addLayer("r", { // The unique ID for this layer is "r"
    name: "rest", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return { // Defines the starting data for the layer.
        unlocked: true, // The layer starts unlocked.
		points: new Decimal(0), // The player starts with 0 Rest Points.
    }},
    color: "#66b3ff",
    // The requirement to prestige is now dynamic based on the Burnout state.
    requires() { 
        if (player.inBurnout) 
            return new Decimal(20); // The cost is higher during Burnout.
        else 
            return new Decimal(10); // The normal cost.
    },
    resource: "rest points", // The name of the currency this layer produces.
    baseResource: "Social Interactions", // The name of the resource used for resetting. This is for display purposes.
    baseAmount() {return player.points}, // A function to get the current amount of the base resource (player.points).
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // The prestige formula exponent. A higher value means the cost scales faster.
    gainMult() { // A function to calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // A function to calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // The row the layer is in on the tree (0 is the first row).
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    // This function is called every game tick.
    update(diff) {
        // Spoon consumption logic.
        let spoonsToSpend = tmp.pointGen.times(diff).div(100); // Spoons are spent at a rate of 1 per 100 Social Interactions.
        player.spoons = player.spoons.sub(spoonsToSpend);

        // Trigger Burnout state if spoons are depleted.
        if (player.spoons.lte(0)) {
            player.inBurnout = true;
        }

        // Spoon regeneration logic from the upgrade.
        if (hasUpgrade('r', 11)) { // Check if the player has purchased the 'Mindful Breathing' upgrade.
            player.spoons = player.spoons.add(upgradeEffect('r', 11).times(diff)); // Add regenerated spoons.
        }

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // This function is called after a prestige reset.
    postReset() {
        player.spoons = getMaxSpoons(); // Refill spoons to maximum.
        player.inBurnout = false; // Exit the Burnout state.
    },

    // Defines the upgrades for this layer.
    upgrades: {
        11: { // The unique ID for this upgrade is 11.
            title: "Mindful Breathing",
            description: "Passively regenerate Spoons based on your total Rest Points.",
            cost: new Decimal(2),
            // The effect of the upgrade.
            effect() {
                // Balanced from 0.01 to 0.001 based on user feedback.
                return player.r.points.times(0.001);
            },
            // How the effect is displayed to the player.
            effectDisplay() { return "+" + format(upgradeEffect('r', 11)) + " Spoons/sec" },
        },
    },
})
