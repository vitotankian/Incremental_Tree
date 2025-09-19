let modInfo = {
	name: "The Neurodivergent Tree",
	author: "Bobo",
	pointsName: "Social Interactions",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
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

	let gain = new Decimal(100) // Increased for testing
	return gain
}

function getMaxSpoons() {
    let max = new Decimal(10)
    return max
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    spoons: new Decimal(10),
    lastSpoonCheck: new Decimal(0),
    inBurnout: false, // Tracks if the player is in the Burnout state.
}}

// Display extra things at the top of the page
var displayThings = [
	function() { 
        // Display spoon count in red if in Burnout.
        return "You have <span style='" + (player.inBurnout ? "color: #ff4444; font-weight: bold;" : "") + "'>" + format(player.spoons) + "</span> / " + format(getMaxSpoons()) + " Spoons" 
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
