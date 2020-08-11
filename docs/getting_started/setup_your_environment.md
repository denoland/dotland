## Set up your environment

<!--
To productively get going with Deno you should set up your environment. This
means setting up shell autocomplete, environmental variables and your editor or
IDE of choice.
-->
Denoの開発で生産性を上げるために環境構築すべきです。つまり。シェル自動補完や環境変数、好きなエディターやIDEの設定をすることです。

<!-- ### Environmental variables -->
### 環境変数

<!-- There are several env vars that control how Deno behaves: -->
Denoがどのように動作するか決める環境変数がいくつかあります。

<!--
`DENO_DIR` defaults to `$HOME/.cache/deno` but can be set to any path to control
where generated and cached source code is written and read to.
-->
`DENO_DIR` のデフォルトは `$HOME/.cache/deno` ですが、生成されキャッシュされたソースコードがどこに書き込まれどこから読まれるかは任意のパスに設定することが出来ます。

<!--
`NO_COLOR` will turn off color output if set. See https://no-color.org/. User
code can test if `NO_COLOR` was set without having `--allow-env` by using the
boolean constant `Deno.noColor`.
-->
`NO_COLOR` がセットされていればは出力の色付けを切ります。https://no-color.org/ を参照してください。ユーザーコードはブール定数 `Deno.noColor` を使うことで `--allow-env` を用いなくても `NO_COLOR` がセットされているかどうか調べることが出来ます。

<!-- ### Shell autocomplete -->
### シェル自動補完

<!--
You can generate completion script for your shell using the
`deno completions <shell>` command. The command outputs to stdout so you should
redirect it to an appropriate file.
-->
`deno completions <shell>` コマンドを使うことでシェルの補完スクリプトを生成することが出来ます。このコマンドは標準出力に出力するので適切なファイルにリダイレクトしてください。

<!-- The supported shells are: -->
サポートされているシェルは:

- zsh
- bash
- fish
- powershell
- elvish

<!-- Example (bash): -->
例 (bash)

```shell
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
source /usr/local/etc/bash_completion.d/deno.bash
```

<!-- Example (zsh): -->
例 (zsh)

```shell
mkdir ~/.oh-my-zsh/custom/plugins/deno
deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

<!-- After this add `deno` plugin under plugins tag in `~/.zshrc` file. -->
これは `deno` プラグインを `~/.zshrc` のプタグインタグに追加します。

<!-- ### Editors and IDEs -->
### エディターとIDE

<!--
Because Deno requires the use of file extensions for module imports and allows
http imports, and most editors and language servers do not natively support this
at the moment, many editors will throw errors about being unable to find files
or imports having unnecessary file extensions.
-->
Denoはモジュールのインポートに拡張子を使用する必要があり、HTTPインポートを許可していますが、ほとんどののエディターやランゲージサーバーは現段階でネイティブにこれらをサポートしていません。多くのエディターはファイルが見つからないやインポート時の不執拗な拡張子などでエラーを出すでしょう。

<!-- The community has developed extensions for some editors to solve these issues: -->
コミュニティはこれらの問題を解決するためにいくつかのエディターには拡張機能を開発しました:

#### VS Code

<!--
The beta version of [vscode_deno](https://github.com/denoland/vscode_deno) is
published on the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).
Please report any issues.
-->
ベータ版の [vscode_deno](https://github.com/denoland/vscode_deno) は [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) で公開されています。問題が発生したらレポートを送ってください。

#### JetBrains IDEs

<!--
Support for JetBrains IDEs is available through
[the Deno plugin](https://plugins.jetbrains.com/plugin/14382-deno).
-->
JetBrains IDEへのサポートは [the Deno plugin](https://plugins.jetbrains.com/plugin/14382-deno) にあります。

<!--
For more information on how to set-up your JetBrains IDE for Deno, read
[this comment](https://youtrack.jetbrains.com/issue/WEB-41607#focus=streamItem-27-4160152.0-0)
on YouTrack.
-->
DenoのためのJetBrains IDEの設定のその他の情報はYouTrackの [this comment](https://youtrack.jetbrains.com/issue/WEB-41607#focus=streamItem-27-4160152.0-0) を読んでください。

<!-- #### Vim and NeoVim -->
#### VimとNeoVim

<!--
Vim works fairly well for Deno/TypeScript if you install
[CoC](https://github.com/neoclide/coc.nvim) (intellisense engine and language
server protocol).
-->
[CoC](https://github.com/neoclide/coc.nvim) (インテリセンスエンジンと言語サーバープロトコル)をインストールすれば、Deno/TypeScript上でvimを使うことができます。

<!--
After CoC is installed, from inside Vim, run`:CocInstall coc-tsserver` and
`:CocInstall coc-deno`. To get autocompletion working for Deno type definitions
run `:CocCommand deno.types`. Optionally restart the CoC server `:CocRestart`.
From now on, things like `gd` (go to definition) and `gr` (goto/find references)
should work.
-->
CoCをインストールした後は、vim側から`:CocInstall coc-tsserver`と`:CocInstall coc-deno`を実行させてみましょう。Denoの型定義のために自動補完機能を実装させるためには`:CocCommand deno.types`の実行が必要です。必要に応じて、`:CocRestart`でCoCのサーバーのリスタートを行いましょう。この動作以降、`gd` (go to definition)や`gr` (goto/find references)といったものが動くようになります。

#### Emacs

Emacs works pretty well for a TypeScript project targeted to Deno by using a
combination of [tide](https://github.com/ananthakumaran/tide) which is the
canonical way of using TypeScript within Emacs and
[typescript-deno-plugin](https://github.com/justjavac/typescript-deno-plugin)
which is what is used by the
[official VSCode extension for Deno](https://github.com/denoland/vscode_deno).

To use it, first make sure that `tide` is setup for your instance of Emacs.
Next, as instructed on the
[typescript-deno-plugin](https://github.com/justjavac/typescript-deno-plugin)
page, first `npm install --save-dev typescript-deno-plugin typescript` in your
project (`npm init -y` as necessary), then add the following block to your
`tsconfig.json` and you are off to the races!

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-deno-plugin",
        "enable": true, // default is `true`
        "importmap": "import_map.json"
      }
    ]
  }
}
```

If you don't see your favorite IDE on this list, maybe you can develop an
extension. Our [community Discord group](https://discord.gg/deno) can give you
some pointers on where to get started.
