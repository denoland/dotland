/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { getFileURL, getTableOfContents } from "./manual_utils";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f")
  ).toBeTruthy();
});

<<<<<<< HEAD
/** @todo 目前中文版只有最新文档 */
test("get introduction file", async () => {
=======
test("get introduction file commit hash", async () => {
>>>>>>> 725c77384c94fcdbf6187e2645ded8d2577dd53d
  expect(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction")
  ).toEqual(
<<<<<<< HEAD
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md"
=======
    "https://raw.githubusercontent.com/denoland/manual/95b75e204ab3c0966e344a52c7bc9b9011ac345f/introduction.md"
  );
});

test("get introduction file old repo", async () => {
  expect(getFileURL("v1.12.0", "/introduction")).toEqual(
    "https://deno.land/x/deno@v1.12.0/docs/introduction.md"
  );
});

test("get introduction file new repo", async () => {
  expect(getFileURL("v1.12.1", "/introduction")).toEqual(
    "https://deno.land/x/manual@v1.12.1/introduction.md"
>>>>>>> 725c77384c94fcdbf6187e2645ded8d2577dd53d
  );
});
