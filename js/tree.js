var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""
}

// This is the core definition of the layer tree.
// It MUST be defined before tree-tab is created.
// The game loop iterates over this array to update and display layers.
var TREE_LAYERS = [
    ["r"], // Row 0: The Rest layer
    ["s"]  // Row 1: The Sleep layer
];


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})
