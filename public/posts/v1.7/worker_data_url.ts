import { deferred } from "https://deno.land/std@0.83.0/async/deferred.ts";
import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";

const promise = deferred();
const tsWorker = new Worker(
  `data:application/typescript;base64,${btoa(`
    if (self.name !== "tsWorker") {
      throw Error(\`Invalid worker name: \${self.name}, expected tsWorker\`);
    }
    onmessage = function (e): void {
      postMessage(e.data);
      close();
    };
  `)}`,
  { type: "module", name: "tsWorker" }
);

tsWorker.onmessage = (e): void => {
  assertEquals(e.data, "Hello World");
  promise.resolve();
};

tsWorker.postMessage("Hello World");

await promise;
tsWorker.terminate();
