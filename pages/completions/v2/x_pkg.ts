// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../../deps.ts";
import { Handlers } from "../../../server_deps.ts";
import {
  getFuse,
  getInitialPackageList,
  MAX_AGE_1_HOUR,
} from "../../../util/completions_utils.ts";

export const handler: Handlers = {
  async GET({ match }) {
    const { pkg } = match;
    if (!pkg) {
      return new Response(
        JSON.stringify({
          items: await getInitialPackageList(),
          isIncomplete: true,
        }),
        {
          headers: {
            "cache-control": MAX_AGE_1_HOUR,
            "content-type": "application/json",
          },
        },
      );
    } else {
      const fuse = await getFuse();
      const foundItems = fuse.search(pkg);
      const found: string[] = foundItems.map(({ item }: { item: string }) =>
        item
      );
      const items = found.slice(0, 100);
      const body = {
        items,
        isIncomplete: found.length > items.length,
        preselect: (foundItems[0].score === 0) ? foundItems[0].item : undefined,
      };
      return new Response(JSON.stringify(body), {
        headers: {
          "cache-control": MAX_AGE_1_HOUR,
          "content-type": "application/json",
        },
      });
    }
  },
};

export const config: PageConfig = {
  routeOverride: "/_api/x/{:pkg}?",
};
