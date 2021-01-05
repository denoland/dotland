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
        <title>
          Deno - Un entorno de ejecución seguro para JavaScript y TypeScript.
        </title>
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
              Un entorno de ejecución{" "}
              <strong className="font-semibold">seguro</strong> para{" "}
              <strong className="font-semibold">JavaScript</strong> y{" "}
              <strong className="font-semibold">TypeScript</strong>.
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
            Deno es un entorno de ejecución simple, moderno y seguro para
            JavaScript y TypeScript que usa V8 y está construido en Rust.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
              Seguro por defecto. Sin acceso a archivos, redes o entornos, a
              menos que se habilite explícitamente.
            </li>
            <li>Soporte para TypeScript, listo para usar.</li>
            <li>Envía solo un archivo ejecutable.</li>
            <li>
              Tiene utilidades integradas como un inspector de dependencias (
              <InlineCode>deno info</InlineCode>) y un formateador de código (
              <InlineCode>deno fmt</InlineCode>).
            </li>
            <li>
              Tiene un conjunto de módulos estándar revisados (auditados) que
              están garantizados para trabajar con Deno:{" "}
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
                Instalación
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                Comenzando
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Intente ejecutar un programa simple:
          </p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">O uno más complejo:</p>
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
            Puede encontrar una introducción más detallada, ejemplos y guías de
            configuración del entorno en{" "}
            <Link href="/manual">
              <a className="link">el manual.</a>
            </Link>
            .
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                Documentación del entorno de ejecución
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            La documentación básica del entorno de ejecución para Deno se puede
            encontrar en{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Deno viene con{" "}
            <Link href="/manual">
              <a className="link">un manual</a>
            </Link>{" "}
            que contiene explicaciones más detalladas sobre las funciones más
            complejas del entorno de ejecución, una introducción a los conceptos
            sobre los que se basa Deno, detalles sobre los aspectos internos de
            Deno, cómo integrar Deno en su propia aplicación y cómo extender
            Deno usando complementos de Rust.
          </p>
          <p className="my-4 text-gray-700">
            El manual también contiene información sobre las herramientas
            integradas que proporciona Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                Librería estándar
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Además del entorno de ejecución de Deno, este también proporciona
            una lista de módulos estándar auditados que son revisados por los
            encargados del mantenimiento de Deno y están garantizados para
            funcionar con una versión específica de Deno. Estos conviven con el
            código fuente de Deno en el repositorio{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>
            .{" "}
          </p>
          <p className="my-4 text-gray-700">
            Estos módulos estándar están alojados en{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            y se distribuyen a través de enlaces como todos los demás módulos
            que son compatibles con Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                Módulos de terceros
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno puede importar módulos desde cualquier ubicación en la web,
            como GitHub, un servidor web personal o un CDN como{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>{" "}
            o{" "}
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Para facilitar el consumo de módulos de terceros, Deno proporciona
            algunas herramientas integradas como{" "}
            <InlineCode>deno info</InlineCode> y{" "}
            <InlineCode>deno doc</InlineCode>. El sitio web de Deno también
            proporciona una interfaz de usuario web para ver la documentación
            del módulo. Está disponible en{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            El sitio web de deno también proporciona un servicio de alojamiento
            público simple para módulos que funcionan con Deno. Se puede
            encontrar en{" "}
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
        Construya e instale desde la fuente usando{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
      </p>
      <CodeBlock language="bash" code={`cargo install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno se envía como un solo ejecutable sin dependencias. Puede instalarlo
        utilizando los instaladores a continuación, o descargar un binario de
        lanzamiento desde la{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          página de lanzamientos
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
        Ver{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        para más opciones de instalación.
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
