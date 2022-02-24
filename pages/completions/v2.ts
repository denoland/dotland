// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig, twas } from "../../deps.ts";
import { Fuse, HandlerContext, prettyBytes } from "../../server_deps.ts";
import { S3_BUCKET } from "../../util/registry_utils.ts";

interface ApiModuleData {
  name: string;
  description: string;
  "star_count": number;
}

interface ApiModuleResponse {
  data: ApiModuleData;
}

interface ApiModuleSearchResponse {
  data: { results: ApiModuleData[] };
}

interface MetaVersionJson {
  latest: string;
  versions: string[];
}

interface MetaFileJson {
  path: string;
  size: number;
  type: "dir" | "file";
}

interface MetaJson {
  "uploaded_at": string;
  "directory_listing": MetaFileJson[];
  "upload_options": {
    type: string;
    repository: string;
    ref: string;
  };
}

interface PackageData {
  name: string;
  description: string;
  stars: number;
}

const MODULE_LIST = "https://api.deno.land/modules?simple=1";
const INITIAL_LIST = "https://api.deno.land/modules?limit=50&sort=stars";
const MAX_AGE_1_HOUR = "max-age=3600";
const MAX_AGE_1_DAY = "max-age=86400";
const IMMUTABLE = "max-age=2628000, immutable";

let fuse = new Fuse([], { includeScore: true, distance: 10 });
/** If the index searching hasn't been updated in > 120 seconds, it will be
 * refreshed before processing the next request, meaning the index of packages
 * will be kept fresh. */
let fuseUpdated = 0;

/** A cache of all the package data retrieved from api.deno.land.
 *
 * Since this data only contains the description and the star count, which
 * are likely to change slowly, and don't materially impact the responses, the
 * cached values will be reset when the worker is restarted, which is likely
 * sufficient invalidation. */
const packages = new Map<string, PackageData>();
/** The initial list of packages displayed when there is no specific package
 * being searched for.  Currently this will be the top 50 packages/modules in
 * the registry order by star count. */
let initialList: string[];
/** A cache of all the package data retrieved from the S3 bucket. */
const packageMeta = new Map<string, Map<string, MetaJson>>();
/** A cache of a modules version data retrieved from the S3 bucket. */
const versions = new Map<string, MetaVersionJson>();
/** We will cache versions of packages/modules for up to 5 minutes before
 * considering them state, and clearing them out. */
let versionsInvalidated = Date.now();

/** Descriptions of the packages/modules that are in `std`.
 *
 * TODO(@kitsonk): move to `std` as a JSON file which is retrieved. */
const stdDescriptions: Record<string, string> = {
  archive: "Utilities for handling archive formatted files",
  async: "Utilities for helping with asynchronous tasks",
  bytes: "Helper functions to manipulate byte slices",
  collections:
    "Pure functions for handling common tasks around collection types",
  crypto: "Extensions to the web crypto APIs",
  datetime:
    "A helper function to parse date strings into `Date` objects and additional functions",
  encoding: "Helper modules for dealing with encoded data structures",
  examples:
    "Small scripts that demonstrate use of Deno and its standard modules",
  flags: "Command line arguments parser for Deno based on minimist",
  fmt: "Utilities for formatting strings for output",
  fs: "Helpers associated with file system tasks",
  hash: "**DEPRECATED** Use the Web Crypto APIs or `std/crypto` instead",
  http: "Wrapper utilities for Deno's built-in HTTP server",
  io: "Utility functions and classes to assist with IO tasks",
  log: "A logging framework",
  mime: "A utility for handling multi-part encoded bodies",
  node: "Utilities and polyfills for Node.js built-in modules",
  path: "Utility functions for manipulating file paths",
  permissions: "A utility for granting sets of permissions in one API call",
  signal: "A module used to capture and monitor OS signals",
  streams:
    "Utilities for working with Deno `Reader`/`Writer` interfaces and web streams",
  testing: "Utilities for making testing easier and consistent in Deno",
  textproto: "A port of Go's textproto",
  uuid: "Utilities for generating v1, v4, and v5 UUIDs",
  wasi: "Provides an implementation of the WebAssembly System Interface",
};

/** Cache the response from api.deno.land. */
function cacheResponse({ data: { results } }: ApiModuleSearchResponse) {
  for (const { name, description, star_count } of results) {
    packages.set(name, { name, description, stars: star_count });
  }
}

/** Invalidates the cache of version information if it older than 5 minutes. */
function checkVersionsFreshness(): void {
  const now = Date.now();
  if (versionsInvalidated + 300_000 < now) {
    versionsInvalidated = now;
    versions.clear();
  }
}

/** Fetch the meta data for a specific package/module and version from the S3
 * bucket. */
async function fetchMeta(pkg: string, ver: string): Promise<MetaJson> {
  if (!packageMeta.has(pkg)) {
    packageMeta.set(pkg, new Map());
  }
  const versionsMeta = packageMeta.get(pkg)!;
  const res = await fetch(`${S3_BUCKET}${pkg}/versions/${ver}/meta/meta.json`);
  if (res.status === 200) {
    versionsMeta.set(ver, await res.json());
  } else {
    versionsMeta.set(ver, {
      uploaded_at: "",
      directory_listing: [],
      upload_options: { type: "", repository: "", ref: "" },
    });
  }
  return versionsMeta.get(ver)!;
}

