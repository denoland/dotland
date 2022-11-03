// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  getDocURL,
  getFileURL,
  getTableOfContents,
  tocGen,
} from "./manual_utils.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";

Deno.test("get table of contents", async () => {
  assert(await getTableOfContents("95b75e204ab3c0966e344a52c7bc9b9011ac345f"));
});

Deno.test("get introduction file commit hash", () => {
  assertEquals(
    getFileURL("95b75e204ab3c0966e344a52c7bc9b9011ac345f", "/introduction"),
    "https://raw.githubusercontent.com/denoland/manual/95b75e204ab3c0966e344a52c7bc9b9011ac345f/introduction.md",
  );
});

Deno.test("get introduction file old repo", () => {
  assertEquals(
    getFileURL("v1.12.0", "/introduction"),
    "https://cdn.deno.land/deno/versions/v1.12.0/raw/docs/introduction.md",
  );
});

Deno.test("get introduction file new repo", () => {
  assertEquals(
    getFileURL("v1.12.1", "/introduction"),
    "https://cdn.deno.land/manual/versions/v1.12.1/raw/introduction.md",
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

Deno.test("tocGen", () => {
  const toc = {
    "basics": {
      "name": "Basics",
      "children": {
        "import_export": "Importing and Exporting Modules",
        "node": {
          "name": "Importing npm modules",
          "children": {
            "npm_specifiers": "Using Node.js Packages with npm Specifiers",
            "cdns": "Using Node.js Packages Via CDNs",
            "std_node": "The std/node Library",
            "import_maps": "Using Import Maps",
            "faqs": "Frequently Asked Questions",
          },
        },
        "standard_library": "Standard Library",
        "linking_to_external_code": "Using Third Party Modules",
        "permissions": "Permissions",
        "connecting_to_databases": "Connecting to Databases",
        "env_variables": "Environment Variables",
        "testing": {
          "name": "Testing",
          "children": {
            "assertions": "Assertions",
            "coverage": "Coverage",
            "documentation": "Documentation",
            "sanitizers": "Sanitizers",
            "behavior_driven_development": "Behavior-Driven Development",
            "mocking": "Mocking",
            "snapshot_testing": "Snapshots",
          },
        },
        "debugging_your_code": "Debugging Your Code",
      },
    },
    "help": {
      "name": "Help",
    },
  };
  const map = tocGen(toc, "foo");
  assertEquals(map, new Map([
    ["foo/basics", "Basics"],
    ["foo/help", "Help"],
  ]));
});
