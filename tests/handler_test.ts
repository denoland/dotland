// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { assert, assertEquals, assertStringIncludes } from "../test_deps.ts";
import { extractAltLineNumberReference } from "../util/registry_utils.ts";

import { ServerContext } from "../server_deps.ts";
import routes from "../routes.gen.ts";
const handleRequest = (await ServerContext.fromRoutes(routes)).handler();

/** This is taken directly from a recent version of Chromium */
const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
const DENO_CLI_ACCEPT = "*/*";

Deno.test({
  name: "/ responds with html",
  async fn() {
    const res = await handleRequest(new Request("https://deno.land/"));
    assert(res.headers.get("Content-Type")?.includes("text/html"));
    const text = await res.text();
    assertStringIncludes(
      text,
      "<title>Deno - A modern runtime for JavaScript and TypeScript</title>",
    );
  },
});

Deno.test({
  name: "/std@0.127.0/version.ts with Accept: 'text/html' responds with html",
  sanitizeResources: false, // TODO(@crowlKats): this shouldnt be required, something wrong with fetch resource consumption
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/std@0.127.0/version.ts", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assert(res.headers.get("Content-Type")?.includes("text/html"));
    const text = await res.text();
    assertStringIncludes(text, "<title>std@0.127.0 | Deno</title>");
  },
});

Deno.test({
  name: "/std/version.ts with Deno CLI Accept responds with redirect",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/x/std/version.ts", {
        headers: { Accept: DENO_CLI_ACCEPT },
      }),
    );
    assertEquals(res.status, 302);
    assert(res.headers.get("Location")?.includes("@"));
    assert(res.headers.get("X-Deno-Warning")?.includes("latest"));
    assert(res.headers.get("X-Deno-Warning")?.includes("/std/version.ts"));
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
  },
});

Deno.test({
  name:
    "/std@v0.127.0/version.ts with Deno CLI Accept responds with raw typescript",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/std@0.127.0/version.ts", {
        headers: { Accept: DENO_CLI_ACCEPT },
      }),
    );
    assert(res.headers.get("Content-Type")?.includes("application/typescript"));
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
    const text = await res.text();
    assertStringIncludes(text, "/** Version of the Deno standard modules");
  },
});

Deno.test({
  name:
    "/std@0.127.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/std@0.127.0/fs/mod.ts:5:3", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assertEquals(res.status, 302);
    assert(res.headers.get("Location")?.includes("/std@0.127.0/fs/mod.ts#L5"));
  },
});

Deno.test({
  name: "/install.sh responds with /x/install/install.sh redirect",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/install.sh"),
    );
    assertEquals(res.status, 307);
    assert(res.headers.get("Location")?.includes("/x/install/install.sh"));
  },
});

Deno.test({
  name: "extractAltLineNumberReference",
  fn() {
    type TestCase = {
      url: string;
      expected: { rest: string; line: number } | null;
    };

    const cases: TestCase[] = [
      {
        url: "https://deno.land/x/std/fs/mod.ts:5:3",
        expected: {
          rest: "https://deno.land/x/std/fs/mod.ts",
          line: 5,
        },
      },
      {
        url: "https://deno.land/x/std@0.50.0/fs/mod:ts:5:3",
        expected: {
          rest: "https://deno.land/x/std@0.50.0/fs/mod:ts",
          line: 5,
        },
      },
      {
        url: "https://deno.land/x/std@0.50.0/fs/mod.ts:a:3",
        expected: null,
      },
      {
        url: "https://deno.land/x/std@0.50.0/fs/mod.ts:5:a",
        expected: null,
      },
      {
        url: "https://deno.land/x/std@0.50.0/fs/mod.ts:a:a",
        expected: null,
      },
      {
        url: "https://deno.land/x/std@0.50.0/fs/mod.ts",
        expected: null,
      },
    ];

    for (const { url, expected } of cases) {
      const actual = extractAltLineNumberReference(url);
      assertEquals(actual, expected);
    }
  },
});
