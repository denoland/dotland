import React from "react";
import CodeBlock from "./CodeBlock";
import { InternalLink } from "./InternalLink";
import "./Home.css";
import { Link } from "@material-ui/core";

const code = `import { serve } from "https://deno.land/std@v0.22.0/http/server.ts";
const body = new TextEncoder().encode("Hello World\\n");
const s = serve(":8000");
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
          <h1>Deno</h1>A secure runtime for JavaScript and TypeScript built with
          V8, Rust, and Tokio
        </div>
      </header>

      <table id="badges">
        <tbody>
          <tr>
            <th>
              <Link href="https://github.com/denoland/deno">deno</Link>
            </th>
            <td>
              <Link
                className="badge"
                href="https://github.com/denoland/deno/actions"
              >
                <img
                  alt="deno ci badge"
                  src="https://github.com/denoland/deno/workflows/build/badge.svg?branch=master"
                />
              </Link>
            </td>
          </tr>
          <tr>
            <th>
              <Link href="https://github.com/denoland/deno_website2">
                deno_website2
              </Link>
            </th>
            <td>
              <Link
                className="badge"
                href="https://github.com/denoland/deno_website2/actions"
              >
                <img
                  alt="deno ci badge"
                  src="https://github.com/denoland/deno_website2/workflows/ci/badge.svg?branch=master"
                />
              </Link>
            </td>
          </tr>
          <tr>
            <th>
              <Link href="https://github.com/denoland/deno_install">
                deno_install
              </Link>
            </th>
            <td>
              <Link
                className="badge"
                href="https://github.com/denoland/deno_install/actions"
              >
                <img
                  alt="deno_install ci badge"
                  src="https://github.com/denoland/deno_install/workflows/ci/badge.svg?branch=master"
                />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="install">Install</h2>

      <p>Using Shell:</p>
      <pre>
        curl -fsSL{" "}
        <Link href="/x/install/install.sh">
          https://deno.land/x/install/install.sh
        </Link>{" "}
        | sh
      </pre>
      <p>Or using PowerShell:</p>
      <pre>
        iwr{" "}
        <Link href="/x/install/install.ps1">
          https://deno.land/x/install/install.ps1
        </Link>{" "}
        -useb | iex
      </pre>
      <p>
        Using <Link href="https://formulae.brew.sh/formula/deno">Homebrew</Link>{" "}
        (mac or Linux):
      </p>
      <pre>brew install deno</pre>
      <p>
        Using <Link href="https://scoop.sh/">Scoop</Link> (windows):
      </p>
      <pre>scoop install deno</pre>
      <p>
        Using <Link href="https://crates.io/crates/deno_cli">Cargo</Link>:
      </p>
      <pre>cargo install deno_cli</pre>
      <p>
        See{" "}
        <Link href="https://github.com/denoland/deno_install">
          deno_install
        </Link>{" "}
        for more installation options.
      </p>

      <h2 id="example">Example</h2>

      <p>Try running a simple program:</p>
      <pre>deno https://deno.land/std/examples/welcome.ts</pre>

      <p>Or a more complex one:</p>

      <CodeBlock language={"typescript"} value={code} />

      <h2 id="dig-in">Dig in...</h2>

      <p>
        <b>
          <Link component={InternalLink} to="/std/manual.md">
            Manual
          </Link>
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
        <Link target="_blank" rel="noopener noreferrer" href="/typedoc/">
          API Reference
        </Link>
      </p>

      <p>Modules:</p>
      <ul>
        <li>
          <Link component={InternalLink} to="/std/">
            Standard
          </Link>
        </li>
        <li>
          <Link component={InternalLink} to="/x/">
            Third Party
          </Link>
        </li>
      </ul>

      <p>
        <Link href="https://github.com/denoland/deno/blob/master/Releases.md">
          Releases
        </Link>
      </p>

      <p>
        <Link component={InternalLink} to="/benchmarks">
          Benchmarks
        </Link>
      </p>

      <p>
        <Link href="https://gitter.im/denolife/Lobby">Community Chat Room</Link>
      </p>

      <p>
        <Link href="https://twitter.com/deno_land">Twitter</Link>
      </p>

      <p>
        <Link href="https://github.com/denolib/awesome-deno">More Links</Link>
      </p>
    </main>
  );
}

export default Home;
