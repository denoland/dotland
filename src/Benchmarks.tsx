import React from "react";
import Spinner from "./Spinner";
import C3Chart from 'react-c3js';

export interface BenchmarkExecTimeResult {
  min?: number;
  max?: number;
  mean?: number;
  stddev?: number;
  system?: number;
  user?: number;
}

export interface BenchmarkExecTimeResultSet {
  [variant: string]: BenchmarkExecTimeResult;
}

export interface BenchmarkVariantsResultSet {
  [variant: string]: number;
}


export interface BenchmarkRun {
  created_at: string;
  sha1: string;
  benchmark: BenchmarkExecTimeResultSet;
  binary_size?: BenchmarkVariantsResultSet | number;
  max_memory?: BenchmarkVariantsResultSet | number;
  bundle_size?: BenchmarkVariantsResultSet;
  max_latency?: BenchmarkVariantsResultSet;
  req_per_sec?: BenchmarkVariantsResultSet;
  req_per_sec_proxy?: BenchmarkVariantsResultSet;
  syscall_count?: BenchmarkVariantsResultSet;
  thread_count?: BenchmarkVariantsResultSet;
  throughput?: BenchmarkVariantsResultSet;
}

export type BenchmarkName = string;

function getBenchmarkVarieties(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName
): string[] {
  // Look at last sha hash.
  const last = data[data.length - 1];
  return Object.keys(last[benchmarkName]);
}

type Column = [string, ...Array<number | null>];

function createColumns(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName
): Column[] {
  const varieties = getBenchmarkVarieties(data, benchmarkName);
  return varieties.map(variety => [
    variety,
    ...data.map(d => {
      if (d[benchmarkName] != null) {
        if (d[benchmarkName][variety] != null) {
          const v = d[benchmarkName][variety];
          if (benchmarkName == "benchmark") {
            const meanValue = v ? v.mean : 0;
            return meanValue || null;
          } else {
            return v;
          }
        }
      }
      return null;
    })
  ]);
}

function createReqPerSecColumns(data: BenchmarkRun[]): Column[] {
  return createColumns(data, "req_per_sec");
}

export default function Benchmarks() {
  const [state, setState] = React.useState({
    data: null,
    reqPerSecColumns: null
  });

  React.useEffect(() => {
    const dataUrl = "https://denoland.github.io/deno/recent.json";


    fetch(dataUrl).then(async response => {
      const data = await response.json();

      const reqPerSecColumns = createReqPerSecColumns(data);
      console.log("reqPerSecColumns", reqPerSecColumns);

      setState({ data, reqPerSecColumns });
    });
  }, []);

  // TODO(ry) error message of load failed.

  if (!state.data) {
    return (<Spinner />);
  }

  return (
    <main>
      <a href="/"><img alt="deno logo" src="/images/deno_logo_4.gif" width="200"/></a>
      <h1>Deno Continuous Benchmarks</h1>

      <p>
        These plots are updated on every commit to
        <a href="https://github.com/denoland/deno">master branch</a>.
      </p>

      <p>
        Make sure your adblocker is disabled as some can block the chart
        rendering.
      </p>

      <p><a href="#recent">recent data</a></p>
      <p><a href="#all">all data</a> (takes a moment to load)</p>


      <h3 id="req-per-sec">Req/Sec <a href="#req-per-sec">#</a></h3>

      <p>
        Tests HTTP server performance. 10 keep-alive connections do as many
        hello-world requests as possible. Bigger is better.
      </p>

      <ul>
        <li>
          <a
            href="https://github.com/denoland/deno/blob/master/tools/deno_tcp.ts"
            >deno_tcp</a
          >
          is a fake http server that doesn't parse HTTP. It is comparable to
          <a
            href="https://github.com/denoland/deno/blob/master/tools/node_tcp.js"
            >node_tcp</a
          >
          .
        </li>

        <li>
          <a
            href="https://github.com/denoland/deno_std/blob/master/http/http_bench.ts"
            >deno_http</a
          >
          is a web server written in TypeScript. It is comparable to
          <a
            href="https://github.com/denoland/deno/blob/master/tools/node_http.js"
            >node_http</a
          >
          .
        </li>

        <li>
          deno_core_single and deno_core_multi are two versions of a minimal
          fake HTTP server. It blindly reads and writes fixed HTTP packets. It
          is comparable to deno_tcp and node_tcp. This is a standalone
          executable that uses
          <a href="https://crates.io/crates/deno">the deno rust crate</a>. The
          code is in
          <a
            href="https://github.com/denoland/deno/blob/master/core/examples/http_bench.rs"
            >http_bench.rs</a
          >
          and
          <a
            href="https://github.com/denoland/deno/blob/master/core/examples/http_bench.js"
            >http_bench.js</a
          >. single uses
          <a
            href="https://docs.rs/tokio/0.1.19/tokio/runtime/current_thread/index.html"
            >tokio::runtime::current_thread</a
          >
          and multi uses
          <a href="https://docs.rs/tokio/0.1.19/tokio/runtime/"
            >tokio::runtime::threadpool</a
          >.
        </li>

        <li>
          <a
            href="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs"
          >
            hyper
          </a>
          is a Rust HTTP server and represents an upper bound.
        </li>
      </ul>

      <C3Chart data={state.reqPerSecColumns} />


      <h1>TODO: more charts</h1>
    </main>
  );
}
