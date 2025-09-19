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
        // Standard, time-based consumption method.
        let spoonsToSpend = tmp.pointGen.times(diff).div(100);
        player.spoons = player.spoons.sub(spoonsToSpend);

        // Trigger Burnout state.
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true;
        }

        // Spoon regeneration from the 'Mindful Breathing' upgrade.
        if (hasUpgrade('r', 11)) {
            // Regenerate 0.5% of MAX spoons per second. This is constant and works during Burnout.
            let regen = getMaxSpoons().times(0.005).times(diff);
            player.spoons = player.spoons.add(regen);
        }

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // postReset is no longer needed as we are not using lastSpoonCheck anymore.

    upgrades: {
        11: {
            title: "Mindful Breathing",
            description: "Regenerate 0.5% of your maximum Spoons every second. This helps recover from Burnout.",
            cost: new Decimal(2),
        },
    },
})
