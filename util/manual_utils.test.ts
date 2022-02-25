// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { getDocURL, getFileURL, getTableOfContents } from "./manual_utils.ts";
import { assert, assertEquals } from "../test_deps.ts";

Deno.test("get table of contents", async () => {
  assert(await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f"));
});

<<<<<<< HEAD
/** @todo 目前中文版只有最新文档 */
test("get introduction file", async () => {
  expect(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction"),
  ).toEqual(
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md",
  );
});

test("get edit link new repo", async () => {
  expect(getDocURL("v1.12.1", "/introduction")).toEqual(
    "https://github.com/denocn/deno_docs/blob/master/introduction.md",
  );
});

test("get page title", async () => {
  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f",
    ).then((tableOfContentsMap) => tableOfContentsMap.get("/getting_started")),
  ).toEqual("快速入门");

  expect(
    await getTableOfContentsMap(
      "95b75e204ab3c0966e344a52c7bc9b9011ac345f",
    ).then((tableOfContentsMap) =>
      tableOfContentsMap.get("/getting_started/installation")
    ),
  ).toEqual("安装");
});
=======
Deno.test("get introduction file commit hash", () => {
  assertEquals(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction"),
    "https://raw.githubusercontent.com/denoland/manual/95b75e204ab3c0966e344a52c7bc9b9011ac345f/introduction.md",
  );
});

Deno.test("get introduction file old repo", () => {
  assertEquals(
    getFileURL("v1.12.0", "/introduction"),
    "https://deno.land/x/deno@v1.12.0/docs/introduction.md",
  );
});

Deno.test("get introduction file new repo", () => {
  assertEquals(
    getFileURL("v1.12.1", "/introduction"),
    "https://deno.land/x/manual@v1.12.1/introduction.md",
  );
});

Deno.test("get edit link old repo", () => {
  assertEquals(
    getDocURL("v1.12.0", "/introduction"),
    "https://github.com/denoland/deno/blob/v1.12.0/docs/introduction.md",
  );
});

Deno.test("get edit link new repo", () => {
  assertEquals(
    getDocURL("v1.12.1", "/introduction"),
    "https://github.com/denoland/manual/blob/v1.12.1/introduction.md",
  );
});
>>>>>>> 536026728193c65673465483c3006267099de405
