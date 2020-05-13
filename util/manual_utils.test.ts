import { getTableOfContents, getFileURL } from "./manual_utils";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("f184332c09c851faac50f598d29ebe4426e05464")
  ).toBeTruthy();
});

test("get introduction file", async () => {
  expect(
    getFileURL("f184332c09c851faac50f598d29ebe4426e05464", "/introduction")
  ).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/f184332c09c851faac50f598d29ebe4426e05464/docs/introduction.md"
  );
});
