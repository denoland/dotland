// set up global namespace for worker environment
import { fetch, URL, Request, Response } from "@dollarshaveclub/cloudworker";
declare var global: any;
Object.assign(global, { fetch, URL, Request, Response });
