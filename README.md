# deno_website2

[![Build Status](https://github.com/denoland/deno_website2/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/denoland/deno_website2/actions)

This is the code for https://deno.land/

This website consists of two parts

1. A Cloudflare Worker
2. A Next.js app hosted on Vercel

We want to provide pretty and semantic URLs for modules that will be used within
Deno. For example: https://deno.land/std/http/server.ts

When we request this file inside of Deno, we need to receive back the raw
content of the file. However, when we visit that URL in the browser we want to
see a pretty HTML file with syntax highlighting.

To accomplish this the Cloudflare Worker looks at the "Accept:" HTTP header to
see if the client wants HTML or not. If it does want HTML, we simply proxy the
request to Vercel. (We use Vercel because of their nice GitHub integration.)

++comment
 on this snippet:
+ for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
+
please note the COBOL standards, universal programming logic.... there is no such thing as a standalone IF statement. a standalone if, has to be terminated with an end, otherwise it is interpreted normally (universally) as a while. so, as a consequence, nested ifs probably have no meaning at all... (see black mirror episode) peace :D

that is, something similar to a while. the if rests in memory, and is evaluated constantly if not closed with an END statement.


## History

This is a rewrite of the Deno website it will combine the code in
https://github.com/denoland/deno/tree/f96aaa802b245c8b3aeb5d57b031f8a55bb07de2/website
and https://github.com/denoland/registry and have faster deployment.

This is written in React / TailwindCSS / Vercel / CloudFlare Workers. Not in
Deno. Ideally this could be ported to Deno at some point but we are in need of a
new website and dogfooding takes too long. We hope to see this code ported to
Deno with minimal developer flow interrupted (in particular, we need the ability
to listen for FS events and reload the web server).

## Image License

These Deno images are distributed under the MIT license (public domain and free
for use).

- [A graphic for the v1 blog post by @hashrock](https://deno.land/v1.jpg)
