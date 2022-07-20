// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  fileNameFromURL,
  fileTypeFromURL,
  getSourceURL,
  isReadme,
} from "./registry_utils.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("source url", () => {
  assertEquals(
    getSourceURL("ltest2", "0.0.8", "/README.md"),
    "https://cdn.deno.land/ltest2/versions/0.0.8/raw/README.md",
  );
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

Deno.test("fileNameFromURL", () => {
  assertEquals(fileNameFromURL("a/path/to/%5Bfile%5D.txt"), "[file].txt");
  assertEquals(fileNameFromURL("a/path/to/file.tsx"), "file.tsx");
});

Deno.test("isReadme", () => {
  const tests: Array<[string, boolean]> = [
    ["README", true],
    ["README.md", true],
    ["README.org", true],
    ["readme.markdown", true],
    ["readme.org", true],
    ["README.mdown", true],
    ["readme.mkdn", true],
    ["readme.mdwn", true],
    ["README.mkd", true],
    ["README.mkdown", false],
    ["README.markdn", false],
    ["READTHIS.md", false],
    ["READTHIS.org", false],
  ];
  for (const [path, expectedToBeReadme] of tests) {
    assertEquals([path, isReadme(path)], [path, expectedToBeReadme]);
  }
});
