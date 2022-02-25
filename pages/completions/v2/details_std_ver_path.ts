// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchMeta,
  getLatestVersion,
  getMeta,
  IMMUTABLE,
  toStdPathDocs,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    let { ver, path } = match;
    if (ver === "_latest") {
      ver = await getLatestVersion("std");
    }
    const meta = getMeta("std", ver) ?? await fetchMeta("std", ver);
    const body = {
      kind: "markdown",
      value: toStdPathDocs(ver, path, meta),
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
  routeOverride: "/_api/details/std/:ver/:path*{/}?",
};
