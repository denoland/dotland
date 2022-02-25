// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchMeta,
  fetchPackageData,
  getMeta,
  IMMUTABLE,
  packages,
  toVersionDocs,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    const { pkg, ver } = match;
    const pkgData = packages.get(pkg) ?? await fetchPackageData(pkg);
    const meta = getMeta(pkg, ver) ?? await fetchMeta(pkg, ver);
    const body = {
      kind: "markdown",
      value: toVersionDocs(pkgData, ver, meta),
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
  routeOverride: "/_api/details/x/:pkg/:ver",
};
