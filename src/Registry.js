import React from "react";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import assert from "assert";
import Markdown from "./Markdown";
import CodeBlock from "./CodeBlock";
import PathBreadcrumbs from "./PathBreadcrumbs";
import { proxy, getEntry } from "./registry_utils";

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
