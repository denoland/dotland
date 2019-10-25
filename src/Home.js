import React from "react";
import CodeBlock from "./CodeBlock";
import { Link } from "react-router-dom";
import "./Home.css";

const code = `import { serve } from "https://deno.land/std@v0.21.0/http/server.ts";
const body = new TextEncoder().encode("Hello World\\n");
const s = serve(":8000");
window.onload = async () => {
  console.log("http://localhost:8000/");
  for await (const req of s) {
    req.respond({ body });
  }
};`;

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
              <a href="https://github.com/denoland/deno">deno</a>
            </th>
            <td colSpan={2}>
              <a
                className="badge"
                href="https://github.com/denoland/deno/actions"
              >
                <img
                  alt="deno ci badge"
                  src="https://github.com/denoland/deno/workflows/build/badge.svg?branch=master"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th>
              <a href="https://github.com/denoland/deno_website2">
                deno_website2
              </a>
            </th>
            <td colSpan={2}>
              <a
                className="badge"
                href="https://github.com/denoland/deno_website2/actions"
              >
                <img
                  alt="deno ci badge"
                  src="https://github.com/denoland/deno_website2/workflows/build/badge.svg?branch=master"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th>
              <a href="https://github.com/denoland/deno_install">
                deno_install
              </a>
            </th>
            <td>
              <a
                className="badge"
                href="https://travis-ci.com/denoland/deno_install"
              >
                <img
                  alt="deno_install ci badge travis"
                  src="https://travis-ci.com/denoland/deno_install.svg?branch=master"
                />
              </a>
            </td>
            <td>
              <a
                className="badge"
                href="https://ci.appveyor.com/project/deno/deno-install"
              >
                <img
                  alt="deno_install ci badge appveyor"
                  src="https://ci.appveyor.com/api/projects/status/gtekeaf7r60xa896?branch=master&svg=true"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="install">Install</h2>

      <p>Using Shell:</p>
      <pre>
        curl -fsSL{" "}
        <a href="/x/install/install.sh">
          https://deno.land/x/install/install.sh
        </a>{" "}
        | sh
      </pre>
      <p>Or using PowerShell:</p>
      <pre>
        iwr{" "}
        <a href="/x/install/install.ps1">
          https://deno.land/x/install/install.ps1
        </a>{" "}
        -useb | iex
      </pre>
      <p>
        Using <a href="https://formulae.brew.sh/formula/deno">Homebrew</a> (mac
        or Linux):
      </p>
      <pre>brew install deno</pre>
      <p>
        Using <a href="https://scoop.sh/">Scoop</a> (windows):
      </p>
      <pre>scoop install deno</pre>
      <p>
        Using <a href="https://crates.io/crates/deno_cli">Cargo</a>:
      </p>
      <pre>cargo install deno_cli</pre>
      <p>
        See <a href="https://github.com/denoland/deno_install">deno_install</a>{" "}
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
          <Link to="/std/manual.md">Manual</Link>
        </b>
      </p>

      <p>
        <a href="/typedoc/">API Reference</a>
      </p>

      <p>Modules:</p>
      <ul>
        <li>
          <a href="/std/">Standard</a>
        </li>
        <li>
          <a href="/x/">Third Party</a>
        </li>
      </ul>

      <p>
        <a href="/std/style_guide.md">Style Guide</a>
      </p>

      <p>
        <a href="https://twitter.com/deno_land">Twitter Account</a>
      </p>

      <p>
        <a href="https://github.com/denoland/deno/blob/master/Releases.md">
          Release notes
        </a>
      </p>

      <p>
        <a href="https://gitter.im/denolife/Lobby">Community chat room</a>
      </p>

      <p>
        <a href="/benchmarks">Benchmarks</a>
      </p>

      <p>
        <a href="https://github.com/denolib/awesome-deno">
          A curated list of awesome Deno things
        </a>
      </p>
    </main>
  );
}

export default Home;
