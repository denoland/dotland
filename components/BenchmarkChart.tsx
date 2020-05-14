/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useState } from "react";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: BenchmarkLoading,
});

import { Column, formatLogScale, logScale } from "../util/benchmark_utils";

export interface BenchmarkChartProps {
  yTickFormat?: (n: number) => string;
  columns: Column[];
  yLabel?: string;
  sha1List: string[];
}

function BenchmarkChart(props: BenchmarkChartProps) {
  const [id] = useState(Math.random().toString());

  const shortSha1List = props.sha1List.map((s) => s.slice(0, 6));

  function viewCommitOnClick(c1: any, c2: any, { dataPointIndex }: any): void {
    window.open(
      `https://github.com/denoland/deno/commit/${props.sha1List[dataPointIndex]}`
    );
  }

  const cols = props.columns.map((d) => ({ name: d.name, data: [...d.data] }));

  if (props.yTickFormat && props.yTickFormat === formatLogScale) {
    logScale(cols);
  }

  const options = {
    chart: {
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
      events: {
        markerClick: viewCommitOnClick,
      },
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
        formatter: props.yTickFormat,
      },
      title: {
        text: props.yLabel,
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
  };

  const series = cols.sort((a, b) => {
    // Sort by last benchmark.
    const aLast = a.data[a.data.length - 1];
    const bLast = b.data[b.data.length - 1];
    return (bLast ?? 0) - (aLast ?? 0);
  });

  return (
    <ApexChart
      key={id}
      type="line"
      options={options}
      series={series}
      height="320"
    />
  );
}

export function BenchmarkLoading() {
  return (
    <div style={{ height: 335 }} className="flex items-center justify-center">
      <span className="text-gray-500">Loading...</span>
    </div>
  );
}

export default BenchmarkChart;
