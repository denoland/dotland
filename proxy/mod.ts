import { Application, Router } from "./deps.ts";
import { registryMiddleware } from "./src/registry.ts";
import { vscModule, vscPaths, vscPathsLatest } from "./src/vscode.ts";
import { websiteMiddleware } from "./src/website.ts";

export function app(app = new Application()) {
  const router = new Router();

  router.get("/std{@:version}?/:path+", registryMiddleware);
  router.get("/x/:module{@:version}?/:path+", registryMiddleware);

  router.get("/_vsc1/modules/:module([a-z0-9_]*)", vscModule);
  router.get("/_vsc1/modules/:module([a-z0-9_]*)/v/:version", vscPaths);
  router.get("/_vsc1/modules/:module([a-z0-9_]*)/v_latest", vscPathsLatest);

  router.redirect("/v1", "/posts/v1", 301);
  router.get(
    "/typedoc",
    (ctx) => {
      ctx.response.status = 301;
      ctx.response.redirect("https://doc.deno.land/builtin/stable");
    },
  );

  // This will proxy all requests we do not match to Vercel.
  app.use(websiteMiddleware);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
