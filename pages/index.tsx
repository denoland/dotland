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
        <title>دێنۆ - ژینگەیەکی مۆدێرن بۆ تایپسکریپت و جاڤاسکریپت</title>
      </Head>
      <div class="bg-white">
        <div class="bg-gray-50 border-b border-gray-200">
          <Header main />
          <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 class="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              دێنۆ
            </h1>
            <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              ژینگەیەکی <strong class="font-semibold">مۆدێرن</strong> بۆ{" "}
              <strong class="font-semibold">تایپسکریپت</strong> and{" "}
              <strong class="font-semibold">جاڤاسکریپت</strong>.
            </h2>
            <a
              href="/#installation"
              class="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              دایبمەزرێنە
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
            دێنۆ ژینگەیەکی مۆدێرن و پارێزراوە بۆ تایپسکریپت و جاڤاسکریپت کە V8
            بەکار دەهێنێت و بە زمانی ڕەست نووسراوە.
          </p>
          <ol class="mr-8 list-disc text-gray-700">
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
              <a href="https://deno.land/std" class="link">
                deno.land/std
              </a>
              .
            </li>
            <li>
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                class="link"
              >
                ژمارەیەک کۆمپانیا هەن کە کار بە دێنۆ دەکەن
              </a>
              .
            </li>
          </ol>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#installation">
            <h3 class="font-bold text-xl" id="installation">
              دامەزراندن
            </h3>
          </a>
          <InstallSection />
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#getting-started">
            <h3 class="font-bold text-xl" id="getting-started">
              دەستپێکردن
            </h3>
          </a>
          <p class="my-4 text-gray-700">پڕۆگرامێکی ساکار کار پێ بکە:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p class="my-4 text-gray-700">یان دانەیەکی چڕتر:</p>
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
            دەتوانیت بە بەکارهێنانی <a class="link" href="/manual">مانواڵەکە</a>
            {" "}
            پێشەکییەکی قوڵتر بخوێنیتەوە و نموونەی زۆرتر ببینیت.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#runtime-documentation">
            <h3 class="font-bold text-xl" id="runtime-documentation">
              نووسراوی ژینگە
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            نووسراوێکی سادە دەربارەی ژینگەکە بەردەستە لە{" "}
            <a href="https://doc.deno.land/builtin/stable" class="link">
              doc.deno.land
            </a>
            .
          </p>
          <p class="my-4 text-gray-700">
            دێنۆ <a class="link" href="/manual">مانواڵێکی</a>{" "}
            هەیە کە بە قووڵی باس لە دێنۆ دەکات و پێشەکییەکت دەربارەی چەمکەکان پێ
            دەدات.
          </p>
          <p class="my-4 text-gray-700">
            مانواڵەکە باس لە ئەو شتانەش دەکات کە دێنۆ دابینینیان دەکات.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#standard-modules">
            <h3 class="font-bold text-xl" id="standard-modules">
              کتێبخانەی ستاندارد
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            پەرەپێدەرەکانی دێنۆ کار لەسەر مۆدیوڵە ستانداردەکان دەکەن کە گەرەنتیی
            کارکردنیان هەیە بە دێنۆ. سەرچاوەی مۆدیوڵە ستانداردەکان{" "}
            <a href="https://github.com/denoland/deno_std" class="link">
              لێرەیە
            </a>.
          </p>
          <p class="my-4 text-gray-700">
            هەروەها لە <a class="link" href="/std">deno.land/std</a>{" "}
            بڵاو کراونەتەوە وەک هەر مۆدیوڵێکی دیکە.
          </p>
        </div>
        <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <a class="hover:underline" href="#third-party-modules">
            <h3 class="font-bold text-xl" id="third-party-modules">
              مۆدیوڵەکان
            </h3>
          </a>
          <p class="my-4 text-gray-700">
            دێنۆ دەتوانێت مۆدیوڵ لە هەر شوێنێکی ئینتەرنێتەوە هاوردە بکات، بۆ
            نموونە گیتهەب، ڕاژەیەکی کەسی یان CDNـەکان وەک{" "}
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
            یان{" "}
            <a href="https://esm.sh/" class="link">
              esm.sh
            </a>
            .
          </p>
          <p class="my-4 text-gray-700">
            بۆ ئاسانکردنی بەکارهێنانی مۆدیوڵەکان، دێنۆ چەند کەرەستەیەکی
            لەگەڵدایە وەک <InlineCode>deno info</InlineCode> و{" "}
            <InlineCode>deno doc</InlineCode>. هەروەها deno.land ڕووکارێکی
            تێدایە بۆ بینینی نووسراوی مۆدیوڵەکان. کە لە{" "}
            <a href="https://doc.deno.land" class="link">
              doc.deno.land
            </a>{" "}
            بەردەستە.
          </p>
          <p class="my-4 text-gray-700">
            deno.land خزمەتگوزارییەکی بڵاوکردنەوەی گشتیشی تێدایە:{" "}
            <a class="link" href="/x">deno.land/x</a>.
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
      <p class="py-2">شێڵ (ماک، لینوکس):</p>
      <CodeBlock
        language="bash"
        code="curl -fsSL https://deno.land/install.sh | sh"
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" class="link">
          هۆمبرو
        </a>{" "}
        (ماک):
      </p>
      <CodeBlock language="bash" code="brew install deno" />
    </div>
  );
  const powershell = (
    <div key="powershell" class="my-4 text-gray-700">
      <p class="mb-2">پاوەڕشێڵ (ویندۆز):</p>
      <CodeBlock
        language="bash"
        code="iwr https://deno.land/install.ps1 -useb | iex"
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://chocolatey.org/packages/deno" class="link">
          چۆکۆڵاتی
        </a>{" "}
        (ویندۆز):
      </p>
      <CodeBlock language="bash" code="choco install deno" />
    </div>
  );
  const scoop = (
    <div key="scoop" class="my-4 text-gray-700">
      <p class="mb-2">
        <a href="https://scoop.sh/" class="link">
          سکووپ
        </a>{" "}
        (ویندۆز):
      </p>
      <CodeBlock language="bash" code="scoop install deno" />
    </div>
  );
  const cargo = (
    <div key="cargo" class="my-4 text-gray-700">
      <p class="py-2">
        دروستکردن و دامەزراندن ڕێی{" "}
        <a href="https://crates.io/crates/deno" class="link">
          کارگۆ
        </a>
        :
      </p>
      <CodeBlock language="bash" code="cargo install deno --locked" />
    </div>
  );

  return (
    <>
      <p class="my-4 text-gray-700">
        دێنۆ تەنیا یەک فایلە و لەسەر هیچ بەند نییە. دەتوانیت لە ڕێی
        دامەزرێنەرەکان دایگریت وەک لە خوارەوە باسکراوە، یان وەشانێک لە{" "}
        <a href="https://github.com/denoland/deno/releases" class="link">
          ئێرە
        </a>{" "}
        داگریت. .
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p class="my-4 text-gray-700">
        <a class="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        ببینە بۆ ڕێگەی دیکەی دامەزراندن.
      </p>
    </>
  );
}