/** Fetch the version data for a specific package/module from the S3 bucket. */
async function fetchVersions(pkg: string): Promise<MetaVersionJson> {
  const res = await fetch(`${S3_BUCKET}${pkg}/meta/versions.json`);
  if (res.status === 200) {
    versions.set(pkg, await res.json());
  } else {
    versions.set(pkg, { latest: "", versions: [] });
  }
  return versions.get(pkg)!;
}

/** Fetch package data from api.deno.land for a specific package/module. */
async function fetchPackageData(pkg: string): Promise<PackageData> {
  const res = await fetch(`https://api.deno.land/modules/${pkg}`);
  if (res.status === 200) {
    const { data: { name, description, star_count: stars } }:
      ApiModuleResponse = await res.json();
    packages.set(pkg, {
      name,
      description,
      stars,
    });
  } else {
    packages.set(pkg, {
      name: pkg,
      description: "",
      stars: 0,
    });
  }
  return packages.get(pkg)!;
}

/** Lazily update the module list for searching with fuse every 2 minutes and
 * return a reference. */
async function getFuse(): Promise<Fuse> {
  const now = Date.now();
  if (fuseUpdated + 120_000 < now) {
    fuseUpdated = now;
    const res = await fetch(MODULE_LIST);
    if (res.status === 200) {
      fuse = new Fuse(await res.json(), { includeScore: true, distance: 10 });
    }
  }
  return fuse;
}

/** Get the initial package list to send to the client when no specific module
 * is being searched for. */
async function getInitialPackageList() {
  if (!initialList) {
    const res = await fetch(INITIAL_LIST);
    if (res.status !== 200) {
      throw new Error("bad api response");
    }
    const json: ApiModuleSearchResponse = await res.json();
    cacheResponse(json);
    initialList = toItems(json);
  }
  return initialList;
}

/** Given a package, return its latest version. */
async function getLatestVersion(pkg: string): Promise<string> {
  checkVersionsFreshness();
  const data = versions.get(pkg) ?? await fetchVersions(pkg);
  return data.latest;
}

function getMeta(pkg: string, ver: string): MetaJson | undefined {
  return packageMeta.get(pkg)?.get(ver);
}

/** When dealing with a path, try to preselect the most logical module for the
 * user. */
function getPreselectPath(items: string[]): string | undefined {
  // preselect anything that appears to be a root file in order
  const preselect = [
    "mod.ts",
    "mod.js",
    "main.ts",
    "main.js",
    "lib.ts",
    "lib.js",
    "index.ts",
    "index.mjs",
    "index.js",
  ]
    .find((i) => items.includes(i));
  if (preselect) {
    return preselect;
  }
  // when navigating subdirs, then preselect the first thing we encounter that
  // appears to be an root file in the subdir
  return items.find((i) =>
    [
      "/mod.ts",
      "/mod.js",
      "/main.ts",
      "/main.js",
      "/lib.ts",
      "/lib.js",
      "/index.ts",
      "/index.mjs",
      "/index.js",
    ].find((s) => i.endsWith(s))
  );
}

/** Given a package and optionally the current path, return a set of items
 * that allows sub navigation of a directory structure. */
function toFileItems(meta: MetaJson, currentPath = ""): string[] {
  let dirs: string[] = [];
  let items: string[] = [];
  for (const { path, type } of meta.directory_listing) {
    if (
      type === "dir" && path.startsWith(`/${currentPath}`) &&
      path !== (`/${currentPath}`) &&
      !path.match(/\/[_.]/)
    ) {
      dirs.push(`${path.slice(1)}/`);
    } else if (
      path.startsWith(`/${currentPath}`) && path !== (`/${currentPath}`) &&
      !path.match(/\/[_.]/) &&
      path.match(/\.(jsx?|tsx?|mjs|cjs|mts|cts|json)$/i)
    ) {
      items.push(path.slice(1));
    }
  }
  dirs = dirs.filter((dir) => items.some((item) => item.startsWith(dir)));
  dirs = dirs.filter((dir) =>
    !dir.replace(currentPath, "").slice(0, -1).includes("/")
  );
  items = items.filter((item) => !dirs.some((dir) => item.startsWith(dir)));
  return [...dirs, ...items];
}

/** Convert an API search response into a list of module/package names. */
function toItems({ data: { results } }: ApiModuleSearchResponse) {
  return results.map(({ name }) => name);
}

function toPathDocs(
  pkg: string,
  ver: string,
  path: string,
  meta: MetaJson,
): string {
  const matchPath = `/${path}`;
  const listing =
    meta.directory_listing.find(({ path }) => path === matchPath) ??
      { size: 0, type: "file", path: "" };
  const { size, type } = listing;
  return type === "file"
    ? `[docs](https://doc.deno.land/https://deno.land/x/${pkg}@${ver}/${path}) | [code](https://deno.land/x/${pkg}@${ver}/${path}) | size: ${
      prettyBytes(size)
    }\n`
    : `[code](https://deno.land/x/${pkg}@${ver}/${path}) | size: ${
      prettyBytes(size)
    }`;
}

