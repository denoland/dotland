// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { delay } from "https://deno.land/std@0.120.0/async/mod.ts";
import * as colors from "https://deno.land/std@0.120.0/fmt/colors.ts";
import { STATUS_TEXT } from "https://deno.land/std@0.120.0/http/http_status.ts";
import type { Context } from "https://deno.land/x/oak@v10.1.0/context.ts";
import type { Middleware } from "https://deno.land/x/oak@v10.1.0/middleware.ts";

const GA_TRACKING_ID = "GA_TRACKING_ID";
const GA_BATCH_ENDPOINT = "https://www.google-analytics.com/batch";
const GA_MAX_PARAM_LENGTH = 2_048; // 2kb
const GA_MAX_PAYLOAD_LENGTH = 8_092; // 8kb
const GA_MAX_BATCH_PAYLOAD_COUNT = 20;
const GA_MAX_BATCH_LENGTH = 16_386; // 16kb
const UPLOAD_DELAY = 1_000;
const SLOW_UPLOAD_THRESHOLD = 1_000;

/** A narrowed down version of `Deno.Conn` which only contains the information
 * which the library usages. */
export interface Conn {
  readonly remoteAddr: Deno.Addr;
}

/** The shape of the Google Analytics measurement that is supported.
 *
 * Ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
 */
interface GAMeasurement {
  v: 1;
  tid: string;
  t:
    | "pageview"
    | "screenview"
    | "event"
    | "transaction"
    | "item"
    | "social"
    | "exception"
    | "timing";
  cid: string;
  uip: string;
  dl: string;
  dt?: string;
  dr?: string | null;
  cm?: string;
  cs?: string;
  ua?: string | null;
  exd?: string;
  exf: boolean;
  srt: number;
  qt: number;
}

/** Specialized data fields that are supported being set via a callback. */
export interface MetaData {
  /** The value to be assigned to the `cm` field in the measurement payload. */
  campaignMedium?: string;
  /** The value to be assigned to the `cs` field in the measurement payload. */
  campaignSource?: string;
  /** The value to be assigned to the `dt` field in the measurement payload. */
  documentTitle?: string;
}

/** The interface returned from `createReporter()` that is then called to
 * enqueue measurement messages to be sent to Google Analytics. */
export interface Reporter {
  /**
   * A reporter function which will asynchronously dispatch measurement messages
   * to Google Analytics.
   *
   * @param req the web standard request received
   * @param conn the connection information of the request
   * @param res the web standard response being sent
   * @param start the time in milliseconds when the request started being
   *              handled
   * @param error any error associated with handling the request/response
   * @returns a promise that resolves when the measurement is enqueued to be
   *          sent to Google Analytics.
   */
  (
    req: Request,
    conn: Conn,
    res: Response,
    start: number,
    error?: unknown,
  ): Promise<void>;
}

/** Options which can be supplied to the `createReporter()` factory function. */
export interface ReporterOptions {
  /** The batch Google Analytics endpoint to send messages to.  This defaults
   * to `https://www.google-analytics.com/batch`. */
  endpoint?: string;
  /** An optional callback which determines if a particular request should
   * generate a measurement message.
   *
   * @param req the current `Request` object.
   * @param res the current `Response` object.
   * @returns `true` if the request should generate a measurement, or `false`.
   */
  filter?(req: Request, res: Response): boolean;
  /** The Google Analytics web property ID. This defaults to being read from the
   * `GA_TRACKING_ID` environment variable. If neither the property ID is passed
   * nor is the environment variable set, dispatching will be disabled. */
  id?: string;
  /** An optional function/method for logging warning messages generated from
   * the library. This defaults to logging to `console.warn()`. */
  log?(msg: string): void;
  /** An optional callback which provides optional data to enrich the
   * measurement message.
   *
   * @param req the current `Request` object.
   * @param res the current `Response` object.
   * @returns The meta data to enrich the measurement, or `undefined`.
   */
  metaData?(req: Request, res: Response): MetaData | undefined;
  /** A boolean which defaults to `true` that indicates if the library should
   * log warning messages or not. */
  warn?: boolean;
}

/** Options which can be supplied to the `createReporterMiddleware()` factory
 * function. */
export interface ReportMiddlewareOptions {
  /** The batch Google Analytics endpoint to send messages to.  This defaults
   * to `https://www.google-analytics.com/batch`. */
  endpoint?: string;
  /** An optional callback which determines if a particular request should
   * generate a measurement message.
   *
   * @param ctx the context related to the request/response being processed
   * @returns `true` if the request should generate a measurement, or `false`.
   */
  filter?(ctx: Context): boolean;
  /** The Google Analytics web property ID. This defaults to being read from the
   * `GA_TRACKING_ID` environment variable. If neither the property ID is passed
   * nor is the environment variable set, dispatching will be disabled. */
  id?: string;
  /** An optional function/method for logging warning messages generated from
   * the library. This defaults to logging to `console.warn()`. */
  log?(msg: string): void;
  /** An optional callback which provides optional data to enrich the
   * measurement message.
   *
   * @param ctx the context related to the request/response being processed
   * @returns The meta data to enrich the measurement, or `undefined`.
   */
  metaData?(ctx: Context): MetaData | undefined;
  /** A boolean which defaults to `true` that indicates if the library should
   * log warning messages or not. */
  warn?: boolean;
}

