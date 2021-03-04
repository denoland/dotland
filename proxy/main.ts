import { app as createApp } from "./mod.ts";
import { Application } from "./deps.ts";

const app = new Application();

app.addEventListener("listen", (event) => {
  console.log(
    `Listening at http://${event.hostname ?? "localhost"}:${event.port}`,
  );
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

await createApp(app).listen({ port: 8080 });
