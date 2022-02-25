// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchMeta,
  getLatestVersion,
  getMeta,
  getPreselectPath,
  IMMUTABLE,
  toFileItems,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    let { pkg, ver, path } = match;
    if (ver === "_latest") {
      ver = await getLatestVersion(pkg);
    }
    const meta = getMeta(pkg, ver) ?? await fetchMeta(pkg, ver);
    const items = toFileItems(meta, path);
    const body = {
      items,
      isIncomplete: true,
      preselect: getPreselectPath(items),
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
  routeOverride: "/_api/x/:pkg/:ver/:path*{/}?",
};
