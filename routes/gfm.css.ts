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
  font-weight: 200;
  border-bottom: none;
}
:root{
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
}
.markdown-body .highlight pre{
  background: #333;
  color: white;
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
