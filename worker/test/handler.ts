import { expect } from "chai";
import { handleRequest } from "../src/handler";

describe("handler returns response with request method", () => {
  it("/ responds with React html", async () => {
    const result = await handleRequest(new Request("https://deno.land/"));
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include(
      'content="Deno is a secure JavaScript and TypeScript runtime"'
    );
  });

  it("/typedoc/ responds with typedoc", async () => {
    const result = await handleRequest(
      new Request("https://deno.land/typedoc/")
    );
    expect(result.headers.get("Content-Type")).to.include("text/html");
    const text = await result.text();
    expect(text).to.include("<title>Deno | deno</title>");
  });
});
