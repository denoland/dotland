// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchPackageData,
  MAX_AGE_1_DAY,
  packages,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    const { pkg } = match;
    const pkgData = packages.get(pkg) ?? await fetchPackageData(pkg);
    const body = {
      kind: "markdown",
      value:
        `**${pkgData.name}**\n\n${pkgData.description}\n\n[code](https://deno.land/x/${pkg})${
          pkgData.stars ? ` | stars: _${pkgData.stars}_` : ""
        }\n\n`,
    };
    return new Response(JSON.stringify(body), {
      headers: {
        "cache-control": MAX_AGE_1_DAY,
        "content-type": "application/json",
      },
    });
  },
};

export const config: PageConfig = {
  routeOverride: "/_api/details/x/:pkg",
};
