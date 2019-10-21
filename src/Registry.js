import React from "react";
import { Breadcrumbs, Box } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import assert from "assert";
import Markdown from "./Markdown";
import CodeBlock from "./CodeBlock";
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

function proxy(pathname) {
  if (pathname.startsWith("/core") || pathname.startsWith("/std")) {
    console.log("proxy", pathname);
    return proxy("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return null;
  }

  const i = pathname.indexOf("/", 3);
  const rest = pathname.slice(i + 1);
  const nameBranch = pathname.slice(3, i);
  let [name, branch] = nameBranch.split("@", 2);
  const entry = getEntry(name, branch);

  if (!entry || !entry.url) {
    return null;
  }

  assert(entry.url.endsWith("/"));
  assert(!rest.startsWith("/"));
  return { entry, path: rest };
}

function Registry(params) {
  const [state, setState] = React.useState({ contents: "loading", rUrl: null });
  const location = useLocation();

  React.useEffect(
    () => {
      const { pathname } = location;
      const { entry, path } = proxy(pathname);
      const rUrl = `${entry.url}${path}`;
      console.log("fetch", rUrl);
      fetch(rUrl).then(async response => {
        const m = await response.text();
        setState({ contents: m, rUrl });
      });
    },
    [location]
  );

  let contentComponent;
  if (state.rUrl) {
    if (state.rUrl.endsWith(".md")) {
      contentComponent = <Markdown source={state.contents} />;
    } else {
      // TODO(ry) pass language to CodeBlock.
      contentComponent = <CodeBlock value={state.contents} />;
    }
  }

  return (
    <Box>
      <Breadcrumbs separator="/">
        {location.pathname.split("/").map((part, i) => {
          // TODO(ry) Fix link destination in breadcrumbs.
          return (
            <Link to="/" key={i}>
              {part}
            </Link>
          );
        })}
      </Breadcrumbs>
      {contentComponent}
    </Box>
  );
}

export default Registry;
