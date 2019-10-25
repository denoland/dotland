import React from "react";
import Spinner from "./Spinner";
import ApexChart from "react-apexcharts";
import {
  BenchmarkData,
  Column,
  reshape,
  logScale,
  formatLogScale,
  formatReqSec,
  formatMB,
  formatKB,
  formatPercentage
} from "./benchmark_utils";

interface Props {
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
  sha1List: string[];
}

function BenchmarkChart(props: Props) {
  function viewCommitOnClick(c1: any, c2: any, { dataPointIndex }: any): void {
    window.open(
      `https://github.com/denoland/deno/commit/${props.sha1List[dataPointIndex]}`
    );
  }

  if (props.yTickFormat && props.yTickFormat === formatLogScale) {
    logScale(props.columns);
  }

  const options = {
    chart: {
      toolbar: {
        show: true
      },
      animations: {
        enabled: false
      },
      events: {
        markerClick: viewCommitOnClick
      }
    },
    stroke: {
      width: 2,
      curve: "straight"
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: "bottom"
    },
    yaxis: {
      labels: {
        formatter: props.yTickFormat
      },
      title: {
        text: props.yLabel
      }
    },
    xaxis: {
      labels: {
        show: false
      },
      categories: props.sha1List,
      tooltip: {
        enabled: false
      }
    }
  };

  const series = props.columns;

  return (
    <ApexChart type="line" options={options} series={series} height={300} />
  );
}

