// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  checkVersionsFreshness,
  fetchVersions,
  MAX_AGE_1_HOUR,
  versions,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    const { pkg, ver } = match;
    checkVersionsFreshness();
    const versionInfo = versions.get(pkg) ?? await fetchVersions(pkg);
    const items = ver
      ? versionInfo.versions.filter((v) => v.startsWith(ver))
      : versionInfo.versions;
    const body = {
      items,
      isIncomplete: false,
      preselect: items.find((v) => v === versionInfo.latest),
    };
    return new Response(JSON.stringify(body), {
      headers: {
        "cache-control": MAX_AGE_1_HOUR,
        "content-type": "application/json",
      },
    });
  },
};

export const config: PageConfig = {
  routeOverride: "/_api/x/:pkg/{:ver}?",
};
