addLayer("r", {
    name: "rest",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#66b3ff",
    // The requirement to prestige is now dynamic based on the Burnout state.
    requires() { 
        if (player.inBurnout) 
            return new Decimal(20); // The cost is higher during Burnout.
        else 
            return new Decimal(10); // The normal cost.
    },
    resource: "rest points",
    baseResource: "Social Interactions",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.75,
    gainMult() { 
        mult = new Decimal(1)
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    update(diff) {
        // Robust spoon consumption logic
        if (player.points.gt(player.lastSpoonCheck)) {
            let interactionsGained = player.points.sub(player.lastSpoonCheck);
            let spoonsToSpend = interactionsGained.div(100);
            
            player.spoons = player.spoons.sub(spoonsToSpend);
            player.lastSpoonCheck = player.points;
        }

        // Trigger Burnout state
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true;
        }

        // Percentage-based spoon regeneration from the 'Mindful Breathing' upgrade.
        if (hasUpgrade('r', 11) && player.spoons.gt(0)) {
            // Regenerate 1% of current spoons per second.
            let regen = player.spoons.times(0.01).times(diff);
            player.spoons = player.spoons.add(regen);
        }

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // This function is called after a prestige reset.
    postReset() {
        // Reset the spoon consumption checkpoint. This is crucial to re-enable spoon consumption after a reset.
        player.lastSpoonCheck = new Decimal(0);
    },

    upgrades: {
        11: {
            title: "Mindful Breathing",
            description: "Regenerate 1% of your current Spoons every second.",
            cost: new Decimal(2),
            // effect() and effectDisplay() are no longer needed.
        },
    },
})
