/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const req = await fetch(
<<<<<<< HEAD
  "https://cdn.jsdelivr.net/gh/github/gemoji/db/emoji.json"
=======
  "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json",
>>>>>>> aa611c5e9dfbf7d90d524d4c0c5645094b5fcf0c
);
const emojis = await req.json();

const emojisMap = {};

emojis.forEach((emoji) => {
  emoji.aliases.forEach((alias) => (emojisMap[alias] = emoji.emoji));
});

await Deno.writeTextFile("./util/emojis.json", JSON.stringify(emojisMap));
