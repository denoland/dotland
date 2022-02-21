/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "https://raw.githubusercontent.com/lucacasonato/fresh/04a32f34987fbd59ce646967f216b2cca072a58f/server.ts";
import routes from "./routes.gen.ts";

await start(routes);
