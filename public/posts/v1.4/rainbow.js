// This script prints a rainbow to the terminal using the CSS
// support in console.log that was introduced in Deno 1.4.
//
// How to run:
// deno run https://deno.land/posts/v1.4/rainbow.js

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "grey",
];

for (const color of colors) {
  console.log("%c    Deno 1.4    ", `color: white; background-color: ${color}`);
}
