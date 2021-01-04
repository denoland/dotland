/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  BenchmarkData,
  Column,
  reshape,
  formatLogScale,
  formatMB,
  formatPercentage,
  formatReqSec,
  formatKB,
} from "../util/benchmark_utils";
import BenchmarkChart, { BenchmarkLoading } from "../components/BenchmarkChart";
import { CookieBanner } from "../components/CookieBanner";

// TODO(lucacasonato): add anchor points to headers
function Benchmarks(): React.ReactElement {
  const _ = useRouter();
  const location = typeof window !== "undefined" ? window.location : null;
  const typescriptBenches = ["check", "no_check", "bundle", "bundle_no_check"];

  let show!: { dataFile: string; range: number[]; search: string };
  // Default (recent).
  show = {
    dataFile: "recent.json",
    range: [],
    search: "",
  };
  while (location) {
    // Show all.
    if (location.search.endsWith("?all")) {
      show = { dataFile: "data.json", range: [], search: "all" };
      break;
    }
    // Custom range.
    const range = decodeURIComponent(location.search)
      .split(/([?,]|\.{2,})/g)
      .filter(Boolean)
      .map(Number)
      .filter(Number.isInteger);
    if ([1, 2].includes(range.length)) {
      const search = range.join("...");
      show = { dataFile: "data.json", range, search };
      break;
    }
    break;
  }
  if (
    location != null &&
    location.search !== show.search &&
    location.search !== `?${show.search}`
  ) {
    location.replace(location.toString().replace(/\?.*$/, `?${show.search}`));
  }

  const showAll = show.dataFile !== "recent.json";
  const dataUrl = `https://denoland.github.io/benchmark_data/${show.dataFile}`;

  const [data, setData] = React.useState<BenchmarkData | null>(null);
  const [dataRangeTitle, setDataRangeTitle] = React.useState<string>("");
  const [showNormalized, setShowNormalized] = React.useState(false);

  React.useEffect(() => {
    setData(null);
    fetch(dataUrl).then(async (response) => {
      const rawData = await response.json();
      const data = reshape(rawData.slice(...show.range));
      setData(data);

      // Show actual range in title bar (except when showing 'recent' only).
      if (typeof window !== "undefined") {
        setDataRangeTitle(
          showAll
            ? [(ks: number[]) => ks[0], (ks: number[]) => ks.pop()]
                .map((f) => f([...rawData.keys()].slice(...show.range)))
                .filter((k) => k != null)
                .join("...")
            : ""
        );
      }
    });
  }, [show.search]);

  return (
    <>
      <Head>
        <title>
          Referencias {dataRangeTitle ? `(${dataRangeTitle})` : `| Deno`}
        </title>
      </Head>
      <CookieBanner />
      <div className="bg-gray-50 min-h-full">
        <Header subtitle="Continuous Benchmarks" />
        <div className="mb-12">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8">
            <img src="/images/deno_logo_4.gif" className="mb-12 w-32 h-32" />
            <h4 className="text-2xl font-bold tracking-tight">Acerca de</h4>
            <p className="mt-4">
              Como parte del proceso de pruebas e integración continua de Deno,
              medimos el rendimiento de determinadas métricas clave del tiempo
              de ejecución. Puede ver estos puntos de referencia aquí.
            </p>
            <p className="mt-4">
              Actualmente estás viendo datos{" "}
              {showAll ? "de todos los commits" : "del mas reciente commit"} a
              la rama <a href="https://github.com/denoland/deno">master. </a>
              También puedes ver{" "}
              <Link href={!showAll ? "/benchmarks?all" : "/benchmarks"}>
                <a className="link">
                  {!showAll ? "todos los commits." : "el mas reciente commit"}
                </a>
              </Link>{" "}
            </p>
            <div className="mt-12 pt-4">
              <h4 className="text-2xl font-bold tracking-tight">
                Métricas del entorno de ejecución
              </h4>
              <p className="mt-2">
                En esta sección medimos varias métricas de los siguientes
                scripts:
              </p>
              <ul className="ml-8 list-disc my-2">
                <li>
                  <SourceLink
                    path="cli/tests/003_relative_import.ts"
                    name="cold_relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/text_decoder_perf.js"
                    name="text_decoder"
                  />
                </li>
                <li>
                  <SourceLink path="cli/tests/error_001.ts" name="error_001" />
                </li>
                <li>
                  <SourceLink path="cli/tests/002_hello.ts" name="cold_hello" />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/workers_round_robin_bench.ts"
                    name="workers_round_robin"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/003_relative_import.ts"
                    name="relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/workers_startup_bench.ts"
                    name="workers_startup"
                  />
                </li>
                <li>
                  <SourceLink path="cli/tests/002_hello.ts" name="hello" />
                </li>
              </ul>
              <div className="mt-8">
                <a href="#execution-time" id="execution-time">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Tiempo de ejecución
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                  yLabel="seconds"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Escala logarítmica. Esto muestra cuánto tiempo total se
                  necesita para ejecutar un script. Para que deno ejecute
                  mecanografiado, primero debe compilarlo en JS. Un inicio en
                  caliente es cuando deno ya tiene una salida JS en caché, por
                  lo que debería ser rápido porque pasa por alto el compilador
                  TS. Un inicio en frío es cuando deno debe compilar desde cero.
                </p>
              </div>
              <div className="mt-8">
                <a href="#thread-count" id="thread-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Número de hilos
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.threadCount.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                />
                <p className="mt-1">
                  Cuántos subprocesos utilizan los distintos programas. Cuanto
                  más pequeño, mejor.
                </p>
              </div>
              <div className="mt-8">
                <a href="#syscall-count" id="syscall-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Recuento de llamadas al sistema
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.syscallCount.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                />
                <p className="mt-1">
                  Cuántas llamadas al sistema en total se realizan al ejecutar
                  un script determinado. Cuanto más pequeño, mejor.
                </p>
              </div>
              <div className="mt-8">
                <a href="#max-memory-usage" id="max-memory-usage">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Uso máximo de memoria
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxMemory.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                  yLabel="megabytes"
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Uso máximo de memoria durante la ejecución. Cuanto más
                  pequeño, mejor.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">
                Rendimiento de TypeScript
              </h4>
              <div className="mt-8">
                <a href="#type-checking" id="type-checking">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Comprobación del tipado
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(({ name }) => {
                    console.log(name);
                    return typescriptBenches.includes(name);
                  })}
                  yLabel="seconds"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  En ambos casos, <code>std/examples/chat/server_test.ts</code>{" "}
                  es almacenado en cache por deno. La carga de trabajo contiene
                  20 TypeScript únicos modulos. Con <em>check</em> se realiza
                  una verificación completa del tipo de TypeScript, mientras{" "}
                  <em>no_check</em> usa el argumento <code>--no-check</code>{" "}
                  para omitir una verificación completa del tipado.{" "}
                  <em>bundle</em> realiza una verificación de tipo completa y
                  genera una salida de archivo único, mientras{" "}
                  <em>bundle_no_check</em> si usa el argumento{" "}
                  <code>--no-check</code> para omitir una verificación completa
                  del tipado.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">I/O</h4>
              <p
                className="mt-4 flex cursor-pointer"
                onClick={() => setShowNormalized(!showNormalized)}
              >
                <span
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={showNormalized ? "true" : "false"}
                  className={`${
                    showNormalized ? "bg-gray-900" : "bg-gray-200"
                  } relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      showNormalized ? "translate-x-5" : "translate-x-0"
                    } inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                  ></span>
                </span>
                <span className="ml-2 text-gray-900">
                  Mostrar comparativas normalizadas
                </span>
              </p>
              <div className="mt-8">
                <a href="#http-server-throughput" id="http-server-throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Rendimiento del servidor HTTP
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={
                    showNormalized ? data?.normalizedReqPerSec : data?.reqPerSec
                  }
                  yLabel={
                    showNormalized ? "% of hyper througput" : "1k req/sec"
                  }
                  yTickFormat={showNormalized ? formatPercentage : formatReqSec}
                />
                <p className="mt-1">
                  Prueba el rendimiento del servidor HTTP. Diez conexiones para
                  mantener vivo hacen tantas solicitudes de saludo como sea
                  posible. Mas grande es mejor.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <SourceLink path="tools/deno_tcp.ts" name="deno_tcp" /> es
                    un servidor http falso que no analiza HTTP. Es comparable a{" "}
                    <SourceLink path="tools/node_tcp.js" name="node_tcp" />
                  </li>
                  <li>
                    <SourceLink
                      path="std/http/http_bench.ts"
                      name="deno_http"
                    />{" "}
                    es un servidor web escrito en TypeScript. Es comparable a{" "}
                    <SourceLink path="tools/node_http.js" name="node_http" />
                  </li>
                  <li className="break-words">
                    deno_core_single y deno_core_multi son dos versiones de un
                    servidor HTTP falso mínimo. Lee y escribe ciegamente
                    paquetes HTTP fijos. Es comparable a deno_tcp y node_tcp.
                    Este es un ejecutable independiente que usa{" "}
                    <a
                      className="link"
                      href="https://crates.io/crates/deno_core"
                    >
                      el crate de deno para rust
                    </a>
                    . el código está en{" "}
                    <SourceLink
                      path="core/examples/http_bench.rs"
                      name="http_bench.rs"
                    />{" "}
                    y{" "}
                    <SourceLink
                      path="core/examples/http_bench.js"
                      name="http_bench.js"
                    />
                    . usos unicos{" "}
                    <a
                      className="link"
                      href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.basic_scheduler"
                    >
                      tokio::runtime::Builder::basic_scheduler
                    </a>{" "}
                    y multiple usos{" "}
                    <a
                      className="link"
                      href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.threaded_scheduler"
                    >
                      tokio::runtime::Builder::threaded_scheduler
                    </a>
                    .
                  </li>
                  <li>
                    <SourceLink
                      path="tools/hyper_hello/hyper_hello.rs"
                      name="hyper"
                    />{" "}
                    es un servidor HTTP de Rust y representa un límite superior.
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <a href="#http-latency" id="http-latency">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Latencia HTTP
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxLatency}
                  yLabel={"milliseconds"}
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Latencia máxima durante la misma prueba utilizada
                  anteriormente para solicitudes por segundo. Cuanto más pequeño,
                  mejor. Escala logarítmica.
                </p>
              </div>
              <div className="mt-8">
                <a href="#http-proxy-throughput" id="http-proxy-throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Rendimiento del proxy HTTP
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={showNormalized ? data?.normalizedProxy : data?.proxy}
                  yLabel={
                    showNormalized ? "% of hyper througput" : "1k req/sec"
                  }
                  yTickFormat={showNormalized ? formatPercentage : formatReqSec}
                />
                <p className="mt-1">
                  Prueba el rendimiento del proxy. diez conexiones para mantener
                  vivo hacen tantas solicitudes de saludo como sea posible. Más
                  grande es mejor.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <SourceLink
                      path="tools/deno_tcp_proxy.ts"
                      name="deno_proxy_tcp"
                    />{" "}
                    es un servidor proxy tcp falso que no analiza HTTP. Es
                    comparable a{" "}
                    <SourceLink
                      path="tools/node_tcp_proxy.js"
                      name="node_proxy_tcp"
                    />
                  </li>
                  <li>
                    <SourceLink
                      path="tools/deno_http_proxy.ts"
                      name="deno_proxy"
                    />{" "}
                    es un servidor proxy HTTP escrito en TypeScript. Es
                    comparable a{" "}
                    <SourceLink
                      path="tools/node_http_proxy.js"
                      name="node_proxy"
                    />
                  </li>
                  <li>
                    <SourceLink
                      path="tools/hyper_hello/hyper_hello.rs"
                      name="hyper"
                    />{" "}
                    is a Rust HTTP server used as the origin for the proxy
                    tests.
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <a href="#throughput" id="throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Rendimiento
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.throughput}
                  yLabel={"seconds"}
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Escala logarítmica. Tiempo que lleva canalizar una cierta
                  cantidad de datos a través de Deno.{" "}
                  <SourceLink
                    path="cli/tests/echo_server.ts"
                    name="echo_server.ts"
                  />{" "}
                  y <SourceLink path="cli/tests/cat.ts" name="cat.ts" />. Más
                  pequeño es mejor.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">Tamaño</h4>
              <div className="mt-8">
                <a href="#executable-size" id="executable-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    tamaño del ejecutable
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.binarySize}
                  yLabel={"megabytes"}
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Deno envía solo un único binario. Seguimos su tamaño aquí.
                </p>
              </div>
              <div className="mt-8">
                <a href="#bundle-size" id="bundle-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Tamaño del paquete
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.bundleSize}
                  yLabel={"kilobytes"}
                  yTickFormat={formatKB}
                />
                <p className="mt-1">
                  Tamaño de diferentes scripts empaquetados.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <Link href="/std/http/file_server.ts">
                      <a className="link">file_server</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/std/examples/gist.ts">
                      <a className="link">gist</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer simple />
      </div>
    </>
  );
}

function BenchmarkOrLoading(props: {
  data: BenchmarkData | null;
  columns?: Column[];
  yLabel?: string;
  yTickFormat?: (n: number) => string;
}) {
  return props.data && props.columns ? (
    <BenchmarkChart
      columns={props.columns}
      sha1List={props.data.sha1List}
      yLabel={props.yLabel}
      yTickFormat={props.yTickFormat}
    />
  ) : (
    <BenchmarkLoading />
  );
}

function SourceLink({ name, path }: { name: string; path: string }) {
  return (
    <a
      href={`https://github.com/denoland/deno/blob/master/${path}`}
      className="link"
    >
      {name}
    </a>
  );
}

export default Benchmarks;
