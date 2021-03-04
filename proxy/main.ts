import { app as createApp } from "./mod.ts";
import { Application } from "./deps.ts";
import { State } from "./src/utils.ts";

const GIT_SHA = Deno.env.get("GIT_SHA") ?? "dev";

const app = new Application<State>();

// Logger
app.use(async (ctx, next) => {
  await next();
  const st = ctx.response.headers.get("Server-Timing");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${st}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("Server-Timing", `total;dur=${ms}`);
});

// Server
app.use(async (ctx, next) => {
  await next();
  ctx.response.headers.set(
    "Server",
    `Deno/${Deno.version.deno} @ ${GIT_SHA}`,
  );
});

app.addEventListener("listen", (event) => {
  console.log(
    `Listening at http://${event.hostname ?? "localhost"}:${event.port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log("error", evt.error);
});

await createApp(app).listen({ port: 8080 });
