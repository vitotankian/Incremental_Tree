/**
 * @file layers.js
 * @description This file defines all the layers of the game, their mechanics, upgrades, and UI.
 * Each layer is an object created with the addLayer function.
 */

// =====================================================================================================================
// LAYER: Rest (r)
// =====================================================================================================================
// This is the first and primary prestige layer. Players reset their main progress (Social Interactions)
// to gain a new currency (Rest Points) which is used to purchase permanent upgrades.
addLayer("r", {
    // --- Basic Layer Properties ---
    name: "rest", // Internal name of the layer.
    symbol: "R", // The symbol that appears on the node in the tree.
    position: 0, // The position of the node within its row. (Not currently used in this mod).

    // --- Data Initialization ---
    // This function defines the variables that will be stored in the player save file for this layer.
    startData() { 
        return {
            unlocked: true, // This layer is unlocked from the very beginning of the game.
			points: new Decimal(0), // This is the currency of the layer, "Rest Points". Starts at 0.
        }
    },

    // --- Visuals ---
    color: "#66b3ff", // The color of the layer node and related UI elements.

    // --- Prestige Mechanics ---
    // This function determines the cost to perform a prestige reset for this layer.
    requires() { 
        // The cost is dynamic based on the player's Burnout state.
        if (player.inBurnout) 
            return new Decimal(20); // If in Burnout, the cost is doubled.
        else 
            return new Decimal(10); // The normal cost is 10 Social Interactions.
    },
    resource: "Rest Points", // The display name of the currency this layer generates.
    baseResource: "Social Interactions", // The currency that is consumed to perform the prestige reset.
    baseAmount() { return player.points }, // A function that returns the current amount of the base currency.
    type: "normal", // A "normal" prestige layer resets the progress of the previous layer upon reset.
    exponent: 0.75, // The formula for calculating prestige point gain is baseAmount.pow(exponent).
    gainMult() { 
        let mult = new Decimal(1) // Multiplier for prestige point gain. Currently no bonus.
        return mult
    },
    gainExp() { 
        return new Decimal(1) // Exponential modifier for prestige point gain. Currently no bonus.
    },

    // --- Tree & UI ---
    row: 0, // This layer appears in the first row (row 0) of the layer tree.
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}, // This layer is always visible.

    // This function dynamically changes the CSS style of the layer's tab.
    style() {
        // If the Sleep Bonus is active, change the background color to a light purple as a visual indicator.
        if (player.sleepBonus.gt(0)) return {
            'background-color': '#d3c5ff'
        }
    },

    // --- Game Loop Update ---
    // This function is called every tick of the game loop.
    update(diff) {
        // `diff` is the time in seconds that has passed since the last tick.

        // Handle the timer for the Sleep Bonus.
        if (player.sleepBonus.gt(0)) {
            player.sleepBonus = player.sleepBonus.sub(diff); // Decrease the timer.
            if (player.sleepBonus.lt(0)) player.sleepBonus = new Decimal(0); // Prevent the timer from going below zero.
        }

        // This is the core Spoon consumption mechanic.
        let spoonsToSpend = tmp.pointGen.times(diff).div(100); // Calculate spoons to spend based on SIP gain (100:1 ratio).
        player.spoons = player.spoons.sub(spoonsToSpend); // Subtract the spent spoons.

        // This block triggers the Burnout state.
        if (player.spoons.lte(0) && !player.inBurnout) {
            player.inBurnout = true; // Activate Burnout state.
            player.burnoutUnlocked = true; // Permanently unlock the Burnout layer tab.
        }

        // This block handles the logic for the "Recuperación Constante" upgrade.
        if (getGridData('r', 101)) { // Check if the upgrade (grid cell 101) has been purchased.
            player.sipSinceRegen = player.sipSinceRegen.add(tmp.pointGen.times(diff)); // Add SIP gained this tick to a counter.
            if (player.sipSinceRegen.gte(150)) { // If the counter reaches the threshold of 150...
                player.sipSinceRegen = player.sipSinceRegen.sub(150); // ...subtract 150 from the counter...
                player.spoons = player.spoons.add(1); // ...and grant 1 Spoon.
                doPopup("achievement", "+1 Spoon", "Spoon Regenerated!", 2); // Show a notification to the player.
            }
        }

        // This ensures the player's spoons never exceed their maximum capacity.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // --- Tab Layout ---
    // This defines the layout of the layer's tab, using a sub-tab format.
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display", // Shows the main prestige currency and gain.
                "prestige-button", // The button to perform the prestige reset.
                "blank", // Adds some empty space.
                "grid", // Displays the upgrade grid defined below.
            ]
        }
    },

    // --- Upgrade Grid ---
    // This object defines the grid of upgrades for this layer.
    grid: {
        rows: 1, // The grid currently has 1 row.
        cols: 2, // The grid currently has 2 columns.

        // This function sets the default data for each grid cell when the game starts.
        getStartData(id) {
            return false; // `false` means the upgrade has not been purchased.
        },
        // This function determines if a grid cell is visible.
        getUnlocked(id) {
            return true; // All cells in this grid are visible by default.
        },
        // This function returns the title for a specific grid cell.
        getTitle(data, id) {
            switch (id) {
                case 101: return "Recuperación Constante";
                case 102: return "Mayor Resiliencia";
            }
        },
        // This function returns the main description text for a specific grid cell.
        getDisplay(data, id) {
            let cost = this.getCost(id); // Get the cost of the upgrade.
            let description = "";
            switch (id) {
                case 101: 
                    description = "Cada 150 Interacciones Sociales ganadas, regenera 1 Spoon.";
                    break;
                case 102: 
                    description = "Añade +1 a la capacidad máxima de Spoons y otorga 1 Spoon instantáneamente.";
                    break;
            }
            return description + "<br><br>Cost: " + format(cost, 0) + " Rest Points"; // Combine description and cost.
        },
        // This function defines the cost of each grid cell.
        getCost(id) {
            switch (id) {
                case 101: return new Decimal(1);
                case 102: return new Decimal(2);
            }
        },
        // This function determines if a grid cell can be clicked (i.e., purchased).
        getCanClick(data, id) {
            // The player can click if they have enough Rest Points and have not already purchased the upgrade.
            return player.r.points.gte(this.getCost(id)) && !player.r.grid[id];
        },
        // This function is executed when a grid cell is clicked.
        onClick(data, id) {
            player.r.points = player.r.points.sub(this.getCost(id)); // Subtract the cost.
            setGridData(this.layer, id, true); // Mark the upgrade as purchased.

            // This switch handles effects that happen only once, at the moment of purchase.
            switch (id) {
                case 102: // For "Mayor Resiliencia"
                    player.spoons = player.spoons.add(1); // Grant 1 Spoon instantly.
                    // Ensure the instant spoon doesn't exceed the new maximum.
                    if (player.spoons.gt(getMaxSpoons())) {
                        player.spoons = getMaxSpoons();
                    }
                    break;
            }
        },
        // This function applies a dynamic style to a grid cell.
        getStyle(data, id) {
            // If the upgrade has been purchased, change its border color to green.
            if (player.r.grid[id]) return {
                'border-color': '#66ff66'
            }
        },
    },
})

