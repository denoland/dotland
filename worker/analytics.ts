import { delay } from "https://deno.land/std@0.112.0/async/mod.ts";
import {
  ConnInfo,
  STATUS_TEXT,
} from "https://deno.land/std@0.112.0/http/mod.ts";

const GA_TRACKING_ID = Deno.env.get("GA_TRACKING_ID")!;
if (!GA_TRACKING_ID) {
  console.log("GA_TRACKING_ID not set, Google Analytics reporting disabled.");
}

const GA_BATCH_ENDPOINT = "https://www.google-analytics.com/batch";
const GA_MAX_PARAM_LENGTH = 2048; // 2kb
const GA_MAX_PAYLOAD_LENGTH = 8092; // 8kb
const GA_MAX_BATCH_PAYLOAD_COUNT = 20;
const GA_MAX_BATCH_LENGTH = 16386; // 16kb

const UPLOAD_DELAY = 1000; // msec

const encoder = new TextEncoder();
const uploadQueue: Uint8Array[] = [];
let uploading = false;

/** Construct and store the page_view event in memory. */
export async function reportAnalytics(
  req: Request,
  con: ConnInfo,
  res: Response,
  srt: number,
  err: unknown,
) {
  if (GA_TRACKING_ID == null) {
    return; // Google analytics tracking disabled.
  }

  // Request headers.
  const { pathname } = new URL(req.url);
  const accept = req.headers.get("accept");
  const referer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");

  // Response headers.
  const { ok, status } = res;
  const statusText = res.statusText || STATUS_TEXT.get(status) || `${status}`;
  const contentType = res.headers.get("content-type");
  const isHtml = /html/i.test(contentType ?? "");

  // Don't report anything to GA if response has 1xx/3xx status.
  if (!(ok || status >= 400)) {
    return;
  }

  // Report errors, including error message in case of a thrown exception.
  let exception;
  if (status >= 400) {
    exception = `${status} ${statusText}`;
    if (err != null) {
      exception = `${exception} (${String(err)})`;
    }
  }

  // Don't track css, images etc.
  if (
    !(
      pathname === "/" || pathname.startsWith("/std") ||
      pathname.startsWith("/x") || isHtml || exception != null
    )
  ) {
    return;
  }

  // Set the page title to "website" or "javascript" or "typescript" or wasm".
  let pageTitle;
  if (!ok) {
    pageTitle = statusText.toLowerCase();
  } else if (isHtml) {
    pageTitle = "website";
  } else if (contentType != null) {
    pageTitle = /^application\/(.*?)(?:;|$)/i.exec(contentType)?.[1];
  }

  // Files downloaded by a bot (deno, curl) get a special medium/source tag.
  let campaignMedium;
  let campaignSource;
  if (
    referer == null &&
    (userAgent == null || !userAgent.startsWith("Mozilla/")) &&
    (accept == null || accept === "*/*")
  ) {
    campaignMedium = "Bot";
    campaignSource = userAgent?.replace(/[^\w\-].*$/, "");
  }

  // TODO(piscisaureus): validate that the 'cf-connecting-ip' header was
  // actually set by cloudflare. See https://www.cloudflare.com/en-gb/ips/.
  const ip = req.headers.get("cf-connecting-ip") ||
    (con.remoteAddr as Deno.NetAddr).hostname;

  const info = {
    v: 1, // Version, should be 1.
    tid: GA_TRACKING_ID,
    t: "pageview", // Event type.
    cid: await getHash(ip), // GA requires `cid` to be set.
    uip: ip,
    dl: req.url,
    dt: pageTitle,
    dr: referer,
    cm: campaignMedium,
    cs: campaignSource,
    ua: userAgent,
    exd: exception,
    exf: exception != null,
    srt, // Server response time (in ms).
    qt: uploading ? 0 : UPLOAD_DELAY, // Delay before uploading event (in ms).
  };

  // Build GA request payload.
  const entries = Object.entries(info)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => [k, String(v).slice(0, GA_MAX_PARAM_LENGTH)]);
  const params = new URLSearchParams(entries);
  const line = params.toString() + "\n";
  const payload = encoder.encode(line);
  if (payload.length > GA_MAX_PAYLOAD_LENGTH) {
    console.error("GA: payload exceeds maximum size: " + payload);
    return;
  }

  // Add to upload queue.
  uploadQueue.push(payload);
  // Schedule upload if it isn't already running.
  if (!uploading) {
    uploading = true;
    setTimeout(upload, UPLOAD_DELAY);
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

const batchBuffer = new Uint8Array(GA_MAX_BATCH_LENGTH);

async function upload() {
  while (uploadQueue.length > 0) {
    // Build batch upload body.
    let payloadCount = 0;
    let bodyLength = 0;
    while (
      payloadCount < Math.min(uploadQueue.length, GA_MAX_BATCH_PAYLOAD_COUNT)
    ) {
      const payload = uploadQueue[payloadCount];
      if (bodyLength + payload.length > GA_MAX_BATCH_LENGTH) break;
      batchBuffer.set(payload, bodyLength);
      payloadCount += 1;
      bodyLength += payload.length;
    }
    const body = batchBuffer.subarray(0, bodyLength);

    try {
      const start = performance.now();
      const response = await fetch(GA_BATCH_ENDPOINT, { method: "POST", body });
      const elapsed = performance.now() - start;

      // Log slow and failed uploads.
      if (response.status !== 200 || elapsed >= 1000) {
        console.log(
          `GA: batch uploaded ${payloadCount} items in ${elapsed}ms. ` +
            `Response: ${response.status} ${response.statusText}`,
        );
      }

      // Google says not to retry when it reports a non-200 status code.
      uploadQueue.splice(0, payloadCount);
    } catch (err) {
      console.error(`GA: batch upload failed: ${err}`);
      await delay(UPLOAD_DELAY);
    }
  }
  uploading = false;
}
