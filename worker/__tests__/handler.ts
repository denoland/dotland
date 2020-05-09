import { fetch, URL, Request, Response } from "@dollarshaveclub/cloudworker";
import { needsWarning, handleRequest } from "../src/handler";

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
    expect(text).toContain(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }, 5000);

  test("needsWarning", async () => {
    expect(needsWarning("/std/http/server.ts")).toEqual(true);
    expect(needsWarning("/std@v0.1.2/http/server.ts")).toEqual(false);
    expect(needsWarning("/x/foo/bar.txt")).toEqual(false);
    expect(needsWarning("/index.html")).toEqual(false);
  });

  it("/typedoc/ responds with typedoc", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/typedoc/")
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain("<title>Deno | deno</title>");
  }, 5000);

  it("/std/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }, 5000);

  it("/std/http/server.ts had x-deno-warning", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/http/server.ts")
    );
    expect(result.headers.get("Content-Type")).toContain("text/plain");
    expect(result.headers.get("X-Deno-Warning")).toContain("master branch");
    expect(result.headers.get("X-Deno-Warning")).toContain(
      "/std/http/server.ts"
    );
    const text = await result.text();
    expect(text).toContain("import");
  }, 5000);

  it("/x/std/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain('content="A third party module for Deno."');
  }, 5000);

  it("/x/std/version.ts with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/version.ts")
    );
    expect(result.headers.get("Content-Type")).toContain("text/plain");
    const text = await result.text();
    expect(text).toContain("/** Version of the Deno standard modules");
  }, 5000);

  it("/std@v0.50.0/version.ts with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.50.0/version.ts", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).toContain("text/html");
    const text = await result.text();
    expect(text).toContain(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }, 5000);

  it("/std@v0.50.0/version.ts with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.50.0/version.ts")
    );
    expect(result.headers.get("Content-Type")).toContain("text/plain");
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
    expect(text).toContain('content="A third party module for Deno."');
  }, 5000);

  it("/x/std@v0.50.0/version.ts with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@v0.50.0/version.ts")
    );
    expect(result.headers.get("Content-Type")).toContain("text/plain");
    const text = await result.text();
    expect(text).toContain("/** Version of the Deno standard modules");
  }, 5000);
});
