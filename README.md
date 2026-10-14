# JavaScript Assignments & Capstone

Six assignments plus the Product Inventory & Analytics Dashboard capstone.

## Open the project
Double-click `index.html`. No install, no server. (Needs internet only for the Google Fonts; it still works without.)

## What is inside
- `index.html`, `css/`, `js/app.js` : the website (light theme, animated)
- `console/assignment-1...6` : each assignment as a plain script
- `console/capstone.js` + `js/inventory-core.js` : the capstone logic
- `build.js` : re-packs the console scripts into `js/snippets.js` after you edit them

## Run in the terminal (Node)
```
node console/run-all.js          # everything, in order
node console/capstone.js         # capstone only (asks for a product with prompt())
node -r ./console/prompt-shim.js console/assignment-2-operators.js
```

## Run in the browser console
Open any file in `console/`, copy the code, paste it into DevTools > Console. `prompt()` works natively there.

## Real console output
Press F12 and open the Console tab. Every Run (and every capstone action) prints there with real `console.log`, as well as in the on-page panel.

## Name
Shown in the footer and hero. Change `name` in the `STUDENT` line at the top of `js/app.js` to edit it.

## Capstone concept map
| Requirement | Where |
|---|---|
| prompt() + Number() conversion | `parsePrice`, "Use prompt()" button |
| if...else and switch | `validateProduct`, `getCategory` |
| loops with break / continue | `findProduct`, `addMany` |
| regular + arrow functions, scope | `calculateTotal`, `applyTaxAndDiscount` |
| forEach / filter / map | `buildReport`, `filterAffordable`, `formatReport` |
