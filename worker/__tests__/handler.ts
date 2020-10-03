/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { fetch, URL, Request, Response } from "@dollarshaveclub/cloudworker";
import { handleRequest, extractAltLineNumberReference } from "../src/handler";

/* eslint-env jest */

beforeAll(() => {
  // set up global namespace for worker environment
  Object.assign(global, { fetch, URL, Request, Response });
});

describe("worker proxying", () => {
  test("/ responds with React html", async () => {
    const result = await handleRequest(new Request("https://deno.land/"));
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("Deno");
  }, 5000);

  it("/std/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("Deno");
  }, 5000);

  it("/x/std/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("Deno");
  }, 5000);

  it("/x/std/version.ts with no Accept responds with redirect", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts")
    );
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toContain("@");
    expect(result.headers.get("X-Deno-Warning")).toContain("latest");
    expect(result.headers.get("X-Deno-Warning")).toContain("/std/version.ts");
  }, 5000);

  it("/std@v0.50.0/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("Deno");
  }, 5000);

  it("/std@v0.50.0/version.ts with no Accept responds with raw typescript", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/version.ts")
    );
    expect(result.headers.get("Content-Type")).toContain(
      "application/typescript"
    );
    const text = await result.text();
    expect(text).toContain("/** Version of the Deno standard modules");
  }, 5000);

  it("/x/std@0.50.0/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("Deno");
  }, 5000);

  it("/x/std@v0.50.0/version.ts with no Accept responds with raw typescript", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/version.ts")
    );
    expect(result.headers.get("Content-Type")).toContain(
      "application/typescript"
    );
    const text = await result.text();
    expect(text).toContain("/** Version of the Deno standard modules");
  }, 5000);

  it("/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/fs/mod.ts:5:3", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toContain("/std/fs/mod.ts#L5");
  }, 5000);

  it("/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@0.50.0/fs/mod.ts:5:3", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toContain(
      "/std@0.50.0/fs/mod.ts#L5"
    );
  }, 5000);

  it("/x/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/fs/mod.ts:5:3", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toContain("/x/std/fs/mod.ts#L5");
  }, 5000);

  it("/x/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.50.0/fs/mod.ts:5:3", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toContain(
      "/x/std@0.50.0/fs/mod.ts#L5"
    );
  }, 5000);
});

describe("unit tests", () => {
  it("extractAltLineNumberReference", () => {
    expect(
      extractAltLineNumberReference("https://deno.land/x/std/fs/mod.ts:5:3")
    ).toEqual({
      rest: "https://deno.land/x/std/fs/mod.ts",
      line: 5,
    });
    expect(
      extractAltLineNumberReference(
        "https://deno.land/x/std@0.50.0/fs/mod:ts:5:3"
      )
    ).toEqual({
      rest: "https://deno.land/x/std@0.50.0/fs/mod:ts",
      line: 5,
    });
    expect(
      extractAltLineNumberReference(
        "https://deno.land/x/std@0.50.0/fs/mod.ts:a:3"
      )
    ).toEqual(null);
    expect(
      extractAltLineNumberReference(
        "https://deno.land/x/std@0.50.0/fs/mod.ts:5:a"
      )
    ).toEqual(null);
    expect(
      extractAltLineNumberReference(
        "https://deno.land/x/std@0.50.0/fs/mod.ts:a:a"
      )
    ).toEqual(null);
    expect(
      extractAltLineNumberReference("https://deno.land/x/std@0.50.0/fs/mod.ts")
    ).toEqual(null);
  });
});
