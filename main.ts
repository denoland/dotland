/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "https://raw.githubusercontent.com/lucacasonato/fresh/6abf62c832ced41ae9365b48939221adfbe74e5d/server.ts";
import routes from "./routes.gen.ts";

await start(routes);
