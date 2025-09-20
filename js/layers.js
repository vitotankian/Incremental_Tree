addLayer("r", {
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

    style() {
        if (player.sleepBonus.gt(0)) return {
            'background-color': '#d3c5ff'
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

        /* Spoon regeneration logic is temporarily disabled during grid refactor
        if (hasUpgrade('r', 11)) {
            let regen = getMaxSpoons().times(0.001);
            if (player.sleepBonus.gt(0)) {
                regen = regen.times(1.5);
            }
            if (player.spoons.lte(-50)) {
                regen = regen.times(0);
            } else if (player.spoons.lte(-10)) {
                regen = regen.times(0.5);
            }
            player.spoons = player.spoons.add(regen.times(diff));
        }
        */

        // Clamp spoons to the maximum value.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // Define the layout of the tab to display a grid
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "grid",
            ]
        }
    },

    // The new grid system for upgrades, based on documentation
    grid: {
        rows: 1,
        cols: 2,
        getStartData(id) {
            return false; // Default to not purchased
        },
        getUnlocked(id) {
            return true; // All gridables are visible by default
        },
        getTitle(data, id) {
            switch (id) {
                case 101: return "Recuperación Constante";
                case 102: return "Mayor Resiliencia";
            }
        },
        getDisplay(data, id) {
            let cost = this.getCost(id);
            let description = "";
            switch (id) {
                case 101: 
                    description = "Cada 150 Interacciones Sociales ganadas, regenera 1 Spoon.";
                    break;
                case 102: 
                    description = "Añade +1 a la capacidad máxima de Spoons y otorga 1 Spoon instantáneamente.";
                    break;
            }
            return description + "<br><br>Cost: " + format(cost, 0) + " Rest Points";
        },
        getCost(id) {
            switch (id) {
                case 101: return new Decimal(1);
                case 102: return new Decimal(2);
            }
        },
        getCanClick(data, id) {
            return player.r.points.gte(this.getCost(id)) && !player.r.grid[id];
        },
        onClick(data, id) {
            player.r.points = player.r.points.sub(this.getCost(id));
            setGridData(this.layer, id, true);

            // Add specific on-purchase effects
            switch (id) {
                case 102:
                    player.spoons = player.spoons.add(1);
                    if (player.spoons.gt(getMaxSpoons())) {
                        player.spoons = getMaxSpoons();
                    }
                    break;
            }
        },
        getStyle(data, id) {
            if (player.r.grid[id]) return {
                'border-color': '#66ff66'
            }
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
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#a37cff",
    row: 1, 
    layerShown(){return true},
    type: "none",

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
                if (player.spoons.lte(-50)) cost = new Decimal(15);
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
                player.sleepBonus = new Decimal(10);

                if (player.spoons.gt(getMaxSpoons())) {
                    player.spoons = getMaxSpoons();
                }
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
    row: "side",
    layerShown() { 
        return player.inBurnout 
    },
    type: "none",

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

            html += `<div style='${level1Active ? activeStyle : inactiveStyle}'><h4>Level 1: Agotamiento</h4>`;
            html += "<span>(Active at 0 Spoons or less)</span><br>";
            html += "<ul>";
            html += "<li>Social Interaction gain is reduced by 50%.</li>";
            html += "<li>The cost of 'Rest' is doubled.</li>";
            html += "</ul></div>";

            html += `<div style='${level2Active ? activeStyle : inactiveStyle}'><h4>Level 2: Fatiga Crónica</h4>`;
            html += "<span>(Active at -10 Spoons or less)</span><br>";
            html += "<ul>";
            html += "<li>Social Interaction gain is reduced by 75%.</li>";
            html += "<li>\'Mindful Breathing\' regeneration is reduced by 50%.</li>";
            html += "</ul></div>";

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
