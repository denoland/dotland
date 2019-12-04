import React from "react";
import CodeBlock from "./CodeBlock";
import Link from "./Link";
import "./Home.css";

const code = `import { serve } from "https://deno.land/std@v0.24.0/http/server.ts";
const body = new TextEncoder().encode("Hello World\\n");
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body });
}
`;

function Home() {
  return (
    <main>
      <header>
        <img
          id="logo"
          src="images/deno_logo_3.svg"
          alt="deno logo"
          width="200"
        />
        <div>
          <h1>Deno</h1>A secure runtime for JavaScript and TypeScript
        </div>
      </header>

      <table id="badges">
        <tbody>
          {["deno", "deno_website2", "deno_install", "rusty_v8"].map((repo, i) => {
            const url = `https://github.com/denoland/${repo}`;
            const badge = `https://github.com/denoland/${repo}/workflows/ci/badge.svg?branch=master&event=push`;
            return (
              <tr key={i}>
                <th>
                  <Link to={url}>{repo}</Link>
                </th>
                <td>
                  <Link className="badge" to={`${url}/actions`}>
                    <img alt={`${repo} ci badge`} src={badge} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 id="install">Install</h2>

      <p>Using Shell:</p>
      <CodeBlock
        language={"shell"}
        value={"curl -fsSL https://deno.land/x/install/install.sh | sh"}
      />
      <p>Or using PowerShell:</p>
      <CodeBlock
        language={"shell"}
        value={"iwr https://deno.land/x/install/install.ps1 -useb | iex"}
      />
      <p>
        Using <Link to="https://formulae.brew.sh/formula/deno">Homebrew</Link>{" "}
        (mac or Linux):
      </p>
      <CodeBlock language={"shell"} value={"brew install deno"} />
      <p>
        Using <Link to="https://scoop.sh/">Scoop</Link> (windows):
      </p>
      <CodeBlock language={"shell"} value={"scoop install deno"} />
      <p>
        Using <Link to="https://crates.io/crates/deno_cli">Cargo</Link>:
      </p>
      <CodeBlock language={"shell"} value={"cargo install deno_cli"} />
      <p>
        See{" "}
        <Link to="https://github.com/denoland/deno_install">deno_install</Link>{" "}
        for more installation options.
      </p>

      <h2 id="example">Example</h2>

      <p>Try running a simple program:</p>
      <CodeBlock
        language={"shell"}
        value={"deno https://deno.land/std/examples/welcome.ts"}
      />

      <p>Or a more complex one:</p>

      <CodeBlock language={"typescript"} value={code} />

      <h2 id="dig-in">Dig in...</h2>

      <p>
        <b>
          <Link to="/std/manual.md">Manual</Link>
        </b>
      </p>

      <p>
        {/*
          TODO(ry) The /typedoc/ path is not part of the react app. It's a
          separate static site hosted in S3 and to proxied by the CF worker.
          This is a legacy documentation site. The goal is to handle Deno's own
          internal documentation using the same system that handles /std/.
          https://github.com/denoland/deno_website2/issues/57
        */}
        <Link target="_blank" rel="noopener noreferrer" to="/typedoc/">
          API Reference
        </Link>
      </p>

      <p>Modules:</p>
      <ul>
        <li>
          <Link to="/std/">Standard</Link>
        </li>
        <li>
          <Link to="/x/">Third Party</Link>
        </li>
      </ul>

      <p>
        <Link to="https://github.com/denoland/deno/blob/master/Releases.md">
          Releases
        </Link>
      </p>

      <p>
        <Link to="/benchmarks">Benchmarks</Link>
      </p>

      <p>
        <Link to="https://gitter.im/denolife/Lobby">Community Chat Room</Link>
      </p>

      <p>
        <Link to="https://twitter.com/deno_land">Twitter</Link>
      </p>

      <p>
        <Link to="https://github.com/denolib/awesome-deno">More Links</Link>
      </p>
    </main>
  );
}

export default Home;
