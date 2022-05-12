// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { ConnInfo } from "https://deno.land/std@0.120.0/http/server.ts";
import { STATUS_TEXT } from "https://deno.land/std@0.120.0/http/http_status.ts";
import snakeCase from "https://deno.land/x/case@2.1.1/snakeCase.ts";

const GA4_ENDPOINT_URL = "https://www.google-analytics.com/g/collect";
const SLOW_UPLOAD_THRESHOLD = 1_000;

export type Primitive = bigint | boolean | null | number | string;

export interface GA4Report {
  measurementId?: string;
  client: Client;
  user: User;
  session?: Session;
  campaign?: Campaign;
  page: Page;
  events: [PrimaryEvent, ...Event[]];
}

export type Client = {
  id?: string; // Must have either `ip` or `id`.
  ip?: string;
  language?: string;
  headers: Headers;
};

export interface User {
  id?: string;
  properties: Record<string, Primitive>;
}

export interface Session {
  id: string;
  number: number;
  engaged: boolean;
  start?: boolean;
  hitCount: number;
}

type TrafficType = "direct" | "organic" | "referral" | "internal" | "custom";

export interface Page {
  location: string;
  title: string;
  referrer?: string;
  ignoreReferrer?: boolean;
  trafficType?: TrafficType;
  firstVisit?: boolean;
  newToSite?: boolean;
}

export interface Campaign {
  source: string;
  medium: string;
  id?: string;
  name?: string;
  content?: string;
  term?: string;
}

export interface Event {
  name: string;
  category?: string;
  label?: string;
  params: Record<string, Primitive>;
}

// Defaults to "page_view", but can be overridden/surpressed.
export type PrimaryEvent = Event | null;

export interface GA4Init {
  measurementId?: string;
  request: Request;
  response: Response;
  conn: ConnInfo;
}

export class GA4Report {
  constructor({ measurementId, request, response, conn }: GA4Init) {
    this.measurementId = measurementId;
    this.client = {
      ip: getClientIp(request, conn),
      language: getClientLanguage(request),
      headers: getClientHeaders(request),
    };
    this.user = { properties: {} };
    this.session = getSession(conn);
    this.page = {
      location: request.url,
      title: getPageTitle(request, response),
      referrer: getPageReferrer(request),
      trafficType: getPageTrafficType(request),
      firstVisit: getFirstVisit(request, response),
    };
    this.campaign = undefined;
    this.events = [{ name: "page_view", params: {} }];
  }

  get event(): PrimaryEvent {
    return this.events[0];
  }

  set event(event: PrimaryEvent) {
    this.events[0] = event;
  }

  async send(): Promise<void> {
    // Short circuit if there are no events to report.
    if (!this.events.find(Boolean)) {
      return;
    }

    this.measurementId ??= Deno.env.get("GA4_MEASUREMENT_ID");
    if (!this.measurementId) {
      return this.warn(
        "GA4_MEASUREMENT_ID environment variable not set. " +
          "Google Analytics reporting disabled.",
      );
    }

    if (this.client.id == null) {
      if (this.client.ip == null) {
        return this.warn("either `client.id` or `client.ip` must be set.");
      }
      const material = [
        this.client.ip,
        this.client.headers.get("user-agent"),
        this.client.headers.get("sec-ch-ua"),
      ].join();
      this.client.id = await toDigest(material);
    }

    // Note that the order in which parameters appear in the query string does
    // matter.
    const queryParams: Record<string, string> = {};

    // Version; must be set to "2" to send events to GA4.
    addShortParam(queryParams, "v", 2);
    addShortParam(queryParams, "tid", this.measurementId);

    addShortParam(queryParams, "cid", this.client.id);
    addShortParam(queryParams, "ul", this.client.language);
    addShortParam(queryParams, "_uip", this.client.ip);

    addShortParam(queryParams, "uid", this.user.id);
    for (const [name, value] of Object.entries(this.user.properties)) {
      addCustomParam(queryParams, "up", name, value);
    }

    addShortParam(queryParams, "cs", this.campaign?.source);
    addShortParam(queryParams, "cm", this.campaign?.medium);
    addShortParam(queryParams, "ci", this.campaign?.id);
    addShortParam(queryParams, "cn", this.campaign?.name);
    addShortParam(queryParams, "cc", this.campaign?.content);
    addShortParam(queryParams, "ck", this.campaign?.term);

    addShortParam(queryParams, "sid", this.session?.id);
    addShortParam(queryParams, "sct", this.session?.number);
    addShortParam(queryParams, "seg", this.session?.engaged);
    addShortParam(queryParams, "_s", this.session?.hitCount);

    addShortParam(queryParams, "dl", this.page.location);
    addShortParam(queryParams, "dr", this.page.referrer);
    addShortParam(queryParams, "dt", this.page.title);
    addShortParam(queryParams, "ir", this.page.ignoreReferrer, false);
    addShortParam(queryParams, "tt", this.page.trafficType, "internal");

    if (this.event != null) {
      addEventParams(queryParams, this.event);
      // When part of the URL query, the event name must be placed *after* the
      // parameters.
      addShortParam(queryParams, "en", this.event.name);
      // Automatically collected events.
      addShortParam(queryParams, "_fv", this.page.firstVisit, false);
      addShortParam(queryParams, "_nts", this.page.newToSite, false);
      addShortParam(queryParams, "_ss", this.session?.start, false);
    }

    const extraEvents = this.events.slice(1) as Event[];
    const eventParamsList = extraEvents.map((event) => {
      const eventParams: Record<string, string> = {};
      // Inside the body, the event name must be placed *before* the parameters.
      addShortParam(eventParams, "en", event.name);
      addEventParams(eventParams, event);
      return eventParams;
    });

    const url = Object.assign(new URL(GA4_ENDPOINT_URL), {
      search: String(new URLSearchParams(queryParams)),
    }).href;

    const headers = this.client.headers;

    const body = eventParamsList.map((eventParams) =>
      new URLSearchParams(eventParams).toString()
    ).join("\n");

    const request = new Request(url, { method: "POST", headers, body });

    // console.log(`${url}\n${body}\n======`);

    try {
      const start = performance.now();
      const response = await fetch(request);
      const duration = performance.now() - start;

      if (this.session && response.ok) {
        if (this.event != null) {
          this.session.start = undefined;
        }
        const hitCount = this.events.filter(Boolean).length || 1;
        this.session.hitCount += hitCount;
      }

      if (response.status !== 204 || duration >= SLOW_UPLOAD_THRESHOLD) {
        this.warn(
          `${this.events.length} events uploaded in ${duration}ms. ` +
            `Response: ${response.status} ${response.statusText}`,
        );
        // Google tells us not to retry when it reports a non-2xx status code.
      }
    } catch (err) {
      this.warn(`Upload failed: ${err}`);
    }
  }

