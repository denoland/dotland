/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import { assert, assertEquals } from "./test_deps.ts";
import { extractAltLineNumberReference, handleRequest } from "./handler.ts";

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
        headers: { Accept: "text/html" },
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
        headers: { Accept: "text/html" },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/x/std/version.ts with no Accept responds with redirect",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts"),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes("@"));
    assert(result.headers.get("X-Deno-Warning")?.includes("latest"));
    assert(result.headers.get("X-Deno-Warning")?.includes("/std/version.ts"));
  },
});

Deno.test({
  name:
    "/std@v0.50.0/version.ts with Accept: 'text/html' responds with React html",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts", {
        headers: { Accept: "text/html" },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/std@v0.50.0/version.ts with no Accept responds with raw typescript",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts"),
    );
    assert(result.headers.get("Content-Type")?.includes(
      "application/typescript",
    ));
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
        headers: { Accept: "text/html" },
      }),
    );
    assert(result.headers.get("Content-Type")?.includes("text/html"));
    const text = await result.text();
    assert(text.includes("Deno"));
  },
});

Deno.test({
  name: "/x/std@v0.50.0/version.ts with no Accept responds with raw typescript",
  async fn() {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/version.ts"),
    );
    assert(result.headers.get("Content-Type")?.includes(
      "application/typescript",
    ));
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
        headers: { Accept: "text/html" },
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
        headers: { Accept: "text/html" },
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
        headers: { Accept: "text/html" },
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
        headers: { Accept: "text/html" },
      }),
    );
    assertEquals(result.status, 302);
    assert(result.headers.get("Location")?.includes(
      "/x/std@0.50.0/fs/mod.ts#L5",
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
