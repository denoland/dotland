// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  fetchMeta,
  getMeta,
  IMMUTABLE,
  toStdVersionDocs,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    const { ver } = match;
    const meta = getMeta("std", ver) ?? await fetchMeta("std", ver);
    const body = {
      kind: "markdown",
      value: toStdVersionDocs(ver, meta),
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
  routeOverride: "/_api/details/std/:ver",
};
