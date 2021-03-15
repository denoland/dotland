import { app as createApp } from "./mod.ts";
import { Application } from "./deps.ts";
import { State } from "./src/utils.ts";

const GIT_SHA = Deno.env.get("GIT_SHA") ?? "dev";

const app = new Application<State>();

// Logger
app.use(async (ctx, next) => {
  await next();
  const st = ctx.response.headers.get("Server-Timing");
  const status = ctx.response.status;
  if (status >= 200 && status < 400) {
    console.log(
      `[ok]   ${status} - ${ctx.request.method} ${ctx.request.url} - ${st}`,
    );
  } else {
    console.log(
      `[fail] ${status} - ${ctx.request.method} ${ctx.request.url} - ${st}`,
    );
  }
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
  const ctx = evt.context;
  if (ctx) {
    const status = ctx.response.status;
    console.error(
      `[err]  ${status} - ${ctx.request.method} ${ctx.request.url} - ${evt.error}`,
    );
  } else {
    console.error(`[err]  - ${evt.error}`);
  }
});

await createApp(app).listen({ port: 8080 });
