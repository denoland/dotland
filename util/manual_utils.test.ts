/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { getFileURL, getTableOfContents } from "./manual_utils";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f")
  ).toBeTruthy();
});

/** @todo 目前中文版只有最新文档 */
test("get introduction file", async () => {
  expect(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction")
  ).toEqual(
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md"
  );
});
