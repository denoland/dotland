/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import { accepts } from "https://deno.land/x/oak_commons@0.1.1/negotiation.ts";

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

/** The _legacy_ v1 configuration file. This will be provided to any client
 * which does not indicate it is capable of understanding the v2 registry
 * (earlier than Deno 1.17.1) */
const configV1: RegistryConfig = {
  version: 1,
  registries: [
    {
      schema: "/x/:module([a-z0-9_]*)@:version?/:path*",
      variables: [
        {
          key: "module",
          url: "https://api.deno.land/modules?simple=1",
        },
        {
          key: "version",
          url: "https://deno.land/_vsc1/modules/${module}",
        },
        {
          key: "path",
          url: "https://deno.land/_vsc1/modules/${module}/v/${{version}}",
        },
      ],
    },
    {
      schema: "/x/:module([a-z0-9_]*)/:path*",
      variables: [
        {
          key: "module",
          url: "https://api.deno.land/modules?simple=1",
        },
        {
          key: "path",
          url: "https://deno.land/_vsc1/modules/${module}/v_latest",
        },
      ],
    },
    {
      schema: "/std@:version?/:path*",
      variables: [
        {
          key: "version",
          url: "https://deno.land/_vsc1/modules/std",
        },
        {
          key: "path",
          url: "https://deno.land/_vsc1/modules/std/v/${{version}}",
        },
      ],
    },
    {
      schema: "/std/:path*",
      variables: [
        {
          key: "path",
          url: "https://deno.land/_vsc1/modules/std/v_latest",
        },
      ],
    },
  ],
};

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
          documentation: "/_api/details/x/${module}",
          url: "/_api/x/${module}",
        },
        {
          key: "version",
          documentation: "/_api/details/x/${module}/${{version}}",
          url: "/_api/x/${module}/${{version}}",
        },
        {
          key: "path",
          documentation: "/_api/details/x/${module}/${{version}}/${path}",
          url: "/_api/x/${module}/${{version}}/${path}",
        },
      ],
    },
    {
      schema: "/x/:module([a-z0-9_]*)/:path*",
      variables: [
        {
          key: "module",
          documentation: "/_api/details/x/${module}",
          url: "/_api/x/${module}",
        },
        {
          key: "path",
          documentation: "/_api/details/x/${module}/_latest/${path}",
          url: "/_api/x/${module}/_latest/${path}",
        },
      ],
    },
    {
      schema: "/std@:version?/:path*",
      variables: [
        {
          key: "version",
          documentation: "/_api/details/std/${{version}}",
          url: "/_api/x/std/${{version}}",
        },
        {
          key: "path",
          documentation: "/_api/details/std/${{version}}/${path}",
          url: "/_api/x/std/${{version}}/${path}",
        },
      ],
    },
    {
      schema: "/std/:path*",
      variables: [
        {
          key: "path",
          documentation: "/_api/details/std/_latest/${path}",
          url: "/_api/x/std/_latest/${path}",
        },
      ],
    },
  ],
};

/** Provide the v1 or v2 registry configuration based on the accepts header
 * provided by the client.  Deno 1.17.1 and later indicates it accepts a
 * configuration of v2. */
export function handleConfigRequest(request: Request): Promise<Response> {
  let body: unknown;
  let contentType = "application/json";
  const accept = request.headers.get("accept");
  if (
    accept !== null && accept !== "*/*" &&
    accepts(request, "application/vnd.deno.reg.v2+json")
  ) {
    contentType = "application/vnd.deno.reg.v2+json";
    body = configV2;
  } else {
    body = configV1;
  }
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: {
        "cache-control": MAX_AGE_1_DAY,
        "content-type": contentType,
      },
    }),
  );
}
