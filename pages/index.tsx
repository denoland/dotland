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

interface HomeProps {
  latestStd: string;
}

const Home: NextPage<HomeProps> = ({ latestStd }) => {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";

console.log("http://localhost:8000/");
serve((req) => new Response("Hello World\\n"), { port: 8000 });
`;

  return (
    <>
      <Head>
        <title>دێنۆ - ژینگەیەکی مۆدێرن بۆ تایپسکریپت و جاڤاسکریپت</title>
      </Head>
      {/* <div className="bg-blue-500 p-4 text-white flex justify-center text-center">
        <div className="max-w-screen-xl">
          <span className="inline">Deno 1.9 is out.</span>
          <span className="block sm:ml-2 sm:inline-block font-semibold">
            <a href="https://deno.com/blog/v1.9">
              Read the release notes <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </div>
      </div> */}
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <Header main />
          <div
            className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center"
            dir="rtl"
          >
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              دێنۆ
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              ژینگەیەکی <strong className="font-semibold">مۆدێرن</strong> بۆ{" "}
              <strong className="font-semibold">تایپسکریپت</strong> و{" "}
              <strong className="font-semibold">جاڤاسکریپت</strong>.
            </h2>
            <a
              href="/#installation"
              className="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              دایبمەزرێنە
            </a>
            <a
              href="https://github.com/denoland/deno/releases/latest"
              className="mt-4"
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <p className="my-4 text-gray-700">
            دێنۆ ژینگەیەکی مۆدێرن و پارێزراوە بۆ تایپسکریپت و جاڤاسکریپت کە V8
            بەکار دەهێنێت و بە زمانی ڕەست نووسراوە.
          </p>
          <ol className="mr-8 list-disc text-gray-700">
            <li>
              لە بنەڕەتەوە پارێزراوە. ناتوانێت دەستی بگات بە فایلەکان، نێتوۆرک و
              هتد مەگەر خۆت بهێڵیت.
            </li>
            <li>
              بەبێ ئەنجامدانی هیچ کارێکی پێشوەختە دەتوانیت تایپسکریپت بەکار
              بهێنیت.
            </li>
            <li>هەموو دێنۆ یەک فایلە.</li>
            <li>
              لەناو خۆیدا چەند کەرەستەیەکی تێدایە، بۆ نموونە ڕازێنەرەوەی کۆد (
              <InlineCode>deno fmt</InlineCode>).
            </li>
            <li>
              چەندین مۆدیوڵی ستانداردی هەیە کە لە گەرەنتیی کارکردنیان هەیە:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
              .
            </li>
            <li>
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                className="link"
              >
                ژمارەیەک کۆمپانیا هەن کە کار بە دێنۆ دەکەن
              </a>
              .
            </li>
          </ol>
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                دامەزراندن
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                دەستپێکردن
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">پڕۆگرامێکی ساکار کار پێ بکە:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">یان دانەیەکی چڕتر:</p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8" dir="rtl">
          <p className="my-4 text-gray-700">
            دەتوانیت بە بەکارهێنانی{" "}
            <Link href="/manual">
              <a className="link">مانواڵەکە</a>
            </Link>{" "}
            پێشەکییەکی قوڵتر بخوێنیتەوە و نموونەی زۆرتر ببینیت.
          </p>
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                نووسراوی ژینگە
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            نووسراوێکی سادە دەربارەی ژینگەکە بەردەستە لە{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            دێنۆ{" "}
            <Link href="/manual">
              <a className="link">مانواڵێکی</a>
            </Link>{" "}
            هەیە کە بە قووڵی باس لە دێنۆ دەکات و پێشەکییەکت دەربارەی چەمکەکان پێ
            دەدات.
          </p>
          <p className="my-4 text-gray-700" dir="rtl">
            مانواڵەکە باس لە ئەو شتانەش دەکات کە دێنۆ دابینینیان دەکات.
          </p>
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                کتێبخانەی ستاندارد
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            پەرەپێدەرەکانی دێنۆ کار لەسەر مۆدیوڵە ستانداردەکان دەکەن کە گەرەنتیی
            کارکردنیان هەیە بە دێنۆ. سەرچاوەی مۆدیوڵە ستانداردەکان{" "}
            <a href="https://github.com/denoland/deno_std" className="link">
              لێرەیە
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            هەروەها لە{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            بڵاو کراونەتەوە وەک هەر مۆدیوڵێکی دیکە.
          </p>
        </div>
        <div
          className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20"
          dir="rtl"
        >
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                مۆدیوڵەکان
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            دێنۆ دەتوانێت مۆدیوڵ لە هەر شوێنێکی ئینتەرنێتەوە هاوردە بکات، بۆ
            نموونە گیتهەب، ڕاژەیەکی کەسی یان CDNـەکان وەک{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            ,{" "}
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>{" "}
            یان{" "}
            <a href="https://esm.sh/" className="link">
              esm.sh
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            بۆ ئاسانکردنی بەکارهێنانی مۆدیوڵەکان، دێنۆ چەند کەرەستەیەکی
            لەگەڵدایە وەک <InlineCode>deno info</InlineCode> و{" "}
            <InlineCode>deno doc</InlineCode>. هەروەها deno.land ڕووکارێکی
            تێدایە بۆ بینینی نووسراوی مۆدیوڵەکان. کە لە{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>{" "}
            بەردەستە.
          </p>
          <p className="my-4 text-gray-700">
            deno.land خزمەتگوزارییەکی بڵاوکردنەوەی گشتیشی تێدایە:{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            .
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
      <p className="py-2">شێڵ (ماک، لینوکس):</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://deno.land/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" className="link">
          هۆمبرو
        </a>{" "}
        (ماک):
      </p>
      <CodeBlock language="bash" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">پاوەرشێڵ (ویندۆز):</p>
      <CodeBlock
        language="bash"
        code={`iwr https://deno.land/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://chocolatey.org/packages/deno" className="link">
          چۆکۆڵاتی
        </a>{" "}
        (ویندۆز):
      </p>
      <CodeBlock language="bash" code={`choco install deno`} />
    </div>
  );
  const scoop = (
    <div key="scoop" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://scoop.sh/" className="link">
          سکووپ
        </a>{" "}
        (ویندۆز):
      </p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );
  const cargo = (
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
        لە ڕێی{" "}
        <a href="https://crates.io/crates/deno" className="link">
          کارگۆ
        </a>{" "}
        بیڵدی بکە و دایبمەزرێنە:
      </p>
      <CodeBlock language="bash" code={`cargo install deno --locked`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        دێنۆ تەنیا یەک فایلە و لەسەر هیچ بەند نییە. دەتوانیت لە ڕێی
        دامەزرێنەرەکان دایگریت وەک لە خوارەوە باسکراوە، یان وەشانێک لە{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          ئێرە
        </a>{" "}
        داگریت.
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        ببینە بۆ ڕێگەی دیکەی دامەزراندن.
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
