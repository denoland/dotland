# deno_website2

[![Build Status](https://github.com/denoland/deno_website2/workflows/ci/badge.svg?branch=master&event=push)](https://github.com/denoland/deno/actions)

This is the code for https://deno.land/

This website consists of two parts

1. A Cloudflare Worker
2. A next.js app hosted on ZEIT Now

We want to provide pretty and semantic URLs for modules that will be used within
deno. For example: https://deno.land/std/http/server.ts

When we request this file inside of Deno, we need to receive back the raw
content of the file. However, when we visit that URL in the browser we want to
see a pretty HTML file with syntax highlighting.

To accomplish this the Cloudflare worker looks at the "Accept:" HTTP header to
see if the client wants HTML or not. If it does want HTML, we simply proxy the
request to ZEIT Now. (We use ZEIT Now because of their nice GitHub integration.)

## History

This is a rewrite of the Deno website it will combine the code in
https://github.com/denoland/deno/tree/master/website and
https://github.com/denoland/registry and have faster deployment.

This is written in React / MaterialUI / ZEIT Now / CloudFlare Workers. Not in
Deno. Ideally this could be ported to Deno at some point but we are in need of a
new website and dogfooding takes too long. We hope to see this code ported to
Deno with minimal developer flow interrupted (in particular, we need the ability
to listen for FS events and reload the web server).
