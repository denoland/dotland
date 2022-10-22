// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  checkVersionsFreshness,
  fetchMeta,
  fetchPackageData,
  fetchVersions,
  getFuse,
  getInitialPackageList,
  getLatestVersion,
  getMeta,
  getPreselectPath,
  IMMUTABLE,
  MAX_AGE_1_DAY,
  MAX_AGE_1_HOUR,
  packages,
  toFileItems,
  toPathDocs,
  toStdPathDocs,
  toStdVersionDocs,
  toVersionDocs,
  versions,
} from "./util/completions_utils.ts";
import { HandlerContext } from "$router";

async function detailsStdVer(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function detailsStdVerPath(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function detailsXPkg(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
  const { pkg } = match;
  const pkgData = packages.get(pkg) ?? await fetchPackageData(pkg);
  const body = {
    kind: "markdown",
    value:
      `**${pkgData.name}**\n\n${pkgData.description}\n\n[docs](https://deno.land/x/${pkg})${
        pkgData.stars ? ` | stars: _${pkgData.stars}_` : ""
      }\n\n`,
  };
  return new Response(JSON.stringify(body), {
    headers: {
      "cache-control": MAX_AGE_1_DAY,
      "content-type": "application/json",
    },
  });
}

async function detailsXPkgVer(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function detailsXPkgVerPath(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function xPkg(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function xPkgVer(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

async function xPkgVerPath(
  _req: Request,
  _ctx: HandlerContext,
  match: Record<string, string>,
) {
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
}

export const routes = {
  "/_api/details/std/:ver": detailsStdVer,
  "/_api/details/std/:ver/:path*{/}?": detailsStdVerPath,
  "/_api/details/x/:pkg": detailsXPkg,
  "/_api/details/x/:pkg/:ver": detailsXPkgVer,
  "/_api/details/x/:pkg/:ver/:path*{/}?": detailsXPkgVerPath,
  "/_api/x/{:pkg}?": xPkg,
  "/_api/x/:pkg/{:ver}?": xPkgVer,
  "/_api/x/:pkg/:ver/:path*{/}?": xPkgVerPath,
};
