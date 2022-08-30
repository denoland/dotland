// Copyright 2022 the Deno authors. All rights reserved. MIT license.

const INSIGHTS_ENDPOINT = "https://insights.algolia.io/1/events";
const ALGOLIA_API_KEY = "2ed789b2981acd210267b27f03ab47da";
const ALGOLIA_APPLICATION_ID = "QFPCRZC6WX";

/**
 * Report the search click event to algolia.
 *
 * @param userToken the current user token
 * @param index the name of the index that was clicked
 * @param queryID the query ID that resulted in the list
 * @param objectID the object ID of the search result
 * @param position the absolute position of search item in the results
 */
export async function searchClick(
  userToken: string | undefined,
  index: string,
  queryID: string | undefined,
  objectID: string,
  position: number | undefined,
): Promise<void> {
  if (!userToken || !queryID || !position) {
    return;
  }
  const event = {
    eventType: "click",
    eventName: `${index} search click`,
    index,
    userToken,
    timestamp: Date.now(),
    queryID,
    objectIDs: [objectID],
    positions: [position],
  };
  const body = JSON.stringify({ events: [event] });
  try {
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
