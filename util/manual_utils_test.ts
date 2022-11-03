// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  generateToC,
  getDocURL,
  getFileURL,
  getTableOfContents,
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

Deno.test("generateToC", () => {
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
        "linking_to_external_code": {
          "name": "Using Third Party Modules",
          "redirectFrom": ["/linking_to_external_code"],
        },
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
  const { pageList, redirectList } = generateToC(toc, "foo");
  assertEquals(
    pageList,
    [
      { path: "foo/basics", name: "Basics" },
      {
        path: "foo/basics/import_export",
        name: "Importing and Exporting Modules",
      },
      { path: "foo/basics/node", name: "Importing npm modules" },
      {
        path: "foo/basics/node/npm_specifiers",
        name: "Using Node.js Packages with npm Specifiers",
      },
      { path: "foo/basics/node/cdns", name: "Using Node.js Packages Via CDNs" },
      { path: "foo/basics/node/std_node", name: "The std/node Library" },
      { path: "foo/basics/node/import_maps", name: "Using Import Maps" },
      { path: "foo/basics/node/faqs", name: "Frequently Asked Questions" },
      { path: "foo/basics/standard_library", name: "Standard Library" },
      {
        path: "foo/basics/linking_to_external_code",
        name: "Using Third Party Modules",
      },
      { path: "foo/basics/permissions", name: "Permissions" },
      {
        path: "foo/basics/connecting_to_databases",
        name: "Connecting to Databases",
      },
      { path: "foo/basics/env_variables", name: "Environment Variables" },
      { path: "foo/basics/testing", name: "Testing" },
      { path: "foo/basics/testing/assertions", name: "Assertions" },
      { path: "foo/basics/testing/coverage", name: "Coverage" },
      { path: "foo/basics/testing/documentation", name: "Documentation" },
      { path: "foo/basics/testing/sanitizers", name: "Sanitizers" },
      {
        path: "foo/basics/testing/behavior_driven_development",
        name: "Behavior-Driven Development",
      },
      { path: "foo/basics/testing/mocking", name: "Mocking" },
      { path: "foo/basics/testing/snapshot_testing", name: "Snapshots" },
      { path: "foo/basics/debugging_your_code", name: "Debugging Your Code" },
      { path: "foo/help", name: "Help" },
    ],
  );

  assertEquals(
    redirectList,
    { "/linking_to_external_code": "foo/basics/linking_to_external_code" },
  );
});
