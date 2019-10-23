import assert from "assert";
export const DATABASE = require("./database.json");

export function proxy(pathname) {
  if (pathname.startsWith("/std")) {
    console.log("proxy", pathname);
    return proxy("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return null;
  }

  const nameBranchRest = pathname.replace(/^\/x\//, "");
  console.log("nameBranchRest", nameBranchRest);
  let [nameBranch, ...rest] = nameBranchRest.split("/");
  let [name, branch] = nameBranch.split("@", 2);

  const path = rest.join("/");

  console.log("getEntry", { name, branch, path });
  const entry = getEntry(name, branch);

  if (!entry || !entry.url) {
    return null;
  }

  assert(entry.url.endsWith("/"));
  assert(!path.startsWith("/"));
  return { entry, path };
}

/**
 * Pull an entry from the database
 * @param  {string} name
 * @param  {string}                branch
 * @return {import('./types').Entry}
 */
export function getEntry(name, branch = "master") {
  // denoland/deno_std was merged into denoland/deno. For a while we will try
  // to maintain old links for backwards compatibility with denoland/deno_std
  // but eventually tags before v0.20.0 will break.
  if (
    name === "std" &&
    (branch === "v0.16.0" ||
      branch === "v0.17.0" ||
      branch === "v0.18.0" ||
      branch === "v0.19.0" ||
      branch === "v0.20.0")
  ) {
    name = "std_old";
  }

  const rawEntry = DATABASE[name];
  if (!rawEntry) {
    return null;
  } else if (rawEntry.type === "url") {
    return {
      name,
      branch,
      raw: rawEntry,
      type: "url",
      url: rawEntry.url.replace(/\$\{b}/, branch),
      repo: rawEntry.repo.replace(/\$\{b}/, branch)
    };
  }
  if (rawEntry.type === "esm") {
    const version = branch === "master" ? "latest" : branch;
    return {
      name,
      raw: rawEntry,
      type: "esm",
      url: rawEntry.url.replace(/\$\{v}/, version),
      repo: rawEntry.repo.replace(/\$\{v}/, version)
    };
  }
  if (rawEntry.type === "github") {
    return {
      name,
      branch,
      raw: rawEntry,
      type: "github",
      url: `https://raw.githubusercontent.com/${rawEntry.owner}/${
        rawEntry.repo
      }/${branch}${rawEntry.path || "/"}`,
      repo: `https://github.com/${rawEntry.owner}/${rawEntry.repo}${
        rawEntry.path ? `/tree/${branch}${rawEntry.path || "/"}` : ""
      }`
    };
  }
  return null;
}
