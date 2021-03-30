import { app } from "./mod.ts";
import { assert, superoak } from "./test_deps.ts";

Deno.test("proxies homepage", async () => {
  const request = await superoak(app());
  await request.get("/")
    .expect("Content-Type", /html/)
    .expect(200)
    .expect(/<title>/);
});

Deno.test("proxies manual", async () => {
  const request = await superoak(app());
  await request.get("/manual")
    .expect("Content-Type", /html/)
    .expect(200)
    .expect(/<title>/);
});

Deno.test("proxies /std/version.ts when accepting html", async () => {
  const request = await superoak(app());
  await request.get("/std/version.ts")
    .accept("text/html")
    .expect("Content-Type", /html/)
    .expect(200)
    .expect(/<title>/);
});

Deno.test("serves /std/version.ts redirect when accepting any", async () => {
  const request = await superoak(app());
  await request.get("/std/version.ts")
    .accept("")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/std@"));
      assert(location.endsWith("/version.ts"));
    })
    .expect("");
});

Deno.test("serves /std/version.ts redirect when accepting js", async () => {
  const request = await superoak(app());
  await request.get("/std/version.ts")
    .accept("application/javascript")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/std@"));
      assert(location.endsWith("/version.ts"));
    })
    .expect("");
});

Deno.test("serves /std/version.ts redirect when accepting ts", async () => {
  const request = await superoak(app());
  await request.get("/std/version.ts")
    .accept("application/typescript")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/std@"));
      assert(location.endsWith("/version.ts"));
    })
    .expect("");
});

Deno.test("serves /std@0.89.0/version.ts when accepting any", async () => {
  const request = await superoak(app());
  await request.get("/std@0.89.0/version.ts")
    .accept("")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/0\.89\.0/);
});

Deno.test("serves /std@0.89.0/version.ts when accepting js", async () => {
  const request = await superoak(app());
  await request.get("/std@0.89.0/version.ts")
    .accept("application/javascript")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/0\.89\.0/);
});

Deno.test("serves /std@0.89.0/version.ts when accepting ts", async () => {
  const request = await superoak(app());
  await request.get("/std@0.89.0/version.ts")
    .accept("application/typescript")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/0\.89\.0/);
});

Deno.test("serves /x/oak/mod.ts redirect when accepting any", async () => {
  const request = await superoak(app());
  await request.get("/x/oak/mod.ts")
    .accept("")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/x/oak@"));
      assert(location.endsWith("/mod.ts"));
    })
    .expect("");
});

Deno.test("serves /x/oak/mod.ts redirect when accepting js", async () => {
  const request = await superoak(app());
  await request.get("/x/oak/mod.ts")
    .accept("application/javascript")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/x/oak@"));
      assert(location.endsWith("/mod.ts"));
    })
    .expect("");
});

Deno.test("serves /x/oak/mod.ts redirect when accepting ts", async () => {
  const request = await superoak(app());
  await request.get("/x/oak/mod.ts")
    .accept("application/typescript")
    .expect(302)
    .expect("access-control-allow-origin", "*")
    .expect((resp) => {
      const location = resp.headers["location"] as string;
      assert(location.startsWith("/x/oak@"));
      assert(location.endsWith("/mod.ts"));
    })
    .expect("");
});

Deno.test("serves /x/oak@v6.5.0/mod.ts when accepting any", async () => {
  const request = await superoak(app());
  await request.get("/x/oak@v6.5.0/mod.ts")
    .accept("")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/export { Application } from/);
});

Deno.test("serves /x/oak@v6.5.0/mod.ts when accepting js", async () => {
  const request = await superoak(app());
  await request.get("/x/oak@v6.5.0/mod.ts")
    .accept("application/javascript")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/export { Application } from/);
});

Deno.test("serves /x/oak@v6.5.0/mod.ts when accepting ts", async () => {
  const request = await superoak(app());
  await request.get("/x/oak@v6.5.0/mod.ts")
    .accept("application/typescript")
    .expect(200)
    .expect("content-type", "application/typescript; charset=utf-8")
    .expect("access-control-allow-origin", "*")
    .expect(/export { Application } from/);
});

Deno.test("redirects :123:2 line numbers to #L123 in html", async () => {
  const request = await superoak(app());
  await request.get("/std@0.89.0/version.ts:5:1")
    .accept("text/html")
    .expect(302)
    .expect("location", "/std@0.89.0/version.ts#L5")
    .expect("");
});

Deno.test("dont redirect :123:2 line numbers to #L123 in plain", async () => {
  const request = await superoak(app());
  await request.get("/std@0.89.0/version.ts:5:1")
    .accept("application/typescript")
    .expect(404)
    .expect("access-control-allow-origin", "*")
    .expect("Resource Not Found");
});

Deno.test("caching", async () => {
  const a = app();
  let request = await superoak(a);
  await request.get("/std@0.89.0/version.ts")
    .accept("application/typescript")
    .expect(200)
    .expect("x-deno-cache", "MISS");
  request = await superoak(a);
  await request.get("/std@0.89.0/version.ts")
    .accept("application/typescript")
    .expect(200)
    .expect("x-deno-cache", "HIT");
});
