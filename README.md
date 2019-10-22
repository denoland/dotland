This is a rewrite of the Deno website it will combine the code in
https://github.com/denoland/deno/tree/master/website
and https://github.com/denoland/registry and have faster deployment.

This is written in React / MaterialUI / Netlify / CloudFlare Workers. Not in
Deno. Ideally this could be ported to Deno at some point but we are in need of a
new website and dogfooding takes too long. We hope to see this code ported to
Deno with minimal developer flow interrupted (in particular, we need the ability
to listen for FS events and reload the web server).
