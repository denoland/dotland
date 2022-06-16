/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */
import { accepts } from "$oak_commons";
import type { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";
import { createReporter, Reporter } from "$ga";
import type { Event } from "$ga4";
import {
  formatStatus,
  GA4Report,
  isDocument,
  isRedirect,
  isServerError,
} from "$ga4";

/**
 * Helper functions.
 */

export function isHtmlRequest(req: Request) {
  return accepts(req, "application/*", "text/html") === "text/html";
}

export function isNonAssetRequest(req: Request, res: Response) {
  const { pathname } = new URL(req.url);
  return pathname === "/" ||
    pathname.startsWith("/std") ||
    pathname.startsWith("/x") || isHtmlRequest(req) || res.status >= 400;
}

export function isBot(req: Request) {
  const accept = req.headers.get("accept");
  const referer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");
  return referer == null &&
    (userAgent == null || !userAgent.startsWith("Mozilla/")) &&
    (accept == null || accept === "*/*");
}

export function getBotName(req: Request) {
  const userAgent = req.headers.get("user-agent");
  return userAgent?.replace(/[^\w\-].*$/, "") ?? "(unknown bot)";
}

// Makes up a document title based on the returned content type, and whether or
// not an error happened. Example of document titles it can return are "html",
// "javascript", "typescript", "wasm", and "not found".
export function getDocumentTitle(req: Request, res: Response): string {
  if (!res.ok) {
    return res.statusText.toLowerCase();
  } else if (isHtmlRequest(req)) {
    return "html";
  } else {
    const contentType = res.headers.get("content-type") ?? "";
    return /^application\/(.*?)(?:;|$)/i.exec(contentType)?.[1] ?? "";
  }
}

/**
 * Create GA3 reporters.
 */

const gaForBots = createReporter({
  id: Deno.env.get("GA_TRACKING_ID_FOR_BOTS"),
  filter(req, _res) {
    return isBot(req);
  },
  metaData(req, res) {
    return {
      campaignMedium: "Bot",
      campaignSource: getBotName(req),
      documentTitle: getDocumentTitle(req, res),
    };
  },
});

const gaForHumans = createReporter({
  id: Deno.env.get("GA_TRACKING_ID_FOR_HUMANS"),
  filter(req, res) {
    return !isBot(req) && isNonAssetRequest(req, res);
  },
  metaData(req, res) {
    return { documentTitle: getDocumentTitle(req, res) };
  },
});

const ga: Reporter = async (...args) => {
  await Promise.all([gaForBots(...args), gaForHumans(...args)]);
};

// Create GA4 reporter.
function ga4(
  request: Request,
  conn: ConnInfo,
  response: Response,
  _start: number,
  error?: unknown,
) {
  Promise.resolve().then(async () => {
    // We're tracking page views and file downloads. These are the only two
    // HTTP methods that _might_ be used.
    if (!/^(GET|POST)$/.test(request.method)) {
      return;
    }

    const bot = isBot(request);
    const botName = bot ? getBotName(request) : null;

    // If the visitor is using a web browser, only create events when we serve
    // a top level documents or download; skip assets like css, images, fonts.
    if (!bot && !isDocument(request, response) && error == null) {
      return;
    }

    let event: Event | null = null;
    if (isRedirect(response)) {
      const redirectLocation = response.headers.get("location");
      event = { name: "redirect", params: { redirectLocation } };
    } else if (bot) {
      event = { name: "file_download", params: {} };
    } else {
      const fetchDest = request.headers.get("sec-fetch-dest");
      if (fetchDest) {
        if (/^(document|i?frame|video)$/.test(fetchDest)) {
          event = { name: "page_view", params: {} };
        } else {
          event = null; // Don't report asset downloads.
        }
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType != null && /text\/html/.test(contentType)) {
          event = { name: "page_view", params: {} }; // Probably an old browser.
        } else {
          event = { name: "file_download", params: {} };
        }
      }
    }

    if (event == null && error == null) {
      return;
    }

    if (event != null) {
      // And add some extra HTTP metadata to the event.
      event.params.httpRequestMethod = request.method;
      event.params.httpResponseStatus = formatStatus(response);

      // Add client type classification to the event.
      if (botName === "Deno") {
        event.params.clientType = "deno";
      } else if (bot) {
        event.params.clientType = "other";
      } else {
        event.params.clientType = "browser";
      }
    }

    // If an exception was thrown, build a separate event to report it.
    let exceptionEvent;
    if (error != null) {
      exceptionEvent = {
        name: "exception",
        params: {
          description: String(error),
          fatal: isServerError(response),
        },
      };
    } else {
      exceptionEvent = undefined;
    }

    // Create basic report.
    const report = new GA4Report({ request, response, conn });

    // Override the default (page_view) event.
    report.event = event;

    // Add the exception event, if any.
    if (exceptionEvent != null) {
      report.events.push(exceptionEvent);
    }

    await report.send();
  }).catch((err) => {
    console.error(`Internal error: ${err}`);
  });
}

// Main function to handle all GA events.
export function withLog(
  handler: (
    request: Request,
    connInfo: ConnInfo,
  ) => Response | Promise<Response>,
): (request: Request, connInfo: ConnInfo) => Promise<Response> {
  return async (req, con) => {
    let err: unknown;
    let res!: Response;
    const start = performance.now();
    try {
      res = await handler(req, con);
    } catch (e) {
      err = e;
      console.error(err);
      res = new Response(
        "500 Internal Server Error\nPlease try again later.",
        { status: 500 },
      );
    } finally {
      ga(req, con, res, start, err);
      ga4(req, con, res, start, err);
    }
    return res;
  };
}
