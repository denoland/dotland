/* esm.sh - esbuild bundle(is-plain-object@5.0.0) deno production */
function n(t){return Object.prototype.toString.call(t)==="[object Object]"}function o(t){var e,r;return n(t)===!1?!1:(e=t.constructor,e===void 0?!0:(r=e.prototype,!(n(r)===!1||r.hasOwnProperty("isPrototypeOf")===!1)))}export{o as isPlainObject};
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
