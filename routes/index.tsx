// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head, tw } from "../deps.ts";
import { CodeBlock } from "../components/CodeBlock.tsx";
import { Footer } from "../components/Footer.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import { Header } from "../components/Header.tsx";
import versions from "../versions.json" assert { type: "json" };
import { Background } from "../components/HeroBackground.tsx";

export default function Home() {
  const complexExampleProgram =
    `import { serve } from "https://deno.land/std/http/server.ts";
serve(req => new Response("Hello World\\n"));`;

  const denoTestExample =
    `deno test https://deno.land/std@0.132.0/testing/chai_example.ts
running 3 tests from https://deno.land/std@0.132.0/testing/chai_example.ts
test we can make chai assertions ... ok (8ms)
test we can make chai expectations ... ok (2ms)
test we can use chai should style ... ok (4ms)

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (27ms)`;

  return (
    <div>
      <Head>
        <title>Deno - 现代的 JavaScript 和 TypeScript 运行时</title>
      </Head>
      <div class={tw`bg-white`}>
        <div
          class={tw
            `bg-gray-50 overflow-x-hidden border-b border-gray-200 relative`}
        >
          <Background />
          <Header main />
          <div
            class={tw
              `relative max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center`}
          >
            <h1
              class={tw
                `font-extrabold text-5xl leading-10 tracking-tight text-gray-900`}
            >
              Deno
            </h1>
<<<<<<< HEAD
            <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              <strong class="font-semibold">现代</strong>的{" "}
              <strong class="font-semibold">JavaScript</strong> 和{" "}
              <strong class="font-semibold">TypeScript</strong> 运行时。
=======
            <h2
              class={tw
                `mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900`}
            >
              A <strong class={tw`font-semibold`}>modern</strong> runtime for
              {" "}
              <strong class={tw`font-semibold`}>JavaScript</strong> and{" "}
              <strong class={tw`font-semibold`}>TypeScript</strong>.
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
            </h2>
            <a
              href="/#installation"
              class={tw
                `rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg`}
            >
              安装
            </a>
            <a
              href="https://github.com/denoland/deno/releases/latest"
              class={tw`mt-4`}
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
<<<<<<< HEAD
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p class="my-4 text-gray-700">
            Deno 是一个简单的、现代的、安全的 JavaScript、TypeScript 和 WebAssembly 运行时，基于 V8
            引擎并采用 Rust 构建。
=======
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
          <p class={tw`my-4 text-gray-700`}>
            Deno is a simple, modern and secure runtime for JavaScript,
            TypeScript, and WebAssembly that uses V8 and is built in Rust.
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
          </p>
          <ol class={tw`ml-8 list-disc text-gray-700`}>
            <li>
<<<<<<< HEAD
              提供符合 Web 平台标准的{" "}
              <a class="link" href="/manual/runtime/web_platform_apis.md">
=======
              Provides{" "}
              <a class={tw`link`} href="/manual/runtime/web_platform_apis.md">
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
                web platform functionality
              </a>{" "}
              。
            </li>
            <li>
              默认安全。除非显式开启，否则没有文件、网络、环境变量的访问权限。
            </li>
            <li>
<<<<<<< HEAD
              开箱即用的 <a class="link" href="/manual/typescript">TypeScript</a> 支持。
=======
              Supports{" "}
              <a class={tw`link`} href="/manual/typescript">TypeScript</a>{" "}
              out of the box.
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
            </li>
            <li>单一的可执行文件</li>
            <li>
<<<<<<< HEAD
              拥有一些列{" "}
              <a class="link" href="/manual/tools">
                内置开发工具
              </a>{" "}
              例如依赖检查器 (
              <a class="link" href="/manual/tools/dependency_inspector">
                <InlineCode>deno info</InlineCode>
              </a>) 和代码格式化 (<a class="link" href="/manual/tools/formatter">
=======
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
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
                <InlineCode>deno fmt</InlineCode>
              </a>)。
            </li>
            <li>
              自带一套经过审查 (安全审计) 的标准模块，并保证了代码与 Deno 完全兼容：{" "}
              <a
<<<<<<< HEAD
                href="https://doc.deno.js.cn/https://deno.land/std"
                class="link"
=======
                href="https://doc.deno.land/https://deno.land/std"
                class={tw`link`}
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
              >
                deno.land/std
              </a>.
            </li>
            <li>
              已有很多{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                class={tw`link`}
              >
                公司对 Deno 感兴趣
              </a>
            </li>
          </ol>
        </div>
<<<<<<< HEAD
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#installation">
            <h3 class="font-bold text-xl" id="installation">
              安装
=======
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
          <a class={tw`hover:underline`} href="#installation">
            <h3 class={tw`font-bold text-xl`} id="installation">
              Installation
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
            </h3>
          </a>
          <InstallSection />
        </div>
<<<<<<< HEAD
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#getting-started">
            <h3 class="font-bold text-xl" id="getting-started">
              起步
            </h3>
          </a>
          <p class="my-4 text-gray-700">运行一个简单的 Deno 程序：</p>
=======
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
          <a class={tw`hover:underline`} href="#getting-started">
            <h3 class={tw`font-bold text-xl`} id="getting-started">
              Getting Started
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>Try running a simple program:</p>
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
<<<<<<< HEAD
          <p class="my-4 text-gray-700">或者运行一个复杂点的 Deno 程序：</p>
=======
          <p class={tw`my-4 text-gray-700`}>Or a more complex one:</p>
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8`}>
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
<<<<<<< HEAD
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p class="my-4 text-gray-700">
            你可以在 <a class="link" href="/manual">参考手册</a>{" "}
            中找到“深入介绍”、“环境搭建”、“代码示例”等内容。
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#runtime-documentation">
            <h3 class="font-bold text-xl" id="runtime-documentation">
              运行时文档
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            Deno 的基本运行时文档可以在{" "}
            <a href="https://doc.deno.js.cn/deno/stable" class="link">
              doc.deno.js.cn
=======
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8`}>
          <p class={tw`my-4 text-gray-700`}>
            You can find a more in depth introduction, examples, and environment
            setup guides in{" "}
            <a class={tw`link`} href="/manual">
              the manual
            </a>
            .
          </p>
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
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
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
            </a>{" "}
            网站找到。
          </p>
<<<<<<< HEAD
          <p class="my-4 text-gray-700">
            Deno 自带的 <a class="link" href="/manual">参考手册</a>{" "}
            包含了关于 Deno Runtime 更复杂功能的深入解析,、Deno 内部功能的详细信息、如何在您自己的应用程序中嵌入 Deno
            以及如何使用 Rust 编写 Deno 插件。
          </p>
          <p class="my-4 text-gray-700">
            该手册还包含有关 Deno 提供的内置工具的信息。
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#standard-modules">
            <h3 class="font-bold text-xl" id="standard-modules">
              标准模块
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            除了提供 Deno 运行时之外，Deno 还提供了标准模块，这些模块由 Deno 核心团队维护和审核以保证可使用特定的 Deno
            版本。这些模块在{" "}
            <a href="https://github.com/denoland/deno_std" class="link">
=======
          <p class={tw`my-4 text-gray-700`}>
            The manual also contains information about the built in tools that
            Deno provides.
          </p>
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
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
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
              denoland/deno_std
            </a>{" "}
            仓库。
          </p>
<<<<<<< HEAD
          <p class="my-4 text-gray-700">
            这些标准模块托管在 <a class="link" href="/std">deno.js.cn/std</a>{" "}
            上，并且同所有其他的兼容 Deno 的 ES 模块一样通过 URL 进行分发。
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#third-party-modules">
            <h3 class="font-bold text-xl" id="third-party-modules">
              第三方模块
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            Deno 可以从网络上的任何位置导入模块，例如 GitHub、个人网站或 CDN，例如{" "}
            <a href="https://www.skypack.dev" class="link">
              Skypack
            </a>
            、{" "}
            <a href="https://jspm.io" class="link">
              jspm.io
            </a>
            、{" "}
            <a href="https://www.jsdelivr.com/" class="link">
              jsDelivr
            </a>{" "}
            或{" "}
            <a href="https://esm.sh/" class="link">
=======
          <p class={tw`my-4 text-gray-700`}>
            These standard modules are hosted at{" "}
            <a class={tw`link`} href="/std">
              deno.land/std
            </a>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
          </p>
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
          <a class={tw`hover:underline`} href="#third-party-modules">
            <h3 class={tw`font-bold text-xl`} id="third-party-modules">
              Third Party Modules
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Deno can import modules from any location on the web, like GitHub, a
            personal webserver, or a CDN like{" "}
            <a href="https://www.skypack.dev" class={tw`link`}>
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" class={tw`link`}>
              jspm.io
            </a>
            ,{" "}
            <a href="https://www.jsdelivr.com/" class={tw`link`}>
              jsDelivr
            </a>{" "}
            or{" "}
            <a href="https://esm.sh/" class={tw`link`}>
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
              esm.sh
            </a>
            。
          </p>
<<<<<<< HEAD
          <p class="my-4 text-gray-700">
            为了更方便地使用第三方模块，Deno 提供了一些内置的工具，如
            <a class="link" href="/manual/tools/dependency_inspector">
              <InlineCode>deno info</InlineCode>
            </a>{" "}
            和{" "}
            <a
              class="link"
              href="/manual/tools/documentation_generator"
            >
              <InlineCode>deno doc</InlineCode>
            </a>。deno.js.cn 还提供了一个 web UI 用来在线查看模块文档。可以通过{" "}
            <a href="https://doc.deno.js.cn" class="link">
              doc.deno.js.cn
            </a>{" "}
            访问。
          </p>
          <p class="my-4 text-gray-700">
            deno.land 还为用于 Deno 的 ES 模块提供简单的公共托管服务。 位于{" "}
            <a class="link" href="/x">deno.js.cn/x</a>。
=======
          <p class={tw`my-4 text-gray-700`}>
            To make it easier to consume third party modules Deno provides some
            built in tooling like{" "}
            <a class={tw`link`} href="/manual/tools/dependency_inspector">
              <InlineCode>deno info</InlineCode>
            </a>{" "}
            and{" "}
            <a class={tw`link`} href="/manual/tools/documentation_generator">
              <InlineCode>deno doc</InlineCode>
            </a>
            . deno.land also provides a web UI for viewing module documentation.
            It is available at{" "}
            <a href="https://doc.deno.land" class={tw`link`}>
              doc.deno.land
            </a>
            .
          </p>
          <p class={tw`my-4 text-gray-700`}>
            deno.land also provides a simple public hosting service for ES
            modules that work with Deno. It can be found at{" "}
            <a class={tw`link`} href="/x">
              deno.land/x
            </a>
            .
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
          </p>
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
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
            <CodeBlock code={"deno lint\nChecked 54 files"} language="bash" />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            <a class={tw`link`} href="/manual/tools/formatter">
              Format
            </a>{" "}
            all supported files in the current directory and subdirectories:
          </p>
          <p>
            <CodeBlock code={"deno fmt\nChecked 46 files"} language="bash" />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            Run a{" "}
            <a class={tw`link`} href="/manual/testing">
              test
            </a>
            :
          </p>
          <p>
            <CodeBlock code={denoTestExample} language="bash" />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            For the full list of tools and their options, see{" "}
            <a href="/manual/tools" class={tw`link`}>
              here
            </a>
            .
          </p>
        </div>
        <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
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
          <Footer simple />
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
    <div class={tw`max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20`}>
      <a class={tw`hover:underline`} href="#deno-in-production">
        <h3 class={tw`font-bold text-xl`} id="deno-in-production">
          Deno in Production
        </h3>
      </a>
      <ol class={tw`pl-1 md:pl-0 md:flex flex-wrap gap-8 mt-5 list-none`}>
        {companies.map(({ name, logo, url }) => (
          <li class={tw`mb-2 md:mb-0`} key={url}>
            <a
              class={tw
                `flex items-center gap-2 flex-nowrap opacity-70 hover:opacity-100`}
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

function InstallSection() {
  const shell = (
    <div key="shell" class={tw`my-4 text-gray-700`}>
      <p class={tw`py-2`}>Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code="curl -fsSL https://x.deno.js.cn/install.sh | sh"
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://formulae.brew.sh/formula/deno" class={tw`link`}>
          Homebrew
        </a>{" "}
        (Mac)：
      </p>
      <CodeBlock language="bash" code="brew install deno" />
    </div>
  );
  const powershell = (
    <div key="powershell" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://x.deno.js.cn/install.ps1 -useb | iex"
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://chocolatey.org/packages/deno" class={tw`link`}>
          Chocolatey
        </a>{" "}
        (Windows)：
      </p>
      <CodeBlock language="bash" code="choco install deno" />
    </div>
  );
  const scoop = (
    <div key="scoop" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>
        <a href="https://scoop.sh/" class={tw`link`}>
          Scoop
        </a>{" "}
        (Windows)：
      </p>
      <CodeBlock language="bash" code="scoop install deno" />
    </div>
  );
  const cargo = (
<<<<<<< HEAD
    <div key="cargo" class="my-4 text-gray-700">
      <p class="py-2">
        使用{" "}
        <a href="https://crates.io/crates/deno" class="link">
=======
    <div key="cargo" class={tw`my-4 text-gray-700`}>
      <p class={tw`py-2`}>
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" class={tw`link`}>
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
          Cargo
        </a>{" "}
        从源码构建并安装：
      </p>
      <CodeBlock language="bash" code="cargo install deno --locked" />
    </div>
  );

  return (
    <>
<<<<<<< HEAD
      <p class="my-4 text-gray-700">
        Deno 没有外部依赖，只有一个单独的可执行文件。你可以使用下面的安装器来安装，也可以从{" "}
        <a href="https://github.com/denoland/deno/releases" class="link">
          GitHub Releases 页面
=======
      <p class={tw`my-4 text-gray-700`}>
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the
        {" "}
        <a href="https://github.com/denoland/deno/releases" class={tw`link`}>
          releases page
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
        </a>
        下载已经编译好的二进制可执行程序。
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
<<<<<<< HEAD
      <p class="my-4 text-gray-700">
        查看{" "}
        <a class="link" href="https://github.com/denocn/deno_install">
          denocn/deno_install
=======
      <p class={tw`my-4 text-gray-700`}>
        See{" "}
        <a class={tw`link`} href="https://github.com/denoland/deno_install">
          deno_install
>>>>>>> 8202fd5aad54ae3cbda998ebc7dfcef594bc546a
        </a>{" "}
        以了解更多的安装选项。
      </p>
    </>
  );
}
