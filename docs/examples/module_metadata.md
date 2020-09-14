# Module metadata

<!-- ## Concepts -->
## 概念

<!--
- [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)
  can provide information on the context of the module
- The boolean
  [import.meta.main](https://doc.deno.land/builtin/stable#ImportMeta) will let
  you know if the current module is the program entry point
- The string [import.meta.url](https://doc.deno.land/builtin/stable#ImportMeta)
  will give you the URL of the current module
- The string
  [Deno.mainModule](https://doc.deno.land/builtin/stable#Deno.mainModule) will
  give you the URL of the main module entry point, i.e. the module invoked by
  the deno runtime
-->
- [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) はモジュールのコンテクストの情報を提供します
- ブーリアン [import.meta.main](https://doc.deno.land/builtin/stable#ImportMeta) じゃ現在のモジュールがエントリーポイントかどうか教えてくれます
- 文字列 [import.meta.url](https://doc.deno.land/builtin/stable#ImportMeta) は現在のモジュールのURLを教えてくれます
- 文字列 [Deno.mainModule](https://doc.deno.land/builtin/stable#Deno.mainModule) はメインモジュールのエントリーポイントのURLを教えてくれます。すなわち、denoランタイムによって呼び出されるモジュールのURLです

<!-- ## Example -->
## 例

<!--
The example below uses two modules to show the difference between
`import.meta.url`, `import.meta.main` and `Deno.mainModule`. In this example,
`module_a.ts` is the main module entry point
-->
下記の例は `import.meta.url`、`import.meta.main`、`Deno.mainModule` の違いを示すために2つのモジュールを使用します。この例では `module_a.ts` がメインモジュールエントリーポイントです

```ts
/**
 * module_b.ts
 */
export function outputB() {
  console.log("Module B's import.meta.url", import.meta.url);
  console.log("Module B's mainModule url", Deno.mainModule);
  console.log(
    "Is module B the main module via import.meta.main?",
    import.meta.main,
  );
}
```

```ts
/**
 * module_a.ts
 */
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("Module A's import.meta.url", import.meta.url);
  console.log("Module A's mainModule url", Deno.mainModule);
  console.log(
    "Is module A the main module via import.meta.main?",
    import.meta.main,
  );
}

outputA();
console.log("");
outputB();
```

<!--
If `module_a.ts` is located in `/home/alice/deno` then the output of
`deno run --allow-read module_a.ts` is:
-->
もし `module_a.ts` が `/home/alice/deno` にあったら `deno run --allow-read module_a.ts` の出力は:

```
Module A's import.meta.url file:///home/alice/deno/module_a.ts
Module A's mainModule url file:///home/alice/deno/module_a.ts
Is module A the main module via import.meta.main? true

Module B's import.meta.url file:///home/alice/deno/module_b.ts
Module B's mainModule url file:///home/alice/deno/module_a.ts
Is module B the main module via import.meta.main? false
```
