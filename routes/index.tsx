// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, VNode } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { Footer } from "@/components/Footer.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import { Header } from "@/components/Header.tsx";
import { LinkWithArrow } from "@/components/LinkWithArrow.tsx";
import * as Icons from "@/components/Icons.tsx";
import Frameworks from "@/islands/Frameworks.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

import versions from "@/versions.json" assert { type: "json" };

interface Data {
  isWin: boolean;
  isFirefox: boolean;
}

export default function HomeNew({ data, url }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Deno - A modern runtime for JavaScript and TypeScript</title>
      </Head>
      <div>
        <div
          class={tw`absolute w-full h-full overflow-hidden flex items-center justify-center bg-white`}
          style="filter: blur(900px);"
        >
          <img
            class={tw`w-screen absolute bottom-0`}
            src="/office_illustration_lighter.png"
          />
        </div>

        <Header main />

        <div class={tw`relative`}>
          {/* cover */}
          <div
            class={tw`w-screen h-screen flex items-center justify-center`}
          >
            <div class={tw`w-[900px] flex items-center justify-between`}>
              <div>
                <h2 class={tw`text-symbol text-[25px] leading-none`}>
                  A modern runtime for
                </h2>
                <h1 class={tw`mt-2 text-[54px] font-bold leading-[1.1]`}>
                  Javascript <br />
                  Typescript <br />
                  WebAssembly
                </h1>
                <div class={tw`flex gap-2 mt-6`}>
                  <button
                    href="https://deno.com/deploy"
                    class={tw`flex h-10 items-center gap-2 rounded-md px-5 bg-default text-white border-1 border-gray-200 hover:bg-white hover:text-default hover:border-gray-500 transition-colors`}
                  >
                    <svg
                      width="19"
                      height="12"
                      viewBox="0 0 19 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.64749 6.02025C6.64723 6.31595 6.52871 6.59943 6.318 6.80839L2.19942 10.8978C1.98649 11.0948 1.70486 11.202 1.41387 11.1969C1.12287 11.1918 0.845222 11.0748 0.639424 10.8704C0.433625 10.6661 0.315741 10.3904 0.310607 10.1015C0.305472 9.81254 0.413488 9.53291 0.611899 9.32149L3.93672 6.02025L0.611899 2.71902C0.501541 2.61691 0.413026 2.49379 0.351633 2.35698C0.290241 2.22017 0.25723 2.07249 0.254569 1.92274C0.251908 1.77299 0.279652 1.62424 0.336145 1.48537C0.392639 1.3465 0.476724 1.22035 0.583386 1.11444C0.690048 1.00854 0.817101 0.925045 0.956965 0.868952C1.09683 0.812859 1.24664 0.785312 1.39746 0.787954C1.54828 0.790596 1.69702 0.823374 1.8348 0.884331C1.97258 0.945288 2.09659 1.03318 2.19942 1.14275L6.318 5.23212C6.52917 5.44031 6.64749 5.72433 6.64749 6.02025ZM9.64282 8.99434C9.34492 8.99434 9.05921 9.11184 8.84856 9.321C8.63791 9.53016 8.51957 9.81383 8.51957 10.1096C8.51957 10.4054 8.63791 10.6891 8.84856 10.8982C9.05921 11.1074 9.34492 11.2249 9.64282 11.2249H17.1311C17.4291 11.2249 17.7148 11.1074 17.9254 10.8982C18.1361 10.6891 18.2544 10.4054 18.2544 10.1096C18.2544 9.81383 18.1361 9.53016 17.9254 9.321C17.7148 9.11184 17.4291 8.99434 17.1311 8.99434H9.64282Z"
                        fill="currentColor"
                      />
                    </svg>
                    Install Deno
                    <span class={tw`opacity-60 font-medium text-sm`}>
                      {versions.cli[0]}
                    </span>
                  </button>
                  <a
                    href="/manual"
                    class={tw`flex h-10 items-center rounded-md px-5 bg-white border-1 border-gray-200 hover:border-gray-500 transition-colors`}
                  >
                    Docs
                  </a>
                </div>
              </div>
              <img class={tw`w-[480px]`} src="/office_illustration.png" />
            </div>
          </div>

          {/* installation */}
          <div class={tw`w-[750px] mx-auto flex flex-col gap-4`}>
            <h2 class={tw`text-xl font-medium`}>Installation</h2>
            <CodeBlock
              class="border-2 border-fresh !bg-[#F3FBF5]"
              code={data.isWin
                ? `iwr https://deno.land/install.ps1 -useb | iex`
                : `curl -fsSL https://deno.land/install.sh | sh`}
              language="bash"
              url={url}
            >
            </CodeBlock>
            <p>
              Other{" "}
              <LinkWithArrow
                class={tw`text-primary`}
                href="/installation"
              >
                Installation Methods
              </LinkWithArrow>
            </p>
          </div>

          {/* desc */}
          <div class={tw`w-[750px] mx-auto mt-20`}>
            <h2 class={tw`text-xl`}>
              <strong>Deno</strong>{" "}
              is a simple, modern and secure runtime for JavaScript, TypeScript,
              and WebAssembly that uses V8 and is built in Rust.
            </h2>
            <ul class={tw`flex flex-col gap-2 mt-4`}>
              <Li>
                Provides{" "}
                <a class={tw`link`} href="/manual/runtime/web_platform_apis">
                  web platform functionality
                </a>{" "}
                and adopts web platform standards.
              </Li>
              <Li>
                Secure by default. No file, network, or environment access,
                unless explicitly enabled.
              </Li>
              <Li>
                Supports{" "}
                <a class={tw`link`} href="/manual/typescript">TypeScript</a>
                {" "}
                out of the box.
              </Li>
              <Li>Ships only a single executable file.</Li>
              <Li>
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
              </Li>
              <Li>
                Has a set of reviewed (audited) standard modules that are
                guaranteed to work with Deno:{" "}
                <a
                  href="https://doc.deno.land/https://deno.land/std"
                  class={tw`link`}
                >
                  deno.land/std
                </a>.
              </Li>
              <Li>
                Has a number of{" "}
                <a
                  href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                  class={tw`link`}
                >
                  companies interested in using and exploring Deno.
                </a>
              </Li>
            </ul>
          </div>

          {/* getting started */}
          <div class={tw`w-[750px] mx-auto my-20 flex flex-col gap-4`}>
            <h2 class={tw`text-xl font-medium`}>Getting started</h2>
            <CodeBlock
              code={[
                `// server.ts`,
                ``,
                `import { serve } from "https://deno.land/std@0.148.0/http/server.ts";`,
                ``,
                `serve(req => new Response("Hello World\\n"));`,
              ].join("\n")}
              language="typescript"
              url={url}
            >
              <a
                href="https://dash.deno.com/playground/example-helloworld"
                class={tw`rounded-md px-4.5 py-2.5 inline-flex items-center gap-1.5 border-1 border-transparent leading-none font-medium text-white bg-primary hover:bg-white hover:text-primary hover:border-primary transition-colors`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.Playground />
                <div>Playground</div>
              </a>
            </CodeBlock>
            <p>Run the server:</p>
            <CodeBlock
              code={"deno run --allow-net server.ts"}
              language="bash"
              url={url}
            />
            <p>
              You can find a more in depth introduction, examples, and
              environment setup guides in{" "}
              <a href="/manual" class={`link`}>the manual</a>.
            </p>
          </div>
        </div>

        {/* framework */}
        <Frameworks />

        {/* logos */}
        <div
          class={tw`relative bg-white flex flex-col w-screen h-48 items-center justify-center gap-4`}
        >
          <h2 class={tw`text-gray-400 leading-none`}>
            Deno in Production
          </h2>
          <Logos />
        </div>

        <Footer />
      </div>
    </>
  );
}

