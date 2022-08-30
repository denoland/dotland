import { MiddlewareHandlerContext } from "$fresh/server.ts";

function assert(cond: unknown, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
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
    ip = hostname;
  }
  const data = new TextEncoder().encode(ip);
  const buff = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buff));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface State {
  userToken: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  assert(ctx.remoteAddr.transport === "tcp");
  ctx.state.userToken = await getUserToken(
    req.headers,
    ctx.remoteAddr.hostname,
  );
  return ctx.next();
}
