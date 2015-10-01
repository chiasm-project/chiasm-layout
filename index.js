// chiasm-layout.js
// github.com/chiasm-project/chiasm-layout
//
// This is a Chiasm plugin for nested box layout.

var ChiasmLayout = require("./src/layout");
var computeLayout = require("./src/computeLayout");

// Expose this function just in case anyone wants to use it directly.
ChiasmLayout.computeLayout = computeLayout;

module.exports = ChiasmLayout;
