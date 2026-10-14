// Runs every assignment one after another:  node console/run-all.js

require("./prompt-shim.js");

const files = [
  "assignment-1-variables.js",
  "assignment-2-operators.js",
  "assignment-3-conditionals.js",
  "assignment-4-loops.js",
  "assignment-5-functions.js",
  "assignment-6-arrays-objects.js",
  "capstone.js",
];

files.forEach(function (file, index) {
  console.log("\n===== " + (index + 1 <= 6 ? "Assignment " + (index + 1) : "Capstone Project") + " (" + file + ") =====");
  require("./" + file);
});
