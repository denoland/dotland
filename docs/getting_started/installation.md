## Installation

<!--
Deno works on macOS, Linux, and Windows. Deno is a single binary executable. It
has no external dependencies.
-->
DenoはmacOS、Linux、Windowsで動作します。Denoは1つの実行ファイルで実行可能です。外部依存はありません。

### Download and install

<!--
[deno_install](https://github.com/denoland/deno_install) provides convenience
scripts to download and install the binary.
-->
[deno_install](https://github.com/denoland/deno_install)は実行ファイルをダウンロードしてインストールするのに便利なスクリプトを提供します。

<!-- Using Shell (macOS and Linux): -->
Shell (macOS、Linux) を使う: 

```shell
curl -fsSL https://deno.land/x/install/install.sh | sh
```

<!-- Using PowerShell (Windows): -->
PowerShell (Windows) を使う:

```shell
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

<!-- Using [Scoop](https://scoop.sh/) (Windows): -->
[Scoop](https://scoop.sh/) (Windows) を使う: 

```shell
scoop install deno
```

<!-- Using [Chocolatey](https://chocolatey.org/packages/deno) (Windows): -->
[Chocolatey](https://chocolatey.org/packages/deno) (Windows) を使う: 

```shell
choco install deno
```

<!-- Using [Homebrew](https://formulae.brew.sh/formula/deno) (macOS): -->
[Homebrew](https://formulae.brew.sh/formula/deno) (macOS)を使う:

```shell
brew install deno
```

<!-- Using [Cargo](https://crates.io/crates/deno) (Windows, macOS, Linux): -->
[Cargo](https://crates.io/crates/deno) (Windows、macOS、Linux) を使う:

```shell
cargo install deno
```

<!--
Deno binaries can also be installed manually, by downloading a zip file at
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).
These packages contain just a single executable file. You will have to set the
executable bit on macOS and Linux.
-->
Deno実行ファイルは [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) のzipファイルをダウンロードして手動でインストールすることも可能です。これらのパッケージは1つの実行ファイルのみを含んでいます。macOSとLinuxでは実行可能ビットを設定する必要があります。

### Testing your installation

<!--
To test your installation, run `deno --version`. If this prints the Deno version
to the console the installation was successful.
-->
インストールが出来たか確認するために `deno --version` を実行してください。コンソールにDenoのバージョンが表示されればインストールは成功しています。

<!--
Use `deno help` to see help text documenting Deno's flags and usage. Get a
detailed guide on the CLI [here](./command_line_interface.md).
-->
`deno help` を使うことでDenoのフラグや使い方を見ることが出来ます。CLIの詳しい使い方は[こちら](./command_line_interface.md)。

### Updating

<!-- To update a previously installed version of Deno, you can run: -->
前回インストールしたDenoのバージョンからアップデートするには、次を実行してください:

```shell
deno upgrade
```

<!--
This will fetch the latest release from
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases),
unzip it, and replace your current executable with it.
-->
これは[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)から最新のリリースを取得、解凍し現在のバージョンの実行ファイルと置き換えます。

<!-- You can also use this utility to install a specific version of Deno: -->
次のユーティリティを使うことでDenoの特定のバージョンをインストールすることも出来ます:

```shell
deno upgrade --version 1.0.1
```

### Building from source

<!--
Information about how to build from source can be found in the `Contributing`
chapter.
-->
ソースからビルドする方法については `Contributing` を参照してください。
