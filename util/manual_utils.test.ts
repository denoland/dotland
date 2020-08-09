import { getTableOfContents, getFileURL } from "./manual_utils";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("e325962d9cd386086cf67a65bb5421034c440a67")
  ).toBeTruthy();
});

test("get introduction file", async () => {
  expect(
    getFileURL("e325962d9cd386086cf67a65bb5421034c440a67", "/introduction")
  ).toEqual(
    "https://raw.githubusercontent.com/tokiedokie/deno_website2_japanese/e325962d9cd386086cf67a65bb5421034c440a67/docs/introduction.md"
  );
});
