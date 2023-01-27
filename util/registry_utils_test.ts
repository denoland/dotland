// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import {
  extractLinkUrl,
  fileTypeFromURL,
  getSourceURL,
  getVersionList,
  shouldTranspile,
  transpile,
  tryInstantiateEmitLibWasm,
} from "./registry_utils.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  assertStringIncludes,
} from "$std/testing/asserts.ts";

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

Deno.test("shouldTranspile", () => {
  const DENO_USER_AGENT = "Deno/1.29.4";

  // don't transpile js file
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.js",
    new Headers({ Accept: "*/*" }),
  ));
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.mjs",
    new Headers({ Accept: "*/*" }),
  ));

  // don't transpile unknown extension
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.foo",
    new Headers({ Accept: "*/*" }),
  ));

  // don't transpile if Deno's User-Agent
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.ts",
    new Headers({ "User-Agent": DENO_USER_AGENT, Accept: "*/*" }),
  ));

  // don't transpile if `Accept: application/typescript`
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.ts",
    new Headers({ Accept: "application/typescript" }),
  ));

  // transpile if `Accept: application/javascript`
  assert(shouldTranspile(
    "https://deno.land/x/path/to/file.ts",
    new Headers({ Accept: "application/javascript" }),
  ));

  // transpile if `Accept: */*`
  assert(shouldTranspile(
    "https://deno.land/x/path/to/file.ts",
    new Headers({ Accept: "*/*" }),
  ));

  // don't transpile if unknown Accept header
  assertFalse(shouldTranspile(
    "https://deno.land/x/path/to/file.ts",
    new Headers({ Accept: "foo/bar" }),
  ));
});

Deno.test("tryInstantiateEmitLibWasm", async () => {
  // Check if no errors occur
  console.time("tryInstantiateEmitLibWasm");
  await tryInstantiateEmitLibWasm();
  console.timeEnd("tryInstantiateEmitLibWasm");
});

Deno.test("transpile", async () => {
  {
    // ts file
    const transpiled = await transpile(
      "export const a: string = 1;",
      "https://deno.land/path/to/file.ts",
    );
    assertStringIncludes(transpiled, "export const a = 1;");
  }
  {
    // mts file
    const transpiled = await transpile(
      "export function foo(arg: Foo) {}",
      "https://deno.land/path/to/file.mts",
    );
    assertStringIncludes(transpiled, "export function foo(arg) {}");
  }
  {
    // jsx file
    const transpiled = await transpile(
      "<div></div>",
      "https://deno.land/path/to/file.jsx",
    );
    assertStringIncludes(transpiled, 'React.createElement("div", null);');
  }
  {
    // tsx file
    const transpiled = await transpile(
      "<div></div>",
      "https://deno.land/path/to/file.tsx",
    );
    assertStringIncludes(transpiled, 'React.createElement("div", null);');
  }
  {
    // Don't raise an error even if there is no import statement extension
    const transpiled = await transpile(
      'import "https://esm.sh/foo"; import "npm:foo";',
      "https://deno.land/path/to/file.ts",
    );
    assertStringIncludes(
      transpiled,
      'import "https://esm.sh/foo";\nimport "npm:foo"',
    );
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
