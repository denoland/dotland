import { expect } from "chai";
import { handleRequest } from "../src/handler";

describe("worker proxying", () => {
  it("/ responds with React html", async () => {
    const result = await handleRequest(new Request("https://deno.land/"));
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
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

  it("/std/manual.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/manual.md", {
        headers: { Accept: "text/html" }
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
    );
  }).timeout("5000");

  it("/std/manual.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std/manual.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Manual");
  }).timeout("5000");

  it("/x/std/manual.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/manual.md", {
        headers: { Accept: "text/html" }
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
    );
  }).timeout("5000");

  it("/x/std/manual.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std/manual.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Manual");
  }).timeout("5000");

  it("/std@v0.34.0/manual.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.34.0/manual.md", {
        headers: { Accept: "text/html" }
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
    );
  }).timeout("5000");

  it("/std@v0.34.0/manual.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/std@v0.34.0/manual.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Manual");
  }).timeout("5000");

  it("/x/std@0.34.0/manual.md with Accept: 'text/html' responds with React html", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@0.34.0/manual.md", {
        headers: { Accept: "text/html" }
      })
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
    );
  }).timeout("5000");

  it("/x/std@v0.34.0/manual.md with no Accept responds with raw markdown", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/x/std@v0.34.0/manual.md")
    );
    expect(result.headers.get("Content-Type")).to.include("text/plain");
    const text = await result.text();
    expect(text).to.include("# Deno Manual");
  }).timeout("5000");
});
