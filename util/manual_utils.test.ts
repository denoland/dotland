// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  getDocURL,
  getFileURL,
  getTableOfContents,
  getTableOfContentsMap,
} from "./manual_utils.ts";
import "isomorphic-unfetch";

/* eslint-env jest */

test("get table of contents", async () => {
  expect(
    await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f"),
  ).toBeTruthy();
});

test("get introduction file commit hash", async () => {
  expect(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction"),
  ).toEqual(
    "https://raw.githubusercontent.com/denoland/manual/95b75e204ab3c0966e344a52c7bc9b9011ac345f/introduction.md",
  );
});

test("get introduction file old repo", async () => {
  expect(getFileURL("v1.12.0", "/introduction")).toEqual(
    "https://deno.land/x/deno@v1.12.0/docs/introduction.md",
  );
});

test("get introduction file new repo", async () => {
  expect(getFileURL("v1.12.1", "/introduction")).toEqual(
    "https://deno.land/x/manual@v1.12.1/introduction.md",
  );
});

test("get edit link old repo", async () => {
  expect(getDocURL("v1.12.0", "/introduction")).toEqual(
    "https://github.com/denoland/deno/blob/v1.12.0/docs/introduction.md",
  );
});

test("get edit link new repo", async () => {
  expect(getDocURL("v1.12.1", "/introduction")).toEqual(
    "https://github.com/denoland/manual/blob/v1.12.1/introduction.md",
  );
});

test("get page title", async () => {
  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f",
    ).then((tableOfContentsMap) => tableOfContentsMap.get("/getting_started")),
  ).toEqual("Getting Started");

  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f",
    ).then((tableOfContentsMap) =>
      tableOfContentsMap.get("/getting_started/installation")
    ),
  ).toEqual("Installation");
});