const encoder = new TextEncoder();
const batch = new Uint8Array(GA_MAX_BATCH_LENGTH);
const queue: Uint8Array[] = [];
let uploading = false;

/** Create a queue that dispatches queued messages to the endpoint, returning
 * the enqueue function. */
function createEnqueue(
  endpoint: string,
  log: (msg: string) => void,
  warn: boolean,
) {
  async function upload() {
    while (queue.length) {
      let count = 0;
      let length = 0;
      while (count < Math.min(queue.length, GA_MAX_BATCH_PAYLOAD_COUNT)) {
        const payload = queue[count];
        if (length + payload.length > GA_MAX_BATCH_LENGTH) {
          break;
        }
        batch.set(payload, length);
        count += 1;
        length += payload.length;
      }
      const body = batch.subarray(0, length);

      try {
        const start = performance.now();
        const res = await fetch(endpoint, { method: "POST", body });
        const duration = performance.now() - start;

        if ((res.status !== 200 || duration >= SLOW_UPLOAD_THRESHOLD) && warn) {
          log(
            `batch uploaded ${count} items in ${duration}ms. Response: ${res.status} ${res.statusText}`,
          );
        }

        // Google says not to retry when it reports a non-200 status code.
        queue.splice(0, count);
      } catch (err) {
        if (warn) {
          log(`batch upload failed: ${err}`);
        }
        await delay(UPLOAD_DELAY);
      }
    }
    uploading = false;
  }

  return function enqueue(payload: Uint8Array) {
    queue.push(payload);

    if (!uploading) {
      uploading = true;
      setTimeout(upload, UPLOAD_DELAY);
    }
  };
}

function defaultLog(msg: string) {
  console.warn(`[ga] ${colors.yellow("warn")}: ${msg}`);
}

