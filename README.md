# dotland

[![Build Status](https://github.com/denoland/dotland/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/denoland/dotland/actions)

This is the code for https://deno.land/

We want to provide pretty and semantic URLs for modules that will be used within
Deno. For example: https://deno.land/std/http/server.ts

When we request this file inside of Deno, we need to receive back the raw
content of the file. However, when we visit that URL in the browser we want to
see a pretty HTML file with syntax highlighting.

To accomplish this, we look at the "Accept:" HTTP header to see if the client
wants HTML or not. If it does want HTML, we simply render the html, else we
proxy the file contents from S3 buckets.

For questions or problems regarding modules, please e-mail modules@deno.com.

## Image License

These Deno images are distributed under the MIT license (public domain and free
for use).

- [A graphic for the v1 blog post by @hashrock](https://deno.land/v1.png)
