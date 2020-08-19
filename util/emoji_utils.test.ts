/* eslint-env jest */

import { replaceEmojis } from "./emoji_util";

test("emoji replacement", () => {
  expect(replaceEmojis(":ram:")).toEqual("🐏");
  expect(replaceEmojis("one :ram:")).toEqual("one 🐏");
  expect(replaceEmojis("three :ram: :ram: :ram:")).toEqual("three 🐏 🐏 🐏");
  expect(replaceEmojis("one :ram: one :car: two :ram:")).toEqual(
    "one 🐏 one 🚗 two 🐏"
  );
  expect(replaceEmojis(":ram: :deno: :ram:")).toEqual("🐏 :deno: 🐏");
});
