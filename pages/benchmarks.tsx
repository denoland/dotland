/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h, useState, useEffect } from "../deps.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import {
  BenchmarkData,
  Column,
  formatKB,
  formatLogScale,
  formatMB,
  formatMsec,
  formatReqSec,
  reshape,
} from "../util/benchmark_utils.ts";
import { BenchmarkChart, BenchmarkLoading } from "../components/BenchmarkChart.tsx";

// TODO(lucacasonato): add anchor points to headers
export default function Benchmarks() {
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

  const [data, setData] = useState<BenchmarkData | null>(null);
  const [dataRangeTitle, setDataRangeTitle] = useState<string>("");
  const [showNormalized, setShowNormalized] = useState(false);

  useData()

  useEffect(() => {
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
            : "",
        );
      }
    });
  }, [show.search]);

  return (
    <>
      <Head>
        <title>
          Benchmarks {dataRangeTitle ? `(${dataRangeTitle})` : `| Deno`}
        </title>
      </Head>
      <div className="bg-gray-50 min-h-full">
        <Header subtitle="Continuous Benchmarks" widerContent={true} />
        <div className="mb-12">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8">
            <img src="/images/deno_logo_4.gif" className="mb-12 w-32 h-32" />
            <h4 className="text-2xl font-bold tracking-tight">About</h4>
            <p className="mt-4">
              As part of Deno's continuous integration and testing pipeline we
              measure the performance of certain key metrics of the runtime. You
              can view these benchmarks here.
            </p>
            <p className="mt-4">
              You are currently viewing data for{" "}
              {showAll ? "all" : "the most recent"} commits to the{" "}
              <a href="https://github.com/denoland/deno">main</a>
              branch. You can also view{" "}
              <Link href={!showAll ? "/benchmarks?all" : "/benchmarks"}>
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
              <ul className="ml-8 list-disc my-2">
                <li>
                  <SourceLink
                    path="cli/tests/testdata/003_relative_import.ts"
                    name="cold_relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/text_decoder_perf.js"
                    name="text_decoder"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/error_001.ts"
                    name="error_001"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/002_hello.ts"
                    name="cold_hello"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/workers/bench_round_robin.ts"
                    name="workers_round_robin"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/003_relative_import.ts"
                    name="relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/workers/bench_startup.ts"
                    name="workers_startup"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/testdata/002_hello.ts"
                    name="hello"
                  />
                </li>
              </ul>
              <div className="mt-8">
                <a href="#execution-time" id="execution-time">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Execution time
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(
                    ({ name }) => !typescriptBenches.includes(name),
                  )}
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
                <a href="#thread-count" id="thread-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Thread count
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.threadCount.filter(
                    ({ name }) => !typescriptBenches.includes(name),
                  )}
                />
                <p className="mt-1">
                  How many threads various programs use. Smaller is better.
                </p>
              </div>
              <div className="mt-8">
                <a href="#syscall-count" id="syscall-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Syscall count
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.syscallCount.filter(
                    ({ name }) => !typescriptBenches.includes(name),
                  )}
                />
                <p className="mt-1">
                  How many total syscalls are performed when executing a given
                  script. Smaller is better.
                </p>
              </div>
              <div className="mt-8">
                <a href="#max-memory-usage" id="max-memory-usage">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Max memory usage
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxMemory.filter(
                    ({ name }) => !typescriptBenches.includes(name),
                  )}
                  yLabel="megabytes"
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Max memory usage during execution. Smaller is better.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">
                TypeScript Performance
              </h4>
              <div className="mt-8">
                <a href="#type-checking" id="type-checking">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Type Checking
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(({ name }) => {
                    return typescriptBenches.includes(name);
                  })}
                  yLabel="seconds"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  In both cases, <code>std/examples/chat/server_test.ts</code>
                  {" "}
                  is cached by Deno. The workload contains 20 unique TypeScript
                  modules. With <em>check</em>{" "}
                  a full TypeScript type check is performed, while{" "}
                  <em>no_check</em> uses the <code>--no-check</code>{" "}
                  flag to skip a full type check. <em>bundle</em>{" "}
                  does a full type check and generates a single file output,
                  while <em>bundle_no_check</em> uses the{" "}
                  <code>--no-check</code> flag to skip a full type check.
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
                  >
                  </span>
                </span>
                <span className="ml-2 text-gray-900">
                  Show normalized benchmarks
                </span>
              </p>
              <div className="mt-8">
                <a href="#http-server-throughput" id="http-server-throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    HTTP Server Throughput
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={showNormalized
                    ? data?.normalizedReqPerSec
                    : data?.reqPerSec}
                  yLabel="1k req/sec"
                  yTickFormat={formatReqSec}
                />
                <p className="mt-1">
                  Tests HTTP server performance. 10 keep-alive connections do as
                  many hello-world requests as possible. Bigger is better.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <SourceLink path="cli/bench/deno_tcp.ts" name="deno_tcp" />
                    {" "}
                    is a fake http server that doesn't parse HTTP. It is
                    comparable to{" "}
                    <SourceLink path="cli/bench/node_tcp.js" name="node_tcp" />
                  </li>
                  <li>
                    <SourceLink
                      repo="deno_std"
                      path="http/bench.ts"
                      name="deno_http"
                    />{" "}
                    is a web server written in TypeScript. It is comparable to
                    {" "}
                    <SourceLink
                      path="cli/bench/node_http.js"
                      name="node_http"
                    />
                  </li>
                  <li className="break-words">
                    core_http_bin_ops and core_http_json_ops are two versions of
                    a minimal fake HTTP server. It blindly reads and writes
                    fixed HTTP packets. It is comparable to deno_tcp and
                    node_tcp. This is a standalone executable that uses{" "}
                    <a
                      className="link"
                      href="https://crates.io/crates/deno_core"
                    >
                      the deno rust crate
                    </a>
                    . The code is in{" "}
                    <SourceLink
                      path="core/examples/http_bench_json_ops.rs"
                      name="http_bench_json_ops.rs"
                    />{" "}
                    and{" "}
                    <SourceLink
                      path="core/examples/http_bench_json_ops.js"
                      name="http_bench_json_ops.js"
                    />{" "}
                    for http_bench_json_ops.
                  </li>
                  <li>
                    <SourceLink
                      path="test_util/src/test_server.rs"
                      name="hyper"
                    />{" "}
                    is a Rust HTTP server and represents an upper bound.
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <a href="#http-latency" id="http-latency">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    HTTP Latency
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={showNormalized ? data?.normalizedMaxLatency
                    : data?.maxLatency}
                  yLabel={"milliseconds"}
                  yTickFormat={formatMsec}
                />
                <p className="mt-1">
                  Max latency during the same test used above for
                  requests/second. Smaller is better.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">Size</h4>
              <div className="mt-8">
                <a href="#executable-size" id="executable-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    File sizes
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.binarySize}
                  yLabel={"megabytes"}
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  We track the size of various files here. "deno" is the release
                  binary.
                </p>
              </div>
              <div className="mt-8">
                <a href="#bundle-size" id="bundle-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Bundle size
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.bundleSize}
                  yLabel={"kilobytes"}
                  yTickFormat={formatKB}
                />
                <p className="mt-1">Size of different bundled scripts.</p>
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
              <div className="mt-8">
                <a href="#cargo-deps" id="cargo-deps">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Cargo Dependencies
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading data={data} columns={data?.cargoDeps} />
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">
                Language Server
              </h4>
              <div className="mt-8">
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.lspExecTime}
                  yLabel={"milliseconds"}
                />
                <p className="mt-1">
                  We track the performance of the Deno language server under
                  different scenarios to help gauge the overall performance of
                  the language server.
                </p>
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
  return props.data && props.columns
    ? (
      <BenchmarkChart
        columns={props.columns}
        sha1List={props.data.sha1List}
        yLabel={props.yLabel}
        yTickFormat={props.yTickFormat}
      />
    )
    : <BenchmarkLoading />;
}

function SourceLink({
  name,
  path,
  repo = "deno",
}: {
  name: string;
  path: string;
  repo?: string;
}) {
  return (
    <a
      href={`https://github.com/denoland/${repo}/blob/main/${path}`}
      className="link"
    >
      {name}
    </a>
  );
}
