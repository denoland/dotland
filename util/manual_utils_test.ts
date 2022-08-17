// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { getDocURL, getFileURL, getTableOfContents } from "./manual_utils.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";

Deno.test("get table of contents", async () => {
  assert(await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f"));
});

Deno.test("get introduction file commit hash", () => {
  assertEquals(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction"),
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md",
  );
});

Deno.test("get introduction file old repo", () => {
  assertEquals(
    getFileURL("v1.12.0", "/introduction"),
<<<<<<< HEAD
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md",
=======
    "https://cdn.deno.land/deno/versions/v1.12.0/raw/docs/introduction.md",
>>>>>>> 1199e14ce5494dae6bed81dc3b81033dc3042718
  );
});

Deno.test("get introduction file new repo", () => {
  assertEquals(
    getFileURL("v1.12.1", "/introduction"),
<<<<<<< HEAD
    "https://cdn.jsdelivr.net/gh/denocn/deno_docs@master/introduction.md",
=======
    "https://cdn.deno.land/manual/versions/v1.12.1/raw/introduction.md",
  );
});

Deno.test("get edit link old repo", () => {
  assertEquals(
    getDocURL("v1.12.0", "/introduction"),
    "https://github.com/denoland/deno/blob/v1.12.0/docs/introduction.md",
>>>>>>> 1199e14ce5494dae6bed81dc3b81033dc3042718
  );
});

Deno.test("get edit link new repo", () => {
  assertEquals(
    getDocURL("v1.12.1", "/introduction"),
    "https://github.com/denocn/deno_docs/blob/master/introduction.md",
  );
});
