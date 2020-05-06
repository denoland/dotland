import { expect } from "chai";
import { handleRequest } from "../src/handler";

describe("worker proxying", () => {
  it("/ responds with React html", async () => {
    const result = await handleRequest(new Request("https://deno.land/"));
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

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

  it("/std/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");

  it("/x/std/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("/x/std/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");

  it("/std@v0.34.0/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.34.0/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("/std@v0.34.0/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.34.0/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");

  it("/x/std@0.34.0/style_guide.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.34.0/style_guide.md", {
        headers: { Accept: "text/html" },
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno, a secure runtime for JavaScript and TypeScript."'
    );
  }).timeout("5000");

  it("/x/std@v0.34.0/style_guide.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@v0.34.0/style_guide.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Style Guide");
  }).timeout("5000");
});
