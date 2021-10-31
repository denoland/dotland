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
    `import { listenAndServe } from "https://deno.land/std@${latestStd}/http/server.ts";

console.log("http://localhost:8000/");
listenAndServe(":8000", (req) => new Response("Hello World\\n"));
`;

  return (
    <>
      <Head>
        <title>Deno - это современная среда выполнения для JavaScript и TypeScript</title>
      </Head>
      <CookieBanner />
      {
        /* <div className="bg-blue-500 p-4 text-white flex justify-center text-center">
        <div className="max-w-screen-xl">
          <span className="inline">вышел Deno 1.9.</span>
          <span className="block sm:ml-2 sm:inline-block font-semibold">
            <a href="https://deno.com/blog/v1.9">
              Прочтите примечания к выпуску <span aria-hidden="true">&rarr;</span>
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
              Это <strong className="font-semibold">современная</strong> среда исполнения для
              {" "}
              <strong className="font-semibold">JavaScript</strong> и{" "}
              <strong className="font-semibold">TypeScript</strong>.
            </h2>
            <a
              href="/#installation"
              className="rounded-full mt-8 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white text-lg shadow-lg"
            >
              Установка
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
            Deno это простая, современная и безопасная среда выполнения для JavaScript и
            TypeScript которая использует V8 и построена на Rust.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
              Безопасность по умолчанию. Нет доступа к файлам, сети или окружению, только при явном разрешении.
            </li>
            <li>Поддержка TypeScript из коробки.</li>
            <li>В поставке только один файл.</li>
            <li>
              Имеет встроенные утилиты, такие как инспектор зависимостей (
              <InlineCode>deno info</InlineCode>) и форматер кода (
              <InlineCode>deno fmt</InlineCode>).
            </li>
            <li>
              Имеет набор проверенных (аудируемых) стандартных модулей
              гарантированно работающих с Deno:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
            </li>
            <li>
              Имеет ряд{" "}
              <a
                href="https://github.com/denoland/deno/wiki#companies-interested-in-deno"
                className="link"
              >
                компании, заинтересованных в использовании и изучении Deno
              </a>
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                Установка
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                Первое знакомство
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">Try running a simple program:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">Or a more complex one:</p>
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
            Вы можете найти более подробное введение, примеры и руководства по настройке среды в {" "}
            <Link href="/manual">
              <a className="link">the manual</a>
            </Link>
            .
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                Документация во время выполнения
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Базовую документацию по времени исполнения для Deno можно найти на{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Deno поставляется с{" "}
            <Link href="/manual">
              <a className="link">руководством</a>
            </Link>{" "}
            который содержит более подробные объяснения более сложных
            функций рантайма, введение в концепции, на которых Deno
            построен, подробности о внутреннем устройстве Deno, как встроить Deno
            в ваше приложение и как расширить Deno используя плагины Rust.
          </p>
          <p className="my-4 text-gray-700">
            В руководстве также содержится информация о встроенных инструментах, 
            которые предоставляет Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                Стандартные модули
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Помимо среды исполнения Deno, 
            Deno также предоставляет список проверенных стандартных модулей,
            которые проверяются специалистами по сопровождению Deno и
            гарантированно работают с конкретной версией Deno. 
            Они находятся в
            {" "}
            <a href="https://github.com/denoland/deno_std" className="link">
              denoland/deno_std
            </a>{" "}
            реппозитории.
          </p>
          <p className="my-4 text-gray-700">
            Эти стандартные модули размещены на{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            и распространяются через URL-адреса, как и все другие модули ES,
            совместимые с Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                Сторонние модули
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno может импортировать модули из любого места в Интернете, например, GitHub, личного веб-сервера или CDN, например{" "}
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
            or{" "}
            <a href="https://esm.sh/" className="link">
              esm.sh
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Чтобы упростить использование сторонних модулей, 
            Deno предоставляет некоторые встроенные инструменты, 
            такие как <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. deno.land также предоставляет веб-интерфейс
            для просмотра документации модуля. Она доступна на{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            deno.land также предоставляет простой общедоступный хостинг
            для модулей ES, которые работают с Deno. 
            Его можно найти на{" "}
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
        Build and install from source using{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
        :
      </p>
      <CodeBlock language="bash" code={`cargo install deno --locked`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno поставляется как единый исполняемый файл без зависимостей. Вы можете установить его
        с помощью установщиков, указанных ниже, или загрузить двоичный файл релиза с
        {" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          страница релизов
        </a>
        .
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        See{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        для дополнительных вариантов установки.
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
