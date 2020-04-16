import React from "react";
import { Box, ButtonGroup } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import Link from "../component/Link";
import Button from "../component/Button";
import Spinner from "../component/Spinner";
import Title from "../component/Title";
import { proxy } from "../util/registry_utils";

const CodeBlock = React.lazy(() => import("../component/CodeBlock"));
const Markdown = React.lazy(() => import("../component/Markdown"));

export default function Registry() {
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, setState] = React.useState({
    contents: null,
    rawUrl: null,
    repoUrl: null,
    dir: null
  });
  const { pathname, search, hash } = useLocation();
  const firstSelectedLine = React.useRef(null);
  React.useEffect(() => {
    setIsLoading(true);
    const x = proxy(pathname);
    if (!x || !x.entry) {
      setState({
        contents: "Module not found in database."
      });
      setIsLoading(false);
      return;
    }
    const { entry, path } = x;
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
        if (response.status === 404) {
          try {
            await renderDir(path, entry);
            history.replace(path + "/");
          } catch {
            console.log("also not a directory", path);
          }
        }

        const m = await response.text();
        setState({
          contents: m,
          rawUrl,
          repoUrl
        });
        setIsLoading(false);
        if (firstSelectedLine.current) {
          window.scrollTo(0, firstSelectedLine.current.offsetTop);
        }
      });
    }
  }, [pathname, history]);

  const lineSelectionRangeMatch = hash.match(/^#L(\d+)(?:-L(\d+))?$/) || [];
  lineSelectionRangeMatch.shift(); // Get rid of complete match
  // Handle highlighting "#LX" (same as range [X, X])
  if (
    lineSelectionRangeMatch.length > 0 &&
    lineSelectionRangeMatch[1] === undefined
  ) {
    lineSelectionRangeMatch[1] = lineSelectionRangeMatch[0];
  }
  const lineSelectionRange = lineSelectionRangeMatch.map(Number);

  let contentComponent;
  if (isLoading) {
    contentComponent = <Spinner />;
  } else if (state.dir) {
    const { body, files } = state.dir;
    const entries = [];
    for (const d of files) {
      const name = d.type !== "dir" ? d.name : d.name + "/";
      entries.push(
        <tr key={name}>
          <td>{d.type}</td>
          <td>{d.size}</td>
          <td>
            <Link
              to={name}
              style={name.toLowerCase() === "readme.md" ? readmeStyle : null}
            >
              {name}
            </Link>
          </td>
        </tr>
      );
    }

    contentComponent = (
      <div>
        <ButtonGroup size="small" variant="text" color="primary">
          <Button to={state.repoUrl}>Repository</Button>
        </ButtonGroup>
        <br />
        <br />
        {entries.length > 0 && (
          <table>
            <tbody>{entries}</tbody>
          </table>
        )}
        {body && <Markdown source={body} />}
      </div>
    );
  } else {
    const isMarkdown = state.rawUrl && state.rawUrl.endsWith(".md");
    const docsURL = `https://doc.deno.land/https/deno.land/${pathname}`;
    if (search.includes("doc") && state.contents) {
      window.location.href = docsURL;
    }
    contentComponent = (
      <div>
        <ButtonGroup size="small" variant="text" color="primary">
          <Button to={docsURL}>Documentation</Button>
          {state.repoUrl ? (
            <Button to={state.repoUrl}>Repository</Button>
          ) : null}
          {state.rawUrl ? <Button to={state.rawUrl}>Raw</Button> : null}
        </ButtonGroup>
        {(() => {
          if (isMarkdown) {
            return <Markdown source={state.contents} />;
          } else {
            return (
              <CodeBlock
                showLineNumbers={true}
                value={state.contents}
                language={
                  state.rawUrl
                    ? state.rawUrl.substr(state.rawUrl.lastIndexOf(".") + 1)
                    : "text"
                }
                lineProps={lineNumber => {
                  const lineProps = {};
                  if (
                    lineNumber >= lineSelectionRange[0] &&
                    lineNumber <= lineSelectionRange[1]
                  ) {
                    lineProps.className = "hljs-selection";
                  }
                  if (lineNumber === lineSelectionRange[0]) {
                    lineProps.ref = firstSelectedLine;
                  }
                  return lineProps;
                }}
              />
            );
          }
        })()}
      </div>
    );
  }

  return (
    <Box>
      <Title>Deno {pathname}</Title>
      {contentComponent}
    </Box>
  );
}

const readmeStyle = {
  fontWeight: "900"
};

async function renderDir(pathname, entry) {
  console.log({ pathname, entry });
  const entryType = entry.raw.type;
  if (entryType === "github" || entryType === "esm") {
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

    const files = data.entries.map(entry => ({
      name: entry.name,
      type: entry.type, // "file" | "dir" | "symlink"
      size: entry.size, // file only
      target: entry.target // symlink only
    }));

    let body;

    // no useful files exist in the repository, so opt to attempt
    // showing the contents of the README file instead if it exists.
    const readme = files.find(
      entry => entry.name.toLowerCase() === "readme.md"
    );

    if (readme) {
      const rawUrl =
        entryType === "esm"
          ? `${entry.url}${path}${readme.name}`
          : `https://raw.githubusercontent.com/${owner}/${repo}/${entry.branch}/${path}${readme.name}`;
      try {
        const response = await fetch(rawUrl);
        if (response.ok) body = await response.text();
      } catch (e) {
        // ignore
      }
    }

    return { body, files };
  }

  return {
    body: `Directories not yet supported for entry type ${entry.raw.type}.`,
    files: []
  };
}
