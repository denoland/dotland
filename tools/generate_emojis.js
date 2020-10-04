/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const req = await fetch(
  "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
);
const emojis = await req.json();

const emojisMap = {};

emojis.forEach((emoji) => {
  emoji.aliases.forEach((alias) => (emojisMap[alias] = emoji.emoji));
});

await Deno.writeTextFile("./util/emojis.json", JSON.stringify(emojisMap));
