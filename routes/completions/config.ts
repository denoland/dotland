// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { RouteConfig } from "$fresh/server.ts";
import { accepts } from "$oak_commons";

interface RegistryDefVariable {
  key: string;
  documentation?: string;
  url: string;
}

interface RegistryDef {
  schema: string;
  variables: RegistryDefVariable[];
}

interface RegistryConfig {
  version: 1 | 2;
  registries: RegistryDef[];
}

const MAX_AGE_1_DAY = "max-age=86400";
const APILAND_URL = "https://apiland-8vkh4yhxnpf0.deno.dev";

/** This is the v2 registry configuration which provides documentation
 * endpoints and allows incremental completion/search of variables. */
const configV2: RegistryConfig = {
  version: 2,
  registries: [
    {
      schema: "/x/:module([a-z0-9_]+)@:version?/:path*",
      variables: [
        {
          key: "module",
          documentation: APILAND_URL + "/completions/resolve/${module}",
          url: APILAND_URL + "/completions/items/${module}",
        },
        {
          key: "version",
          documentation: APILAND_URL +
            "/completions/resolve/${module}/${{version}}",
          url: APILAND_URL + "/completions/items/${module}/${{version}}",
        },
        {
          key: "path",
          documentation: APILAND_URL +
            "/completions/resolve/${module}/${{version}}/${path}",
          url: APILAND_URL +
            "/completions/items/${module}/${{version}}/${path}",
        },
      ],
    },
    {
      schema: "/x/:module([a-z0-9_]*)/:path*",
      variables: [
        {
          key: "module",
          documentation: APILAND_URL + "/completions/resolve/${module}",
          url: APILAND_URL + "/completions/items/${module}",
        },
        {
          key: "path",
          documentation: APILAND_URL +
            "/completions/resolve/${module}/__latest__/${path}",
          url: APILAND_URL + "/completions/items/${module}/__latest__/${path}",
        },
      ],
    },
    {
      schema: "/std@:version?/:path*",
      variables: [
        {
          key: "version",
          documentation: APILAND_URL + "/completions/resolve/std/${{version}}",
          url: APILAND_URL + "/completions/items/std/${{version}}",
        },
        {
          key: "path",
          documentation: APILAND_URL +
            "/completions/resolve/std/${{version}}/${path}",
          url: APILAND_URL + "/completions/items/std/${{version}}/${path}",
        },
      ],
    },
    {
      schema: "/std/:path*",
      variables: [
        {
          key: "path",
          documentation: APILAND_URL +
            "/completions/resolve/std/__latest__/${path}",
          url: APILAND_URL + "/completions/items/std/__latest__/${path}",
        },
      ],
    },
  ],
};

/** Provide the v1 or v2 registry configuration based on the accepts header
 * provided by the client.  Deno 1.17.1 and later indicates it accepts a
 * configuration of v2. */
export function handler(req: Request) {
  const accept = req.headers.get("accept");
  const acceptsV2 = accept !== null && accept !== "*/*" &&
    accepts(req, "application/vnd.deno.reg.v2+json");
  if (!acceptsV2) {
    return new Response(
      "The v1 registry completions API is not supported anymore. Please upgrade to Deno v1.17.1 or later.",
      { status: 404 },
    );
  }
  return Response.json(configV2, {
    headers: {
      "cache-control": MAX_AGE_1_DAY,
      "content-type": "application/vnd.deno.reg.v2+json",
    },
  });
}

export const config: RouteConfig = {
  routeOverride: "/.well-known/deno-import-intellisense.json",
};
