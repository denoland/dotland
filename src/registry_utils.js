export const DATABASE = require("./database.json");

/**
 * Pull an entry from the database
 * @param  {string} name
 * @param  {string}                branch
 * @return {import('./types').Entry}
 */
export function getEntry(name, branch = "master") {
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
