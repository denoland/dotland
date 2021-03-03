import { app } from "./mod.ts";

app.addEventListener("listen", (event) => {
  console.log(
    `Listening at http://${event.hostname ?? "localhost"}:${event.port}`,
  );
});

await app.listen({ port: 8080 });
