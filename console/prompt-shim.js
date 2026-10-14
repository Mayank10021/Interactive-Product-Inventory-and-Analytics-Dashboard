// Node has no prompt(), so this small shim adds one.
// In a terminal it waits for you to type; press Enter to accept the [default].
// When output is piped (no keyboard), it just uses the default automatically.

const fs = require("fs");

global.prompt = function (message, fallback = "") {
  process.stdout.write(message + (fallback ? " [" + fallback + "] " : " "));

  if (!process.stdin.isTTY) {
    console.log(fallback);
    return fallback;
  }

  const buffer = Buffer.alloc(256);
  let bytes = 0;
  try {
    bytes = fs.readSync(0, buffer, 0, 256);
  } catch (error) {
    bytes = 0;
  }
  const text = buffer.toString("utf8", 0, bytes).trim();
  return text || fallback;
};
