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
import { Background } from "@/components/HeroBackground.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

import versions from "@/versions.json" assert { type: "json" };

interface Data {
  isFirefox: boolean;
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

  return (
    <div>
      <Head>
        <title>Deno - 现代的 JavaScript 和 TypeScript 运行时</title>
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
              <strong class={tw`font-semibold`}>现代</strong>的{" "}
              <strong class={tw`font-semibold`}>JavaScript</strong> 和{" "}
              <strong class={tw`font-semibold`}>TypeScript</strong> 运行时。
            </h2>
            <a
              href="/#installation"
              class={tw`rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg`}
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
        <div class={tw`section-x-inset-sm mt-20`}>
          <p class={tw`my-4 text-gray-700`}>
            Deno 是一个简单的、现代的、安全的 JavaScript、TypeScript 和 WebAssembly 运行时，基于 V8
            引擎并采用 Rust 构建。
          </p>
          <ol class={tw`ml-8 list-disc text-gray-700`}>
            <li>
              提供符合{" "}
              <a class={tw`link`} href="/manual/runtime/web_platform_apis">
                Web 平台标准的函数集
              </a>。
            </li>
            <li>
              默认安全。除非显式开启，否则没有文件、网络、环境变量的访问权限。
            </li>
            <li>
              开箱即用的 <a class={tw`link`} href="/manual/typescript">TypeScript</a>
              {" "}
              支持。
            </li>
            <li>单一的可执行文件</li>
            <li>
              拥有一些列{" "}
              <a class={tw`link`} href="/manual/tools">
                内置开发工具
              </a>{" "}
              例如依赖检查器 (
              <a class={tw`link`} href="/manual/tools/dependency_inspector">
                <InlineCode>deno info</InlineCode>
              </a>) 和代码格式化 (<a class={tw`link`} href="/manual/tools/formatter">
                <InlineCode>deno fmt</InlineCode>
              </a>)。
            </li>
            <li>
              自带一套经过审查 (安全审计) 的标准模块，并保证了代码与 Deno 完全兼容：{" "}
              <a
                href="https://doc.deno.js.cn/https://deno.land/std"
                class={tw`link`}
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
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#installation">
            <h3 class={tw`font-bold text-xl`} id="installation">
              安装
            </h3>
          </a>
          <InstallSection url={url} />
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#getting-started">
            <h3 class={tw`font-bold text-xl`} id="getting-started">
              起步
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>尝试运行一个简单的 Deno 程序：</p>
          <CodeBlock
            code={`deno run https://deno.land/std@${
              versions.std[0]
            }/examples/welcome.ts`}
            language="bash"
            url={url}
          />
          <p class={tw`my-4 text-gray-700`}>或者运行一个复杂点的 Deno 程序：</p>
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
            你可以在<a class={tw`link`} href="/manual">
              参考手册
            </a>中找到“深入介绍”、“环境搭建”、“代码示例”等内容。
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#runtime-documentation">
            <h3 class={tw`font-bold text-xl`} id="runtime-documentation">
              运行时文档
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Deno 的基本运行时文档可以在{" "}
            <a href="https://doc.deno.js.cn/deno/stable" class={tw`link`}>
              doc.deno.js.cn
            </a>
            网站找到。
          </p>
          <p class={tw`my-4 text-gray-700`}>
            Deno 自带的 <a class={tw`link`} href="/manual">参考手册</a>
            包含了关于 Deno Runtime 更复杂功能的深入解析,、Deno 内部功能的详细信息、如何在您自己的应用程序中嵌入 Deno
            以及如何使用 Rust 编写 Deno 插件。
          </p>
          <p class={tw`my-4 text-gray-700`}>
            该手册还包含有关 Deno 提供的内置工具的信息。
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#standard-modules">
            <h3 class={tw`font-bold text-xl`} id="standard-modules">
              标准模块
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            除了提供 Deno 运行时之外，Deno 还提供了标准模块，这些模块由 Deno 核心团队维护和审核以保证可使用特定的 Deno
            版本。这些模块在{" "}
            <a href="https://github.com/denoland/deno_std" class={tw`link`}>
              denoland/deno_std
            </a>{" "}
            仓库。
          </p>
          <p class={tw`my-4 text-gray-700`}>
            这些标准模块托管在 <a class={tw`link`} href="/std">deno.js.cn/std</a>{" "}
            上，并且同所有其他的兼容 Deno 的 ES 模块一样通过 URL 进行分发。
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#toolchain">
            <h3 class={tw`font-bold text-xl`} id="toolchain">
              内置工具链
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            Deno 附带了{" "}
            <a class={tw`link`} href="/manual/tools">
              一套强大的工具
            </a>
            ，因此您可以花更少的时间搜索和评估第三方模块，而将更多的时间用于编写代码和提高工作效率。下面是一些示例。
          </p>
          <p class={tw`my-4 text-gray-700`}>
            <a class={tw`link`} href="/manual/tools/linter">
              Lint
            </a>{" "}
            当前目录和子目录中的所有 JS/TS 文件：
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
              格式化
            </a>{" "}
            当前目录和子目录中所有支持的文件：
          </p>
          <p>
            <CodeBlock
              code={"deno fmt\nChecked 46 files"}
              language="bash"
              url={url}
            />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            运行{" "}
            <a class={tw`link`} href="/manual/testing">
              测试
            </a>
            ：
          </p>
          <p>
            <CodeBlock code={denoTestExample} language="bash" url={url} />
          </p>
          <p class={tw`my-4 text-gray-700`}>
            有关工具及其选项的完整列表，请参阅{" "}
            <a href="/manual/tools" class={tw`link`}>
              这里
            </a>
            。
          </p>
        </div>
        <div class={tw`section-x-inset-sm mt-20`}>
          <a class={tw`hover:underline`} href="#examples">
            <h3 class={tw`font-bold text-xl`} id="examples">
              示例
            </h3>
          </a>
          <p class={tw`my-4 text-gray-700`}>
            下面是一些可用的示例。
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
            有关更多示例，请查看{" "}
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
        code="curl -fsSL https://x.deno.js.cn/install.sh | sh"
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
        (Mac)：
      </p>
      <CodeBlock language="bash" code="brew install deno" url={url} />
    </div>
  );
  const powershell = (
    <div key="powershell" class={tw`my-4 text-gray-700`}>
      <p class={tw`mb-2`}>PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code="iwr https://x.deno.js.cn/install.ps1 -useb | iex"
        url={url}
      />
    </div>
  );

  return (
    <>
      <p class={tw`my-4 text-gray-700`}>
        Deno 没有外部依赖，只有一个单独的可执行文件。你可以使用下面的安装器来安装，也可以从{" "}
        <a href="https://github.com/denoland/deno/releases" class={tw`link`}>
          GitHub Releases 页面
        </a>
        下载已经编译好的二进制可执行程序。
      </p>
      {shell}
      {powershell}
      {homebrew}
      <p class={tw`my-4 text-gray-700`}>
        查看{" "}
        <a class={tw`link`} href="https://github.com/denocn/deno_install">
          denocn/deno_install
        </a>{" "}
        以了解更多的安装选项。
      </p>
    </>
  );
}

export const handler: Handlers<Data> = {
  GET(req, { render }) {
    return render!({
      isFirefox:
        req.headers.get("user-agent")?.toLowerCase().includes("firefox") ??
          false,
    });
  },
};
