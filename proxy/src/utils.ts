import { Cache, Context } from "../deps.ts";

export interface State {
  cache: Cache;
}

export async function cachedFetch(
  ctx: Context<State>,
  url: string,
): Promise<Response> {
  const cachedResponse = await ctx.state.cache.match(url);
  if (cachedResponse !== undefined) {
    cachedResponse.headers.set("X-Deno-Cache", "HIT");
    return cachedResponse;
  }
  const response = await fetch(url);
  await ctx.state.cache.put(url, response.clone());
  response.headers.set("X-Deno-Cache", "MISS");
  return response;
}
