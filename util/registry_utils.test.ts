/* eslint-env jest */

/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import {
  getSourceURL,
  VersionMetaInfo,
  getRepositoryURL,
  getVersionMeta,
  getVersionList,
  getModule,
  fileNameFromURL,
  findRootReadme,
  isReadme,
  fileTypeFromURL,
} from "./registry_utils";
import "isomorphic-unfetch";

test("source url", () => {
  expect(getSourceURL("ltest2", "0.0.8", "/README.md")).toEqual(
    "https://cdn.deno.land/ltest2/versions/0.0.8/raw/README.md"
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

test("getRepositoryURL", () => {
  expect(getRepositoryURL(versionMeta, "/README.md")).toEqual(
    "https://github.com/luca-rand/testing/tree/0.0.8/README.md"
  );
});

test("getVersionMeta", async () => {
  expect(await getVersionMeta("ltest2", "0.0.7")).toEqual(null);
  expect(await getVersionMeta("ltest2", "0.0.8")).toEqual(versionMeta);
});

test("getVersionList", async () => {
  const versionList = await getVersionList("ltest2");
  expect(versionList).toBeTruthy();
  expect(versionList?.isLegacy).toEqual(undefined);
  expect(versionList?.latest).toEqual(versionList?.versions[0]);
  expect(versionList?.versions.length).toBeGreaterThanOrEqual(2);
});

test("getModule", async () => {
  expect(await getModule("ltest2")).toEqual({
    name: "ltest2",
    description: "Move along, just for testing",
    star_count: 2,
  });
});

test("fileTypeFromURL", () => {
  const tests: Array<[string, string | undefined]> = [
    ["main.ts", "typescript"],
    ["lib.js", "javascript"],
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
    ["image.png", "image"],
    ["image.jpg", "image"],
    ["image.jpeg", "image"],
    ["file.unknown", undefined],
  ];
  for (const [name, expectedType] of tests) {
    expect(fileTypeFromURL(name)).toBe(expectedType);
  }
});

test("fileNameFromURL", () => {
  expect(fileNameFromURL("a/path/to/%5Bfile%5D.txt")).toBe("[file].txt");
  expect(fileNameFromURL("a/path/to/file.tsx")).toBe("file.tsx");
});

test("findRootReadme", () => {
  const tests: Array<[string, boolean]> = [
    ["/README", true],
    ["/README.md", true],
    ["/readme.markdown", true],
    ["/README.mdown", true],
    ["/readme.mkdn", true],
    ["/readme.mdwn", true],
    ["/README.mkd", true],
    ["/README.mkdown", false],
    ["/README.markdn", false],
    ["/READTHIS.md", false],
    ["/docs/README.md", true],
    ["/.github/README.md", true],
  ];

  for (const [path, expectedToBeRootReadme] of tests) {
    const rootReadme = findRootReadme([{ path, type: "file", size: 100 }]);
    if (expectedToBeRootReadme) {
      expect(rootReadme).not.toBe(undefined);
    } else {
      expect(rootReadme).toBe(undefined);
    }
  }
});

test("isReadme", () => {
  const tests: Array<[string, boolean]> = [
    ["README", true],
    ["README.md", true],
    ["readme.markdown", true],
    ["README.mdown", true],
    ["readme.mkdn", true],
    ["readme.mdwn", true],
    ["README.mkd", true],
    ["README.mkdown", false],
    ["README.markdn", false],
    ["READTHIS.md", false],
  ];
  for (const [path, expectedToBeReadme] of tests) {
    expect(isReadme(path)).toBe(expectedToBeReadme);
  }
});
