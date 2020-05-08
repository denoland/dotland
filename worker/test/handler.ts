import { expect } from "chai";
import { needsWarning, handleRequest } from "../src/handler";

describe("worker proxying", () => {
  it("/ responds with React html", async () => {
    const result = await handleRequest(new Request("https://deno.land/"));
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("needsWarning", async () => {
    expect(needsWarning("/std/http/server.ts")).to.equal(true);
    expect(needsWarning("/std@v0.1.2/http/server.ts")).to.equal(false);
    expect(needsWarning("/x/foo/bar.txt")).to.equal(false);
    expect(needsWarning("/index.html")).to.equal(false);
  });

  it("/typedoc/ responds with typedoc", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/typedoc/")
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include("<title>Deno | deno</title>");
  }).timeout("5000");

  it("/std/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("/std/http/server.ts had x-deno-warning", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/http/server.ts")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    expect(result.headers.get("X-Deno-Warning")).to.include("master branch");
    expect(result.headers.get("X-Deno-Warning")).to.include("/std/http/server.ts");
    const text = await result.text();
    expect(text).to.include("import");
  }).timeout("5000");

  it("/x/std/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include('content="A third party module for Deno."');
  }).timeout("5000");

  it("/x/std/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");

  it("/std@v0.42.0/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.42.0/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("/std@v0.42.0/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.42.0/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");

  it("/x/std@0.42.0/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.42.0/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include('content="A third party module for Deno."');
  }).timeout("5000");

  it("/x/std@v0.42.0/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@v0.42.0/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");
});
