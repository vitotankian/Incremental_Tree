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
            // Base regeneration (0.1% of max spoons)
            let regen = getMaxSpoons().times(0.001);
            
            // Apply Sleep Bonus
            if (player.sleepBonus.gt(0)) {
                regen = regen.times(1.5);
            }

            // Apply Burnout penalties
            if (player.spoons.lte(-50)) { // Level 3
                regen = regen.times(0);
            } else if (player.spoons.lte(-10)) { // Level 2
                regen = regen.times(0.5);
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
            // The description is now a function to be dynamic and show a percentage.
            description() {
                let baseRate = 0.1; // Base rate as a percentage
                let currentRate = baseRate;
                if (player.sleepBonus.gt(0)) {
                    currentRate *= 1.5;
                }
                // Apply Burnout penalties to the display value
                if (player.spoons.lte(-50)) { // Level 3
                    currentRate = 0;
                } else if (player.spoons.lte(-10)) { // Level 2
                    currentRate *= 0.5;
                }
                return "Regenerate " + format(currentRate, 2) + "% of your maximum Spoons per second.";
            },
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
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15); // Level 3 cost increase
                return "Costs: " + format(cost, 0) + " Rest Points<br><br>Instantly recover 5 Spoons and boost Rest upgrades by 1.5x for 10 seconds."
            },
            canClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);
                return player.r.points.gte(cost);
            },
            onClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);

                player.r.points = player.r.points.sub(cost);
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

// The informational layer for the Burnout state
addLayer("b", {
    name: "burnout",
    symbol: "B",
    color: "#ff6666",
    row: "side", // This makes it a side layer
    layerShown() { 
        return player.inBurnout 
    },
    type: "none",

    // Add a glowing effect to the tab button
    nodeStyle() {
        if(player.inBurnout) return {
            "box-shadow": "0 0 20px #ff6666",
            "border-color": "#ff8888"
        }
    },

    tabFormat: [
        ["display-text", "You are in Burnout. Your energy is draining and your capacity to recover is impaired."],
        "blank",
        "h-line",
        "blank",
        ["display-text", "<h3>Burnout Levels:</h3>"],
        "blank",
        ["raw-html", function() {
            let level1Active = player.spoons.lte(0) && player.spoons.gt(-10);
            let level2Active = player.spoons.lte(-10) && player.spoons.gt(-50);
            let level3Active = player.spoons.lte(-50);

            let activeStyle = "border: 2px solid #ff8888; background-color: #4d2020; padding: 10px; border-radius: 5px; margin-bottom: 10px;";
            let inactiveStyle = "border: 1px solid #888; padding: 10px; border-radius: 5px; margin-bottom: 10px; opacity: 0.6;";

            let html = "";

            // Level 1 Display
            html += `<div style='${level1Active ? activeStyle : inactiveStyle}'><h4>Level 1: Agotamiento</h4>`;
            html += "<span>(Active at 0 Spoons or less)</span><br>";
            html += "<ul>";
            html += "<li>Social Interaction gain is reduced by 50%.</li>";
            html += "<li>The cost of 'Rest' is doubled.</li>";
            html += "</ul></div>";

            // Level 2 Display
            html += `<div style='${level2Active ? activeStyle : inactiveStyle}'><h4>Level 2: Fatiga Crónica</h4>`;
            html += "<span>(Active at -10 Spoons or less)</span><br>";
            html += "<ul>";
            html += "<li>Social Interaction gain is reduced by 75%.</li>";
            html += "<li>\'Mindful Breathing\' regeneration is reduced by 50%.</li>";
            html += "</ul></div>";

            // Level 3 Display
            html += `<div style='${level3Active ? activeStyle : inactiveStyle}'><h4>Level 3: Colapso</h4>`;
            html += "<span>(Active at -50 Spoons or less)</span><br>";
            html += "<ul>";
            html += "<li>\'Mindful Breathing\' regeneration stops completely.</li>";
            html += "<li>The cost of 'Sleep' ability increases.</li>";
            html += "</ul></div>";

            return html;
        }],
    ],
})
