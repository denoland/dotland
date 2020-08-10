import { getTableOfContents, getFileURL } from "./manual_utils";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("72da0b1b5e33af2f50ba5c527096622fa980075b")
  ).toBeTruthy();
});

test("get introduction file", async () => {
  expect(
    getFileURL("72da0b1b5e33af2f50ba5c527096622fa980075b", "/introduction")
  ).toEqual(
    "https://raw.githubusercontent.com/tokiedokie/deno_website2_japanese/72da0b1b5e33af2f50ba5c527096622fa980075b/docs/introduction.md"
  );
});
