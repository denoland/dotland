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
<<<<<<< HEAD
      {
        /* <div className="bg-blue-500 p-4 text-white flex justify-center text-center">
        <div className="max-w-screen-xl">
          <span className="inline">Deno 1.9 发布了</span>
          <span className="block sm:ml-2 sm:inline-block font-semibold">
            <a href="https://deno.com/blog/v1.9">
              阅读文章 <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </div>
      </div> */
      }
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
=======
      <div class="bg-white">
        <div class="bg-gray-50 border-b border-gray-200">
>>>>>>> 536026728193c65673465483c3006267099de405
          <Header main />
          <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 class="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
<<<<<<< HEAD
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              <strong className="font-semibold">现代的</strong>{" "}
              <strong className="font-semibold">JavaScript</strong> 和{" "}
              <strong className="font-semibold">TypeScript</strong> 运行时。
=======
            <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              A <strong class="font-semibold">modern</strong> runtime for{" "}
              <strong class="font-semibold">JavaScript</strong> and{" "}
              <strong class="font-semibold">TypeScript</strong>.
>>>>>>> 536026728193c65673465483c3006267099de405
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
<<<<<<< HEAD
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
            Deno 是一个简单、现代且安全的 JavaScript 和 TypeScript 运行时，基于 V8 引擎并采用 Rust
            编程语言构建。
=======
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p class="my-4 text-gray-700">
            Deno is a simple, modern and secure runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust.
>>>>>>> 536026728193c65673465483c3006267099de405
          </p>
          <ol class="ml-8 list-disc text-gray-700">
            <li>
              默认安全。除非显示开启，否则没有文件、网络、环境变量的访问权限。
            </li>
            <li>支持开箱即用的 TypeScript。</li>
            <li>只发布单一的可执行程序。</li>
            <li>
              内置了实用工具，例如依赖检查 (<InlineCode>deno info</InlineCode>) 和代码格式化
              (<InlineCode>deno fmt</InlineCode>)。
            </li>
            <li>
<<<<<<< HEAD
              自带一套经过审查 (安全审计) 的标准模块，并保证了代码与 Deno 完全兼容：{" "}
              <a href="https://deno.land/std" className="link">
=======
              Has a set of reviewed (audited) standard modules that are
              guaranteed to work with Deno:{" "}
              <a href="https://deno.land/std" class="link">
>>>>>>> 536026728193c65673465483c3006267099de405
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
<<<<<<< HEAD
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                安装
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                起步
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">试着运行下面的简单程序：</p>
=======
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
>>>>>>> 536026728193c65673465483c3006267099de405
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
<<<<<<< HEAD
          <p className="my-4 text-gray-700">或者再运行一个复杂点的：</p>
=======
          <p class="my-4 text-gray-700">Or a more complex one:</p>
>>>>>>> 536026728193c65673465483c3006267099de405
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
<<<<<<< HEAD
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p className="my-4 text-gray-700">
            你可以在{" "}
            <Link href="/manual">
              <a className="link">参考手册</a>
            </Link>{" "}
            中找到“深入介绍”、“环境搭建”、“代码示例”等内容。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                运行时文档
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno 的基本运行时文档可以在{" "}
            <a href="https://doc.deno.js.cn/builtin/stable" className="link">
              doc.deno.js.cn
            </a>{" "}
            网站找到。
          </p>
          <p className="my-4 text-gray-700">
            Deno 自带的
            <Link href="/manual">
              <a className="link">参考手册</a>
            </Link>{" "}
            包含了关于 Deno 运行时更复杂功能的深入解析, Deno 内部功能的详细信息，如何在您自己的应用程序中嵌入 Deno 以及如何使用
            Rust 编写 Deno 插件。
          </p>
          <p className="my-4 text-gray-700">
            该手册还包含有关 Deno 提供的内置工具的信息。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                标准模块
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            除了提供 Deno 运行时之外，Deno 还提供了标准模块，这些模块由 Deno 核心团队维护和审核以保证可使用特定的 Deno
            版本。这些模块在{" "}
            <a href="https://github.com/denoland/deno_std" className="link">
