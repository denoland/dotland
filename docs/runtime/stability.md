<!-- ## Stability -->
## 安定性

<!--
As of Deno 1.0.0, the `Deno` namespace APIs are stable. That means we will
strive to make code working under 1.0.0 continue to work in future versions.
-->
Deno 1.0.0以降は、`Deno` 名前空間のAPIは安定版です。つまり、1.0.0のコードが今後のバージョンでも動くように努力しています。

<!--
However, not all of Deno's features are ready for production yet. Features which
are not ready, because they are still in draft phase, are locked behind the
`--unstable` command line flag.
-->
しかし、すべてのDenoの機能のすべてがプロダクション段階ではありません。まだ準備段階の機能は `--unstable` コマンドフラグのもとにあります。

```shell
deno run --unstable mod_which_uses_unstable_stuff.ts
```

<!-- Passing this flag does a few things: -->
このフラグは以下のことをします:

<!--
- It enables the use of unstable APIs during runtime.
- It adds the
  [`lib.deno.unstable.d.ts`](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.unstable.d.ts)
  file to the list of TypeScript definitions that are used for type checking.
  This includes the output of `deno types`.
-->
- 実行中に不安定版のAPIの使用を有効化します。
- [`lib.deno.unstable.d.ts`](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.unstable.d.ts)
  ファイルを型チェックのためのTypeScriptの定義に追加します。これには `deno type` の出力も含まれます。

<!--
You should be aware that many unstable APIs have **not undergone a security
review**, are likely to have **breaking API changes** in the future, and are
**not ready for production**.
-->
多くの不安定版のAPIは**セキュリティレビューを受けておらず**、将来的に**APIのは快適な変更**がある可能性があり、**プロダクションでは非推奨**です。

<!-- ### Standard modules -->
### 標準モジュール

<!--
Deno's standard modules (https://deno.land/std/) are not yet stable. We
currently version the standard modules differently from the CLI to reflect this.
Note that unlike the `Deno` namespace, the use of the standard modules do not
require the `--unstable` flag (unless the standard module itself makes use of an
unstable Deno feature).
-->
Denoの標準モジュール(https://deno.land/std/)はまだ安定版では有りません。現在モジュールのバージョンをCLIとは異なるものにしてこれを反映さしています。`Deno` 名前空間と違って、標準モジュールの使用の際に `--unstable` フラグを必要としません(標準モジュール自身がDenoの不安定番の機能を使用している場合を除く)。
