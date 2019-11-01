import React, { useState, useMemo } from "react";
import Spinner from "./Spinner";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
  YAxis,
  XAxis,
  ReferenceArea
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
import { Theme, Button } from "@material-ui/core";
import Link from "./Link";
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
  const [hovered, setHovered] = useState<string>(null);
  const [disabled, setDisabled] = useState<string[]>([]);
  const [refLeft, setRefLeft] = useState<number>(null);
  const [refRight, setRefRight] = useState<number>(null);
  const [boundLeft, setBoundLeft] = useState<number>(null);
  const [boundRight, setBoundRight] = useState<number>(null);

  function viewCommitOnClick(d: number): void {
    window.open(`https://github.com/denoland/deno/commit/${sha1List[d]}`);
  }

  function zoom() {
    if (refLeft !== null) {
      if (refRight !== null && refLeft !== refRight) {
        const newLeft = Math.min(refLeft, refRight) + boundLeft;
        const newRight = Math.max(refLeft, refRight) + boundLeft;
        setBoundLeft(newLeft);
        setBoundRight(newRight);
      } else {
        viewCommitOnClick(refLeft);
      }
    }

    setRefLeft(null);
    setRefRight(null);
  }

  const [data, series, sha1List] = useMemo(() => {
    let data: { name: string }[] = [];
    let series: string[] = [];
    props.columns.forEach(column => {
      series.push(column.name);
      column.data.forEach((y, x) => {
        if (!data[x]) {
          data[x] = { name: props.sha1List[x] };
        }
        data[x][column.name] = y ? y : 0;
      });
    });
    let sha1List = props.sha1List;
    if (boundLeft !== null && boundRight !== null) {
      data = data.splice(boundLeft, boundRight - boundLeft + 1);
      sha1List = sha1List.splice(boundLeft, boundRight - boundLeft + 1);
    }
    return [data, series, sha1List];
  }, [props.columns, props.sha1List, boundLeft, boundRight]);

  return (
    <>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={data}
          onMouseDown={e => e && setRefLeft(e.activeLabel)}
          onMouseMove={e => e && refLeft !== null && setRefRight(e.activeLabel)}
          onMouseUp={() => zoom()}
        >
          {series.map((n, i) => {
            if (disabled.includes(n)) return null;
            let alpha = "";
            if (hovered) {
              if (hovered !== n) {
                alpha = "33";
              }
            }
            return (
              <Line
                type="linear"
                dataKey={n}
                stroke={COLORS[i] + alpha}
                strokeWidth={2}
                isAnimationActive={false}
                key={n}
                dot={false}
                activeDot={{ onClick: viewCommitOnClick }}
              />
            );
          })}
          <Tooltip
            isAnimationActive={false}
            labelFormatter={i => sha1List[i]}
            cursor={false}
            contentStyle={{ backgroundColor: theme.palette.background.default }}
          />
          <Legend
            wrapperStyle={{ backgroundColor: theme.palette.background.default }}
            onMouseEnter={v => setHovered(v.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={v => {
              if (disabled.includes(v.id)) {
                setDisabled(disabled.filter(d => v.id !== d));
              } else {
                setDisabled([...disabled, v.id]);
              }
            }}
            payload={series.map((n, i) => ({
              id: n,
              value: (
                <span
                  style={{
                    opacity: disabled.includes(n) ? 0.2 : 1,
                    userSelect: "none"
                  }}
                >
                  {n}
                </span>
              ),
              type: "circle",
              color: COLORS[i] + (disabled.includes(n) ? "33" : "")
            }))}
          />
          <XAxis tickFormatter={() => ""} />
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
          {refLeft !== null && refRight !== null ? (
            <ReferenceArea x1={refLeft} x2={refRight} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
      {boundLeft || boundRight ? (
        <Button>
          {/*onClick={() => {
            setBoundLeft(null);
            setBoundRight(null);
          }} */}
          Reset Zoom
        </Button>
      ) : null}
    </>
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
        <Link to="#recent">recent data</Link>
      </p>
      <p>
        <Link to="#all">all data</Link> (takes a moment to load)
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
        Req/Sec <Link to="#req-per-sec">#</Link>
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
        scale="linear"
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
        scale="log"
      />

      <p>
        Max latency during the same test used above for requests/second. Smaller
        is better. Log scale.
      </p>

      <h3 id="exec-time">
        Execution time <Link to="#exec-time">#</Link>
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
        <Link to="https://github.com/denoland/deno/blob/master/tests/002_hello.ts">
          tests/002_hello.ts
        </Link>
        ,{" "}
        <Link to="https://github.com/denoland/deno/blob/master/tests/003_relative_import.ts">
          tests/003_relative_import.ts
        </Link>
        ,{" "}
        <Link to="https://github.com/denoland/deno/blob/master/tests/workers_round_robin_bench.ts">
          tests/workers_round_robin_bench.ts
        </Link>
        , and{" "}
        <Link to="https://github.com/denoland/deno/blob/master/tests/workers_startup_bench.ts">
          tests/workers_startup_bench.ts
        </Link>
        . For deno to execute typescript, it must first compile it to JS. A warm
        startup is when deno has a cached JS output already, so it should be
        fast because it bypasses the TS compiler. A cold startup is when deno
        must compile from scratch.
      </p>

      <h3 id="throughput">
        Throughput <Link to="#throughput">#</Link>
      </h3>

      <BenchmarkChart
        columns={data.throughput}
        sha1List={data.sha1List}
        yLabel="seconds"
        scale="log"
      />

      <p>
        Log scale. Time it takes to pipe a certain amount of data through Deno.
        <Link to="https://github.com/denoland/deno/blob/master/tests/echo_server.ts">
          echo_server.ts
        </Link>{" "}
        and{" "}
        <Link to="https://github.com/denoland/deno/blob/master/tests/cat.ts">
          cat.ts
        </Link>
        . Smaller is better.
      </p>

      <h3 id="max-memory">
        Max Memory Usage <Link to="#max-memory">#</Link>
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
        Executable size <Link to="#size">#</Link>
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
        Thread count <Link to="#threads">#</Link>
      </h3>
      <BenchmarkChart
        columns={data.threadCount}
        sha1List={data.sha1List}
        scale="linear"
      />
      <p>How many threads various programs use. Smaller is better.</p>

      <h3 id="bundles">
        Syscall count <Link to="#bundles">#</Link>
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
        Bundle size <Link to="#syscalls">#</Link>
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
