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

    // Add a dynamic style to the tab to show the bonus is active
    style() {
        if (player.sleepBonus.gt(0)) return {
            'background-color': '#d3c5ff' // A light purple to indicate the bonus
        }
    },

    update(diff) {
        // Handle Sleep Bonus Timer
        if (player.sleepBonus.gt(0)) {
            player.sleepBonus = player.sleepBonus.sub(diff);
            if (player.sleepBonus.lt(0)) player.sleepBonus = new Decimal(0);
        }

        // Standard, time-based consumption method.
        let spoonsToSpend = tmp.pointGen.times(diff).div(100);
        player.spoons = player.spoons.sub(spoonsToSpend);

        // Trigger Burnout state.
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true;
        }

        // Spoon regeneration from the 'Mindful Breathing' upgrade.
        if (hasUpgrade('r', 11)) {
            // Base regeneration
            let regen = getMaxSpoons().times(0.005);
            
            // Apply Sleep Bonus
            if (player.sleepBonus.gt(0)) {
                regen = regen.times(1.5);
            }

            player.spoons = player.spoons.add(regen.times(diff));
        }

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    upgrades: {
        11: {
            title: "Mindful Breathing",
            description: "Regenerate 0.5% of your maximum Spoons every second. This helps recover from Burnout.",
            cost: new Decimal(2),
        },
    },
})

// Add the debug tools to the info tab
addLayer("info-tab", {
    tabFormat: [
        "main-display",
        "prestige-button",
        ["raw-html", function() { return modInfo.author ? "<br><h3>Made by " + modInfo.author + "</h3>" : "" }],
        "blank",
        ["raw-html", function() { return "Time Played: " + formatTime(player.timePlayed) }],
        "blank",
        "h-line",
        "blank",
        ["raw-html", "<h2>Debug Tools</h2>"],
        "blank",
        ["row", [["clickable", 11], ["clickable", 12]]],
    ],
    clickables: {
        11: {
            title: "Speed x2",
            canClick: true,
            onClick() { player.timeSpeed = player.timeSpeed.times(2) },
            style: { "min-height": "40px", width: "120px" },
        },
        12: {
            title: "Speed /2",
            canClick: true,
            onClick() { player.timeSpeed = player.timeSpeed.div(2) },
            style: { "min-height": "40px", width: "120px" },
        },
    },
})

// The strategic layer to recover from Burnout
addLayer("s", {
    name: "sleep",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: true, // The tab is always visible
		points: new Decimal(0), // Not used, but good practice
    }},
    color: "#a37cff",
    row: 1, 
    layerShown(){return true},
    type: "none", // This layer does not reset anything

    // The layout of the tab
    tabFormat: [
        ["display-text", "Use your Rest Points to perform strategic recovery actions."],
        "blank",
        "clickables",
    ],

    clickables: {
        11: {
            title: "Get some Sleep",
            display() {
                return "Costs: 10 Rest Points<br><br>Instantly recover 5 Spoons and boost Rest upgrades by 1.5x for 10 seconds."
            },
            canClick() {
                return player.r.points.gte(10);
            },
            onClick() {
                player.r.points = player.r.points.sub(10);
                player.spoons = player.spoons.add(5);
                player.sleepBonus = new Decimal(10); // Activate the 10-second bonus

                // Clamp spoons to the maximum value.
                if (player.spoons.gt(getMaxSpoons())) {
                    player.spoons = getMaxSpoons();
                }
                // If spoons are now positive, exit Burnout.
                if (player.spoons.gt(0)) {
                    player.inBurnout = false;
                }
            },
            style: { "min-height": "120px", width: "200px" },
        },
    },
})
