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
        <title>Deno - 안전한 JavaScript & TypeScript 실행환경</title>
        <meta property="og:title" content="Deno"/>
        <meta property="og:description" content="안전한 JavaScript & TypeScript 실행환경"/>
        <meta property="og:image" content="https://deno-ko.vercel.app/images/icons/apple-touch-icon-180x180.png"/>
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
              {/*A <strong className="font-semibold">secure</strong> runtime for{" "}*/}
              {/*<strong className="font-semibold">JavaScript</strong> and{" "}*/}
              {/*<strong className="font-semibold">TypeScript</strong>.*/}
              <strong className="font-semibold">안전한</strong> {" "}
              <strong className="font-semibold">JavaScript</strong> &{" "}
              <strong className="font-semibold">TypeScript</strong> 실행환경.
            </h2>

            <a
              href="https://github.com/denoland/deno/releases/latest"
              className="rounded-full mt-4 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white shadow-lg"
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
            {/*Deno is a simple, modern and secure runtime for JavaScript and*/}
            {/*TypeScript that uses V8 and is built in Rust.*/}
            Deno는 간결하고 안전하며 최신 기술을 활용하는 JavaScript, TypeScript 실행환경입니다.
            V8 엔진과 Rust 빌드를 사용합니다.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
              {/*Secure by default. No file, network, or environment access, unless*/}
              {/*explicitly enabled.*/}
              안전성이 기본입니다. 파일 시스템, 네트워크, 환경변수에 접근하려면 명시적으로 권한을 받아야 합니다.
            </li>
            <li>
              {/*Supports TypeScript out of the box.*/}
              TypeScript를 바로 사용할 수 있습니다.
            </li>
            <li>
              {/*Ships only a single executable file.*/}
              실행 파일 하나로 배포됩니다.
            </li>
            <li>
              {/*Has built-in utilities like a dependency inspector (*/}
              {/*<InlineCode>deno info</InlineCode>) and a code formatter (*/}
              {/*<InlineCode>deno fmt</InlineCode>).*/}
              의존성 확인 툴(<InlineCode>deno info</InlineCode>)과 코딩 스타일 검사 툴(<InlineCode>deno fmt</InlineCode>)을 기본 제공합니다.
            </li>
            <li>
              {/*Has a set of reviewed (audited) standard modules that are*/}
              {/*guaranteed to work with Deno:{" "}*/}
              {/*<a href="https://deno.land/std" className="link">*/}
              {/*  deno.land/std*/}
              {/*</a>*/}
              검증된 표준 모듈 셋을 활용하면 Deno를 개발하는 시간이 언제나 즐거울 것입니다:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                {/*Installation*/}
                설치방법
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                {/*Getting Started*/}
                시작하기
              </h3>
            </a>
          </Link>
          {/*<p className="my-4 text-gray-700">Try running a simple program:</p>*/}
          <p className="my-4 text-gray-700">예제 프로그램 실행해보기:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          {/*<p className="my-4 text-gray-700">Or a more complex one:</p>*/}
          <p className="my-4 text-gray-700">좀 더 복잡한 프로그램도 실행할 수 있습니다:</p>
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
            {/*You can find a more in depth introduction, examples, and environment*/}
            {/*setup guides in{" "}*/}
            {/*<Link href="/manual">*/}
            {/*  <a className="link">the manual</a>*/}
            {/*</Link>*/}
            심도있는 소개 문서, 예제, 환경설정 방법을 확인하려면{" "}
            <Link href="/manual">
              <a className="link">가이드 문서</a>
            </Link>
            를 참고하세요.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                {/*Runtime Documentation*/}
                실행환경 문서
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*The basic runtime documentation for Deno can be found on{" "}*/}
            {/*<a href="https://doc.deno.land/builtin/stable" className="link">*/}
            {/*  doc.deno.land*/}
            {/*</a>*/}
            {/*.*/}
            실행환경과 관련된 기본 문서는{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            에서 확인할 수 있습니다.
          </p>
          <p className="my-4 text-gray-700">
            {/*Deno comes with{" "}*/}
            {/*<Link href="/manual">*/}
            {/*  <a className="link">a manual</a>*/}
            {/*</Link>{" "}*/}
            {/*which contains more in depth explanations about the more complex*/}
            {/*functions of the runtime, an introduction to the concepts that Deno*/}
            {/*is built on, details about the internals of Deno, how to embed Deno*/}
            {/*in your own application and how to extend Deno using Rust plugins.*/}
            Deno는 <Link href="/manual"><a className="link">가이드 문서</a></Link>와 함께 제공됩니다.
            문서에서는 실행환경에 대해 깊이 있게 안내하며, Deno 설계 철학, Deno 내부 동작 방식, Deno를 활용해서 애플리케이션을 개발하는 방법, Rust 플러그인을 사용해서 Deno를 확장하는 방법에 대해 다룹니다.
          </p>
          <p className="my-4 text-gray-700">
            {/*The manual also contains information about the built in tools that*/}
            {/*Deno provides.*/}
            Deno가 제공하는 기본 툴도 소개합니다.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                {/*Standard Modules*/}
                표준 모듈
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*Next to the Deno runtime, Deno also provides a list of audited*/}
            {/*standard modules that are reviewed by the Deno maintainers and are*/}
            {/*guaranteed to work with a specific Deno version. These live*/}
            {/*alongside the Deno source code in the{" "}*/}
            {/*<a href="https://github.com/denoland/deno" className="link">*/}
            {/*  denoland/deno*/}
            {/*</a>{" "}*/}
            {/*repository.*/}
            Deno 실행환경 외에도 Deno를 유지보수하는 개발자들이 리뷰하고 동작을 검증한 표준 모듈을 제공합니다.
            표준 모듈은 Deno 소스 코드가 관리되는{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            코드 저장소에 함께 있습니다.
          </p>
          <p className="my-4 text-gray-700">
            {/*These standard modules are hosted at{" "}*/}
            {/*<Link href="/std">*/}
            {/*  <a className="link">deno.land/std</a>*/}
            {/*</Link>{" "}*/}
            {/*and are distributed via URLs like all other ES modules that are*/}
            {/*compatible with Deno.*/}
            표준 모듈은{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            에 호스팅되어 있으며, Deno와 호환되는 일반 ES 모듈처럼 URL로 참조할 수 있습니다.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                {/*Third Party Modules*/}
                서드 파티 모듈
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            {/*Deno can import modules from any location on the web, like GitHub, a*/}
            {/*personal webserver, or a CDN like{" "}*/}
            {/*<a href="https://www.skypack.dev" className="link">*/}
            {/*  Skypack*/}
            {/*</a>*/}
            {/*,{" "}*/}
            {/*<a href="https://jspm.io" className="link">*/}
            {/*  jspm.io*/}
            {/*</a>{" "}*/}
            {/*or{" "}*/}
            {/*<a href="https://www.jsdelivr.com/" className="link">*/}
            {/*  jsDelivr*/}
            {/*</a>*/}
            {/*.*/}
            Deno는 GitHub이나, 개인 웹서버,{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            이나{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>{" "}
            ,{" "}
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>
            과 같은 CDN 등 웹 주소로 참조할 수 있는 모듈을 모두 로드할 수 있습니다.
          </p>
          <p className="my-4 text-gray-700">
            {/*To make it easier to consume third party modules Deno provides some*/}
            {/*built in tooling like <InlineCode>deno info</InlineCode> and{" "}*/}
            {/*<InlineCode>deno doc</InlineCode>. deno.land also provides a web UI*/}
            {/*for viewing module documentation. It is available at{" "}*/}
            {/*<a href="https://doc.deno.land" className="link">*/}
            {/*  doc.deno.land*/}
            {/*</a>*/}
            {/*.*/}
            서드 파티 모듈은 Deno가 제공하는 <InlineCode>deno info</InlineCode>이나{" "}
            <InlineCode>deno doc</InlineCode>
            처럼 사용할 수 있습니다.
            deno.land에서도 모듈 문서를 확인할 수 있는 웹 UI를 제공합니다.
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            를 확인해 보세요.
          </p>
          <p className="my-4 text-gray-700">
            {/*deno.land also provides a simple public hosting service for ES*/}
            {/*modules that work with Deno. It can be found at{" "}*/}
            {/*<Link href="/x">*/}
            {/*  <a className="link">deno.land/x</a>*/}
            {/*</Link>*/}
            {/*.*/}
            deno.land는 Deno용 ES 모듈을 호스팅하는 서비스도 제공합니다.
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            를 참고하세요.
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
        {/*Build and install from source using{" "}*/}
        {/*<a href="https://crates.io/crates/deno" className="link">*/}
        {/*  Cargo*/}
        {/*</a>*/}
        {" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
        로 소스파일 빌드하고 설치하기
      </p>
      <CodeBlock language="bash" code={`cargo install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        {/*Deno ships as a single executable with no dependencies. You can install*/}
        {/*it using the installers below, or download a release binary from the{" "}*/}
        {/*<a href="https://github.com/denoland/deno/releases" className="link">*/}
        {/*  releases page*/}
        {/*</a>*/}
        {/*.*/}
        Deno는 추가 의존성이 필요 없는 실행 파일 하나로 배포됩니다.
        Deno를 설치하려면 아래 명령을 실행하거나
        {" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          배포 페이지
        </a>
        에서 배포되는 바이너리 파일을 직접 다운받으면 됩니다.
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        {/*See{" "}*/}
        {/*<a className="link" href="https://github.com/denoland/deno_install">*/}
        {/*  deno_install*/}
        {/*</a>{" "}*/}
        {/*for more installation options.*/}
        설치할 때 사용할 수 있는 옵션에 대해 알아보려면 {" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        문서를 참고하세요.
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
