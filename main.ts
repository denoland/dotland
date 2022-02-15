/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "https://raw.githubusercontent.com/lucacasonato/fresh/2ec980ca454073f4b3895763a693f7cbd73761c6/server.ts";
import routes from "./routes.gen.ts";

await start(routes);
