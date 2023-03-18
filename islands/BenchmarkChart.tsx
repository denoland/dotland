// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { IS_BROWSER } from "$fresh/runtime.ts";
import { Column, formatLogScale, logScale } from "@/utils/benchmark_utils.ts";

let Chart: any;
if (IS_BROWSER) {
  Chart = await import("https://esm.sh/react-apexcharts@1.4.0?alias=react:preact/compat");
}

export default function BenchmarkChart({ data, columns, yTickFormat, yLabel, shortSha1List }: {
  data: any;
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
  shortSha1List: string[];
}) {
  if (!IS_BROWSER) {
    return <div>foo</div>;
  }

  const cols = columns.map((d) => ({ name: d.name, data: [...d.data] }));

  if (yTickFormat === formatLogScale) {
    logScale(cols);
  }

  const series = cols.sort((a, b) => {
    // Sort by last benchmark.
    const aLast = a.data[a.data.length - 1];
    const bLast = b.data[b.data.length - 1];
    return (bLast ?? 0) - (aLast ?? 0);
  });

  console.log(series);


  return (
    <Chart
      options={{
        chart: {
          height: 320,
          type: "line",
          toolbar: {
            show: true
          },
          animations: {
            enabled: false
          },
          events: {
            markerClick: (c1, c2, { dataPointIndex }) => {
              window.open(
                "https://github.com/denoland/deno/commits/" +
                data.sha1List[dataPointIndex]
              );
            }
          }
        },
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
            formatter: yTickFormat?.toString(),
          },
          title: {
            text: yLabel,
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
      }}
      series={series}
    >
    </Chart>
  );
}
