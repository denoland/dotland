import { gfmCSS } from "../server_deps.ts";

// This route responds to GET requests to /gfm.css with the GFM CSS from the
// x/gfm module (plus some minor style tweaks to make it play nice with twind).

const CSS = `${gfmCSS}
.markdown-body ul {
  list-style: disc
}
.markdown-body ol {
  list-style: numeric
}
`;

export const handler = {
  GET: () => {
    return new Response(CSS, {
      headers: {
        "content-type": "text/css",
      },
    });
  },
};
