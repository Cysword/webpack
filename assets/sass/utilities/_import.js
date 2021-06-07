// utils.js
// These scss files will be injected into all css files that pass through webpack
// Do not add scss files that will result in compiled css because this will be added into all css files

// This is a JS file for better performance with webpack

const path = require("path");
const resources = [
    "./_variables.scss",
    "./_mixins.scss",
    "./_functions.scss"
];

module.exports = resources.map(file => path.resolve(__dirname, file));