/** Create a SHA-1 hex string digest of the supplied message. */
async function toDigest(msg: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-1", encoder.encode(msg));
  return Array.from(new Uint8Array(buffer)).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/** Convert a Google Analytics message into a Uint8Array. */
function toPayload(message: GAMeasurement): Uint8Array {
  const entries = Object.entries(message).filter(([, v]) => v).map((
    [k, v],
  ) => [k, String(v).slice(0, GA_MAX_PARAM_LENGTH)]) as [string, string][];
  const params = new URLSearchParams(entries);
  const item = `${params.toString()}\n`;
  return encoder.encode(item);
}

/** Convert a response status, status text and error into an "exception"
 * string. */
function toException(
  status: number,
  statusText: string,
  error: unknown,
): string | undefined {
  let exception;
  if (status >= 400) {
    exception = `${status} ${statusText}`;
    if (error != null) {
      exception += ` (${String(error)})`;
    }
  }
  return exception;
}

/** Create and return a function which will dispatch messages to Google
 * Analytics.
 *
 * ### Examples
 *
 * #### Using `std/http`
 *
 * ```ts
 * import { createReporter } from "https://deno.land/x/g_a/mod.ts";
 * import { serve } from "https://deno.land/std/http/server.ts";
 * import type { ConnInfo } from "https://deno.land/std/http/server.ts";
 *
 * const ga = createReporter();
 *
 * function handler(req: Request, conn: ConnInfo) {
 *   let err;
 *   let res: Response;
 *   const start = performance.now();
 *   try {
 *     // processing of the request...
 *     res = new Response();
 *   } catch (e) {
 *     err = e;
 *   } finally {
 *     ga(req, conn, res!, start, err);
 *   }
 *   return res!;
 * }
 *
 * serve(handler);
 * ```
 *
 * #### Using low level APIs
 *
 * ```ts
 * import { createReporter } from "https://deno.land/x/g_a/mod.ts";
 *
 * const ga = createReporter();
 *
 * for await (const conn of Deno.listen({ port: 0 })) {
 *   (async () => {
 *     const httpConn = Deno.serveHttp(conn);
 *     for await (const requestEvent of httpConn) {
 *       let err;
 *       const start = performance.now();
 *       try {
 *         // processing of the request...
 *         const response = new Response();
 *         await requestEvent.respondWith(response);
 *       } catch (e) {
 *         err = e;
 *       } finally {
 *         await ga(requestEvent.request, conn, response, start, err);
 *       }
 *     }
 *   })();
 * }
 * ```
 *
 * @param options an optional set of options the impact the behavior of the
 *                returned reporter.
 * @returns the reporter function used to enqueue messages to dispatch to Google
 *          Analytics. */
export function createReporter(options: ReporterOptions = {}): Reporter {
  const {
    endpoint = GA_BATCH_ENDPOINT,
    filter = () => true,
    id = Deno.env.get(GA_TRACKING_ID),
    log = defaultLog,
    metaData = () => undefined,
    warn = true,
  } = options;
  if (!id && warn) {
    log(
      "GA_TRACKING_ID environment variable not set. Google Analytics reporting disabled.",
    );
  }
  const enqueue = createEnqueue(endpoint, log, warn);

  return async function report(
    req: Request,
    conn: Conn,
    res: Response,
    start: number,
    error?: unknown,
  ) {
    // Cannot report if no analytics ID
    if (!id) {
      return;
    }

    // Do not report 1XX or 3XX statuses to GA
    if (!(res.ok || res.status >= 400)) {
      return;
    }

    // Filter out any unwanted requests
    if (!filter(req, res)) {
      return;
    }

    const duration = performance.now() - start;

    const status = res.status;
    const statusText = res.statusText || STATUS_TEXT.get(status) || `${status}`;
    const userAgent = req.headers.get("user-agent");
    // TODO(@piscisaureus): validate that the 'cf-connecting-ip' header was
    // actually set by cloudflare. See https://www.cloudflare.com/en-gb/ips/.
    const [ip] = (req.headers.get("x-forwarded-for") ??
      req.headers.get("cf-connecting-ip") ??
      (conn.remoteAddr as Deno.NetAddr).hostname).split(/\s*,\s*/);
    const { documentTitle, campaignMedium, campaignSource } =
      metaData(req, res) ??
        {};
    const exception = toException(status, statusText, error);
    const hitType = exception != null ? "exception" : "pageview";

    const message = {
      v: 1, // version, should always be 1
      tid: id,
      t: hitType, // event type
      cid: await toDigest(ip), // GA requires `cid` to be set.
      uip: ip,
      dl: req.url,
      dt: documentTitle,
      dr: req.headers.get("referer"),
      cm: campaignMedium,
      cs: campaignSource,
      ua: userAgent,
      exd: exception,
      exf: exception != null,
      srt: duration,
      qt: uploading ? 0 : UPLOAD_DELAY,
    } as const;

    const payload = toPayload(message);
    if (payload.length > GA_MAX_PAYLOAD_LENGTH) {
      if (warn) {
        log(`payload exceeds maximum size: ${JSON.stringify(message)}`);
      }
      return;
    }
    enqueue(payload);
  };
}

/** Creates and returns a reporting measurement middleware for oak, which will
 * generate and send to Google Analytics measurements for each request handled
 * by an oak application.
 *
 * ### Examples
 *
 * ```ts
 * import { createReportMiddleware } from "https://deno.land/x/g_a/mod.ts";
 * import { Application } from "https://deno.land/x/oak/mod.ts";
 *
 * const ga = createReportMiddleware();
 * const app = new Application();
 *
 * app.use(ga);
 * // register additional middleware...
 *
 * app.listen({ port: 0 });
 * ```
 *
 * @param options an optional set of options which affects the behavior of the
 *                returned middleware.
 * @returns middleware which should be registered early in the stack with the
 *          application.
 */
export function createReportMiddleware(
  options: ReportMiddlewareOptions = {},
): Middleware {
  const {
    endpoint = GA_BATCH_ENDPOINT,
    filter = () => true,
    id = Deno.env.get(GA_TRACKING_ID),
    log = defaultLog,
    metaData = () => undefined,
    warn = true,
  } = options;
  if (!id && warn) {
    log(
      "GA_TRACKING_ID environment variable not set. Google Analytics reporting disabled.",
    );
  }
  const enqueue = createEnqueue(endpoint, log, warn);

  return async function reporter(ctx, next) {
    if (!id || !filter(ctx)) {
      return next();
    }
    let error: unknown;
    const start = performance.now();
    try {
      await next();
    } catch (e) {
      error = e;
    } finally {
      // Only report 2XX and >= 4XX status to GA
      const status = ctx.response.status;
      if ((status >= 200 && status < 300) || status >= 400) {
        const duration = performance.now() - start;

        const statusText = STATUS_TEXT.get(status) ?? `${status}`;
        const ip = ctx.request.ip;
        const { documentTitle, campaignMedium, campaignSource } =
          metaData(ctx) ??
            {};
        const exception = toException(status, statusText, error);
        const hitType = exception != null ? "exception" : "pageview";

        const message = {
          v: 1, // version, should always be 1
          tid: id,
          t: hitType, // event type
          cid: await toDigest(ip), // GA requires `cid` to be set.
          uip: ip,
          dl: ctx.request.url.toString(),
          dt: documentTitle,
          dr: ctx.request.headers.get("referer"),
          cm: campaignMedium,
          cs: campaignSource,
          ua: ctx.request.headers.get("user-agent"),
          exd: exception,
          exf: exception != null,
          srt: duration,
          qt: uploading ? 0 : UPLOAD_DELAY,
        } as const;

        const payload = toPayload(message);
        if (payload.length <= GA_MAX_PAYLOAD_LENGTH) {
          enqueue(payload);
        } else if (warn) {
          log(`payload exceeds maximum size: ${JSON.stringify(message)}`);
        }
      }
    }
  };
}
