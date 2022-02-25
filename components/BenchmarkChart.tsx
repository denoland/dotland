// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "../deps.ts";

import { Column, formatLogScale, logScale } from "../util/benchmark_utils.ts";

export interface BenchmarkChartProps {
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
}

export function BenchmarkChart(props: BenchmarkChartProps) {
  const id = Math.random().toString();
  const cols = props.columns.map((d) => ({ name: d.name, data: [...d.data] }));

  if (props.yTickFormat && props.yTickFormat === formatLogScale) {
    logScale(cols);
  }

  const series = cols.sort((a, b) => {
    // Sort by last benchmark.
    const aLast = a.data[a.data.length - 1];
    const bLast = b.data[b.data.length - 1];
    return (bLast ?? 0) - (aLast ?? 0);
  });

  return (
    <>
      <div id={id} />
      <script
        id={id + "Data"}
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(series) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        new ApexCharts(document.getElementById("${id}"), {
          chart: {
            height: 320,
            type: "line",
            toolbar: {
              show: true,
            },
            animations: {
              enabled: false,
            },
            events: {
              markerClick: (c1, c2, { dataPointIndex }) => {
                window.open(
                  "https://github.com/denoland/deno/commits/" + data.sha1List[dataPointIndex],
                );
              },
            },
          },
          series: JSON.parse(document.getElementById("${id}Data").text),
          stroke: {
            width: 1,
            curve: "straight",
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            position: "bottom",
          },
          yaxis: {
            labels: {
              formatter: ${props.yTickFormat?.toString()},
            },
            title: {
              text: "${props.yLabel}",
            },
          },
          xaxis: {
            labels: {
              show: false,
            },
            categories: shortSha1List,
            tooltip: {
              enabled: false,
            },
          },
        }).render();
      `,
        }}
      />
    </>
  );
}
<<<<<<< HEAD

export function BenchmarkLoading(): React.ReactElement {
  return (
    <div style={{ height: 335 }} className="flex items-center justify-center">
      <span className="text-gray-500">
        加载中...
      </span>
    </div>
  );
}

export default BenchmarkChart;
=======
>>>>>>> 536026728193c65673465483c3006267099de405
