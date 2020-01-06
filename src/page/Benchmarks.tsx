import React from "react";
import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { useLocation } from "react-router-dom";
import {
  BenchmarkData,
  Column,
  formatKB,
  formatLogScale,
  formatMB,
  formatPercentage,
  formatReqSec,
  logScale,
  reshape
} from "../util/benchmark_utils";
import Link from "../component/Link";
import Spinner from "../component/Spinner";

const ApexChart = React.lazy(() => import("react-apexcharts"));

interface Props {
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
  sha1List: string[];
}

function BenchmarkChart(props: Props) {
  const theme = useTheme<Theme>();

  const shortSha1List = props.sha1List.map(s => s.slice(0, 6));

  function viewCommitOnClick(c1: any, c2: any, { dataPointIndex }: any): void {
    window.open(
      `https://github.com/denoland/deno/commit/${props.sha1List[dataPointIndex]}`
    );
  }

  if (props.yTickFormat && props.yTickFormat === formatLogScale) {
    logScale(props.columns);
  }

  const options = {
    theme: {
      mode: theme.palette.type
    },
    chart: {
      background: theme.palette.background.default,
      foreColor: theme.palette.getContrastText(
        theme.palette.background.default
      ),
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
      width: 1,
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
      categories: shortSha1List,
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

function SourceLink({ name, path }) {
  return (
    <Link to={`https://github.com/denoland/deno/blob/master/${path}`}>
      {name}
    </Link>
  );
}

export default function Benchmarks() {
  const [data, setData] = React.useState<BenchmarkData | null>(null);
  const [showNormalized, setShowNormalized] = React.useState(false);

  const { search } = useLocation();

  React.useEffect(() => {
    let dataUrl = "https://denoland.github.io/deno/recent.json";
    if (search.includes("all")) {
      dataUrl = "https://denoland.github.io/deno/data.json";
    }

    fetch(dataUrl).then(async response => {
      const rawData = await response.json();
      const data = reshape(rawData);
      setData(data);
    });
  }, [search]);

  // TODO(ry) error message of load failed.

  if (!data) {
    return <Spinner />;
  }

  return (
    <main>
      <Link to="/">
        <img alt="deno logo" src="/images/deno_logo_4.gif" width="200" />
      </Link>
      <h1>Deno Continuous Benchmarks</h1>

      <p>
        These plots are updated on every commit to the{" "}
        <Link to="https://github.com/denoland/deno">master branch</Link>.
      </p>

      <p>
        Make sure your adblocker is disabled as some can block the chart
        rendering.
      </p>

      <p>
        <Link to="?recent">recent data</Link>
      </p>
      <p>
        <Link to="?all">all data</Link> (takes a moment to load)
      </p>

      <h2>Runtime Metrics</h2>

      <p>In this section we measure various metrics of the following scripts</p>
      <ul>
        <li>
          <SourceLink
            path="tests/003_relative_import.ts"
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
          <SourceLink path="tests/error_001.ts" name="error_001" />
        </li>
        <li>
          <SourceLink path="tests/002_hello.ts" name="cold_hello" />
        </li>
        <li>
          <SourceLink
            path="tests/workers_round_robin_bench.ts"
            name="workers_round_robin"
          />
        </li>
        <li>
          <SourceLink
            path="tests/003_relative_import.ts"
            name="relative_import"
          />
        </li>
        <li>
          <SourceLink
            path="tests/workers_startup_bench.ts"
            name="workers_startup"
          />
        </li>
        <li>
          <SourceLink path="tests/002_hello.ts" name="hello" />
        </li>
      </ul>

      <h3 id="exec-time">
        Execution time <Link to="#exec-time">#</Link>
      </h3>

      <BenchmarkChart
        columns={data.execTime}
        sha1List={data.sha1List}
        yLabel="seconds"
        yTickFormat={formatLogScale}
      />

      <p>
        Log scale. This shows how much time total it takes to run a script. For
        deno to execute typescript, it must first compile it to JS. A warm
        startup is when deno has a cached JS output already, so it should be
        fast because it bypasses the TS compiler. A cold startup is when deno
        must compile from scratch.
      </p>

      <h3 id="threads">
        Thread count <Link to="#threads">#</Link>
      </h3>
      <BenchmarkChart columns={data.threadCount} sha1List={data.sha1List} />
      <p>How many threads various programs use. Smaller is better.</p>

      <h3 id="bundles">
        Syscall count <Link to="#bundles">#</Link>
      </h3>
      <BenchmarkChart columns={data.syscallCount} sha1List={data.sha1List} />
      <p>
        How many total syscalls are performed when executing a given script.
        Smaller is better.
      </p>

      <h3 id="max-memory">
        Max Memory Usage <Link to="#max-memory">#</Link>
      </h3>
      <BenchmarkChart
        columns={data.maxMemory}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
      />
      <p>Max memory usage during execution. Smaller is better.</p>

      <h2>I/O</h2>

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
        Req/Sec <Link to="#req-per-sec">#</Link>
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
          <Link to="https://github.com/denoland/deno/blob/master/tools/deno_tcp.ts">
            deno_tcp
          </Link>{" "}
          is a fake http server that doesn't parse HTTP. It is comparable to{" "}
          <Link to="https://github.com/denoland/deno/blob/master/tools/node_tcp.js">
            node_tcp
          </Link>
          .
        </li>

        <li>
          <Link to="https://github.com/denoland/deno_std/blob/master/http/http_bench.ts">
            deno_http
          </Link>{" "}
          is a web server written in TypeScript. It is comparable to{" "}
          <Link to="https://github.com/denoland/deno/blob/master/tools/node_http.js">
            node_http
          </Link>
          .
        </li>

        <li>
          deno_core_single and deno_core_multi are two versions of a minimal
          fake HTTP server. It blindly reads and writes fixed HTTP packets. It
          is comparable to deno_tcp and node_tcp. This is a standalone
          executable that uses{" "}
          <Link to="https://crates.io/crates/deno">the deno rust crate</Link>.
          The code is in{" "}
          <Link to="https://github.com/denoland/deno/blob/master/core/examples/http_bench.rs">
            http_bench.rs
          </Link>{" "}
          and{" "}
          <Link to="https://github.com/denoland/deno/blob/master/core/examples/http_bench.js">
            http_bench.js
          </Link>
          . single uses{" "}
          <Link to="https://docs.rs/tokio/0.1.19/tokio/runtime/current_thread/index.html">
            tokio::runtime::current_thread
          </Link>{" "}
          and multi uses
          <Link to="https://docs.rs/tokio/0.1.19/tokio/runtime/">
            tokio::runtime::threadpool
          </Link>
          .
        </li>

        <li>
          <Link to="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs">
            hyper
          </Link>{" "}
          is a Rust HTTP server and represents an upper bound.
        </li>
      </ul>

      <h3 id="proxy-req-per-sec">
        Proxy Req/Sec <Link to="#proxy-eq-per-sec">#</Link>
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
          <Link to="https://github.com/denoland/deno/blob/master/tools/deno_tcp_proxy.ts">
            deno_proxy_tcp
          </Link>{" "}
          is a fake tcp proxy server that doesn't parse HTTP. It is comparable
          to{" "}
          <Link to="https://github.com/denoland/deno/blob/master/tools/node_tcp_proxy.js">
            node_proxy_tcp
          </Link>
          .
        </li>

        <li>
          <Link to="https://github.com/denoland/deno/blob/master/tools/deno_http_proxy.ts">
            deno_proxy
          </Link>{" "}
          is an HTTP proxy server written in TypeScript. It is comparable to{" "}
          <Link to="https://github.com/denoland/deno/blob/master/tools/node_http_proxy.js">
            node_proxy
          </Link>
          .
        </li>

        <li>
          <Link to="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs">
            hyper
          </Link>{" "}
          is a Rust HTTP server used as the origin for the proxy tests
        </li>
      </ul>

      <h3 id="max-latency">
        Max Latency <Link to="#max-latency">#</Link>
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

      <h3 id="throughput">
        Throughput <Link to="#throughput">#</Link>
      </h3>

      <BenchmarkChart
        columns={data.throughput}
        sha1List={data.sha1List}
        yLabel="seconds"
        yTickFormat={formatLogScale}
      />

      <p>
        Log scale. Time it takes to pipe a certain amount of data through Deno.
        <Link to="https://github.com/denoland/deno/blob/master/cli/tests/echo_server.ts">
          echo_server.ts
        </Link>{" "}
        and{" "}
        <Link to="https://github.com/denoland/deno/blob/master/cli/tests/cat.ts">
          cat.ts
        </Link>
        . Smaller is better.
      </p>

      <h2>Size</h2>

      <h3 id="size">
        Executable size <Link to="#size">#</Link>
      </h3>
      <BenchmarkChart
        columns={data.binarySize}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
      />
      <p>deno ships only a single binary. We track its size here.</p>

      <h3 id="bundles">
        Bundle size <Link to="#syscalls">#</Link>
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
          <Link to="https://deno.land/std/http/file_server.ts">
            file_server
          </Link>
        </li>

        <li>
          <Link to="https://deno.land/std/examples/gist.ts">gist</Link>
        </li>
      </ul>
    </main>
  );
}
