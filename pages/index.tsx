/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import { useOS } from "../util/platform";
import Footer from "../components/Footer";
import { entries } from "../util/registry_utils";
import { NextPage, GetStaticProps } from "next";
import InlineCode from "../components/InlineCode";
import Header from "../components/Header";

interface SimpleEntry {
  name: string;
  desc: string;
}
interface HomeProps {
  thirdPartyEntries: SimpleEntry[];
}

const NUM_THIRD_PARTY = 12;

// TODO(lucacasonato): add anchor points to headers
const Home: NextPage<HomeProps> = ({ thirdPartyEntries }) => {
  const [thirdPartySelection, setThirdPartySelection] = useState<
    SimpleEntry[] | null
  >(null);
  useEffect(() => {
    const thirdPartySelection = [];
    for (let i = 0; i < NUM_THIRD_PARTY; i++) {
      const s = Math.floor(thirdPartyEntries.length * Math.random());
      thirdPartySelection.push(thirdPartyEntries[s]);
      thirdPartyEntries.splice(s, 1);
    }
    setThirdPartySelection(thirdPartySelection);
  }, []);

  return (
    <>
      <Head>
        <title>Deno</title>
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
      </Head>
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <Header />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-24 pb-20 sm:pb-36 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              A <strong className="font-semibold">secure</strong> runtime for{" "}
              <strong className="font-semibold">JavaScript</strong> and{" "}
              <strong className="font-semibold">TypeScript</strong>.
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow">
                <a
                  href="#introduction"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-black hover:bg-cool-gray-900 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Get Started
                </a>
              </div>
              <div className="ml-3">
                <Link href="/[identifier]" as="/manual">
                  <a className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:shadow-outline focus:border-gray-300 transition duration-150 ease-in-out">
                    View Docs
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl" id="introduction">
            Introduction
          </h3>
          <p className="my-4 text-gray-700">
            Deno is a simple, modern and secure runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl">Installation</h3>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl">Getting Started</h3>
          <GettingStartedSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl">Runtime Documentation</h3>
          <p className="my-4 text-gray-700">
            The basic runtime documentation for Deno can be found on{" "}
            <a
              href="https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
              className="link"
            >
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Deno also has{" "}
            <Link href="/[identifier]" as="/manual">
              <a className="link">a manual</a>
            </Link>{" "}
            which contains more in depth explainations about the more complex
            functions of the runtime, a introduction to the concepts that Deno
            is built on, details about the internals of Deno, how to embed Deno
            in your own application and how to extend Deno using Rust plugins.
          </p>
          <p className="my-4 text-gray-700">
            The manual also contains information about the built in tools that
            Deno provides.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl">Standard Modules</h3>
          <p className="my-4 text-gray-700">
            Next to the Deno runtime, Deno also provides a list of audited
            standard modules that are reviewed by the core Deno team and are
            guaranteed to work with a specific Deno version. These live
            alongside the Deno source code in the{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            repository and are versioned together with the Deno runtime.
          </p>
          <p className="my-4 text-gray-700">
            These standard modules are hosted at{" "}
            <Link href="/[identifier]" as="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <h3 className="font-bold text-xl">Third Party Modules</h3>
          <p className="my-4 text-gray-700">
            Deno can import modules from any location on the web, for example
            GitHub, a personal webserver, or a CDN like{" "}
            <a href="https://pika.dev" className="link">
              pika.dev
            </a>{" "}
            or{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            To make it easier to use third party modules Deno provides some
            built in tooling like <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land also provides a web UI
            for viewing module documentation. It is available at{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            deno.land provides a simple public hosting service for ES modules
            that work with Deno. It can be found at{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            .
          </p>
          <p className="my-4 text-gray-700">
            Here is a random selection of the modules that are currently
            available on{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            :
          </p>
        </div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {thirdPartySelection?.map((s, i) => (
            <Link href="/x/[identifier]" as={`/x/${s.name}`}>
              <a
                className="rounded-lg bg-white shadow border border-gray-100 p-4 overflow-hidden hover:shadow-sm transition duration-75 ease-in-out cursor-pointer  "
                key={i}
              >
                <h4 className="text-lg font-bold">{s.name}</h4>
                <p
                  className="whitespace-normal break-words text-gray-700 mt-2"
                  style={{ textOverflow: "ellipsis" }}
                >
                  {s.desc}
                </p>
              </a>
            </Link>
          ))}
        </div>
        <div className="mt-20">
          <Footer simple />
        </div>
      </div>
    </>
  );
};

const InstallSection = () => {
  const os = useOS();

  const shell = (
    <div key="shell" className="my-4 text-gray-700">
      <p className="py-2 font-bold">Using Shell:</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://deno.land/x/install/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2 font-bold">Using Homebrew:</p>
      <CodeBlock language="typescript" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2 font-bold">Using PowerShell:</p>
      <CodeBlock
        language="bash"
        code={`iwr https://deno.land/x/install/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2 font-bold">Using Chocolatey:</p>
      <CodeBlock language="bash" code={`choco install deno`} />
    </div>
  );
  const scoop = (
    <div key="scoop" className="my-4 text-gray-700">
      <p className="mb-2 font-bold">Using Scoop:</p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          releases page
        </a>
        .
      </p>
      {(() => {
        switch (os) {
          case "mac":
            return [shell, homebrew];
          case "linux":
            return shell;
          case "win":
            return [powershell, chocolatey, scoop];
          default:
            return [shell, powershell, homebrew, chocolatey, scoop];
        }
      })()}
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

export const complexExampleProgram = `import { serve } from "https://deno.land/std@v0.36.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}`;

const GettingStartedSection = () => (
  <>
    <p className="my-4 text-gray-700">Try running a simple program:</p>
    <CodeBlock
      code="deno https://deno.land/std/examples/welcome.ts"
      language="bash"
    />
    <p className="my-4 text-gray-700">Or a more complex one:</p>
    <CodeBlock code={complexExampleProgram} language="typescript" />
    <p className="my-4 text-gray-700">
      You can find the manual that contains more guides and examples{" "}
      <Link href="/[identifier]" as="/manual">
        <a className="link">here</a>
      </Link>
      .
    </p>
  </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const thirdPartyEntries: SimpleEntry[] = [];

  Object.keys(entries).forEach((name) => {
    const entry = entries[name];
    if (
      entry &&
      entry.desc.length >= 70 &&
      entry.desc.length <= 90 &&
      name !== "std" &&
      name !== "std_old"
    ) {
      thirdPartyEntries.push({
        name,
        desc: entry.desc,
      });
    }
  });

  return {
    props: { thirdPartyEntries },
  };
};

export default Home;