=======
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
            <a href="https://doc.deno.land/builtin/stable" class="link">
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
>>>>>>> 536026728193c65673465483c3006267099de405
              denoland/deno_std
            </a>{" "}
            仓库。
          </p>
<<<<<<< HEAD
          <p className="my-4 text-gray-700">
            这些标准模块托管在{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            上，并且同所有其他的兼容 Deno 的 ES 模块一样通过 URL 进行分发。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                第三方模块
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno 可以从网络上的任何位置导入模块，例如 GitHub、个人网站或 CDN，例如{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            、
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            、
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>{" "}
            或{" "}
            <a href="https://esm.sh/" className="link">
=======
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
>>>>>>> 536026728193c65673465483c3006267099de405
              esm.sh
            </a>
            。
          </p>
<<<<<<< HEAD
          <p className="my-4 text-gray-700">
            为了更方便地使用第三方模块，Deno 提供了一些内置的工具，如 <InlineCode>deno info</InlineCode> 和
            {" "}
            <InlineCode>deno doc</InlineCode>。 deno.land 还提供用于查看模块文档的 Web UI。位于
            {" "}
            <a href="https://doc.deno.js.cn" className="link">
              doc.deno.js.cn
=======
          <p class="my-4 text-gray-700">
            To make it easier to consume third party modules Deno provides some
            built in tooling like <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land also provides a web UI
            for viewing module documentation. It is available at{" "}
            <a href="https://doc.deno.land" class="link">
              doc.deno.land
>>>>>>> 536026728193c65673465483c3006267099de405
            </a>
            。
          </p>
<<<<<<< HEAD
          <p className="my-4 text-gray-700">
            deno.land 还为用于 Deno 的 ES 模块提供简单的公共托管服务。 位于{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            。
=======
          <p class="my-4 text-gray-700">
            deno.land also provides a simple public hosting service for ES
            modules that work with Deno. It can be found at{" "}
            <a class="link" href="/x">deno.land/x</a>.
>>>>>>> 536026728193c65673465483c3006267099de405
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
<<<<<<< HEAD
    <div key="shell" className="my-4 text-gray-700">
      <p className="py-2">Shell (Mac, Linux)：</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://x.deno.js.cn/install.sh | sh`}
=======
    <div key="shell" class="my-4 text-gray-700">
      <p class="py-2">Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code="curl -fsSL https://deno.land/install.sh | sh"
>>>>>>> 536026728193c65673465483c3006267099de405
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
<<<<<<< HEAD
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">PowerShell (Windows)：</p>
      <CodeBlock
        language="bash"
        code={`iwr https://x.deno.js.cn/install.ps1 -useb | iex`}
=======
    <div key="powershell" class="my-4 text-gray-700">
      <p class="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://deno.land/install.ps1 -useb | iex"
>>>>>>> 536026728193c65673465483c3006267099de405
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
<<<<<<< HEAD
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
        使用{" "}
        <a href="https://crates.io/crates/deno" className="link">
=======
    <div key="cargo" class="my-4 text-gray-700">
      <p class="py-2">
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" class="link">
>>>>>>> 536026728193c65673465483c3006267099de405
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
      <p className="my-4 text-gray-700">
        Deno 没有外部依赖，只有一个单独的可执行文件。你可以使用下面的安装器来安装，也可以从{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          GitHub Releases 页面
=======
      <p class="my-4 text-gray-700">
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the
        {" "}
        <a href="https://github.com/denoland/deno/releases" class="link">
          releases page
>>>>>>> 536026728193c65673465483c3006267099de405
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
      <p className="my-4 text-gray-700">
        查看{" "}
        <a className="link" href="https://github.com/denocn/deno_install">
          denocn/deno_install
=======
      <p class="my-4 text-gray-700">
        See{" "}
        <a class="link" href="https://github.com/denoland/deno_install">
          deno_install
>>>>>>> 536026728193c65673465483c3006267099de405
        </a>{" "}
        以了解更多的安装选项。
      </p>
    </>
  );
}
