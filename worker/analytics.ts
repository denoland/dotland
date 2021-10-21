import { delay } from "https://deno.land/std@0.112.0/async/mod.ts";

const GA_BATCH_ENDPOINT = "https://www.google-analytics.com/batch";
const GA_TRACKING_ID = Deno.env.get("GA_TRACKING_ID")!;

const GA_MAX_PARAM_LENGTH = 2048; // 2kb;
const GA_MAX_PAYLOAD_LENGTH = 8092; // 8kb
const GA_MAX_BATCH_PAYLOAD_COUNT = 20;
const GA_MAX_BATCH_BODY_LENGTH = 16386; // 16kb.

const encoder = new TextEncoder();
const uploadQueue: Uint8Array[] = [];
let uploading = false;

const ignoredPaths = [
  "/_next",
];

/** Construct and store the page_view event in memory. */
export async function reportAnalytics(
  req: Request,
  res: Response,
  err: unknown,
) {
  const { pathname } = new URL(req.url);
  const ignorePath = ignoredPaths.find((path) => pathname.startsWith(path));
  if (ignorePath) {
    return;
  }

  let exception;
  if (res.status >= 400) {
    exception = `${res.status} ${res.statusText}`;
    if (err != null) {
      exception = `${exception} (${String(err)})`;
    }
  }
  const ip = req.headers.get("x-forwarded-for")!;
  // TODO: add timing info.
  const info = {
    v: 1, // Version, should be 1.
    tid: GA_TRACKING_ID,
    t: "pageview", // Event type.
    dl: req.url,
    ua: req.headers.get("user-agent"),
    cid: await getHash(ip), // GA requires `cid` to be set.
    uip: ip,
    aip: 1, // Anonymize the visitor's IP address.
    dr: req.headers.get("referer"),
    exd: exception,
    // The time delta (in ms) between when the hit being reported occurred
    // and the time the hit was sent.
    qt: 1000,
  };
  // Build GA request payload.
  const entries = Object.entries(info)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => [k, String(v).slice(0, GA_MAX_PARAM_LENGTH)]);
  const params = new URLSearchParams(entries);
  const line = params.toString() + "\n";
  const payload = encoder.encode(line);
  if (payload.length > GA_MAX_PAYLOAD_LENGTH) {
    console.error("GA: payload exceeds maximimum size: " + payload);
    return;
  }
  // Add to upload queue.
  uploadQueue.push(payload);
  // Schedule upload if it isn't already running.
  if (!uploading) {
    uploading = true;
    setTimeout(upload, 1000);
  }
}

/** Returns sha-1 hash of an IP address. */
async function getHash(ip: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(ip),
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const batchBuffer = new Uint8Array(GA_MAX_BATCH_BODY_LENGTH);

async function upload() {
  while (uploadQueue.length > 0) {
    // Build batch upload body.
    let payloadCount = 0;
    let bodyLength = 0;
    while (
      payloadCount < Math.min(uploadQueue.length, GA_MAX_BATCH_PAYLOAD_COUNT)
    ) {
      const payload = uploadQueue[payloadCount];
      if (bodyLength + payload.length > GA_MAX_BATCH_BODY_LENGTH) break;
      batchBuffer.set(payload, bodyLength);
      payloadCount += 1;
      bodyLength += payload.length;
    }
    const body = batchBuffer.subarray(0, bodyLength);

    try {
      const start = performance.now();
      const response = await fetch(GA_BATCH_ENDPOINT, { method: "POST", body });
      const elapsed = performance.now() - start;
      console.log(
        `GA: batch uploaded ${payloadCount} items in ${elapsed}ms. Response: ${response.status} ${response.statusText}`,
      );
      // Google says not to retry when it reports a non-200 status code.
      uploadQueue.splice(0, payloadCount);
    } catch (err) {
      console.error(`GA: batch upload failed: ${err}`);
      await delay(1000);
    }
  }
  uploading = false;
}
