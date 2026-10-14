// Capstone (console version): run with  node console/capstone.js
// It asks for a product name and price with prompt(), then prints the full report.

require("./prompt-shim.js");
const Inventory = require("../js/inventory-core.js");

const inventory = Inventory.seed();

const name = prompt("Enter the new product name:", "Monitor");
const rawPrice = prompt("Enter its price ($):", "150");

const result = Inventory.addProduct(inventory, name, rawPrice);

if (!result.ok) {
  console.log("Could not add product: " + result.message);
} else {
  const lines = Inventory.buildReport(inventory, { limit: 200, lastAdded: result.product });
  lines.forEach((line) => console.log(line));
}
