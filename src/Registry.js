import React from "react";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import assert from "assert";
import Markdown from "./Markdown";
import CodeBlock from "./CodeBlock";
import PathBreadcrumbs from "./PathBreadcrumbs";
import { getEntry } from "./registry_utils";

function proxy(pathname) {
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

export default function Registry(params) {
  const [state, setState] = React.useState({ contents: "loading", rUrl: null });
  const location = useLocation();

  React.useEffect(
    () => {
      const { pathname } = location;
      let { entry, path } = proxy(pathname);
      if (!path) {
        path = "README.md";
      }
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
      <PathBreadcrumbs />
      {contentComponent}
    </Box>
  );
}