// =====================================================================================================================
// LAYER: Info Tab (info-tab)
// =====================================================================================================================
// This is a special, built-in layer that controls the content of the "i" tab.
// We are defining it here to add our own custom content, specifically the debug tools.
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
        ["raw-html", "<h2>Debug Tools</h2>"], // Title for our debug section.
        "blank",
        ["row", [["clickable", 11], ["clickable", 12]]], // A row containing two clickable buttons.
    ],
    clickables: {
        11: {
            title: "Speed x2",
            canClick: true,
            onClick() { player.timeSpeed = player.timeSpeed.times(2) }, // Doubles the game speed.
            style: { "min-height": "40px", width: "120px" },
        },
        12: {
            title: "Speed /2",
            canClick: true,
            onClick() { player.timeSpeed = player.timeSpeed.div(2) }, // Halves the game speed.
            style: { "min-height": "40px", width: "120px" },
        },
    },
})

// =====================================================================================================================
// LAYER: Sleep (s)
// =====================================================================================================================
// This is a strategic layer that does not involve a prestige reset. It provides an active ability
// to help the player recover from the Burnout state.
addLayer("s", {
    // --- Basic Layer Properties ---
    name: "sleep",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: true, // The tab is visible from the start.
		points: new Decimal(0), // This layer does not have its own currency, but `points` is a required property.
    }},
    color: "#a37cff",
    row: 1, // This layer appears in the second row of the tree.
    layerShown(){return true}, // The layer node is always visible.
    type: "none", // Crucially, a "none" type layer does not perform any kind of reset.

    // --- Tab Layout ---
    // This defines what is shown inside the layer's tab.
    tabFormat: [
        ["display-text", "Use your Rest Points to perform strategic recovery actions."],
        "blank",
        "clickables", // This component will display all the clickables defined below.
    ],

    // --- Clickable Abilities ---
    clickables: {
        11: { // The ID of this clickable is 11.
            title: "Get some Sleep",
            // The `display` function returns the text shown on the button, which can be dynamic.
            display() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15); // The cost increases during Level 3 Burnout.
                return "Costs: " + format(cost, 0) + " Rest Points<br><br>Instantly recover 5 Spoons and boost Rest upgrades by 1.5x for 10 seconds."
            },
            // This function determines if the button can be clicked.
            canClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);
                return player.r.points.gte(cost); // Check if the player has enough Rest Points.
            },
            // This function is executed when the button is clicked.
            onClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);

                player.r.points = player.r.points.sub(cost); // Subtract the cost.
                player.spoons = player.spoons.add(5); // Grant 5 Spoons instantly.
                player.sleepBonus = new Decimal(10); // Activate the 10-second Sleep Bonus.

                // Clamp spoons to the maximum value after recovery.
                if (player.spoons.gt(getMaxSpoons())) {
                    player.spoons = getMaxSpoons();
                }
                // If the recovery brings spoons above zero, exit the Burnout state.
                if (player.spoons.gt(0)) {
                    player.inBurnout = false;
                }
            },
            style: { "min-height": "120px", width: "200px" }, // Basic styling for the button.
        },
    },
})

