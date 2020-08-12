<!-- # Runtime -->
# ランタイム

<!--
Documentation for all runtime functions (Web APIs + `Deno` global) can be found
on
[`doc.deno.land`](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts).
-->
すべてのランタイムの機能(Web APIs + `Deno` global)のドキュメントは [`doc.deno.land`](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts) にあります。

## Web APIs

<!--
For APIs where a web standard already exists, like `fetch` for HTTP requests,
Deno uses these rather than inventing a new proprietary API.
-->
HTTPリクエストの `fetch` などのすでに存在しているwebスタンダードAPIについて、Denoは新しい独自のAPIを作るのではなくこれらを利用しています。

<!--
The detailed documentation for implemented Web APIs can be found on
[doc.deno.land](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.shared_globals.d.ts).
Additionally, a full list of the Web APIs which Deno implements is also
available
[in the repository](https://github.com/denoland/deno/blob/master/cli/rt/README.md).
-->
Web APIの実装の詳しいドキュメントは [doc.deno.land](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.shared_globals.d.ts) 。
また、Denoが実装しているWeb APIの一覧は [in the repository](https://github.com/denoland/deno/blob/master/cli/rt/README.md) で利用可能です。

<!--
The TypeScript definitions for the implemented web APIs can be found in the
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.shared_globals.d.ts)
and
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.window.d.ts)
files.
-->
Web APIのTypeScriptの定義は [`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.shared_globals.d.ts) と [`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.window.d.ts) ファイルにあります。

<!--
Definitions that are specific to workers can be found in the
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.worker.d.ts)
file.
-->
ワーカー特有の定義は [`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.worker.d.ts) にあります。

## `Deno` global

All APIs that are not web standard are contained in the global `Deno` namespace.
It has the APIs for reading from files, opening TCP sockets, and executing
subprocesses, etc.

The TypeScript definitions for the Deno namespaces can be found in the
[`lib.deno.ns.d.ts`](https://github.com/denoland/deno/blob/master/cli/dts/lib.deno.ns.d.ts)
file.

The documentation for all of the Deno specific APIs can be found on
[doc.deno.land](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.ns.d.ts).
