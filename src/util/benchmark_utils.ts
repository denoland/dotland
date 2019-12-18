// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.

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
  max_latency?: BenchmarkVariantsResultSet;
  req_per_sec?: BenchmarkVariantsResultSet;
  req_per_sec_proxy?: BenchmarkVariantsResultSet;
  syscall_count?: BenchmarkVariantsResultSet;
  thread_count?: BenchmarkVariantsResultSet;
  throughput?: BenchmarkVariantsResultSet;
}

export type BenchmarkName = Exclude<keyof BenchmarkRun, "created_at" | "sha1">;

export interface Column {
  name: string;
  data: Array<number | null>;
}

function getBenchmarkVarieties(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName
): string[] {
  // Look at last sha hash.
  const last = data[data.length - 1];
  return Object.keys(last[benchmarkName]!);
}

function createColumns(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName
): Column[] {
  const varieties = getBenchmarkVarieties(data, benchmarkName);
  return varieties.map(variety => ({
    name: variety,
    data: data.map(d => {
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
    })
  }));
}

export function createNormalizedColumns(
  data: BenchmarkRun[],
  benchmarkName: BenchmarkName,
  baselineBenchmark: BenchmarkName,
  baselineVariety: string
): Column[] {
  const varieties = getBenchmarkVarieties(data, benchmarkName);
  return varieties.map(variety => ({
    name: variety,
    data: data.map(d => {
      if (d[baselineBenchmark] != null) {
        const bb = d[baselineBenchmark] as any;
        if (bb[baselineVariety] != null) {
          const baseline = bb[baselineVariety];
          if (d[benchmarkName] != null) {
            const b = d[benchmarkName] as any;
            if (b[variety] != null && baseline !== 0) {
              const v = b[variety];
              if (benchmarkName === "benchmark") {
                const meanValue = v ? v.mean : 0;
                return meanValue || null;
              } else {
                return v / baseline;
              }
            }
          }
        }
      }
      return null;
    })
  }));
}
function createBinarySizeColumns(data: BenchmarkRun[]): Column[] {
  const propName = "binary_size";
  const last = data[data.length - 1]!;
  const binarySizeNames = Object.keys(last[propName]!);
  return binarySizeNames.map(name => ({
    name,
    data: data.map(d => {
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
    })
  }));
}

function createThreadCountColumns(data: BenchmarkRun[]): Column[] {
  const propName = "thread_count";
  const last = data[data.length - 1];
  const threadCountNames = Object.keys(last[propName]!);
  return threadCountNames.map(name => ({
    name,
    data: data.map(d => {
      const threadCountData = d[propName];
      if (!threadCountData) {
        return null;
      }
      return threadCountData[name] || null;
    })
  }));
}

function createSyscallCountColumns(data: BenchmarkRun[]): Column[] {
  const propName = "syscall_count";
  const syscallCountNames = Object.keys(data[data.length - 1][propName]!);
  return syscallCountNames.map(name => ({
    name,
    data: data.map(d => {
      const syscallCountData = d[propName];
      if (!syscallCountData) {
        return null;
      }
      return syscallCountData[name] || null;
    })
  }));
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
          let d2 = d as any;
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
  normalizedProxy: Column[];
  maxLatency: Column[];
  maxMemory: Column[];
  binarySize: Column[];
  threadCount: Column[];
  syscallCount: Column[];
  bundleSize: Column[];
  sha1List: string[];
}

export function reshape(data: BenchmarkRun[]): BenchmarkData {
  // hack to extract proxy fields from req/s fields
  extractProxyFields(data);

  const normalizedReqPerSec = createNormalizedColumns(
    data,
    "req_per_sec",
    "req_per_sec",
    "hyper"
  );
  const normalizedProxy = createNormalizedColumns(
    data,
    "req_per_sec_proxy",
    "req_per_sec",
    "hyper"
  );

  return {
    execTime: createColumns(data, "benchmark"),
    throughput: createColumns(data, "throughput"),
    reqPerSec: createColumns(data, "req_per_sec"),
    normalizedReqPerSec,
    proxy: createColumns(data, "req_per_sec_proxy"),
    normalizedProxy,
    maxLatency: createColumns(data, "max_latency"),
    maxMemory: createColumns(data, "max_memory"),
    binarySize: createBinarySizeColumns(data),
    threadCount: createThreadCountColumns(data),
    syscallCount: createSyscallCountColumns(data),
    bundleSize: createColumns(data, "bundle_size"),
    sha1List: data.map(d => d.sha1)
  };
}
