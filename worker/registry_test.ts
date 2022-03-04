// Copyright 2020 the Deno authors. All rights reserved. MIT license.
import { parsePathname } from "./registry.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("parsePathname", () => {
  assertEquals(parsePathname("/std@0.108.0/testing/asserts.ts"), {
    module: "std",
    version: "0.108.0",
    path: "testing/asserts.ts",
  });
  assertEquals(parsePathname("/std%400.108.0/testing/asserts.ts"), {
    module: "std",
    version: "0.108.0",
    path: "testing/asserts.ts",
  });
  assertEquals(parsePathname("/x/oak@v9.0.1/mod.ts"), {
    module: "oak",
    version: "v9.0.1",
    path: "mod.ts",
  });
});
