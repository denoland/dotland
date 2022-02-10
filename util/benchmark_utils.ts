// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

// How much to multiply time values in order to process log graphs properly.
const TimeScaleFactor = 10000;

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
  cargo_deps?: BenchmarkVariantsResultSet;
  max_latency?: BenchmarkVariantsResultSet;
  req_per_sec?: BenchmarkVariantsResultSet;
  req_per_sec_proxy?: BenchmarkVariantsResultSet;
  syscall_count?: BenchmarkVariantsResultSet;
  thread_count?: BenchmarkVariantsResultSet;
  throughput?: BenchmarkVariantsResultSet;
  lsp_exec_time?: BenchmarkVariantsResultSet;
}

export type BenchmarkName = Exclude<keyof BenchmarkRun, "created_at" | "sha1">;

export interface Column {
  name: string;
  data: Array<number | null>;
}

function getBenchmarkVarieties(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName,
): string[] {
  // Look at last sha hash.
  const last = data[data.length - 1];
  return Object.keys(last[benchmarkName] ?? {});
}

function createNormalizedColumns(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName,
): Column[] {
  const columns = createColumns(data, benchmarkName);
  normalize(columns);
  lowpassFilter(columns);
  return columns;
}

function normalize(columns: Column[]) {
  const series = columns.map((s) => s.data);
  const regressions = columns.map((s) => linearRegression(s.data));
  const xRange = series.map((data) => data.length)
    .reduce((max, length) => Math.max(max, length), 0);
  for (let x = 0; x < xRange; x++) {
    const [ySum, regSum] = series
      .map((_, k) => [series[k][x], regressions[k][x]])
      .filter(([y, _]) => y != null)
      .map(([y, reg]) => [y, reg] as [number, number])
      .reduce(([ySum, regSum], [y, reg]) => [ySum + y, regSum + reg], [0, 0]);
    const f = regSum / ySum;
    for (let k = 0; k < series.length; k++) {
      if (series[k][x] == null) continue;
      series[k][x]! *= f;
    }
  }
}

function lowpassFilter(columns: Column[]) {
  const series = columns.map((s) => s.data);
  const xRange = series.map((d) => d.length)
    .reduce((max, y) => Math.max(max, y), 0);
  const f = 1 / Math.sqrt(xRange);
  for (let k = 0; k < series.length; k++) {
    for (let x = 1; x < xRange; x++) {
      if (series[k][x] == null) continue;
      if (series[k][x - 1] == null) continue;
      series[k][x] = (1 - f) * series[k][x - 1]! + f * series[k][x]!;
    }
  }
}

function linearRegression(data: Array<number | null>): number[] {
  const [xRange, xSum, ySum, xxSum, xySum, count] = data.map((y, x) => [x, y])
    .filter(([_x, y]) => y != null)
    .map(([x, y]) => [x, y] as [number, number])
    .reduce(
      (
        [xRange, xSum, ySum, xxSum, xySum, count],
        [x, y],
      ) => [
        Math.max(xRange, x + 1),
        xSum + x,
        ySum + y,
        xxSum + x * x,
        xySum + x * y,
        count + 1,
      ],
      [0, 0, 0, 0, 0, 0],
    );
  const slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
  const base = (ySum / count) - (slope * xSum) / count;
  return new Array(xRange).fill(null).map((_, x) => x * slope + base);
}

function createColumns(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName,
): Column[] {
  const varieties = getBenchmarkVarieties(data, benchmarkName);
  return varieties.map((variety) => ({
    name: variety,
    data: data.map((d) => {
      // TODO fix typescript madness.
      d = d as any;
      if (d[benchmarkName] != null) {
        const b = d[benchmarkName] as any;
        if (b[variety] != null) {
          const v = b[variety];
          if (benchmarkName === "benchmark") {
            const meanValue = v ? v.mean : 0;
            return meanValue || null;
          } else {
            return v;
          }
        }
      }
      return null;
    }),
  })).filter(({ data }) => data.some((y) => y != null));
}

// For columns that have just a single variety
function createColumns1(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName,
): Column[] {
  return [
    {
      name: benchmarkName,
      data: data.map((d) =>
        d[benchmarkName] ? (d[benchmarkName] as number) : null
      ),
    },
  ];
}

function createBinarySizeColumns(data: BenchmarkRun[]): Column[] {
  const propName = "binary_size";
  const last = data[data.length - 1]!;
  const binarySizeNames = Object.keys(last[propName]!);
  return binarySizeNames.map((name) => ({
    name,
    data: data.map((d) => {
      const binarySizeData = d["binary_size"];
      switch (typeof binarySizeData) {
        case "number": // legacy implementation
          return name === "deno" ? binarySizeData : 0;
        default:
          if (!binarySizeData) {
            return null;
          }
          return binarySizeData[name] || null;
      }
    }),
  }));
}