  warn(message: unknown) {
    console.warn(`GA4: ${message}`);
  }
}

function getClientIp(request: Request, conn: ConnInfo): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(/\s*,\s*/)[0];
  } else {
    return (conn.remoteAddr as Deno.NetAddr).hostname;
  }
}

function getClientLanguage(request: Request): string | undefined {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage == null) {
    return;
  }
  const code = acceptLanguage.split(/[^a-z-]+/i).filter(Boolean).shift();
  if (code == null) {
    return undefined;
  }
  return code.toLowerCase();
}

function getClientHeaders(request: Request): Headers {
  const headerList = [...request.headers.entries()].filter(([name, _value]) => {
    name = name.toLowerCase();
    return name === "user-agent" || name === "sec-ch-ua" ||
      name.startsWith("sec-ch-ua-");
  });
  return new Headers(headerList);
}

const START_OF_2020 = new Date("2020-01-01T00:00:00.000Z").getTime();
const MINUTE = 60 * 1000;
const sessionMap = new WeakMap<ConnInfo, Session>();

function getSession(conn: ConnInfo): Session {
  let session = sessionMap.get(conn);
  if (session == null) {
    // Generate a random session id.
    const id = (Math.random() * 2 ** 52).toString(36).padStart(10, "0");
    const number = Math.floor((Date.now() - START_OF_2020) / MINUTE);
    // Note: we currently cannot in any way determine an accurate "session
    // count" value. However we have to report something (otherwise GA ignores
    // our sessions), so we always use the value `1`. Hopefully that doesn't
    // cause too much weirdness down the line.
    session = { id, number, engaged: true, start: true, hitCount: 0 };
    sessionMap.set(conn, session);
  }
  return session;
}

function getPageTitle(request: Request, response: Response): string {
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    isSuccess(response)
  ) {
    return new URL(request.url)
      .pathname
      .replace(/\.[^\/]*$/, "") // Remove file extension.
      .split(/\/+/) // Split into components.
      .map(decodeURIComponent) // Unescape.
      .map((s) => s.replace(/[\s_]+/g, " ")) // Underbars to spaces.
      .map((s) => s.replace(/@v?[\d\.\s]+$/, "")) // Remove version number.
      .map((s) => s.trim()) // Trim leading/trailing whitespace.
      .filter(Boolean) // Remove empty path components.
      .join(" / ") ||
      "(top level)";
  } else {
    return formatStatus(response).toLowerCase();
  }
}

function getPageReferrer(request: Request): string | undefined {
  const referrer = request.headers.get("referer");
  if (
    referrer !== null && new URL(referrer).host !== new URL(request.url).host
  ) {
    return referrer;
  }
}

