// Assignment 6: Arrays, Objects, and Core Methods

const products = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 45 },
];

// forEach: print every product
console.log("-- All Products (forEach) --");
products.forEach(function (product) {
  console.log("Item: " + product.name + " - Price: $" + product.price);
});

// filter: keep only the cheap ones
console.log("-- Filtered Products (Price < $50) --");
const cheap = products.filter((product) => product.price < 50);
console.log(cheap);

// map: build a new array of formatted strings
console.log("-- Mapped Product Tags (map) --");
const tags = products.map((product) => product.name.toUpperCase() + " costs $" + product.price);
console.log('[ "' + tags.join('", "') + '" ]');
