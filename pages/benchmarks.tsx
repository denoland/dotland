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

// TODO(lucacasonato): add anchor points to headers
const Benchmarks = () => {
  const _ = useRouter();

  const showAll =
    typeof window === "undefined" ? false : location.search.endsWith("?all");

  const [data, setData] = React.useState<BenchmarkData | null>(null);
  const [showNormalized, setShowNormalized] = React.useState(false);

  React.useEffect(() => {
    setData(null);
    let dataUrl = "https://denoland.github.io/benchmark_data/recent.json";
    if (showAll) {
      dataUrl = "https://denoland.github.io/benchmark_data/data.json";
    }

    fetch(dataUrl).then(async (response) => {
      const rawData = await response.json();
      const data = reshape(rawData);
      setData(data);
    });
  }, [showAll]);

  return (
    <>
      <Head>
        <title>Benchmarks - Deno</title>
        <meta name="description" content="Continuous benchmarks for Deno." />
      </Head>
      <div className="bg-gray-50 min-h-full">
        <Header small subtitle="Continuous Benchmarks" />
        <div className="mb-12">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8">
            <h4 className="text-2xl font-bold tracking-tight">About</h4>
            <p className="mt-4">
              As part of Deno's continuous integration and testing pipeline we
              measure the performance of certain key metrics of the runtime. You
              can view these benchmarks here.
            </p>
            <p className="mt-4">
              You are currently viewing data for{" "}
              {showAll ? "all" : "the most recent"} commits to the{" "}
              <a href="https://github.com/denoland/deno">master</a> branch. You
              can also view{" "}
              <Link
                href="/benchmarks"
                as={!showAll ? "/benchmarks?all" : "/benchmarks"}
              >
                <a className="link">{!showAll ? "all" : "the most recent"}</a>
              </Link>{" "}
              commits.
            </p>
            <div className="mt-12 pt-4">
              <h4 className="text-2xl font-bold tracking-tight">
                Runtime Metrics
              </h4>
              <p className="mt-2">
                In this section we measure various metrics of the following
                scripts:
              </p>
              <ul className="ml-8 list list-disc my-2">
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
                <h5 className="text-lg font-medium tracking-tight">
                  Execution time
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime}
                  yLabel="seconds"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Log scale. This shows how much time total it takes to run a
                  script. For deno to execute typescript, it must first compile
                  it to JS. A warm startup is when deno has a cached JS output
                  already, so it should be fast because it bypasses the TS
                  compiler. A cold startup is when deno must compile from
                  scratch.
                </p>
              </div>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">
                  Thread count
                </h5>
                <BenchmarkOrLoading data={data} columns={data?.threadCount} />
                <p className="mt-1">
                  How many threads various programs use. Smaller is better.
                </p>
              </div>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">
                  Syscall count
                </h5>
                <BenchmarkOrLoading data={data} columns={data?.syscallCount} />
                <p className="mt-1">
                  How many total syscalls are performed when executing a given
                  script. Smaller is better.
                </p>
              </div>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">
                  Max memory usage
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxMemory}
                  yLabel="megabytes"
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Max memory usage during execution. Smaller is better.
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
                  Show normalized benchmarks
                </span>
              </p>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">Req/Sec</h5>
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
                  Tests HTTP server performance. 10 keep-alive connections do as
                  many hello-world requests as possible. Bigger is better.
                </p>
                <ul className="ml-8 list list-disc my-2">
                  <li>
                    <SourceLink path="tools/deno_tcp.ts" name="deno_tcp" /> is a
                    fake http server that doesn't parse HTTP. It is comparable
                    to <SourceLink path="tools/node_tcp.js" name="node_tcp" />
                  </li>
                  <li>
                    <SourceLink
                      path="std/http/http_bench.ts"
                      name="deno_http"
                    />{" "}
                    is a web server written in TypeScript. It is comparable to{" "}
                    <SourceLink path="tools/node_http.js" name="node_http" />
                  </li>
                  <li className="break-words">
                    deno_core_single and deno_core_multi are two versions of a
                    minimal fake HTTP server. It blindly reads and writes fixed
                    HTTP packets. It is comparable to deno_tcp and node_tcp.
                    This is a standalone executable that uses{" "}
                    <a
                      className="link"
                      href="https://crates.io/crates/deno_core"
                    >
                      the deno rust crate
                    </a>
                    . The code is in{" "}
                    <SourceLink
                      path="core/examples/http_bench.rs"
                      name="http_bench.rs"
                    />{" "}
                    and{" "}
                    <SourceLink
                      path="core/examples/http_bench.js"
                      name="http_bench.js"
                    />
                    . single uses{" "}
                    <a
                      className="link"
                      href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.basic_scheduler"
                    >
                      tokio::runtime::Builder::basic_scheduler
                    </a>{" "}
                    and multi uses{" "}
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
                    is a Rust HTTP server and represents an upper bound.
                  </li>
                </ul>
              </div>
              <div className="mt-20">
                <h5 className="text-lg font-medium tracking-tight">
                  Proxy Req/Sec
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={showNormalized ? data?.normalizedProxy : data?.proxy}
                  yLabel={
                    showNormalized ? "% of hyper througput" : "1k req/sec"
                  }
                  yTickFormat={showNormalized ? formatPercentage : formatReqSec}
                />
                <p className="mt-1">
                  Tests proxy performance. 10 keep-alive connections do as many
                  hello-world requests as possible. Bigger is better.
                </p>
                <ul className="ml-8 list list-disc my-2">
                  <li>
                    <SourceLink
                      path="tools/deno_tcp_proxy.ts"
                      name="deno_proxy_tcp"
                    />{" "}
                    is a fake tcp proxy server that doesn't parse HTTP. It is
                    comparable to{" "}
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
                    is an HTTP proxy server written in TypeScript. It is
                    comparable to{" "}
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
                <h5 className="text-lg font-medium tracking-tight">
                  Throughput
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.throughput}
                  yLabel={"seconds"}
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Log scale. Time it takes to pipe a certain amount of data
                  through Deno.{" "}
                  <SourceLink
                    path="cli/tests/echo_server.ts"
                    name="echo_server.ts"
                  />{" "}
                  and <SourceLink path="cli/tests/cat.ts" name="cat.ts" />.
                  Smaller is better.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">Size</h4>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">
                  Executable size
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.binarySize}
                  yLabel={"megabytes"}
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Deno ships only a single binary. We track its size here.
                </p>
              </div>
              <div className="mt-8">
                <h5 className="text-lg font-medium tracking-tight">
                  Bundle size
                </h5>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.bundleSize}
                  yLabel={"kilobytes"}
                  yTickFormat={formatKB}
                />
                <p className="mt-1">Size of different bundled scripts.</p>
                <ul className="ml-8 list list-disc my-2">
                  <li>
                    <Link
                      href="/[identifier]/[...path]"
                      as="/std/http/file_server.ts"
                    >
                      <a className="link">file_server</a>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/[identifier]/[...path]"
                      as="/std/examples/gist.ts"
                    >
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
};

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