// =====================================================================================================================
// LAYER: Burnout (b)
// =====================================================================================================================
// This is a purely informational side-layer that displays the player's current Burnout status and penalties.
addLayer("b", {
    // --- Basic Layer Properties ---
    name: "burnout",
    symbol: "B",
    // The color of the node is dynamic.
    color() {
        if (player.inBurnout) return "#ff6666"; // Red when Burnout is active.
        return "#777777"; // Grey when inactive.
    },
    row: "side", // This makes it a side layer, appearing off to the side of the main tree.
    // The layer tab is only shown after the player has entered Burnout for the first time.
    layerShown() { 
        return player.burnoutUnlocked 
    },
    type: "none", // This layer does not perform any resets.

    // --- Visuals ---
    // This function applies a dynamic style to the layer node itself.
    nodeStyle() {
        // If Burnout is active, make the node glow red to draw attention.
        if(player.inBurnout) return {
            "box-shadow": "0 0 20px #ff6666",
            "border-color": "#ff8888"
        }
    },

    // --- Tab Layout ---
    // This defines the content of the tab using the built-in milestones component.
    tabFormat: [
        ["display-text", "You are in Burnout. Your energy is draining and your capacity to recover is impaired."],
        "blank",
        "milestones", // This special keyword tells the engine to display the milestones defined below.
    ],

    // --- Milestones (Used to display Burnout levels) ---
    milestones: {
        0: {
            requirementDescription: "Level 1: Agotamiento",
            effectDescription: "- Social Interaction gain is reduced by 50%.<br>- The cost of 'Rest' is doubled.",
            done() { return player.spoons.lte(0) }, // This milestone is "done" as soon as spoons are 0 or less.
            // This style function provides dynamic visual feedback.
            style() {
                // If this level is currently active...
                if (player.spoons.lte(0) && player.spoons.gt(-10)) return {'background-color': '#993333'} 
                // If it's not active, but has been completed...
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
        1: {
            requirementDescription: "Level 2: Fatiga Crónica",
            effectDescription: "- Social Interaction gain is reduced by 75%.<br>- 'Mindful Breathing' regeneration is reduced by 50%.",
            done() { return player.spoons.lte(-10) },
            style() {
                if (player.spoons.lte(-10) && player.spoons.gt(-50)) return {'background-color': '#993333'} 
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
        2: {
            requirementDescription: "Level 3: Colapso",
            effectDescription: "- 'Mindful Breathing' regeneration stops completely.<br>- The cost of 'Sleep' ability increases.",
            done() { return player.spoons.lte(-50) },
            style() {
                if (player.spoons.lte(-50)) return {'background-color': '#993333'} 
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
    },
})