function createThreadCountColumns(data: BenchmarkRun[]): Column[] {
  const propName = "thread_count";
  const last = data[data.length - 1];
  const threadCountNames = Object.keys(last[propName]!);
  return threadCountNames.map((name) => ({
    name,
    data: data.map((d) => {
      const threadCountData = d[propName];
      if (!threadCountData) {
        return null;
      }
      return threadCountData[name] || null;
    }),
  }));
}

function createSyscallCountColumns(data: BenchmarkRun[]): Column[] {
  const propName = "syscall_count";
  const syscallCountNames = Object.keys(data[data.length - 1][propName]!);
  return syscallCountNames.map((name) => ({
    name,
    data: data.map((d) => {
      const syscallCountData = d[propName];
      if (!syscallCountData) {
        return null;
      }
      return syscallCountData[name] || null;
    }),
  }));
}

export function formatFloat(n: number): string {
  return n.toFixed(3);
}

export function formatKB(bytes: number): string {
  return (bytes / 1024).toFixed(2);
}

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export function formatReqSec(reqPerSec: number): string {
  return (reqPerSec / 1000).toFixed(3);
}

export function formatMsec(n: number): string {
  return Math.round(n * 1000).toFixed(0);
}

export function formatPercentage(decimal: number): string {
  return (decimal * 100).toFixed(2);
}

export function formatLogScale(t: number): string {
  return (Math.pow(10, t) / TimeScaleFactor).toFixed(4);
}

export function logScale(columns: Column[]): void {
  for (const col of columns) {
    for (let i = 0; i < col.data.length; i++) {
      if (col.data[i] == null || col.data[i] === 0) {
        continue;
      }
      col.data[i] = Math.log10((col.data[i] as number) * TimeScaleFactor);
    }
  }
}

function renameReqPerSecFields(data: BenchmarkRun[]): void {
  for (const row of data) {
    if (row.req_per_sec === undefined) continue;
    const {
      core_http_bin_ops,
      deno_core_http_bench,
      deno_core_single,
      deno_tcp,
      deno,
      node_http,
      node,
      ...rest
    } = row.req_per_sec;
    row.req_per_sec = {
      core_http_bin_ops: core_http_bin_ops ?? deno_core_http_bench ??
        deno_core_single,
      deno_tcp: deno_tcp ?? deno,
      node_http: node_http ?? node,
      ...rest,
    };
  }
}

const proxyFields: BenchmarkName[] = ["req_per_sec"];
function extractProxyFields(data: BenchmarkRun[]): void {
  for (const row of data) {
    for (const field of proxyFields) {
      const d = row[field];
      if (!d) continue;
      const name = field + "_proxy";
      const newField = {};
      (row as any)[name] = newField;
      for (const k of Object.getOwnPropertyNames(d)) {
        if (k.includes("_proxy")) {
          const d2 = d as any;
          const v = d2[k];
          delete d2[k];
          (newField as any)[k] = v;
        }
      }
    }
  }
}

export interface BenchmarkData {
  execTime: Column[];
  throughput: Column[];
  reqPerSec: Column[];
  normalizedReqPerSec: Column[];
  proxy: Column[];
  maxLatency: Column[];
  normalizedMaxLatency: Column[];
  maxMemory: Column[];
  binarySize: Column[];
  threadCount: Column[];
  syscallCount: Column[];
  bundleSize: Column[];
  cargoDeps: Column[];
  sha1List: string[];
  lspExecTime: Column[];
}

export function reshape(data: BenchmarkRun[]): BenchmarkData {
  // Rename req/s fields that had a different name in the past.
  renameReqPerSecFields(data);
  // Hack to extract proxy fields from req/s fields.
  extractProxyFields(data);

  const normalizedReqPerSec = createNormalizedColumns(data, "req_per_sec");
  const normalizedMaxLatency = createNormalizedColumns(data, "max_latency");

  return {
    execTime: createColumns(data, "benchmark"),
    throughput: createColumns(data, "throughput"),
    reqPerSec: createColumns(data, "req_per_sec"),
    normalizedReqPerSec,
    proxy: createColumns(data, "req_per_sec_proxy"),
    maxLatency: createColumns(data, "max_latency"),
    normalizedMaxLatency,
    maxMemory: createColumns(data, "max_memory"),
    binarySize: createBinarySizeColumns(data),
    threadCount: createThreadCountColumns(data),
    syscallCount: createSyscallCountColumns(data),
    bundleSize: createColumns(data, "bundle_size"),
    cargoDeps: createColumns1(data, "cargo_deps"),
    sha1List: data.map((d) => d.sha1),
    lspExecTime: createColumns(data, "lsp_exec_time"),
  };
}
