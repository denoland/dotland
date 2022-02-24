
export function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  return proxyFile(url, REMOTE_URL, request);
}

interface CacheEntry {
  body: ArrayBuffer;
  contentType: string;
  etag: string;
  immutable: boolean;
}

const cache = new Map<string, CacheEntry>();

// When deploying a new version, the worker will be updated before the static
// website hosted by Vercel gets updated. Therefore we clear the cache 2 minutes
// after startup up to ensure that there is no stale static content in the
// in-memory cache.
setTimeout(() => cache.clear(), 2 * 60 * 1000);

async function proxyFile(
  url: URL,
  remoteUrl: string,
  request: Request,
): Promise<Response> {
  const proxyUrl = new URL(remoteUrl + url.pathname + url.search).href;
  let cacheEntry = cache.get(proxyUrl);

  if (cacheEntry === undefined) {
    const proxyRequest = new Request(proxyUrl);
    const proxyResponse = await fetchWithRetry(proxyRequest);

    if (!(proxyResponse.ok || proxyResponse.redirected)) {
      return proxyResponse;
    }

    const body = await proxyResponse.arrayBuffer();
    const contentType = proxyResponse.headers.get("content-type") ??
      "application/binary";
    const etag = await crypto.subtle.digest("SHA-1", body).then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
    const immutable = /\bimmutable\b/i
      .test(proxyResponse.headers.get("cache-control") ?? "");

    cacheEntry = {
      body,
      contentType,
      etag,
      immutable,
    };
    cache.set(proxyUrl, cacheEntry);
  }

  if (request.headers.get("if-none-match") !== cacheEntry.etag) {
    let body;
    switch (request.method) {
      case "HEAD":
        body = null;
        break;
      case "GET":
        body = cacheEntry.body;
        break;
      default:
        throw new Error(`Unsupported request method: ${request.method}`);
    }
    return new Response(body, {
      headers: {
        "content-type": cacheEntry.contentType,
        "cache-control": cacheEntry.immutable
          ? "public,max-age=31536000,immutable"
          : "public,max-age=0,must-revalidate",
        "etag": cacheEntry.etag,
      },
    });
  } else {
    return new Response(null, { status: 304 }); // Not modified.
  }
}

async function fetchWithRetry(request: Request): Promise<Response> {
  let promise: Promise<Response>;
  for (let i = 0; i < 3; i++) {
    promise = fetch(request);
    try {
      return await promise;
    } catch (err) {
      // TODO(lucacasonato): only retry on known retryable errors
      console.warn("retrying on proxy error", err);
    }
  }
  return promise!;
}
