const workerUrl = new URL("worker_permissions_worker.ts", import.meta.url).href;
const worker = new Worker(workerUrl, {
  type: "module",
  deno: {
    namespace: true,
    permissions: {
      read: true,
    },
  },
});

worker.postMessage({ cmd: "readFile", fileName: "./log.txt" });
