import React from "react";
import { Box } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import Markdown from "./Markdown";
import CodeBlock from "./CodeBlock";
import { proxy } from "./registry_utils";

export default function Registry(params) {
  const [state, setState] = React.useState({
    contents: "loading",
    rUrl: null,
    dir: null
  });
  const location = useLocation();

  React.useEffect(
    () => {
      const { pathname } = location;
      let { entry, path } = proxy(pathname);
      console.log({ path });
      if (!path || path.endsWith("/")) {
        // Render dir.
        renderDir(path, entry).then(dir => {
          console.log({ dir });
          setState({ dir });
        });
      } else {
        // Render file.
        const rUrl = `${entry.url}${path}`;
        console.log("fetch", rUrl);
        fetch(rUrl).then(async response => {
          const m = await response.text();
          setState({ contents: m, rUrl });
        });
      }
    },
    [location]
  );

  let contentComponent;
  if (state.dir) {
    const entries = [];
    for (let d of state.dir) {
      const name = d.type !== "dir" ? d.name : d.name + "/";
      entries.push(
        <tr>
          <td>{d.type}</td>
          <td>{d.size}</td>
          <td>
            <Link to={name}>{name}</Link>
          </td>
        </tr>
      );
    }
    contentComponent = <table>{entries}</table>;
  } else {
    if (state.rUrl && state.rUrl.endsWith(".md")) {
      contentComponent = <Markdown source={state.contents} />;
    } else {
      // TODO(ry) pass language to CodeBlock.
      contentComponent = <CodeBlock value={state.contents} />;
    }
  }

  return <Box>{contentComponent}</Box>;
}

async function renderDir(pathname, entry) {
  console.log({ pathname, entry });
  if (entry.raw.type === "github") {
    const owner = entry.raw.owner;
    const repo = entry.raw.repo;
    const path = [entry.raw.path, pathname].join('');
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${entry.branch}`;
    console.log("renderDir", url);
    const res = await fetch(url, {
      headers: {
        //authorization:
        //  process.env.GH_TOKEN && "token " + process.env.GH_TOKEN,
        accept: "application/vnd.github.v3.object"
      }
    });
    if (res.status !== 200) {
      throw Error(
        `Got an error (${
          res.status
        }) when querying the GitHub API:\n${await res.text()}`
      );
    }
    const data = await res.json();
    if (data.type !== "dir") {
      throw Error(
        `Unexpected type ${
          data.type
        } when querying the GitHub API:\n${JSON.stringify(data, null, 2)}`
      );
    }

    return data.entries.map(entry => ({
      name: entry.name,
      type: entry.type, // "file" | "dir" | "symlink"
      size: entry.size, // file only
      target: entry.target // symlink only
    }));
  }
}