function getFirstVisit(
  request: Request,
  response: Response,
): boolean | undefined {
  if (!/^(HEAD|GET)$/.test(request.method)) {
    return false;
  }
  if (request.headers.get("cookie")) {
    return false;
  }
  if (/immutable/i.test(response.headers.get("cache-control") ?? "")) {
    return false;
  }
  if (response.headers.get("last-modified")) {
    return request.headers.get("if-modified-since") ? true : false;
  }
  if (response.headers.get("etag")) {
    return request.headers.get("if-none-match") ? true : false;
  }
  return undefined; // Undetermined.
}

function getPageTrafficType(
  request: Request,
): TrafficType | undefined {
  const referrer = request.headers.get("referer");
  if (referrer == null) {
    return;
  }
  if (new URL(request.url).host === new URL(referrer).host) {
    return "internal";
  }
  return "referral";
}

export function formatStatus(response: Response): string {
  let { status, statusText } = response;
  statusText ||= STATUS_TEXT.get(status) ?? "Invalid Status";
  return `${status} ${statusText}`;
}

export function isSuccess(response: Response): boolean {
  const { status } = response;
  return status >= 200 && status <= 299;
}

export function isRedirect(response: Response): boolean {
  const { status } = response;
  return status >= 300 && status <= 399;
}

export function isServerError(response: Response): boolean {
  const { status } = response;
  return status >= 500 && status <= 599;
}

function addShortParam(
  params: Record<string, string>,
  name: string,
  value?: Primitive,
  implicitDefault?: Primitive,
) {
  if (value === undefined || value === implicitDefault) {
    // Do nothing.
  } else if (typeof value === "boolean") {
    params[name] = value ? "1" : "0";
  } else {
    params[name] = String(value);
  }
}

function addCustomParam(
  params: Record<string, string>,
  prefix: string,
  name: string,
  value?: Primitive,
) {
  if (value === undefined) {
    return; // Do nothing.
  }
  name = snakeCase(name);
  if (typeof value === "number" || typeof value === "bigint") {
    params[`${prefix}n.${name}`] = String(value);
  } else {
    params[`${prefix}.${name}`] = String(value);
  }
}

/** Adds the event's category, label, and custom parameters to the parameter set
 * `params`. Note that the event name is *not* added.
 */
function addEventParams(params: Record<string, string>, event: Event) {
  for (const prop of ["category", "label"] as const) {
    addCustomParam(
      params,
      "ep",
      `event_${prop}`,
      event[prop],
    );
  }
  for (const [name, value] of Object.entries(event.params)) {
    addCustomParam(params, "ep", name, value);
  }
}

const encoder = new TextEncoder();

/** Create a SHA-1 hex string digest of the supplied message. */
async function toDigest(msg: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-1", encoder.encode(msg));
  return Array.from(new Uint8Array(buffer)).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/* Heuristically attempts to determine whether a given request-response
 * transaction was fetching a top level document (=> its url goes in the
 * browser's url bar), or whether it was accessing a subresource. Typically HTML
 * files are documents, and images/fonts/javascript/css are all subresources.
 * There's a number of edge cases:
 *   - A PDF file rendered by the browser    : document
 *   - A binary file that gets downloaded    : document
 *   - Image or video opened in new tab      : document
 *   - HTML form submitted with POST request : document
 *   - HTML loaded into IFrame               : subresource
 *   - Use of `fetch()` or `XMLHttpRequest`  : subresource
 */
export function isDocument(request: Request, response: Response): boolean {
  // If the client supports fetch metadata request headers (all web browsers
  // except Safari do), this is easy and precise.
  const fetchMode = request.headers.get("sec-fetch-mode");
  if (fetchMode != null) {
    return fetchMode === "navigate";
  }

  // A downloaded file is a document.
  const disposition = response.headers.get("content-disposition");
  if (disposition != null && /^attachment\b/i.test(disposition)) {
    return true;
  }

  // If the client prefers text/html over anything, it is probably attempting to
  // load a top level document. There might be false positives though, e.g. when
  // the browser is loading an iframe, but we have no choice.
  const accept = request.headers.get("accept");
  if (accept != null && /^text\/html\b/i.test(accept)) {
    return true;
  }

  // If the client asked for "*/*" or didn't include an `accept` header at all,
  // a number of things could be going on:
  //   - The client doesn't support HTML (e.g. curl) : document
  //   - The user clicked "save link as..."          : document
  //   - fetch("...") was called                     : subresource
  //   - A <link href="..."> element in the document : subresource
  // We try to detect dumb clients that don't understand HTML.
  const { method } = request;
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  if (
    method === "GET" &&
    referer == null &&
    (userAgent == null || !userAgent.startsWith("Mozilla/")) &&
    (accept == null || accept === "*/*")
  ) {
    return true;
  }

  // Give up.
  return false;
}
