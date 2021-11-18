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
import { CookieBanner } from "../components/CookieBanner";

interface HomeProps {
  latestStd: string;
}

const Home: NextPage<HomeProps> = ({ latestStd }) => {
  const complexExampleProgram =
    `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";

console.log("http://localhost:8000/");
serve((req) => new Response("Hello World\\n"), { addr: ":8000" });
`;

  return (
    <>
      <Head>
        <title>Deno - 现代的 JavaScript 和 TypeScript 运行时</title>
      </Head>
      <CookieBanner />
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
          <Header main />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              <strong className="font-semibold">现代的</strong>{" "}
              <strong className="font-semibold">JavaScript</strong> 和{" "}
              <strong className="font-semibold">TypeScript</strong> 运行时。
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
            Deno 是一个简单、现代且安全的 JavaScript 和 TypeScript 运行时，基于 V8 引擎并采用 Rust
            编程语言构建。
          </p>
          <ol className="ml-8 list-disc text-gray-700">
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
              自带一套经过审查 (安全审计) 的标准模块，并保证了代码与 Deno 完全兼容：{" "}
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
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">或者再运行一个复杂点的：</p>
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
              denoland/deno_std
            </a>{" "}
            仓库。
          </p>
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
              esm.sh
            </a>
            。
          </p>
          <p className="my-4 text-gray-700">
            为了更方便地使用第三方模块，Deno 提供了一些内置的工具，如 <InlineCode>deno info</InlineCode> 和
            {" "}
            <InlineCode>deno doc</InlineCode>。 deno.land 还提供用于查看模块文档的 Web UI。位于
            {" "}
            <a href="https://doc.deno.js.cn" className="link">
              doc.deno.js.cn
            </a>
            。
          </p>
          <p className="my-4 text-gray-700">
            deno.land 还为用于 Deno 的 ES 模块提供简单的公共托管服务。 位于{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            。
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
      <p className="py-2">Shell (Mac, Linux)：</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://x.deno.js.cn/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" className="link">
          Homebrew
        </a>{" "}
        (Mac)：
      </p>
      <CodeBlock language="bash" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">PowerShell (Windows)：</p>
      <CodeBlock
        language="bash"
        code={`iwr https://x.deno.js.cn/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://chocolatey.org/packages/deno" className="link">
          Chocolatey
        </a>{" "}
        (Windows)：
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
        (Windows)：
      </p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );
  const cargo = (
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
        使用{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>{" "}
        从源码构建并安装：
      </p>
      <CodeBlock language="bash" code={`cargo install deno --locked`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno 没有外部依赖，只有一个单独的可执行文件。你可以使用下面的安装器来安装，也可以从{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
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
      <p className="my-4 text-gray-700">
        查看{" "}
        <a className="link" href="https://github.com/denocn/deno_install">
          denocn/deno_install
        </a>{" "}
        以了解更多的安装选项。
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
