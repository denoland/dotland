import React from "react";
import { Box, Button, Link, ButtonGroup } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { HashLink as RouterLink } from "react-router-hash-link";
import Markdown from "./Markdown";
import CodeBlock from "./CodeBlock";
import Docs from "./Docs";
import { proxy } from "./registry_utils";
import Spinner from "./Spinner";

export default function Registry() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, setState] = React.useState({
    contents: null,
    rawUrl: null,
    repoUrl: null,
    dir: null
  });
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    setIsLoading(true);
    const { entry, path } = proxy(pathname);
    console.log({ path });
    if (!path || path.endsWith("/")) {
      // Render dir.
      const repoUrl = `${entry.repo}${path}`;
      renderDir(path, entry).then(dir => {
        console.log({ dir });
        setState({ dir, repoUrl });
        setIsLoading(false);
      });
    } else {
      // Render file.
      const rawUrl = `${entry.url}${path}`;
      const repoUrl = `${entry.repo}${path}`;
      console.log("fetch", rawUrl);
      fetch(rawUrl).then(async response => {
        const m = await response.text();
        setState({ contents: m, rawUrl, repoUrl });
        setIsLoading(false);
      });
    }
  }, [pathname]);

  let contentComponent;
  if (isLoading) {
    contentComponent = <Spinner />;
  } else if (state.dir) {
    const entries = [];
    for (const d of state.dir) {
      const name = d.type !== "dir" ? d.name : d.name + "/";
      entries.push(
        <tr key={name}>
          <td>{d.type}</td>
          <td>{d.size}</td>
          <td>
            <Link component={RouterLink} to={name}>
              {name}
            </Link>
          </td>
        </tr>
      );
    }
    contentComponent = (
      <div>
        <ButtonGroup color="primary">
          <Button href={state.repoUrl}>Repository</Button>
        </ButtonGroup>
        <br />
        <br />
        <table>
          <tbody>{entries}</tbody>
        </table>
      </div>
    );
  } else {
    const isMarkdown = state.rawUrl && state.rawUrl.endsWith(".md");
    const hasDocsAvailable = state.rawUrl && state.rawUrl.endsWith(".ts");
    const isDocsPage = search.includes("doc") && state.contents;
    contentComponent = (
      <div>
        <ButtonGroup color="primary">
          {isDocsPage ? (
            <Button component={RouterLink} to="?">
              Source Code
            </Button>
          ) : hasDocsAvailable ? (
            <Button component={RouterLink} to="?doc">
              Documentation
            </Button>
          ) : null}
          {state.repoUrl ? (
            <Button href={state.repoUrl}>Repository</Button>
          ) : null}
          {state.rawUrl ? <Button href={state.rawUrl}>Raw</Button> : null}
        </ButtonGroup>
        {(() => {
          if (isMarkdown) {
            return <Markdown source={state.contents} />;
          } else if (isDocsPage) {
            if (hasDocsAvailable) {
              return <Docs source={state.contents} />;
            } else {
              return <CodeBlock value="No documentation avaiable." />;
            }
          } else {
            return <CodeBlock value={state.contents} />;
          }
        })()}
      </div>
    );
  }

  return <Box>{contentComponent}</Box>;
}

async function renderDir(pathname, entry) {
  console.log({ pathname, entry });
  if (entry.raw.type === "github") {
    const owner = entry.raw.owner;
    const repo = entry.raw.repo;
    const path = [entry.raw.path, pathname].join("");
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
