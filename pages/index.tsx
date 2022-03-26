// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head } from "../deps.ts";
import { CodeBlock } from "../components/CodeBlock.tsx";
import { Footer } from "../components/Footer.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import { Header } from "../components/Header.tsx";
import versions from "../versions.json" assert { type: "json" };

export default function Home() {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${
    versions.std[0]
  }/http/server.ts";

console.log("http://localhost:8000/");
serve((req) => new Response("Hello World\\n"), { port: 8000 });`;

  return (
    <div>
      <Head>
        <title>Deno - A modern runtime for JavaScript and TypeScript</title>
      </Head>
      <div class="bg-white">
        <div class="bg-gray-50 border-b border-gray-200">
          <Header main />
          <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 class="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              A <strong class="font-semibold">modern</strong> runtime for{" "}
              <strong class="font-semibold">JavaScript</strong> and{" "}
              <strong class="font-semibold">TypeScript</strong>.
            </h2>
            <a
              href="/#installation"
              class="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              Install
            </a>
            <a
              href="https://github.com/denoland/deno/releases/latest"
              class="mt-4"
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p class="my-4 text-gray-700">
            Deno is a simple, modern and secure runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust.
          </p>
          <ol class="ml-8 list-disc text-gray-700">
            <li>
              Secure by default. No file, network, or environment access, unless
              explicitly enabled.
            </li>
            <li>Supports TypeScript out of the box.</li>
            <li>Ships only a single executable file.</li>
            <li>
              Has built-in utilities like a dependency inspector (
              <InlineCode>deno info</InlineCode>) and a code formatter (
              <InlineCode>deno fmt</InlineCode>).
            </li>
            <li>
              Has a set of reviewed (audited) standard modules that are
              guaranteed to work with Deno:{" "}
              <a href="https://deno.land/std" class="link">
                deno.land/std
              </a>
            </li>
            <li>
              Has a number of{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                class="link"
              >
                companies interested in using and exploring Deno
              </a>
            </li>
          </ol>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#installation">
            <h3 class="font-bold text-xl" id="installation">
              Installation
            </h3>
          </a>
          <InstallSection />
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#getting-started">
            <h3 class="font-bold text-xl" id="getting-started">
              Getting Started
            </h3>
          </a>
          <p class="my-4 text-gray-700">Try running a simple program:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p class="my-4 text-gray-700">Or a more complex one:</p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p class="my-4 text-gray-700">
            You can find a more in depth introduction, examples, and environment
            setup guides in <a class="link" href="/manual">the manual</a>.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#runtime-documentation">
            <h3 class="font-bold text-xl" id="runtime-documentation">
              Runtime Documentation
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            The basic runtime documentation for Deno can be found on{" "}
            <a href="https://doc.deno.land/deno/stable" class="link">
              doc.deno.land
            </a>
            .
          </p>
          <p class="my-4 text-gray-700">
            Deno comes with <a class="link" href="/manual">a manual</a>{" "}
            which contains more in depth explanations about the more complex
            functions of the runtime, an introduction to the concepts that Deno
            is built on, details about the internals of Deno, how to embed Deno
            in your own application and how to extend Deno using Rust plugins.
          </p>
          <p class="my-4 text-gray-700">
            The manual also contains information about the built in tools that
            Deno provides.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#standard-modules">
            <h3 class="font-bold text-xl" id="standard-modules">
              Standard Modules
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            Next to the Deno runtime, Deno also provides a list of audited
            standard modules that are reviewed by the Deno maintainers and are
            guaranteed to work with a specific Deno version. These live in the
            {" "}
            <a href="https://github.com/denoland/deno_std" class="link">
              denoland/deno_std
            </a>{" "}
            repository.
          </p>
          <p class="my-4 text-gray-700">
            These standard modules are hosted at{" "}
            <a class="link" href="/std">deno.land/std</a>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#third-party-modules">
            <h3 class="font-bold text-xl" id="third-party-modules">
              Third Party Modules
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            Deno can import modules from any location on the web, like GitHub, a
            personal webserver, or a CDN like{" "}
            <a href="https://www.skypack.dev" class="link">
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" class="link">
              jspm.io
            </a>
            ,{" "}
            <a href="https://www.jsdelivr.com/" class="link">
              jsDelivr
            </a>{" "}
            or{" "}
            <a href="https://esm.sh/" class="link">
              esm.sh
            </a>
            .
          </p>
          <p class="my-4 text-gray-700">
            To make it easier to consume third party modules Deno provides some
            built in tooling like <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land also provides a web UI
            for viewing module documentation. It is available at{" "}
            <a href="https://doc.deno.land" class="link">
              doc.deno.land
            </a>
            .
          </p>
          <p class="my-4 text-gray-700">
            deno.land also provides a simple public hosting service for ES
            modules that work with Deno. It can be found at{" "}
            <a class="link" href="/x">deno.land/x</a>.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#examples">
            <h3 class="font-bold text-xl" id="examples">
              Examples
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            Here are some examples that you can use to get started immediately.
          </p>
          <ol class="ml-8 list-disc text-gray-700">
            <li>
              <a href="https://examples.deno.land/hello-world" class="link">
                Hello World
              </a>
            </li>
            <li>
              <a href="https://examples.deno.land/import-export" class="link">
                Importing & Exporting
              </a>
            </li>
            <li>
              <a
                href="https://examples.deno.land/dependency-management"
                class="link"
              >
                Dependency Management
              </a>
            </li>
            <li>
              <a href="https://examples.deno.land/http-requests" class="link">
                HTTP Requests
              </a>
            </li>
            <li>
              <a href="https://examples.deno.land/http-server" class="link">
                HTTP Server: Hello World
              </a>
            </li>
          </ol>
          <p class="my-4 text-gray-700">
            For more examples, check out{" "}
            <a class="link" href="https://examples.deno.land">
              examples.deno.land
            </a>.
          </p>
        </div>
        <div class="mt-20">
          <Footer simple />
        </div>
      </div>
    </div>
  );
}

function InstallSection() {
  const shell = (
    <div key="shell" class="my-4 text-gray-700">
      <p class="py-2">Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code="curl -fsSL https://deno.land/install.sh | sh"
      />
    </div>
  );
  const pacman = (
    <div key="pacman" class="my-4 text-gray-700">
      <p class="mb-2">Pacman (Arch Linux and Arch Based distros):</p>
      <CodeBlock
        language="bash"
        code="pacman -S deno"
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" class="link">
          Homebrew
        </a>{" "}
        (Mac):
      </p>
      <CodeBlock language="bash" code="brew install deno" />
    </div>
  );
  const powershell = (
    <div key="powershell" class="my-4 text-gray-700">
      <p class="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://deno.land/install.ps1 -useb | iex"
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://chocolatey.org/packages/deno" class="link">
          Chocolatey
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code="choco install deno" />
    </div>
  );
  const scoop = (
    <div key="scoop" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://scoop.sh/" class="link">
          Scoop
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code="scoop install deno" />
    </div>
  );
  const cargo = (
    <div key="cargo" class="my-4 text-gray-700">
      <p class="py-2">
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" class="link">
          Cargo
        </a>
        :
      </p>
      <CodeBlock language="bash" code="cargo install deno --locked" />
    </div>
  );

  return (
    <>
      <p class="my-4 text-gray-700">
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the
        {" "}
        <a href="https://github.com/denoland/deno/releases" class="link">
          releases page
        </a>
        .
      </p>
      {shell}
      {pacman}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p class="my-4 text-gray-700">
        See{" "}
        <a class="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        for more installation options.
      </p>
    </>
  );
}