function toStdVersionDocs(
  ver: string,
  meta: MetaJson,
): string {
  return `**Deno \`std\` library @ ${ver}**\n\nA collection of modules to assist with common tasks in Deno.\n\n[code](https://deno.land/std@${ver}) | published: _${
    twas(new Date(meta.uploaded_at))
  }_\n\n`;
}

function toStdPathDocs(ver: string, path: string, meta: MetaJson): string {
  const matchPath = `/${path}`;
  const listing =
    meta.directory_listing.find(({ path }) => path === matchPath) ??
      { size: 0, type: "file", path: "" };
  const { size, type } = listing;
  const [mod] = path && path.includes("/") ? path.split("/") : [path];
  const leading = mod in stdDescriptions
    ? `**${mod}**\n\n${stdDescriptions[mod] ?? ""}\n\n`
    : "";
  const body = type === "file"
    ? `[docs](https://doc.deno.land/https://deno.land/std@${ver}/${path}) | [code](https://deno.land/std@${ver}/${path}) | size: ${
      prettyBytes(size)
    }\n`
    : `[code](https://deno.land/std@${ver}/${path}) | size: ${
      prettyBytes(size)
    }`;
  return `${leading}${body}`;
}

function toVersionDocs(
  pkgData: PackageData,
  ver: string,
  meta: MetaJson,
): string {
  return `**${pkgData.name} @ ${ver}**\n\n${pkgData.description}\n\n[code](https://deno.land/x/${pkgData.name}@${ver}) | published: _${
    twas(new Date(meta.uploaded_at))
  }_${pkgData.stars ? ` | stars: _${pkgData.stars}_` : ""}\n\n`;
}

// /_api/details/x/:pkg
async function handlePackageDetails(
  match: URLPatternResult,
): Promise<Response> {
  const { pkg } = match.pathname.groups;
  const pkgData = packages.get(pkg) ?? await fetchPackageData(pkg);
  const body = {
    kind: "markdown",
    value:
      `**${pkgData.name}**\n\n${pkgData.description}\n\n[code](https://deno.land/x/${pkg})${
        pkgData.stars ? ` | stars: _${pkgData.stars}_` : ""
      }\n\n`,
  };
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: {
        "cache-control": MAX_AGE_1_DAY,
        "content-type": "application/json",
      },
    }),
  );
}

// /_api/x/:pkg
async function handlePackages(match: URLPatternResult): Promise<Response> {
  const { pkg } = match.pathname.groups;
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

// /_api/x/:pkg/:ver/:path
async function handlePaths(match: URLPatternResult): Promise<Response> {
  let { pkg, ver, path } = match.pathname.groups;
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

// /_api/x/:pkg/:ver
async function handleVersions(match: URLPatternResult): Promise<Response> {
  const { pkg, ver } = match.pathname.groups;
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

// /_api/details/x/:pkg/:ver/:path
async function handlePathDetails(match: URLPatternResult): Promise<Response> {
  let { pkg, ver, path } = match.pathname.groups;
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

// /_api/details/std/:ver
async function handleStdVersionDetails(
  match: URLPatternResult,
): Promise<Response> {
  const { ver } = match.pathname.groups;
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

// /_api/details/std/:ver/:path
async function handleStdPathDetails(
  match: URLPatternResult,
): Promise<Response> {
  let { ver, path } = match.pathname.groups;
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

// /_api/details/x/:pkg/:ver
async function handleVersionDetails(
  match: URLPatternResult,
): Promise<Response> {
  const { pkg, ver } = match.pathname.groups;
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

/** Routes that get matched and delegated to sub handlers.*/
const patterns: [string, (match: URLPatternResult) => Promise<Response>][] = [
  ["/_api/x/{:pkg}?", handlePackages],
  ["/_api/details/x/:pkg", handlePackageDetails],
  ["/_api/x/:pkg/{:ver}?", handleVersions],
  ["/_api/details/x/:pkg/:ver", handleVersionDetails],
  ["/_api/x/:pkg/:ver/:path*{/}?", handlePaths],
  ["/_api/details/x/:pkg/:ver/:path*{/}?", handlePathDetails],

  ["/_api/details/std/:ver", handleStdVersionDetails],
  ["/_api/details/std/:ver/:path*{/}?", handleStdPathDetails],
];

/** Handle registry v2 API requests. */
export function handler({ req }: HandlerContext) {
  for (const [pattern, handler] of patterns) {
    const result = new URLPattern(pattern, req.url).exec(req.url);
    if (result) {
      try {
        return handler(result);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "internal error";
        return Promise.resolve(
          new Response(msg, { status: 500, statusText: "InternalError" }),
        );
      }
    }
  }
  return Promise.resolve(
    new Response(null, {
      status: 404,
      statusText: "NotFound",
    }),
  );
}

export const config: PageConfig = {
  routeOverride: "/_api/",
};
