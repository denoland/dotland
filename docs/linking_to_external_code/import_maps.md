## Import maps

<!--
> This is an unstable feature. Learn more about
> [unstable features](../runtime/stability.md).
-->
> これは不安定版の機能です。詳しくは [不安定版の機能](../runtime/stability.md) を参照してください。

<!-- Deno supports [import maps](https://github.com/WICG/import-maps). -->
Denoは [import maps](https://github.com/WICG/import-maps) をサポートしています。

<!-- You can use import maps with the `--importmap=<FILE>` CLI flag. -->
`--importmap=<FILE>` CLIフラグでimport mapsを使うことが出来まます。

<!-- Current limitations: -->
現在の制約:

<!--
- single import map
- no fallback URLs
- Deno does not support `std:` namespace
- supports only `file:`, `http:` and `https:` schemes
-->
- 一つのimport map
- フォールバックURLなし
- Denoは `std:` 名前空間をサポートしません
- `file:`、`http:`、`https` スキーマのみをサポートします

<!-- Example: -->
例:

**import_map.json**

```js
{
   "imports": {
      "fmt/": "https://deno.land/std@$STD_VERSION/fmt/"
   }
}
```

**color.ts**

```ts
import { red } from "fmt/colors.ts";

console.log(red("hello world"));
```

<!-- Then: -->
次に:

```shell
$ deno run --importmap=import_map.json --unstable color.ts
```

<!-- To use starting directory for absolute imports: -->
絶対的インポートに開始ディレクトリを使う:

```json
// import_map.json

{
  "imports": {
    "/": "./"
  }
}
```

```ts
// main.ts

import { MyUtil } from "/util.ts";
```

<!-- You may map a different directory: (eg. src) -->
別のディレクトリをマップすることも出来ます: (例、src)

```json
// import_map.json

{
  "imports": {
    "/": "./src"
  }
}
```
