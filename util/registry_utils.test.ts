// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  fileNameFromURL,
  fileTypeFromURL,
  findRootReadme,
  getModule,
  getRepositoryURL,
  getSourceURL,
  getVersionList,
  getVersionMeta,
  isReadme,
  parseNameVersion,
  VersionMetaInfo,
} from "./registry_utils.ts";
import { assert, assertEquals, assertNotEquals } from "../test_deps.ts";

Deno.test("source url", () => {
  assertEquals(
    getSourceURL("ltest2", "0.0.8", "/README.md"),
    "https://cdn.deno.land/ltest2/versions/0.0.8/raw/README.md",
  );
});

const versionMeta: VersionMetaInfo = {
  uploadedAt: new Date("2020-08-08T12:22:43.759Z"),
  directoryListing: [
    {
      path: "",
      size: 2317,
      type: "dir",
    },
    {
      path: "/subproject",
      size: 425,
      type: "dir",
    },
    {
      path: "/.github",
      size: 716,
      type: "dir",
    },
    {
      path: "/.github/workflows",
      size: 412,
      type: "dir",
    },
    {
      path: "/fixtures",
      size: 23,
      type: "dir",
    },
    {
      path: "/mod.ts",
      size: 87,
      type: "file",
    },
    {
      path: "/subproject/README.md",
      size: 354,
      type: "file",
    },
    {
      path: "/subproject/mod.ts",
      size: 71,
      type: "file",
    },
    {
      path: "/.github/workflows/ci.yml",
      size: 412,
      type: "file",
    },
    {
      path: "/LICENSE",
      size: 1066,
      type: "file",
    },
    {
      path: "/.github/README.md",
      size: 304,
      type: "file",
    },
    {
      path: "/fixtures/%",
      size: 23,
      type: "file",
    },
  ],
  uploadOptions: {
    type: "github",
    repository: "luca-rand/testing",
    ref: "0.0.8",
  },
};

Deno.test("getRepositoryURL", () => {
  assertEquals(
    getRepositoryURL(versionMeta, "/README.md"),
    "https://github.com/luca-rand/testing/blob/0.0.8/README.md",
  );
});

Deno.test("getVersionMeta", {
  sanitizeResources: false,
}, async () => {
  assertEquals(await getVersionMeta("ltest2", "0.0.7"), null);
  assertEquals(await getVersionMeta("ltest2", "0.0.8"), versionMeta);
});

Deno.test("getVersionList", async () => {
  const versionList = await getVersionList("ltest2");
  assert(versionList);
  assertEquals(versionList?.isLegacy, undefined);
  assertEquals(versionList?.latest, versionList?.versions[0]);
  assert(versionList?.versions.length >= 2);
});

Deno.test("getModule", async () => {
  const mod = await getModule("ltest2");
  assert(mod);
  assertEquals(mod!.name, "ltest2");
  assertEquals(mod!.description, "Move along, just for testing");
  assert((+mod!.star_count) > 0);
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

Deno.test("findRootReadme", () => {
  const tests: Array<[string, boolean]> = [
    ["/README", true],
    ["/README.md", true],
    ["/README.org", true],
    ["/readme.markdown", true],
    ["/readme.org", true],
    ["/README.mdown", true],
    ["/readme.mkdn", true],
    ["/readme.mdwn", true],
    ["/README.mkd", true],
    ["/README.mkdown", false],
    ["/README.markdn", false],
    ["/READTHIS.md", false],
    ["/READTHIS.org", false],
    ["/docs/README.md", true],
    ["/docs/README.org", true],
    ["/.github/README.md", true],
    ["/.github/README.org", true],
  ];

  for (const [path, expectedToBeRootReadme] of tests) {
    const rootReadme = findRootReadme([{ path, type: "file", size: 100 }]);
    if (expectedToBeRootReadme) {
      assertNotEquals(rootReadme, undefined);
    } else {
      assertEquals(rootReadme, undefined);
    }
  }
});

Deno.test("findRootReadme selection", () => {
  {
    const rootReadme = findRootReadme([
      { path: "/.github/README.md", type: "file", size: 100 },
      { path: "/docs/README.md", type: "file", size: 100 },
      { path: "/README.md", type: "file", size: 100 },
    ]);

    assertEquals(rootReadme?.name, "README.md");
  }
  {
    const rootReadme = findRootReadme([
      { path: "/.github/README.md", type: "file", size: 100 },
      { path: "/docs/README.md", type: "file", size: 100 },
    ]);

    assertEquals(rootReadme?.name, "docs/README.md");
  }
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

Deno.test("parseNameVersion", () => {
  assertEquals(parseNameVersion("ms@v0.1.0"), ["ms", "v0.1.0"]);
  assertEquals(parseNameVersion("xstate@xstate@4.25.0"), [
    "xstate",
    "xstate@4.25.0",
  ]);
});
