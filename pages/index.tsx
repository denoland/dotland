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
        <title>Deno - 现代的 JavaScript 和 TypeScript 运行时</title>
      </Head>
      <div class="bg-white">
        <div class="bg-gray-50 border-b border-gray-200">
          <Header main />
          <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 class="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              <strong class="font-semibold">现代</strong>的{" "}
              <strong class="font-semibold">JavaScript</strong> 和{" "}
              <strong class="font-semibold">TypeScript</strong> 运行时。
            </h2>
            <a
              href="/#installation"
              class="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              安装
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
            Deno 是一个简单的、现代的、安全的 JavaScript 和 TypeScript 运行时，基于 V8 引擎并采用 Rust 构建。
          </p>
          <ol class="ml-8 list-disc text-gray-700">
            <li>
              默认安全。除非显式开启，否则没有文件、网络、环境变量的访问权限。
            </li>
            <li>支持开箱即用的 TypeScript。</li>
            <li>只发布单一的可执行程序。</li>
            <li>
              内置实用工具，例如依赖检查 (<InlineCode>deno info</InlineCode>) 和代码格式化
              (<InlineCode>deno fmt</InlineCode>)。
            </li>
            <li>
              自带一套经过审查 (安全审计) 的标准模块，并保证了代码与 Deno 完全兼容：{" "}
              <a href="https://deno.land/std" class="link">
                deno.land/std
              </a>
            </li>
            <li>
              已有很多{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                class="link"
              >
                公司对 Deno 感兴趣
              </a>
            </li>
          </ol>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#installation">
            <h3 class="font-bold text-xl" id="installation">
              安装
            </h3>
          </a>
          <InstallSection />
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#getting-started">
            <h3 class="font-bold text-xl" id="getting-started">
              起步
            </h3>
          </a>
          <p class="my-4 text-gray-700">运行一个简单的 Deno 程序：</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p class="my-4 text-gray-700">或者运行一个复杂点的 Deno 程序：</p>
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
            </a>{" "}
            网站找到。
          </p>
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
              denoland/deno_std
            </a>{" "}
            仓库。
          </p>
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
              esm.sh
            </a>
            。
          </p>
          <p class="my-4 text-gray-700">
            为了更方便地使用第三方模块，Deno 提供了一些内置的工具，如 <InlineCode>deno info</InlineCode> 和
            {" "}
            <InlineCode>deno doc</InlineCode>。deno.js.cn 还提供了一个 web UI
            用来在线查看模块文档。可以通过{" "}
            <a href="https://doc.deno.js.cn" class="link">
              doc.deno.js.cn
            </a>{" "}
            访问。
          </p>
          <p class="my-4 text-gray-700">
            deno.land 还为用于 Deno 的 ES 模块提供简单的公共托管服务。 位于{" "}
            <a class="link" href="/x">deno.js.cn/x</a>。
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
        code="curl -fsSL https://x.deno.js.cn/install.sh | sh"
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" class="link">
          Homebrew
        </a>{" "}
        (Mac)：
      </p>
      <CodeBlock language="bash" code="brew install deno" />
    </div>
  );
  const powershell = (
    <div key="powershell" class="my-4 text-gray-700">
      <p class="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://x.deno.js.cn/install.ps1 -useb | iex"
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://chocolatey.org/packages/deno" class="link">
          Chocolatey
        </a>{" "}
        (Windows)：
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
        (Windows)：
      </p>
      <CodeBlock language="bash" code="scoop install deno" />
    </div>
  );
  const cargo = (
    <div key="cargo" class="my-4 text-gray-700">
      <p class="py-2">
        使用{" "}
        <a href="https://crates.io/crates/deno" class="link">
          Cargo
        </a>{" "}
        从源码构建并安装：
      </p>
      <CodeBlock language="bash" code="cargo install deno --locked" />
    </div>
  );

  return (
    <>
      <p class="my-4 text-gray-700">
        Deno 没有外部依赖，只有一个单独的可执行文件。你可以使用下面的安装器来安装，也可以从{" "}
        <a href="https://github.com/denoland/deno/releases" class="link">
          GitHub Releases 页面
        </a>
        下载已经编译好的二进制可执行程序。
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p class="my-4 text-gray-700">
        查看{" "}
        <a class="link" href="https://github.com/denocn/deno_install">
          denocn/deno_install
        </a>{" "}
        以了解更多的安装选项。
      </p>
    </>
  );
}
