import assert from "assert";
import DATABASE from "../database.json";

export async function proxy(pathname) {
  if (pathname.startsWith("/std")) {
    return proxy("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return null;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, "");
  const [nameBranch, ...rest] = nameBranchRest.split("/");
  const [name, branch] = nameBranch.split("@", 2);
  const path = rest.join("/");
  const entry = await getEntry(name, branch);
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
export async function getEntry(name, branch = null) {
  // denoland/deno_std was merged into denoland/deno. For a while we will try
  // to maintain old links for backwards compatibility with denoland/deno_std
  // but eventually tags before v0.20.0 will break.
  if (
    name === "std" &&
    branch != null &&
    (branch === "v0.7.0" ||
      branch === "v0.8.0" ||
      branch === "v0.9.0" ||
      branch === "v0.10.0" ||
      branch === "v0.11.0" ||
      branch === "v0.12.0" ||
      branch === "v0.13.0" ||
      branch === "v0.14.0" ||
      branch === "v0.15.0" ||
      branch === "v0.16.0" ||
      branch === "v0.17.0" ||
      branch === "v0.18.0" ||
      branch === "v0.19.0" ||
      branch === "v0.20.0" ||
      branch.startsWith("8c90bd") ||
      branch.startsWith("17a214") ||
      branch.startsWith("6958a4"))
  ) {
    name = "std_old";
  }

  const rawEntry = DATABASE[name];
  if (!rawEntry) {
    return null;
  } else if (rawEntry.type === "url") {
    const version = branch == null ? "master" : branch;
    return {
      name,
      branch,
      raw: rawEntry,
      type: "url",
      url: rawEntry.url.replace(/\$\{b}/, version),
      repo: rawEntry.repo.replace(/\$\{b}/, version)
    };
  } else if (rawEntry.type === "esm") {
    const version = branch === null ? "latest" : branch;
    return {
      name,
      branch,
      raw: rawEntry,
      type: "esm",
      url: rawEntry.url.replace(/\$\{v}/, version),
      repo: rawEntry.repo.replace(/\$\{v}/, version)
    };
  } else if (rawEntry.type === "github") {
    const branch_ =
      branch == null
        ? await getGithubLatestVersion(rawEntry.owner, rawEntry.repo)
            .catch(() => getGithubLatestCommit(rawEntry.owner, rawEntry.repo))
            .catch(() => "master")
        : branch;
    const path = rawEntry.path || "";
    const url = `https://raw.githubusercontent.com/${rawEntry.owner}/${rawEntry.repo}/${branch_}/${path}`;
    const repo = `https://github.com/${rawEntry.owner}/${rawEntry.repo}/tree/${branch_}/${path}`;
    return {
      name,
      branch: branch_,
      raw: rawEntry,
      type: "github",
      url,
      repo
    };
  }
  return null;
}

async function getGithubLatestVersion(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  );
  if (response.ok) {
    return (await response.json())["tag_name"];
  } else {
    throw new Error(
      `Couldn't fetch latest version of https://github.com/${owner}/${repo}`
    );
  }
}

async function getGithubLatestCommit(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
  );
  if (response.ok) {
    return (await response.json())[0]["sha"].substring(0, 6);
  } else {
    throw new Error(
      `Couldn't fetch latest commit of https://github.com/${owner}/${repo}`
    );
  }
}
