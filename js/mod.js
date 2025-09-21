/**
 * @file mod.js
 * @description This file contains the core configuration and global functions for the mod.
 * It defines metadata, global variables, and functions that control the main game loop and player data.
 */

// =====================================================================================================================
// MOD METADATA
// =====================================================================================================================
// This object contains general information about the mod.
let modInfo = {
	name: "The Neurodivergent Tree", // The name of the mod, displayed as the title of the page.
	author: "Bobo", // Your name, which can be displayed in the Info Tab.
	pointsName: "Social Interactions", // The display name for the primary game currency (player.points).
	modFiles: ["layers.js", "tree.js"], // A list of all JavaScript files that are part of this mod.

	discordName: "", // The name for the Discord server link.
	discordLink: "", // The invite link for the Discord server.
	initialStartPoints: new Decimal (0), // The number of points players start with on a hard reset. Set to 0 for our game.
	offlineLimit: 1,  // The maximum number of hours of offline progress to simulate.
}

// This object defines the current version of the mod.
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

// A string containing HTML to be displayed in the changelog tab.
let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

// The text displayed when the player reaches the endgame condition.
let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// An array of function names that should NOT be called every tick. Used for optimization.
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

// =====================================================================================================================
// CORE GAME FUNCTIONS
// =====================================================================================================================

/**
 * @description Determines the starting points for a new player or after a hard reset.
 * @returns {Decimal} The starting number of points.
 */
function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

/**
 * @description A global switch to determine if points can be generated.
 * @returns {boolean} `true` if points can be generated, `false` otherwise.
 */
function canGenPoints(){
	return true
}

/**
 * @description This is a critical function that calculates the rate of point generation per second.
 * It is called by the game engine to determine the value of `tmp.pointGen`.
 * @returns {Decimal} The number of Social Interactions (points) gained per second.
 */
function getPointGen() {
	// If point generation is globally disabled, return 0.
	if(!canGenPoints())
		return new Decimal(0)

	// Start with a base gain value. We use 10 for easier testing.
	let gain = new Decimal(10)
    
    // Apply penalties based on the Burnout state.
    if (player.inBurnout) {
        if (player.spoons.lte(-10)) { // Level 2 or 3 Burnout penalty.
            gain = gain.times(0.25); // 75% reduction in gain.
        } else { // Level 1 Burnout penalty.
            gain = gain.times(0.5); // 50% reduction in gain.
        }
    }

    // Apply the multiplier from our debug tools.
    if (player.timeSpeed) {
        gain = gain.times(player.timeSpeed);
    }

	return gain
}

/**
 * @description Calculates the maximum number of Spoons the player can have.
 * @returns {Decimal} The maximum spoon capacity.
 */
function getMaxSpoons() {
    // Start with a base maximum of 10.
    let max = new Decimal(10)
    
    // Check if the "Mayor Resiliencia" upgrade has been purchased and apply its bonus.
    // The `player.r.grid` check is a safety measure to prevent errors when the game is first loading.
    if (player.r.grid && getGridData('r', 102)) {
        max = max.add(1); // Add +1 to the maximum capacity.
    }
    return max
}


/**
 * @description This function defines all the custom variables that will be saved in the `player` object.
 * It also sets their default values for a new game.
 * @returns {object} An object containing all custom player data.
 */
function addedPlayerData() { return {
    spoons: new Decimal(10), // The player's current number of Spoons.
    inBurnout: false, // A boolean flag that is `true` if the player is currently in the Burnout state.
    burnoutUnlocked: false, // A boolean flag that becomes `true` once the player enters Burnout for the first time. Used to permanently show the Burnout layer tab.
    devSpeed: new Decimal(1), // A variable for the debug tools (not currently used, but can be).
    timeSpeed: new Decimal(1), // The multiplier for game speed, controlled by the debug tools.
    sleepBonus: new Decimal(0), // A timer that counts down the seconds remaining for the Sleep Bonus.
    sipSinceRegen: new Decimal(0), // A counter that tracks how many Social Interactions have been gained since the last "Recuperación Constante" regeneration.
}}

// =====================================================================================================================
// UI & DISPLAY
// =====================================================================================================================

// This is an array of functions. Each function returns a string of HTML to be displayed at the top of the screen.
var displayThings = [
	// Function to display the Spoon counter.
	function() { 
        // The style of the span is dynamic. If in Burnout, the text becomes red and bold.
        return "You have <span style='" + (player.inBurnout ? "color: #ff4444; font-weight: bold;" : "") + "'>" + format(player.spoons) + "</span> / " + format(getMaxSpoons()) + " Spoons" 
    },
    // Function to display the debug game speed multiplier.
    function() {
        // This text only appears if the game speed is not the default (1x).
        if (player.timeSpeed && player.timeSpeed.neq(1)) return "Game Speed: " + format(player.timeSpeed) + "x"
    },
    // Function to display the Sleep Bonus timer.
    function() {
        // This text only appears if the Sleep Bonus is active (timer is greater than 0).
        if (player.sleepBonus.gt(0)) return "<span style='color: #a37cff'>Sleep Bonus Active: " + format(player.sleepBonus) + "s</span>"
    }
]

// =====================================================================================================================
// GAME END & MISC
// =====================================================================================================================

/**
 * @description This function determines if the endgame condition has been met.
 * @returns {boolean} `true` if the game has been beaten.
 */
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}


// Less important boilerplate functions below this point.

// Style for the game background. Can be a function.
var backgroundStyle = {

}

// A function to prevent issues with long tick lengths (e.g., from offline progress).
function maxTickLength() {
	return(3600) // Default is 1 hour, which is just arbitrarily large.
}

// This function is called when loading a save from an older version of the game.
// It can be used to fix variables or data structures that have changed between versions.
function fixOldSave(oldVersion){
}
