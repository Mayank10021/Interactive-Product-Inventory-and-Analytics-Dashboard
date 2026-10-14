// Assignment 5: Function Architecture and Scope

// Standard function with default parameter values
function areaStandard(length = 5, width = 4) {
  return length * width;
}

// Arrow function with default parameter values
const areaArrow = (length = 5, width = 4) => length * width;

console.log("Standard Function Area (Default 5x4): " + areaStandard());
console.log("Arrow Function Area (Custom 10x3): " + areaArrow(10, 3));

// Scope demo: block scope
{
  let blockVar = "I only exist inside this block";
  var leakyVar = "var ignores block scope";
}

try {
  console.log(blockVar);
} catch (error) {
  console.log("Scope Test Error: " + error.name + ": " + error.message + " (when accessed outside block)");
}

// Scope demo: function scope
function makeSecret() {
  const secret = "I only exist inside makeSecret()";
  return secret.length;
}
makeSecret();

try {
  console.log(secret);
} catch (error) {
  console.log("Function Scope Error: " + error.name + ": " + error.message + " (when accessed outside function)");
}
