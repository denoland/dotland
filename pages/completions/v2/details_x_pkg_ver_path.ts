// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchMeta,
  getLatestVersion,
  getMeta,
  IMMUTABLE,
  toPathDocs,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    let { pkg, ver, path } = match;
    if (ver === "_latest") {
      ver = await getLatestVersion(pkg);
    }
    const meta = getMeta(pkg, ver) ?? await fetchMeta(pkg, ver);
    const body = {
      kind: "markdown",
      value: toPathDocs(pkg, ver, path, meta),
    };
    return new Response(JSON.stringify(body), {
      headers: {
        "cache-control": IMMUTABLE,
        "content-type": "application/json",
      },
    });
  },
};

export const config: PageConfig = {
  routeOverride: "/_api/details/x/:pkg/:ver/:path*{/}?",
};
