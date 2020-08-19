/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import Footer from "../components/Footer";
import versions from "../versions.json";
import { NextPage, GetStaticProps } from "next";
import InlineCode from "../components/InlineCode";
import Header from "../components/Header";
import { CookieBanner } from "../components/CookieBanner";

interface HomeProps {
  latestStd: string;
}

const Home: NextPage<HomeProps> = ({ latestStd }) => {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}`;

  return (
    <>
      <Head>
        <title>Deno</title>
      </Head>
      <CookieBanner />
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <Header />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              {/*
              A <strong className="font-semibold">secure</strong> runtime for{" "}
              <strong className="font-semibold">JavaScript</strong> and{" "}
              <strong className="font-semibold">TypeScript</strong>.
              */}
              <strong className="font-semibold">JavaScript</strong>と
              <strong className="font-semibold">TypeScript</strong>のための
              <strong className="font-semibold">安全な</strong>ランタイム
            </h2>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
            {/* 
            Deno is a simple, modern and secure runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust.
            */}
            DenoはV8を使いRustで作られたJavaScriptとTypeScriptのためのシンプルでモダンで安全なランタイムです。
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
              {/*
              Secure by default. No file, network, or environment access, unless
              explicitly enabled.
              */}
              デフォルトで安全。ファイルやネットワークなど環境へのアクセスは明示的に有効にしない限り起こりません。
            </li>
            <li>
              {/* Supports TypeScript out of the box. */}
              最初からTypeScriptをサポート。
            </li>
            <li>
              {/*Ships only a single executable file.*/}
              1つの実行ファイルで実行可能。
            </li>
            <li>
              {/*
              Has built-in utilities like a dependency inspector (
              <InlineCode>deno info</InlineCode>) and a code formatter (
              <InlineCode>deno fmt</InlineCode>).
              */}
              依存関係インスペクター(<InlineCode>deno info</InlineCode>
              )やコードフォーマッター(<InlineCode>deno fmt</InlineCode>
              )などのビルトインユーティリティーを持っています。
            </li>
            <li>
              {/*
              Has a set of reviewed (audited) standard modules that are
              guaranteed to work with Deno:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
              */}
              Denoで動作する審査済み(監査済み)の標準モジュール:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>{" "}
              を持っています。
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                {/* Installation */}
                インストール
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
          <p className="my-4 text-gray-700">
            {/* Try running a simple program: */}
            サンプルプログラムを試す:
          </p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">
            {/* Or a more complex one: */}
            より複雑なプログラム:
          </p>
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
            {/*
            You can find a more in depth introduction, examples, and environment
            setup guides in{" "}
            <Link href="/[...rest]" as="/manual">
              <a className="link">
              the manual
              </a>
            </Link>
            .
            */}
            より深いイントロダクション、例、環境構築のガイドは
            <Link href="/[...rest]" as="/manual">
              <a className="link">マニュアル</a>
            </Link>
            へ。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                {/* Runtime Documentation */}
                ランタイムドキュメント
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*
            The basic runtime documentation for Deno can be found on{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
            */}
            基本的なDenoランタイムのドキュメントは{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>{" "}
            を参照してください。
          </p>
          <p className="my-4 text-gray-700">
            {/*
            Deno comes with{" "}
            <Link href="/[...rest]" as="/manual">
              <a className="link">a manual</a>
            </Link>{" "}
            which contains more in depth explanations about the more complex
            functions of the runtime, an introduction to the concepts that Deno
            is built on, details about the internals of Deno, how to embed Deno
            in your own application and how to extend Deno using Rust plugins.
            */}
            ランタイムのより複雑な機能、Denoのコンセプトの紹介、
            Denoの内部の詳細、アプリケーションへどうやって組み込むかや
            Rustプラグインでの拡張は{" "}
            <Link href="/[...rest]" as="/manual">
              <a className="link">マニュアル</a>
            </Link>{" "}
            を参照してください。
          </p>
          <p className="my-4 text-gray-700">
            {/*
            The manual also contains information about the built in tools that
            Deno provides.
            */}
            マニュアルにはDenoが提供する標準ツールの情報も含まれています。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                {/* Standard Modules */}
                標準モジュール
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*
            Next to the Deno runtime, Deno also provides a list of audited
            standard modules that are reviewed by the core Deno team and are
            guaranteed to work with a specific Deno version. These live
            alongside the Deno source code in the{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            repository.
            */}
            core
            DenoチームによりDenoで動くことが保証された標準モジュールを提供します。
            これらはDenoのソースコードと一緒に{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            にあります。
          </p>
          <p className="my-4 text-gray-700">
            {/*
            These standard modules are hosted at{" "}
            <Link href="/[...rest]" as="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            and are distributed via URLs like all other ES modules that are
            compatible with Deno.
            */}
            これらの標準モジュールは{" "}
            <Link href="/[...rest]" as="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            でホストされており、Denoで動く他のESモジュール同様URLで配布されています。
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                {/* Third Party Modules */}
                サードパーティモジュール
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*
            Deno can import modules from any location on the web, like GitHub, a
            personal webserver, or a CDN like{" "}
            <a href="https://pika.dev" className="link">
              pika.dev
            </a>{" "}
            or{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            .
            */}
            DenoはGitHub、個人のWebサーバー,{" "}
            <a href="https://pika.dev" className="link">
              pika.dev
            </a>{" "}
            や{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>{" "}
            などのCDNなどWebのあらゆる場所からモジュールをインポートすることが出来ます。
          </p>
          <p className="my-4 text-gray-700">
            {/*
            To make it easier to consume third party modules Deno provides some
            built in tooling like <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land also provides a web UI
            for viewing module documentation. It is available at{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
            */}
            サードパーティモジュールを簡単に使用するためDenoは
            <InlineCode>deno info</InlineCode> や{" "}
            <InlineCode>deno doc</InlineCode>
            などのビルトインツールを持っています。
            deno.landはモジュールのドキュメントを見るためのWeb
            UIを提供しています。{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>{" "}
            を参照してください。
          </p>
          <p className="my-4 text-gray-700">
            {/*
            deno.land also provides a simple public hosting service for ES
            modules that work with Deno. It can be found at{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            .
            */}
            またdeno.landはDenoで動作するESモジュールのための
            シンプルなホスティングサービスも提供しています。{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>{" "}
            を参照してください。
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
        code={`curl -fsSL https://deno.land/x/install/install.sh | sh`}
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
        code={`iwr https://deno.land/x/install/install.ps1 -useb | iex`}
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
        {/*
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
        */}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
        を使ってソースからビルドしてインストール
      </p>
      <CodeBlock language="bash" code={`cargo install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        {/*
        Deno ships as a single executable with no dependencies. You can install
        it using the installers below, or download a release binary from the{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          releases page
        </a>
        .
        */}
        Denoは1つの実行ファイルのみ必要で他の依存関係はありません。下記のインストーラーを使ってインストールするか、
        <a href="https://github.com/denoland/deno/releases" className="link">
          リリースページ
        </a>
        よりリリースバイナリーをダウンロードしてください。
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        {/*
        See{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        for more installation options.
        */}
        他のインストール方法については{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        を参照してください。
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
