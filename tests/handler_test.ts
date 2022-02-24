// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { assert, assertEquals } from "../test_deps.ts";
import { extractAltLineNumberReference } from "../util/registry_utils.ts";

import { ServerContext } from "../server_deps.ts";
import routes from "../routes.gen.ts";
const handleRequest = (await ServerContext.fromRoutes(routes)).handler();

/** This is taken directly from a recent version of Chromium */
const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
const DENO_CLI_ACCEPT = "*/*";

Deno.test({
  name: "/ responds with React html",
  async fn() {
    const result = await handleRequest(new Request("https://deno.land/"));
    const contentType = result.headers.get("Content-Type");
    assert(contentType);
    assert(contentType.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/std/version.ts with Accept: 'text/html' responds with React html",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std/version.ts", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/x/std/version.ts with Accept: 'text/html' responds with React html",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/x/std/version.ts with Deno CLI Accept responds with redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts", {
        headers: { Accept: DENO_CLI_ACCEPT },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes("@"));
    assert(result.headers.get("X-Deno-Warning")?.includes("latest"));
    assert(result.headers.get("X-Deno-Warning")?.includes("/std/version.ts"));
    assertEquals(result.headers.get("Access-Control-Allow-Origin"), "*");
  },
});

Deno.test({
  name:
    "/std@v0.50.0/version.ts with Accept: 'text/html' responds with React html",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name:
    "/std@v0.50.0/version.ts with Deno CLI Accept responds with raw typescript",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts", {
        headers: { Accept: DENO_CLI_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes(
      "application/typescript",
    ));
    assertEquals(result.headers.get("Access-Control-Allow-Origin"), "*");
    const text = await result.text();
    assert(text.includes("/** Version of the Deno standard modules"));
  },
});

Deno.test({
  name:
    "/x/std@0.50.0/version.ts with Accept: 'text/html' responds with React html",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/version.ts", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name:
    "/x/std@v0.50.0/version.ts with Deno CLI Accept responds with raw typescript",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/version.ts", {
        headers: { Accept: DENO_CLI_ACCEPT },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes(
      "application/typescript",
    ));
    assertEquals(result.headers.get("Access-Control-Allow-Origin"), "*");
    const text = await result.text();
    assert(text.includes("/** Version of the Deno standard modules"));
  },
});

Deno.test({
  name:
    "/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std/fs/mod.ts:5:3", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes("/std/fs/mod.ts#L5"));
  },
});

Deno.test({
  name:
    "/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/fs/mod.ts:5:3", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes(
      "/std@0.50.0/fs/mod.ts#L5",
    ));
  },
});

Deno.test({
  name:
    "/x/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/fs/mod.ts:5:3", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes("/x/std/fs/mod.ts#L5"));
  },
});

Deno.test({
  name:
    "/x/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/fs/mod.ts:5:3", {
        headers: { Accept: BROWSER_ACCEPT },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes(
      "/x/std@0.50.0/fs/mod.ts#L5",
    ));
  },
});

Deno.test({
  name: "/install.sh responds with /x/install/install.sh redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/install.sh"),
    );
    assertEquals(result.status, 307);
    assert(result.headers.get("Location")?.includes(
      "/x/install/install.sh",
    ));
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
