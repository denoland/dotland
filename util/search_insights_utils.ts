// Copyright 2022 the Deno authors. All rights reserved. MIT license.

const INSIGHTS_ENDPOINT = "https://insights.algolia.io/1/events";
export const DOTLAND_EVENTS_ENDPOINT = "/search/events";
const ALGOLIA_API_KEY = "2ed789b2981acd210267b27f03ab47da";
const ALGOLIA_APPLICATION_ID = "QFPCRZC6WX";

export interface SearchClickEvent {
  eventType: "click";
  eventName: string;
  userToken?: string;
  index: string;
  timestamp: number;
  queryID: string;
  objectIDs: string[];
  positions: string[];
}

export async function getUserToken(
  headers: Headers,
  hostname: string,
): Promise<string> {
  let ip: string;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    ip = xForwardedFor.split(/\s*,\s*/)[0];
  } else {
    ip = hostname ?? "unknown";
  }
  const data = new TextEncoder().encode(ip);
  const buff = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buff));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function searchView(
  userToken: string | undefined,
  index: string,
  objectID: string,
): void {
  if (!userToken) {
    return;
  }
  queueMicrotask(async () => {
    const event = {
      eventType: "view",
      eventName: `${index} page view`,
      index,
      userToken,
      timestamp: Date.now(),
      objectIDs: [objectID],
    };
    const body = JSON.stringify({ events: [event] });
    const res = await fetch(INSIGHTS_ENDPOINT, {
      method: "POST",
      headers: {
        "x-algolia-api-key": ALGOLIA_API_KEY,
        "x-algolia-application-id": ALGOLIA_APPLICATION_ID,
        "content-type": "application/json",
      },
      body,
    });
    if (res.status !== 200) {
      console.error(
        "failed to post view event:",
        res.status,
        res.statusText,
      );
    }
  });
}

export function searchClick(userToken: string, event: SearchClickEvent): void {
  event.userToken = userToken;
  queueMicrotask(async () => {
    const body = JSON.stringify({ events: [event] });
    const res = await fetch(INSIGHTS_ENDPOINT, {
      method: "POST",
      headers: {
        "x-algolia-api-key": ALGOLIA_API_KEY,
        "x-algolia-application-id": ALGOLIA_APPLICATION_ID,
        "content-type": "application/json",
      },
      body,
    });
    if (res.status !== 200) {
      console.error(
        "failed to post view event:",
        res.status,
        res.statusText,
      );
    }
  });
}

/**
 * Report a search click back to dotland.
 *
 * @param index the name of the index that was clicked
 * @param queryID the query ID that resulted in the list
 * @param objectID the object ID of the search result
 * @param position the absolute position of search item in the results
 */
export async function islandSearchClick(
  index: string,
  queryID: string | undefined,
  objectID: string,
  position: number | undefined,
): Promise<void> {
  if (!queryID || !position) {
    return;
  }
  const event = {
    eventType: "click",
    eventName: `${index} search click`,
    index,
    timestamp: Date.now(),
    queryID,
    objectIDs: [objectID],
    positions: [position],
  };
  const body = JSON.stringify(event);
  try {
    const res = await fetch(DOTLAND_EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    if (res.status !== 200) {
      console.error("failed to post search click:", res.status, res.statusText);
    }
  } catch (e) {
    if (e instanceof TypeError) {
      console.warn(
        "Unable to report search events, most likely due to an ad blocker.",
      );
    } else {
      console.error("An unexpected error occurred.", e);
    }
  }
}