function Li({ children }: { children: VNode | string | (VNode | string)[] }) {
  return (
    <li class={tw`flex items-center gap-2 text-default`}>
      <svg
        class={tw`flex-0`}
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle opacity="0.1" cx="10" cy="10" r="10" fill="#0CBB3F" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13.9855 6.99571C14.264 7.2638 14.2725 7.70694 14.0044 7.98548L9.19189 12.9855C9.05993 13.1226 8.87784 13.2 8.68755 13.2C8.49726 13.2 8.31517 13.1226 8.18321 12.9855L5.99571 10.7127C5.72761 10.4342 5.73608 9.99108 6.01462 9.72298C6.29316 9.45489 6.7363 9.46335 7.00439 9.74189L8.68755 11.4906L12.9957 7.01462C13.2638 6.73608 13.7069 6.72761 13.9855 6.99571Z"
          fill="#2FA850"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Logos() {
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
    <ol class={tw`flex flex-wrap gap-8 list-none`}>
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
            <span class={tw`font-medium text-lg leading-none`}>{name}</span>
          </a>
        </li>
      ))}
    </ol>
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
      <CodeBlock language="bash" code="brew install deno" url={url} />
    </div>
  );
  const powershell = (
    <div key="powershell" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://deno.land/install.ps1 -useb | iex"
        url={url}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://chocolatey.org/packages/deno" class={tw`link`}>
          Chocolatey
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code="choco install deno" url={url} />
    </div>
  );
  const scoop = (
    <div key="scoop" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://scoop.sh/" class={tw`link`}>
          Scoop
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code="scoop install deno" url={url} />
    </div>
  );
  const cargo = (
    <div key="cargo" class={tw`my-4 text-gray-700`}>
      <p class={tw`py-2`}>
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" class={tw`link`}>
          Cargo
        </a>
        :
      </p>
      <CodeBlock language="bash" code="cargo install deno --locked" url={url} />
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
      {chocolatey}
      {scoop}
      {cargo}
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
    const ua = req.headers.get("user-agent") ?? "";
    return render!({
      isWin: ua.indexOf("Windows ") >= 0,
      isFirefox: ua.toLowerCase().includes("firefox") ??
        false,
    });
  },
};
