/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import Footer from "../components/Footer";
import versions from "../versions.json";
import { GetStaticProps, NextPage } from "next";
import InlineCode from "../components/InlineCode";
import Header from "../components/Header";

interface HomeProps {
  latestStd: string;
}

const Home: NextPage<HomeProps> = ({ latestStd }) => {
  const complexExampleProgram =
    `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";

console.log("http://localhost:8000/");
serve((req) => new Response("Hello World\\n"), { port: 8000 });
`;

  return (
    <>
      <Head>
        <title>Deno - A modern runtime for JavaScript and TypeScript</title>
      </Head>
      {
        /* <div className="bg-blue-500 p-4 text-white flex justify-center text-center">
        <div className="max-w-screen-xl">
          <span className="inline">Deno 1.9 is out.</span>
          <span className="block sm:ml-2 sm:inline-block font-semibold">
            <a href="https://deno.com/blog/v1.9">
              Read the release notes <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </div>
      </div> */
      }
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <Header main />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              A <strong className="font-semibold">modern</strong> runtime for
              {" "}
              <strong className="font-semibold">JavaScript</strong> and{" "}
              <strong className="font-semibold">TypeScript</strong>.
            </h2>
            <a
              href="/#installation"
              className="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              Install
            </a>
            <a
              href="https://github.com/denoland/deno/releases/latest"
              className="mt-4"
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
            Deno is a simple, modern and secure runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
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
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
            </li>
            <li>
              Has a number of{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                className="link"
              >
                companies interested in using and exploring Deno
              </a>
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                Installation
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                Getting Started
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">Try running a simple program:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">Or a more complex one:</p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p className="my-4 text-gray-700">
            You can find a more in depth introduction, examples, and environment
            setup guides in{" "}
            <Link href="/manual">
              <a className="link">the manual</a>
            </Link>
            .
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                Runtime Documentation
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            The basic runtime documentation for Deno can be found on{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Deno comes with{" "}
            <Link href="/manual">
              <a className="link">a manual</a>
            </Link>{" "}
            which contains more in depth explanations about the more complex
            functions of the runtime, an introduction to the concepts that Deno
            is built on, details about the internals of Deno, how to embed Deno
            in your own application and how to extend Deno using Rust plugins.
          </p>
          <p className="my-4 text-gray-700">
            The manual also contains information about the built in tools that
            Deno provides.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                Standard Modules
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Next to the Deno runtime, Deno also provides a list of audited
            standard modules that are reviewed by the Deno maintainers and are
            guaranteed to work with a specific Deno version. These live in the
            {" "}
            <a href="https://github.com/denoland/deno_std" className="link">
              denoland/deno_std
            </a>{" "}
            repository.
          </p>
          <p className="my-4 text-gray-700">
            These standard modules are hosted at{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                Third Party Modules
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno can import modules from any location on the web, like GitHub, a
            personal webserver, or a CDN like{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            ,{" "}
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>{" "}
            or{" "}
            <a href="https://esm.sh/" className="link">
              esm.sh
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            To make it easier to consume third party modules Deno provides some
            built in tooling like <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land also provides a web UI
            for viewing module documentation. It is available at{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            deno.land also provides a simple public hosting service for ES
            modules that work with Deno. It can be found at{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            .
          </p>
        </div>
        <div className="mt-20">
          <Footer simple />
        </div>
      </div>
    </>
  );
};

const InstallSection = () => {
  const shell = (
    <div key="shell" className="my-4 text-gray-700">
      <p className="py-2">Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://deno.land/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" className="link">
          Homebrew
        </a>{" "}
        (Mac):
      </p>
      <CodeBlock language="bash" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code={`iwr https://deno.land/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://chocolatey.org/packages/deno" className="link">
          Chocolatey
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code={`choco install deno`} />
    </div>
  );
  const scoop = (
    <div key="scoop" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://scoop.sh/" className="link">
          Scoop
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );
  const cargo = (
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
        :
      </p>
      <CodeBlock language="bash" code={`cargo install deno --locked`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the
        {" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          releases page
        </a>
        .
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        See{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        for more installation options.
      </p>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      latestStd: versions.std[0],
    },
  };
};

export default Home;
