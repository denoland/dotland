import { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.112.0/crypto/mod.ts";

interface Visitor {
  ip: string;
  ua: string;
  events: Event[];
}

type Event = PageViewEvent | ExceptionEvent;
interface PageViewEvent {
  name: "page_view";
  params: {
    page_location: string;
    page_referrer: string | undefined;
    page_title: string;
  };
}
interface ExceptionEvent {
  name: "exception";
  params: {
    description: string;
    fatal: boolean;
  };
}

const GA_API_SECRET = Deno.env.get("GA_API_SECRET")!;
const GA_MEASUREMENT_ID = Deno.env.get("GA_MEASUREMENT_ID")!;
const GA_MAX_EVENTS = 32;

if (GA_API_SECRET == null) {
  console.error("GA_API_SECRET not set");
}
if (GA_MEASUREMENT_ID == null) {
  console.error("GA_MEASUREMENT_ID not set");
}

const uploadQueue = new Map<string, Visitor>();
let uploading = false;

/** Construct and store the page_view event in memory. */
export function reportAnalytics(
  req: Request,
  connInfo: ConnInfo,
  response: Response,
  error: unknown,
) {
  if (GA_MEASUREMENT_ID == null || GA_API_SECRET == null) {
    return;
  }

  const ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
  const ua = req.headers.get("user-agent") ?? "";

  let event: PageViewEvent | ExceptionEvent;

  if (response.status >= 400 || error !== undefined) {
    let description = `HTTP ${response.status} ${response.statusText}`;
    if (error) {
      description = `${description} (${String(error)})`;
    }
    event = {
      name: "exception",
      params: { description, fatal: true },
    };
  } else {
    const referer = req.headers.get("referer") ?? undefined;
    event = {
      name: "page_view",
      params: {
        page_location: req.url,
        page_referrer: referer,
        page_title: new URL(req.url).pathname,
      },
    };
  }

  const key = `${ip}+${ua}`;
  let visitor = uploadQueue.get(key);
  if (visitor == null) {
    visitor = { ip, ua, events: [] };
    uploadQueue.set(key, visitor);
  }
  visitor.events.push(event);

  scheduleUpload();
}

function scheduleUpload() {
  if (!uploading) {
    uploading = true;
    setTimeout(upload, 1000);
  }
}

/** Send in memory page_view events to Google Analytics. */
export async function upload() {
  while (uploadQueue.size > 0) {
    const requests = [];
    let eventCount = 0;

    for (const { ip, ua, events } of uploadQueue.values()) {
      eventCount += events.length;

      const urlParams = new URLSearchParams({
        measurement_id: GA_MEASUREMENT_ID,
        api_secret: GA_API_SECRET,
      });
      const url = `https://www.google-analytics.com/mp/collect?${urlParams}`;

      while (events.length > 0) {
        const body = {
          client_id: "deno.land",
          user_id: hash(ip),
          events: events.splice(0, GA_MAX_EVENTS),
        };
        const init = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify(body),
        };
        const fetchPromise = fetch(url, init);
        fetchPromise.then(async (r) =>
          console.log(url, init, r.status, await r.text())
        );
        requests.push(fetchPromise);
      }
    }

    uploadQueue.clear();

    const start = performance.now();
    const results = await Promise.allSettled(requests);
    const elapsed = performance.now() - start;

    console.log(`GA: uploaded ${eventCount} events in ${elapsed} ms.`);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error(result.reason);
      } else if (![200, 204].includes(result.value.status)) {
        console.error(`HTTP ${result.value.status} ${result.value.statusText}`);
      }
    }
  }

  uploading = false;
}

const encoder = new TextEncoder();

/** Returns the SHA-1 hash of a string. */
function hash(text: string): string {
  const textBuf = encoder.encode(text);
  const hashBuf = crypto.subtle.digestSync("SHA-1", textBuf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashStr = hashArr
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashStr;
}
