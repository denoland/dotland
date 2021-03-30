import { Context, readerFromStreamReader } from "../deps.ts";
import { cachedFetch, State } from "./utils.ts";

const REMOTE_URL = "https://deno-website2.now.sh";

export async function websiteMiddleware(
  ctx: Context<State>,
  next: () => Promise<void>,
) {
  await next();
  if (ctx.response.body === undefined) {
    if (ctx.request.method == "GET") {
      const resp = await cachedFetch(
        ctx,
        `${REMOTE_URL}${ctx.request.url.pathname}`,
      );
      ctx.response.status = resp.status;
      ctx.response.headers = resp.headers;
      ctx.response.body = resp.body
        ? readerFromStreamReader(resp.body.getReader())
        : new Uint8Array();
    }
  }
}
