// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { CSS } from "$gfm";
import { Handlers } from "$fresh/server.ts";

// This route responds to GET requests to /gfm.css with the GFM CSS from the
// x/gfm module (plus some minor style tweaks to make it play nice with twind).

const css = `${CSS}
.markdown-body ul {
  list-style: disc
}
.markdown-body ol {
  list-style: numeric
}
.markdown-body table {
  width: fit-content;
}
.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
  font-family: Lexend, sans-serif;
  border-bottom: none;
}
`;

export const handler: Handlers = {
  GET: () => {
    return new Response(css, {
      headers: {
        "content-type": "text/css",
      },
    });
  },
};
