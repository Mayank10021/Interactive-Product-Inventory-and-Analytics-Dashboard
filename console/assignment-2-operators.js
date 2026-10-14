// Assignment 2: Operators, Expressions, and Input Handling

const billInput = prompt("Enter the bill amount ($):", "100");
const tipInput = prompt("Enter the tip percentage (%):", "15");

// prompt() always gives us text, so convert it to numbers first
const subtotal = Number(billInput);
const tipPercent = Number(tipInput);

if (isNaN(subtotal) || isNaN(tipPercent)) {
  console.log("Please enter numbers only, for example 100 and 15.");
} else {
  const tip = (subtotal * tipPercent) / 100;
  let total = subtotal;
  total += tip; // assignment operator at work

  const money = (n) => "$" + Number(n.toFixed(2));

  console.log("Subtotal: " + money(subtotal));
  console.log("Tip Percentage: " + tipPercent + "%");
  console.log("Calculated Tip: " + money(tip));
  console.log("Total Amount to Pay: " + money(total));
}
