import React from "react";
import { Breadcrumbs, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import assert from "assert";
import Markdown from "./Markdown";
const DATABASE = require("./database.json");

/**
 * Pull an entry from the database
 * @param  {string} name
 * @param  {string}                branch
 * @return {import('./types').Entry}
 */
function getEntry(name, branch = "master") {
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

function matchParamsToModule({
  stdPath,
  stdVersion,
  modName,
  modVersion,
  modPath
}) {
  if (stdPath) {
    assert(!modName && !modPath && !modVersion);
    return { name: "std", version: stdVersion, path: stdPath };
  } else {
    assert(!stdPath && !stdVersion);
    return { name: modName, version: modVersion, path: modPath };
  }
}

function Registry(params) {
  const { match } = params;
  const mod = matchParamsToModule(match.params);

  const entry = getEntry(mod.name, mod.version);
  const rUrl = entry.url + mod.path;

  const [state, setState] = React.useState({ contents: "loading" });

  React.useEffect(() => {
    fetch(rUrl).then(async response => {
      const m = await response.text();
      setState({ contents: m });
    });
  });

  console.log("rUrl", rUrl);
  console.log("entry", entry);
  console.log("entry", mod);

  return (
    <Box>
      <Breadcrumbs separator="/">
        {params.location.pathname.split("/").map(part => {
          return <Link href="/">{part}</Link>;
        })}
      </Breadcrumbs>
      {/* TODO handle types other than markdown */}
      <Markdown source={state.contents} />
    </Box>
  );
}

export default Registry;
