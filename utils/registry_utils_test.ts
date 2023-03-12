// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import {
  extractLinkUrl,
  fileTypeFromURL,
  getSourceURL,
  getVersionList,
  validateModuleName,
} from "./registry_utils.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";

Deno.test("source url", () => {
  assertEquals(
    getSourceURL("ltest2", "0.0.8", "/README.md"),
    "https://cdn.deno.land/ltest2/versions/0.0.8/raw/README.md",
  );
});

Deno.test("getVersionList", async () => {
  const versionList = await getVersionList("ltest2");
  assert(versionList);
  assertEquals(versionList?.isLegacy, undefined);
  assertEquals(versionList?.latest, versionList?.versions[0]);
  assert(versionList?.versions.length >= 2);
});

Deno.test("fileTypeFromURL", () => {
  const tests: Array<[string, string | undefined]> = [
    ["main.ts", "typescript"],
    ["lib.js", "javascript"],
    ["lib.mjs", "javascript"],
    ["lib.cjs", "javascript"],
    ["Component.tsx", "tsx"],
    ["Component.jsx", "jsx"],
    ["data.json", "json"],
    ["Cargo.toml", "toml"],
    ["Cargo.lock", "toml"],
    ["mod.rs", "rust"],
    ["main.py", "python"],
    ["lib.wasm", "wasm"],
    ["Makefile", "makefile"],
    ["Dockerfile", "dockerfile"],
    ["build.Dockerfile", "dockerfile"],
    ["config.yml", "yaml"],
    ["config.yaml", "yaml"],
    ["index.html", "html"],
    ["index.htm", "html"],
    ["readme.md", "markdown"],
    ["readme.markdown", "markdown"],
    ["readme.mdown", "markdown"],
    ["readme.mkdn", "markdown"],
    ["readme.mdwn", "markdown"],
    ["readme.mkd", "markdown"],
    ["readme.org", "org"],
    ["image.png", "image"],
    ["image.jpg", "image"],
    ["image.jpeg", "image"],
    ["image.svg", "image"],
    ["file.unknown", undefined],
  ];
  for (const [name, expectedType] of tests) {
    assertEquals(fileTypeFromURL(name), expectedType);
  }
});

Deno.test("extractLinkUrl", () => {
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.ts"`, "")![0],
    "https://deno.land/std/foo/bar.ts",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.js"`, "")![0],
    "https://deno.land/std/foo/bar.js",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.tsx"`, "")![0],
    "https://deno.land/std/foo/bar.tsx",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.jsx"`, "")![0],
    "https://deno.land/std/foo/bar.jsx",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.mts"`, "")![0],
    "https://deno.land/std/foo/bar.mts",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.cts"`, "")![0],
    "https://deno.land/std/foo/bar.cts",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.mjs"`, "")![0],
    "https://deno.land/std/foo/bar.mjs",
  );
  assertEquals(
    extractLinkUrl(`"https://deno.land/std/foo/bar.cjs"`, "")![0],
    "https://deno.land/std/foo/bar.cjs",
  );
  assertEquals(
    extractLinkUrl(`"./qux.ts"`, "https://deno.land/std/foo/bar/baz.ts")![0],
    "https://deno.land/std/foo/bar/qux.ts",
  );
  assertEquals(
    extractLinkUrl(`"../quux.ts"`, "https://deno.land/std/foo/bar/baz.ts")![0],
    "https://deno.land/std/foo/quux.ts",
  );

  // Doesn't link to the external site's url
  assertEquals(extractLinkUrl(`"https://example.com/foo.ts"`, ""), undefined);

  // Doesn't link relative path if the base url is not script
  assertEquals(
    extractLinkUrl(`"./foo.ts"`, "https://deno.land/README.md"),
    undefined,
  );
});

Deno.test("validateModuleName", async () => {
  const controller = new AbortController();
  controller.abort();

  assertEquals(
    await validateModuleName("hello-world", controller),
    "invalid",
  );

  assertEquals(
    await validateModuleName("hello", controller),
    false,
  );

  assertEquals(
    await validateModuleName(
      "defuniq" + parseInt(`${Math.random() * 1000}`),
      new AbortController(),
    ),
    true,
  );
});
