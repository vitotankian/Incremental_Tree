let modInfo = {
	name: "The Neurodivergent Tree",
	author: "Bobo",
	pointsName: "Social Interactions",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1) // Base gain
    
    // In Burnout, point generation is less effective.
    if (player.inBurnout) {
        gain = gain.div(2);
    }

    // Apply debug time speed multiplier
    if (player.timeSpeed) {
        gain = gain.times(player.timeSpeed);
    }

	return gain
}

function getMaxSpoons() {
    let max = new Decimal(10)
    return max
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    spoons: new Decimal(10),
    inBurnout: false, // Tracks if the player is in the Burnout state.
    devSpeed: new Decimal(1), // For debug purposes
    timeSpeed: new Decimal(1), // For debug purposes
    sleepBonus: new Decimal(0), // Tracks the remaining time for the Sleep bonus
}}

// Display extra things at the top of the page
var displayThings = [
	function() { 
        // Display spoon count in red if in Burnout.
        return "You have <span style='" + (player.inBurnout ? "color: #ff4444; font-weight: bold;" : "") + "'>" + format(player.spoons) + "</span> / " + format(getMaxSpoons()) + " Spoons" 
    },
    function() {
        // Display current game speed multiplier for debug
        if (player.timeSpeed && player.timeSpeed.neq(1)) return "Game Speed: " + format(player.timeSpeed) + "x"
    },
    function() {
        // Display the Sleep bonus timer when active
        if (player.sleepBonus.gt(0)) return "<span style='color: #a37cff'>Sleep Bonus Active: " + format(player.sleepBonus) + "s</span>"
    }
]

function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}


// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

function fixOldSave(oldVersion){
}
