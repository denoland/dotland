#!/usr/bin/env -S deno run --allow-read=. --allow-net --allow-env
/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRequest } from "./handler.ts";
import { listenAndServe } from "https://deno.land/std@0.108.0/http/server.ts";

console.log("The server is available at http://localhost:8081");
listenAndServe(":8081", handleRequest);
