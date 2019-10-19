import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Link } from "react-router-dom";

const code = `import { serve } from "https://deno.land/std@v0.19.0/http/server.ts";
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

      <table>
        <thead>
          <tr>
            <th />
            <th>Linux &amp; Mac</th>
            <th>Windows</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <a href="https://github.com/denoland/deno">deno</a>
            </th>
            <td colSpan="2">
              <a
                className="badge"
                href="https://github.com/denoland/deno/actions"
              >
                <img
                  alt="deno ci badge"
                  src="https://github.com/denoland/deno/workflows/build/badge.svg"
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
          <tr>
            <th>
              <a href="https://github.com/denoland/registry">registry</a>
            </th>
            <td colSpan="2">
              <a
                className="badge"
                href="https://travis-ci.com/denoland/registry"
              >
                <img
                  alt="registry ci badge"
                  src="https://travis-ci.com/denoland/registry.svg?branch=master"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="install">
        Install <a href="#install">#</a>
      </h2>

      <p>Using Shell:</p>
      <pre>
        curl -fsSL{" "}
        <a href="https://deno.land/x/install/install.sh">
          https://deno.land/x/install/install.sh
        </a>{" "}
        | sh
      </pre>
      <p>Or using PowerShell:</p>
      <pre>
        iwr{" "}
        <a href="https://deno.land/x/install/install.ps1">
          https://deno.land/x/install/install.ps1
        </a>{" "}
        -useb | iex
      </pre>
      <p>
        Using <a href="https://formulae.brew.sh/formula/deno">Homebrew</a>{" "}
        (mac):
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

      <h2 id="example">
        Example <a href="#example">#</a>
      </h2>

      <p>Try running a simple program:</p>
      <pre>deno https://deno.land/welcome.ts</pre>

      <p>Or a more complex one:</p>

      <pre>
        <SyntaxHighlighter language="typescript">{code}</SyntaxHighlighter>
      </pre>

      <h2 id="dig-in">
        Dig in... <a href="#dig-in">#</a>
      </h2>

      <p>
        <b>
          <Link to="/manual">Manual</Link>
        </b>
      </p>

      <p>
        <a href="https://deno.land/typedoc/">API Reference</a>
      </p>

      <p>
        <a href="https://deno.land/std/">Standard Modules</a>
      </p>

      <p>
        <a href="style_guide.html">Style Guide</a>
      </p>

      <p>
        <a href="https://deno.land/x/">Module repository</a>
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
        <a href="benchmarks.html">Benchmarks</a>
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
