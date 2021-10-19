import { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";

const INTERVAL = 20_000; // 20 seconds.
const DB = new Map<string, Event[]>();
const REGION = Deno.env.get("DENO_REGION")!;
const GA_SECRET = Deno.env.get("GA_API_SECRET")!;
const GA_ID = Deno.env.get("GA_MEASUREMENT_ID")!;
let DATA_BEING_SENT = false;

// Send data every 20 seconds.
setInterval(async () => {
  if (GA_SECRET && !DATA_BEING_SENT) {
    await sendData();
  }
}, INTERVAL);

interface PageView {
  page_location: string;
  page_referrer: string;
  region: string;
}

interface Event {
  name: string;
  params: PageView;
}

/** Construct and store the page_view event in memory. */
export async function gatherRequestData(req: Request, connInfo: ConnInfo) {
  const { pathname } = new URL(req.url);
  // @ts-ignore Property hostname doesn't exist type error
  const ip = connInfo.remoteAddr.hostname as string;
  const referer = req.headers.get("Referer") ?? "Direct";
  const userId = await getHash(ip);
  const event = {
    name: "page_view",
    params: {
      page_location: pathname,
      page_referrer: referer,
      region: REGION,
    },
  };
  if (DB.has(userId)) {
    const events = DB.get(userId)!;
    events.push(event);
    DB.set(userId, events);
  } else {
    DB.set(userId, [event]);
  }
}

/** Returns sha-1 hash of an IP address. */
export async function getHash(ip: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(ip),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
}

/** Send in memory page_view events to Google Analytics. */
export async function sendData() {
  const requests = [];
  const url =
    `https://www.google-analytics.com/mp/collect?&measurement_id=${GA_ID}&api_secret=${GA_SECRET}`;

  const uniqueUsers = DB.size;
  for (const userId of DB.keys()) {
    DATA_BEING_SENT = true;
    const pageViewEvents = DB.get(userId);
    requests.push(fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "client_id": "deno.land",
        "user_id": userId,
        "events": pageViewEvents,
      }),
    }));
    DB.delete(userId);
  }
  try {
    if (requests.length > 0) {
      const start = performance.now();
      await Promise.all(requests);
      const timeTaken = performance.now() - start;
      console.log(
        `Took ${timeTaken}ms to upload data for ${uniqueUsers} users`,
      );
      DATA_BEING_SENT = false;
    }
  } catch (err) {
    console.error("Failed to upload data to GA:", err);
  }
}
