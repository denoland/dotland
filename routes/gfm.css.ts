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
