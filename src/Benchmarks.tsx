import React from "react";
import Spinner from "./Spinner";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
  YAxis
} from "recharts";
import {
  BenchmarkData,
  Column,
  reshape,
  formatReqSec,
  formatMB,
  formatKB,
  formatPercentage
} from "./benchmark_utils";
import { Link, Theme } from "@material-ui/core";
import { InternalLink } from "./InternalLink";
import { useTheme } from "@material-ui/styles";

interface Props {
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
  sha1List: string[];
  scale: "linear" | "log";
}

const COLORS = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928"
];

function BenchmarkChart(props: Props) {
  const theme = useTheme<Theme>();

  function viewCommitOnClick(d: any): void {
    window.open(
      `https://github.com/denoland/deno/commit/${props.sha1List[d.index]}`
    );
  }

  const data: { name: string }[] = [];
  const series: string[] = [];
  props.columns.forEach(column => {
    series.push(column.name);
    column.data.forEach((y, x) => {
      if (!data[x]) {
        data[x] = { name: props.sha1List[x] };
      }
      data[x][column.name] = y ? y : 0;
    });
  });

  return (
    <ResponsiveContainer height={300} width="100%">
      <LineChart data={data}>
        {series.map((n, i) => (
          <Line
            type="linear"
            dataKey={n}
            stroke={COLORS[i]}
            strokeWidth={2}
            isAnimationActive={false}
            key={n}
            dot={false}
            activeDot={{ onClick: viewCommitOnClick }}
          />
        ))}
        <Tooltip
          isAnimationActive={false}
          labelFormatter={i => props.sha1List[i]}
          cursor={false}
          contentStyle={{ backgroundColor: theme.palette.background.default }}
        />
        <Legend
          wrapperStyle={{ backgroundColor: theme.palette.background.default }}
        />
        <YAxis
          label={{
            value: props.yLabel,
            angle: -90,
            position: "insideLeft",
            offset: 2,
            fill: theme.palette.getContrastText(
              theme.palette.background.default
            )
          }}
          width={70}
          padding={{ top: 10, bottom: 10 }}
          tickFormatter={
            props.yTickFormat ? props.yTickFormat : v => v.toFixed(2)
          }
          scale={props.scale}
          domain={["auto", "auto"]}
          stroke={theme.palette.getContrastText(
            theme.palette.background.default
          )}
        />
      </LineChart>
    </ResponsiveContainer>
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
      <Link component={InternalLink} to="/">
        <img alt="deno logo" src="/images/deno_logo_4.gif" width="200" />
      </Link>
      <h1>Deno Continuous Benchmarks</h1>

      <p>
        These plots are updated on every commit to the{" "}
        <Link component={InternalLink} to="https://github.com/denoland/deno">
          master branch
        </Link>
        .
      </p>

      <p>
        Make sure your adblocker is disabled as some can block the chart
        rendering.
      </p>

      <p>
        <Link component={InternalLink} to="#recent">
          recent data
        </Link>
      </p>
      <p>
        <Link component={InternalLink} to="#all">
          all data
        </Link>{" "}
        (takes a moment to load)
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
        Req/Sec{" "}
        <Link component={InternalLink} to="#req-per-sec">
          #
        </Link>
      </h3>

      <BenchmarkChart
        columns={showNormalized ? data.normalizedReqPerSec : data.reqPerSec}
        sha1List={data.sha1List}
        yLabel={showNormalized ? "% of hyper througput" : "1k req/sec"}
        yTickFormat={showNormalized ? formatPercentage : formatReqSec}
        scale="linear"
      />

      <p>
        Tests HTTP server performance. 10 keep-alive connections do as many
        hello-world requests as possible. Bigger is better.
      </p>

      <ul>
        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/deno_tcp.ts"
          >
            deno_tcp
          </Link>{" "}
          is a fake http server that doesn't parse HTTP. It is comparable to{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/node_tcp.js"
          >
            node_tcp
          </Link>
          .
        </li>

        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno_std/blob/master/http/http_bench.ts"
          >
            deno_http
          </Link>{" "}
          is a web server written in TypeScript. It is comparable to{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/node_http.js"
          >
            node_http
          </Link>
          .
        </li>

        <li>
          deno_core_single and deno_core_multi are two versions of a minimal
          fake HTTP server. It blindly reads and writes fixed HTTP packets. It
          is comparable to deno_tcp and node_tcp. This is a standalone
          executable that uses{" "}
          <Link component={InternalLink} to="https://crates.io/crates/deno">
            the deno rust crate
          </Link>
          . The code is in{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/core/examples/http_bench.rs"
          >
            http_bench.rs
          </Link>{" "}
          and{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/core/examples/http_bench.js"
          >
            http_bench.js
          </Link>
          . single uses{" "}
          <Link
            component={InternalLink}
            to="https://docs.rs/tokio/0.1.19/tokio/runtime/current_thread/index.html"
          >
            tokio::runtime::current_thread
          </Link>{" "}
          and multi uses
          <Link
            component={InternalLink}
            to="https://docs.rs/tokio/0.1.19/tokio/runtime/"
          >
            tokio::runtime::threadpool
          </Link>
          .
        </li>

        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs"
          >
            hyper
          </Link>{" "}
          is a Rust HTTP server and represents an upper bound.
        </li>
      </ul>

      <h3 id="proxy-req-per-sec">
        Proxy Req/Sec{" "}
        <Link component={InternalLink} to="#proxy-eq-per-sec">
          #
        </Link>
      </h3>

      <BenchmarkChart
        columns={showNormalized ? data.normalizedProxy : data.proxy}
        sha1List={data.sha1List}
        yLabel={showNormalized ? "% of hyper througput" : "1k req/sec"}
        yTickFormat={showNormalized ? formatPercentage : formatReqSec}
        scale="linear"
      />

      <p>
        Tests proxy performance. 10 keep-alive connections do as many
        hello-world requests as possible. Bigger is better.
      </p>

      <ul>
        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/deno_tcp_proxy.ts"
          >
            deno_proxy_tcp
          </Link>{" "}
          is a fake tcp proxy server that doesn't parse HTTP. It is comparable
          to{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/node_tcp_proxy.js"
          >
            node_proxy_tcp
          </Link>
          .
        </li>

        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/deno_http_proxy.ts"
          >
            deno_proxy
          </Link>{" "}
          is an HTTP proxy server written in TypeScript. It is comparable to{" "}
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/node_http_proxy.js"
          >
            node_proxy
          </Link>
          .
        </li>

        <li>
          <Link
            component={InternalLink}
            to="https://github.com/denoland/deno/blob/master/tools/hyper_hello.rs"
          >
            hyper
          </Link>{" "}
          is a Rust HTTP server used as the origin for the proxy tests
        </li>
      </ul>

      <h3 id="max-latency">
        Max Latency{" "}
        <Link component={InternalLink} to="#max-latency">
          #
        </Link>
      </h3>

      <BenchmarkChart
        columns={data.maxLatency}
        sha1List={data.sha1List}
        yLabel="milliseconds"
        scale="log"
      />

      <p>
        Max latency during the same test used above for requests/second. Smaller
        is better. Log scale.
      </p>

      <h3 id="exec-time">
        Execution time{" "}
        <Link component={InternalLink} to="#exec-time">
          #
        </Link>
      </h3>

      <BenchmarkChart
        columns={data.execTime}
        sha1List={data.sha1List}
        yLabel="seconds"
        scale="log"
      />

      <p>
        Log scale. This shows how much time total it takes to run a few simple
        deno programs:{" "}
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/002_hello.ts"
        >
          tests/002_hello.ts
        </Link>
        ,{" "}
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/003_relative_import.ts"
        >
          tests/003_relative_import.ts
        </Link>
        ,{" "}
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/workers_round_robin_bench.ts"
        >
          tests/workers_round_robin_bench.ts
        </Link>
        , and{" "}
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/workers_startup_bench.ts"
        >
          tests/workers_startup_bench.ts
        </Link>
        . For deno to execute typescript, it must first compile it to JS. A warm
        startup is when deno has a cached JS output already, so it should be
        fast because it bypasses the TS compiler. A cold startup is when deno
        must compile from scratch.
      </p>

      <h3 id="throughput">
        Throughput{" "}
        <Link component={InternalLink} to="#throughput">
          #
        </Link>
      </h3>

      <BenchmarkChart
        columns={data.throughput}
        sha1List={data.sha1List}
        yLabel="seconds"
        scale="log"
      />

      <p>
        Log scale. Time it takes to pipe a certain amount of data through Deno.
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/echo_server.ts"
        >
          echo_server.ts
        </Link>{" "}
        and{" "}
        <Link
          component={InternalLink}
          to="https://github.com/denoland/deno/blob/master/tests/cat.ts"
        >
          cat.ts
        </Link>
        . Smaller is better.
      </p>

      <h3 id="max-memory">
        Max Memory Usage{" "}
        <Link component={InternalLink} to="#max-memory">
          #
        </Link>
      </h3>
      <BenchmarkChart
        columns={data.maxMemory}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
        scale="linear"
      />
      <p>Max memory usage during execution. Smaller is better.</p>

      <h3 id="size">
        Executable size{" "}
        <Link component={InternalLink} to="#size">
          #
        </Link>
      </h3>
      <BenchmarkChart
        columns={data.binarySize}
        sha1List={data.sha1List}
        yLabel="megabytes"
        yTickFormat={formatMB}
        scale="linear"
      />
      <p>deno ships only a single binary. We track its size here.</p>

      <h3 id="threads">
        Thread count{" "}
        <Link component={InternalLink} to="#threads">
          #
        </Link>
      </h3>
      <BenchmarkChart
        columns={data.threadCount}
        sha1List={data.sha1List}
        scale="linear"
      />
      <p>How many threads various programs use. Smaller is better.</p>

      <h3 id="bundles">
        Syscall count{" "}
        <Link component={InternalLink} to="#bundles">
          #
        </Link>
      </h3>
      <BenchmarkChart
        columns={data.syscallCount}
        sha1List={data.sha1List}
        scale="linear"
      />
      <p>
        How many total syscalls are performed when executing a given script.
        Smaller is better.
      </p>

      <h3 id="bundles">
        Bundle size{" "}
        <Link component={InternalLink} to="#syscalls">
          #
        </Link>
      </h3>
      <BenchmarkChart
        columns={data.bundleSize}
        sha1List={data.sha1List}
        yTickFormat={formatKB}
        yLabel="kb"
        scale="linear"
      />
      <p>Size of different bundled scripts.</p>

      <ul>
        <li>
          <Link
            component={InternalLink}
            to="https://deno.land/std/http/file_server.ts"
          >
            file_server
          </Link>
        </li>

        <li>
          <Link
            component={InternalLink}
            to="https://deno.land/std/examples/gist.ts"
          >
            gist
          </Link>
        </li>
      </ul>
    </main>
  );
}
