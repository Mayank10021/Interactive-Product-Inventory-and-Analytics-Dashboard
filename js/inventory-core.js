// Capstone: Interactive Product Inventory & Analytics Dashboard
// Core logic. The web dashboard and the console version both use this file.

(function (root) {
  "use strict";

  const BUDGET_LIMIT = 50;     // below $50   -> Budget
  const PREMIUM_LIMIT = 500;   // $500 and up -> Premium
  const MAX_PRICE = 1000000;

  // ---- 2. Control flow: switch assigns the category badge ----
  function getCategory(price) {
    switch (true) {
      case price < BUDGET_LIMIT:
        return "Budget";
      case price < PREMIUM_LIMIT:
        return "Standard";
      default:
        return "Premium";
    }
  }

  // ---- 1. Input handling: prompt() gives text, so convert explicitly ----
  function parsePrice(raw) {
    let text = String(raw === null || raw === undefined ? "" : raw).trim();
    text = text.replace("$", "").replace(/,/g, "");
    if (text === "") {
      return NaN;
    }
    return Number(text);
  }

  // ---- 3. Loops: search with break ----
  function findProduct(inventory, name) {
    let index = -1;
    for (let i = 0; i < inventory.length; i++) {
      if (inventory[i].name.toLowerCase() === name.toLowerCase()) {
        index = i;
        break; // found it, no need to keep looking
      }
    }
    return index;
  }

  // ---- 2. Control flow: if...else validation ----
  function validateProduct(name, rawPrice, inventory) {
    const cleanName = String(name === null || name === undefined ? "" : name).trim();
    const price = parsePrice(rawPrice);

    if (cleanName === "") {
      return { ok: false, message: "Product name can't be empty." };
    } else if (cleanName.length > 40) {
      return { ok: false, message: "Product name is too long (40 characters max)." };
    } else if (isNaN(price)) {
      return { ok: false, message: "Price must be a number, like 150." };
    } else if (price <= 0) {
      return { ok: false, message: "Price must be greater than zero." };
    } else if (price > MAX_PRICE) {
      return { ok: false, message: "That price looks too high. Check for typos." };
    } else if (findProduct(inventory, cleanName) !== -1) {
      return { ok: false, message: '"' + cleanName + '" is already in the inventory.' };
    }

    return { ok: true, name: cleanName, price: Math.round(price * 100) / 100 };
  }

  function addProduct(inventory, name, rawPrice) {
    const check = validateProduct(name, rawPrice, inventory);
    if (!check.ok) {
      return check;
    }
    const product = { name: check.name, price: check.price, category: getCategory(check.price) };
    inventory.push(product);
    return { ok: true, message: product.name + " added as " + product.category + ".", product: product };
  }

  // ---- 3. Loops: continue skips bad rows and keeps going ----
  function addMany(inventory, entries) {
    const report = { added: [], skipped: [] };
    for (let i = 0; i < entries.length; i++) {
      const result = addProduct(inventory, entries[i].name, entries[i].price);
      if (!result.ok) {
        report.skipped.push({ entry: entries[i], reason: result.message });
        continue;
      }
      report.added.push(result.product);
    }
    return report;
  }

  // ---- 4. Functions & scope: regular + arrow functions ----
  function calculateTotal(items) {
    let total = 0;
    items.forEach(function (item) {
      total += item.price;
    });
    return total;
  }

  const applyTaxAndDiscount = (amount, taxRate = 0, discountRate = 0) => {
    const discounted = amount - (amount * discountRate) / 100;
    const withTax = discounted + (discounted * taxRate) / 100;
    return Math.round(withTax * 100) / 100;
  };

  // ---- 5. Array methods: filter() and map() ----
  const filterAffordable = (items, limit = 200) => items.filter((item) => item.price < limit);
  const formatReport = (items) => items.map((item) => item.name.toUpperCase() + ": " + money(item.price));

  const money = (n) => "$" + Number(Number(n).toFixed(2));
  const listText = (list) => (list.length === 0 ? "[]" : '["' + list.join('", "') + '"]');

  // Builds the console output exactly like the sample in the assignment
  function buildReport(inventory, options) {
    const opts = options || {};
    const limit = opts.limit === undefined ? 200 : opts.limit;
    const tax = opts.tax || 0;
    const discount = opts.discount || 0;
    const lines = [];

    lines.push("--- Initializing Inventory System ---");
    if (opts.lastAdded) {
      lines.push('[Prompt executed: User adds "' + opts.lastAdded.name + '" at "' + money(opts.lastAdded.price) + '"]');
    }

    lines.push("--- Processing Inventory Roster (forEach) ---");
    inventory.forEach(function (item) {
      lines.push("* Item: " + item.name + " (" + money(item.price) + ") -> Category: " + item.category);
    });

    const total = calculateTotal(inventory);
    const affordable = filterAffordable(inventory, limit);

    lines.push("--- Financial Analytics ---");
    lines.push("Total Inventory Value: " + money(total));
    lines.push("Filtered Affordable Items (Under " + money(limit) + "): " + listText(affordable.map((item) => item.name)));
    lines.push("Formatted Report List: " + listText(formatReport(inventory)));

    if (tax > 0 || discount > 0) {
      lines.push(
        "After " + discount + "% discount and " + tax + "% tax: " + money(applyTaxAndDiscount(total, tax, discount))
      );
    }
    return lines;
  }

  const api = {
    getCategory,
    parsePrice,
    findProduct,
    validateProduct,
    addProduct,
    addMany,
    calculateTotal,
    applyTaxAndDiscount,
    filterAffordable,
    formatReport,
    buildReport,
    money,
    seed: function () {
      return [
        { name: "Laptop", price: 800, category: "Premium" },
        { name: "Mouse", price: 25, category: "Budget" },
      ];
    },
  };

  root.Inventory = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
