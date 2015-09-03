// chiasm-layout.js
// v__VERSION__
// github.com/chiasm-project/chiasm-layout
//
// This is a Chiasm plugin for nested box layout.

var Layout = require("./src/layout");
var computeLayout = require("./src/computeLayout");

Layout.computeLayout = computeLayout;

module.exports = Layout;
