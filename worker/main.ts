/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRequest } from "./src/handler.ts";
import { serve, ServerRequest } from "./deps.ts";

const addr = Deno.args[0] || "[::]:8080";
const server = serve(addr);

async function proxyRequest(sreq: ServerRequest): Promise<void> {
  let hostname = sreq.headers.get("Host");
  sreq.headers.delete("Connection");
  if (hostname === "") {
    hostname = "deno.land";
  }
  const url = `https://${hostname}${sreq.url}`;
  let resp: Response;

  if (sreq.headers.get("X-Forwarded-Proto") === "http") {
    resp = Response.redirect(url, 301);
  } else {
    const req = new Request(
      url,
      { method: sreq.method, headers: sreq.headers },
    );
    resp = await handleRequest(req);
  }
  const headers = resp.headers;
  let body = await resp.arrayBuffer(); // TODO: make streaming body work

  sreq.respond({
    headers,
    body: new Uint8Array(body),
  }); // TODO: gross, need to fixup Deno response mismatch
}

console.log(`Proxy listening on http://${addr}/`);
for await (const req of server) {
  proxyRequest(req);
}
