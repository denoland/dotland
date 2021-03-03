import { Context, readerFromStreamReader } from "../deps.ts";

const REMOTE_URL = "https://deno-website2.now.sh";

export async function websiteMiddleware(
  ctx: Context,
  next: () => Promise<void>,
) {
  await next();
  if (ctx.response.body === undefined) {
    if (ctx.request.method == "GET") {
      const resp = await fetch(`${REMOTE_URL}${ctx.request.url.pathname}`);
      ctx.response.status = resp.status;
      ctx.response.headers = resp.headers;
      ctx.response.body = resp.body
        ? readerFromStreamReader(resp.body.getReader())
        : new Uint8Array();
    }
  }
}