export default function Benchmarks() {
  const [data, setData] = React.useState<BenchmarkData | null>(null);
  const [showNormalized, setShowNormalized] = React.useState(false);

  React.useEffect(() => {
    // TODO(ry) handle all.json
    const dataUrl = "https://denoland.github.io/deno/recent.json";

    fetch(dataUrl).then(async response => {
      const rawData = await response.json();
      const data = reshape(rawData);
      setData(data);
    });
  }, []);

  // TODO(ry) error message of load failed.

  if (!data) {
    return <Spinner />;
  }

  return (
    <main>
      <a href="/">
        <img alt="deno logo" src="/images/deno_logo_4.gif" width="200" />
      </a>
      <h1>Deno Continuous Benchmarks</h1>

      <p>
        These plots are updated on every commit to the{" "}
        <a href="https://github.com/denoland/deno">master branch</a>.
      </p>

      <p>
        Make sure your adblocker is disabled as some can block the chart
        rendering.
      </p>

      <p>
        <a href="#recent">recent data</a>
      </p>
      <p>
        <a href="#all">all data</a> (takes a moment to load)
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            checked={showNormalized}
            onChange={e => setShowNormalized(e.target.checked)}
          />{" "}
          Show Normalized Graphs
        </label>
      </p>

      <h3 id="req-per-sec">
        Req/Sec <a href="#req-per-sec">#</a>
      </h3>

      <BenchmarkChart
        columns={showNormalized ? data.normalizedReqPerSec : data.reqPerSec}
        sha1List={data.sha1List}
        yLabel={showNormalized ? "% of hyper througput" : "1k req/sec"}
        yTickFormat={showNormalized ? formatPercentage : formatReqSec}
      />

      <p>
        Tests HTTP server performance. 10 keep-alive connections do as many
        hello-world requests as possible. Bigger is better.
      </p>

      <ul>
        <li>
          <a href="https://github.com/denoland/deno/blob/master/tools/deno_tcp.ts">
            deno_tcp
          </a>{" "}
          is a fake http server that doesn't parse HTTP. It is comparable to{" "}
          <a href="https://github.com/denoland/deno/blob/master/tools/node_tcp.js">
            node_tcp
          </a>
          .
        </li>

        <li>
          <a href="https://github.com/denoland/deno_std/blob/master/http/http_bench.ts">
            deno_http
          </a>{" "}
          is a web server written in TypeScript. It is comparable to{" "}
          <a href="https://github.com/denoland/deno/blob/master/tools/node_http.js">
            node_http
          </a>
          .
        </li>

        <li>
          deno_core_single and deno_core_multi are two versions of a minimal
          fake HTTP server. It blindly reads and writes fixed HTTP packets. It
          is comparable to deno_tcp and node_tcp. This is a standalone
          executable that uses{" "}
          <a href="https://crates.io/crates/deno">the deno rust crate</a>. The
          code is in{" "}
          <a href="https://github.com/denoland/deno/blob/master/core/examples/http_bench.rs">
            http_bench.rs
          </a>{" "}
          and{" "}
          <a href="https://github.com/denoland/deno/blob/master/core/examples/http_bench.js">
            http_bench.js
          </a>
          . single uses{" "}
          <a href="https://docs.rs/tokio/0.1.19/tokio/runtime/current_thread/index.html">
            tokio::runtime::current_thread
          </a>{" "}
          and multi uses
          <a href="https://docs.rs/tokio/0.1.19/tokio/runtime/">
            tokio::runtime::threadpool
          </a>
          .
        </li>

        <li>
          <a href="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs">
            hyper
          </a>{" "}
          is a Rust HTTP server and represents an upper bound.
        </li>
      </ul>

      <h3 id="proxy-req-per-sec">
        Proxy Req/Sec <a href="#proxy-eq-per-sec">#</a>
      </h3>

      <BenchmarkChart
        columns={showNormalized ? data.normalizedProxy : data.proxy}
        sha1List={data.sha1List}
        yLabel={showNormalized ? "% of hyper througput" : "1k req/sec"}
        yTickFormat={showNormalized ? formatPercentage : formatReqSec}
      />

      <p>
        Tests proxy performance. 10 keep-alive connections do as many
        hello-world requests as possible. Bigger is better.
      </p>

      <ul>
        <li>
          <a href="https://github.com/denoland/deno/blob/master/tools/deno_tcp_proxy.ts">
            deno_proxy_tcp
          </a>{" "}
          is a fake tcp proxy server that doesn't parse HTTP. It is comparable
          to{" "}
          <a href="https://github.com/denoland/deno/blob/master/tools/node_tcp_proxy.js">
            node_proxy_tcp
          </a>
          .
        </li>

        <li>
          <a href="https://github.com/denoland/deno/blob/master/tools/deno_http_proxy.ts">
            deno_proxy
          </a>{" "}
          is an HTTP proxy server written in TypeScript. It is comparable to{" "}
          <a href="https://github.com/denoland/deno/blob/master/tools/node_http_proxy.js">
            node_proxy
          </a>
          .
        </li>

        <li>
          <a href="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs">
            hyper
          </a>{" "}
          is a Rust HTTP server used as the origin for the proxy tests
        </li>
      </ul>

      <h3 id="max-latency">
        Max Latency <a href="#max-latency">#</a>
      </h3>

      <BenchmarkChart
        columns={data.maxLatency}
        sha1List={data.sha1List}
        yLabel="milliseconds"
        yTickFormat={formatLogScale}
      />

      <p>
        Max latency during the same test used above for requests/second. Smaller
        is better. Log scale.
      </p>

      <h3 id="exec-time">
        Execution time <a href="#exec-time">#</a>
      </h3>

      <BenchmarkChart
        columns={data.execTime}
        sha1List={data.sha1List}
        yLabel="seconds"
        yTickFormat={formatLogScale}
      />

      <p>
        Log scale. This shows how much time total it takes to run a few simple
        deno programs:{" "}
        <a href="https://github.com/denoland/deno/blob/master/tests/002_hello.ts">
          tests/002_hello.ts
        </a>
        ,{" "}
        <a href="https://github.com/denoland/deno/blob/master/tests/003_relative_import.ts">
          tests/003_relative_import.ts
        </a>
        ,{" "}
        <a href="https://github.com/denoland/deno/blob/master/tests/workers_round_robin_bench.ts">
          tests/workers_round_robin_bench.ts
        </a>
        , and{" "}
        <a href="https://github.com/denoland/deno/blob/master/tests/workers_startup_bench.ts">
          tests/workers_startup_bench.ts
        </a>
        . For deno to execute typescript, it must first compile it to JS. A warm
        startup is when deno has a cached JS output already, so it should be
        fast because it bypasses the TS compiler. A cold startup is when deno
        must compile from scratch.
      </p>

      <h3 id="throughput">
        Throughput <a href="#throughput">#</a>
      </h3>

      <BenchmarkChart
        columns={data.throughput}
        sha1List={data.sha1List}
        yLabel="seconds"
        yTickFormat={formatLogScale}
      />

      <p>
        Log scale. Time it takes to pipe a certain amount of data through Deno.
        <a href="https://github.com/denoland/deno/blob/master/tests/echo_server.ts">
          echo_server.ts
        </a>{" "}
        and{" "}
        <a href="https://github.com/denoland/deno/blob/master/tests/cat.ts">
          cat.ts
        </a>
        . Smaller is better.
      </p>

      <h3 id="max-memory">
        Max Memory Usage <a href="#max-memory">#</a>
      </h3>
      <BenchmarkChart
        columns={data.maxMemory}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
      />
      <p>Max memory usage during execution. Smaller is better.</p>

      <h3 id="size">
        Executable size <a href="#size">#</a>
      </h3>
      <BenchmarkChart
        columns={data.binarySize}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
      />
      <p>deno ships only a single binary. We track its size here.</p>

      <h3 id="threads">
        Thread count <a href="#threads">#</a>
      </h3>
      <BenchmarkChart columns={data.threadCount} sha1List={data.sha1List} />
      <p>How many threads various programs use. Smaller is better.</p>

      <h3 id="bundles">
        Syscall count <a href="#bundles">#</a>
      </h3>
      <BenchmarkChart columns={data.syscallCount} sha1List={data.sha1List} />
      <p>
        How many total syscalls are performed when executing a given script.
        Smaller is better.
      </p>

      <h3 id="bundles">
        Bundle size <a href="#syscalls">#</a>
      </h3>
      <BenchmarkChart
        columns={data.bundleSize}
        sha1List={data.sha1List}
        yTickFormat={formatKB}
        yLabel="kb"
      />
      <p>Size of different bundled scripts.</p>

      <ul>
        <li>
          <a href="https://deno.land/std/http/file_server.ts">file_server</a>
        </li>

        <li>
          <a href="https://deno.land/std/examples/gist.ts">gist</a>
        </li>
      </ul>
    </main>
  );
}
