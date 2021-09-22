/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import {
  getFileURL,
  getDocURL,
  getTableOfContents,
  getTableOfContentsMap,
} from "./manual_utils";
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

test("get edit link old repo", async () => {
  expect(getDocURL("v1.12.0", "/introduction")).toEqual(
    "https://github.com/denoland/deno/blob/v1.12.0/docs/introduction.md"
  );
});

test("get edit link new repo", async () => {
  expect(getDocURL("v1.12.1", "/introduction")).toEqual(
    "https://github.com/denoland/manual/blob/v1.12.1/introduction.md"
  );
});

test("get page title", async () => {
  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f"
    ).then((tableOfContentsMap) => tableOfContentsMap.get("/getting_started"))
  ).toEqual("快速入门");

  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f"
    ).then((tableOfContentsMap) =>
      tableOfContentsMap.get("/getting_started/installation")
    )
  ).toEqual("安装");
});
