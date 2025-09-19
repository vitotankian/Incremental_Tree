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

// Determines if it should show points/sec.
// This is the isolated test to find the root cause of the bug.
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
    // We will add upgrades that increase this later
    return max
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    spoons: new Decimal(10),
    lastSpoonCheck: new Decimal(0), // Re-adding for robust spoon consumption logic
}}

// Display extra things at the top of the page
var displayThings = [
	function() { 
        return "You have " + format(player.spoons) + " / " + format(getMaxSpoons()) + " Spoons" 
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
