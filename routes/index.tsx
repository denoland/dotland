// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { Footer } from "@/components/Footer.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import { Header } from "@/components/Header.tsx";
import HelloBar from "@/islands/HelloBar.tsx";
import { Background } from "@/components/HeroBackground.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

import versions from "@/versions.json" assert { type: "json" };
import { getCookies } from "https://deno.land/std@0.143.0/http/cookie.ts";

interface Data {
  isFirefox: boolean;
  hellobarClosedTo: string;
}

export default function Home({ data, url }: PageProps<Data>) {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${
    versions.std[0]
  }/http/server.ts";
serve(req => new Response("Hello World\\n"));`;

  const denoTestExample = `deno test https://deno.land/std@${
    versions.std[0]
  }/testing/chai_example.ts
running 3 tests from https://deno.land/std@${
    versions.std[0]
  }/testing/chai_example.ts
test we can make chai assertions ... ok (8ms)
test we can make chai expectations ... ok (2ms)
test we can use chai should style ... ok (4ms)

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (27ms)`;

  const hellobarTo =
    "https://deno.news/archive/50-the-javascript-trademark-fresh-11-and-deno-on";
  return (
    <div>
      {hellobarTo !== data.hellobarClosedTo &&
        (
          <HelloBar to={hellobarTo}>
            Check out Deno News issue #50!
          </HelloBar>
        )}
      <Head>
        <title>Deno - A modern runtime for JavaScript and TypeScript</title>
      </Head>
      <div class={tw`bg-white`}>
        <div
          class={tw`bg-gray-50 overflow-x-hidden border-b border-gray-200 relative`}
        >
          {!data.isFirefox && <Background />}
          <Header main />
          <div
            class={tw`relative section-x-inset-sm pt-12 pb-20 flex flex-col items-center`}
          >
            <h1
              class={tw`font-extrabold text-5xl leading-10 tracking-tight text-gray-900`}
            >
              Deno
            </h1>
            <h2
              class={tw`mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900`}
            >
              A <strong class={tw`font-semibold`}>modern</strong> runtime for
              {" "}
              <strong class={tw`font-semibold`}>JavaScript</strong> and{" "}
              <strong class={tw`font-semibold`}>TypeScript</strong>
            </h2>
            <a
              href="/#installation"
              class={tw`rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg`}
            >
              Install
            </a>
            <a
              href="https://github.com/denoland/deno/releases/latest"
              class={tw`mt-4`}
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <p class={tw`my-4 text-gray-700`}>
            Deno is a simple, modern and secure runtime for JavaScript,
            TypeScript, and WebAssembly that uses V8 and is built in Rust.
          </p>
          <ol class={tw`ml-8 list-disc text-gray-700`}>
            <li>
              Provides{" "}
              <a class={tw`link`} href="/manual/runtime/web_platform_apis">
                web platform functionality
              </a>{" "}
              and adopts web platform standards.
            </li>
            <li>
              Secure by default. No file, network, or environment access, unless
              explicitly enabled.
            </li>
            <li>
              Supports{" "}
              <a class={tw`link`} href="/manual/typescript">TypeScript</a>{" "}
              out of the box.
            </li>
            <li>Ships only a single executable file.</li>
            <li>
              Has{" "}
              <a class={tw`link`} href="/manual/tools">
                built-in development tooling
              </a>{" "}
              like a dependency inspector (
              <a class={tw`link`} href="/manual/tools/dependency_inspector">
                <InlineCode>deno info</InlineCode>
              </a>
              ) and a code formatter (
              <a class={tw`link`} href="/manual/tools/formatter">
                <InlineCode>deno fmt</InlineCode>
              </a>
              ).
            </li>
            <li>
              Has a set of reviewed (audited) standard modules that are
              guaranteed to work with Deno:{" "}
              <a
                href="https://doc.deno.land/https://deno.land/std"
                class={tw`link`}
              >
                deno.land/std
              </a>.
            </li>
            <li>
              Has a number of{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                class={tw`link`}
              >
                companies interested in using and exploring Deno.
              </a>
            </li>
          </ol>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#installation">
            <h3 class={tw`font-bold text-xl`} id="installation">
              Installation
            </h3>
          </a>
          <InstallSection url={url} />
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#getting-started">
            <h3 class={tw`font-bold text-xl`} id="getting-started">
              Getting Started
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>Try running a simple program:</p>
          <CodeBlock
            code={`deno run https://deno.land/std@${
              versions.std[0]
            }/examples/welcome.ts`}
            language="bash"
            url={url}
          />
          <p class={tw`my-4 text-gray-700`}>Or a more complex one:</p>
        </div>
        <div class={tw`section-x-inset-sm`}>
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
            url={url}
          />
        </div>
        <div class={tw`section-x-inset-sm`}>
          <p class={tw`my-4 text-gray-700`}>
            You can find a more in depth introduction, examples, and environment
            setup guides in{" "}
            <a class={tw`link`} href="/manual">
              the manual
            </a>
            .
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#runtime-documentation">
            <h3 class={tw`font-bold text-xl`} id="runtime-documentation">
              Runtime Documentation
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            The basic runtime documentation for Deno can be found on{" "}
            <a href="https://doc.deno.land/deno/stable" class={tw`link`}>
              doc.deno.land
            </a>
            .
          </p>
          <p class={tw`my-4 text-gray-700`}>
            Deno comes with{" "}
            <a class={tw`link`} href="/manual">
              a manual
            </a>{" "}
            which contains more in depth explanations about the more complex
            functions of the runtime, an introduction to the concepts that Deno
            is built on, details about the internals of Deno, how to embed Deno
            in your own application and how to extend Deno using Rust plugins.
          </p>
          <p class={tw`my-4 text-gray-700`}>
            The manual also contains information about the built in tools that
            Deno provides.
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#standard-modules">
            <h3 class={tw`font-bold text-xl`} id="standard-modules">
              Standard Modules
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Next to the Deno runtime, Deno also provides a list of audited
            standard modules that are reviewed by the Deno maintainers and are
            guaranteed to work with a specific Deno version. These live in the
            {" "}
            <a href="https://github.com/denoland/deno_std" class={tw`link`}>
              denoland/deno_std
            </a>{" "}
            repository.
          </p>
          <p class={tw`my-4 text-gray-700`}>
            These standard modules are hosted at{" "}
            <a class={tw`link`} href="/std">
              deno.land/std
            </a>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#toolchain">
            <h3 class={tw`font-bold text-xl`} id="toolchain">
              Built-in Toolchain
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Deno comes with a robust{" "}
            <a class={tw`link`} href="/manual/tools">
              set of tools
            </a>
            , so you can spend less time searching and evaluating third party
            modules, and more time writing code and being productive. Here are a
            few examples.
          </p>
          <p class={tw`my-4 text-gray-700`}>
            <a class={tw`link`} href="/manual/tools/linter">
              Lint
            </a>{" "}
            all JS/TS files in the current directory and subdirectories:
          </p>
          <p>
            <CodeBlock
              code={"deno lint\nChecked 54 files"}
              language="bash"
              url={url}
            />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            <a class={tw`link`} href="/manual/tools/formatter">
              Format
            </a>{" "}
            all supported files in the current directory and subdirectories:
          </p>
          <p>
            <CodeBlock
              code={"deno fmt\nChecked 46 files"}
              language="bash"
              url={url}
            />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            Run a{" "}
            <a class={tw`link`} href="/manual/testing">
              test
            </a>
            :
          </p>
          <p>
            <CodeBlock code={denoTestExample} language="bash" url={url} />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            For the full list of tools and their options, see{" "}
            <a href="/manual/tools" class={tw`link`}>
              here
            </a>
            .
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#examples">
            <h3 class={tw`font-bold text-xl`} id="examples">
              Examples
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Here are some examples that you can use to get started immediately.
          </p>
          <ol class={tw`ml-8 list-disc text-gray-700`}>
            <li>
              <a href="https://examples.deno.land/hello-world" class={tw`link`}>
                Hello World
              </a>
            </li>
            <li>
              <a
                href="https://examples.deno.land/import-export"
                class={tw`link`}
              >
                Importing & Exporting
              </a>
            </li>
            <li>
              <a
                href="https://examples.deno.land/dependency-management"
                class={tw`link`}
              >
                Dependency Management
              </a>
            </li>
            <li>
              <a
                href="https://examples.deno.land/http-requests"
                class={tw`link`}
              >
                HTTP Requests
              </a>
            </li>
            <li>
              <a href="https://examples.deno.land/http-server" class={tw`link`}>
                HTTP Server: Hello World
              </a>
            </li>
          </ol>
          <p class={tw`my-4 text-gray-700`}>
            For more examples, check out{" "}
            <a class={tw`link`} href="https://examples.deno.land">
              examples.deno.land
            </a>
            .
          </p>
        </div>
        <DenoInProductionSection />
        <div class={tw`mt-20`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function DenoInProductionSection() {
  const companies = [{
    name: "Slack",
    logo: "slack.svg",
    url: "https://slack.com",
  }, {
    name: "Netlify",
    logo: "netlify.svg",
    url: "https://netlify.com",
  }, {
    name: "GitHub",
    logo: "github.svg",
    url: "https://github.com",
  }, {
    name: "Supabase",
    logo: "supabase.svg",
    url: "https://supabase.com",
  }];

  return (
    <div class={tw`section-x-inset-sm mt-20`}>
      <a class={tw`hover:underline`} href="#deno-in-production">
        <h3 class={tw`font-bold text-xl`} id="deno-in-production">
          Deno in Production
        </h3>
      </a>
      <ol class={tw`pl-1 md:pl-0 md:flex flex-wrap gap-8 mt-5 list-none`}>
        {companies.map(({ name, logo, url }) => (
          <li class={tw`mb-2 md:mb-0`} key={url}>
            <a
              class={tw`flex items-center gap-2 flex-nowrap opacity-70 hover:opacity-100`}
              href={url}
              target="_blank"
            >
              <img
                class={tw`w-5`}
                src={`https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/${logo}`}
                alt={name}
                title={name}
              />{" "}
              <span class={tw`font-medium text-lg`}>{name}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function InstallSection({ url }: { url: URL }) {
  const shell = (
    <div key="shell" class={tw`my-4 text-gray-700`}>
      <p class={tw`py-2`}>Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code="curl -fsSL https://deno.land/install.sh | sh"
        url={url}
        enableCopyButton
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://formulae.brew.sh/formula/deno" class={tw`link`}>
          Homebrew
        </a>{" "}
        (Mac):
      </p>
      <CodeBlock
        language="bash"
        code="brew install deno"
        url={url}
        enableCopyButton
      />
    </div>
  );
  const powershell = (
    <div key="powershell" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="irm https://deno.land/install.ps1 | iex"
        url={url}
        enableCopyButton
      />
    </div>
  );

  return (
    <>
      <p class={tw`my-4 text-gray-700`}>
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the
        {" "}
        <a href="https://github.com/denoland/deno/releases" class={tw`link`}>
          releases page
        </a>
        .
      </p>
      {shell}
      {powershell}
      {homebrew}
      <p class={tw`my-4 text-gray-700`}>
        See{" "}
        <a class={tw`link`} href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        for more installation options.
      </p>
    </>
  );
}

export const handler: Handlers<Data> = {
  GET(req, { render }) {
    const cookies = getCookies(req.headers);
    return render!({
      isFirefox:
        req.headers.get("user-agent")?.toLowerCase().includes("firefox") ??
          false,
      hellobarClosedTo: cookies.hellobar ?? "",
    });
  },
};
