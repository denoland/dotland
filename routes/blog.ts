import { type Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.redirect("https://deno.com/blog", 302);
  },
};