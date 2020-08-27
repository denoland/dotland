<!-- ## Building from source -->
## ソースからのビルド

<!--
Below are instructions on how to build Deno from source. If you just want to use
Deno you can download a prebuilt executable (more information in the
`Getting Started` chapter).
-->
以下はソースからDenoをビルドする手順です。もしDenoを使いたいだけならプレビルドの実行ファイルを
ダウンロードしてください(詳しくは `Getting Started` の章にあります)。

<!-- ### Cloning the Repository -->
### レポジトリのクローン

<!-- Clone on Linux or Mac: -->
LinuxやMacにクローン:

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

<!-- Extra steps for Windows users: -->
Windowsユーザーのための追加の手順:

<!--
1. [Enable "Developer Mode"](https://www.google.com/search?q=windows+enable+developer+mode)
   (otherwise symlinks would require administrator privileges).
2. Make sure you are using git version 2.19.2.windows.1 or newer.
3. Set `core.symlinks=true` before the checkout:
   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```
-->
1. ["Developer Mode" の有効化](https://www.google.com/search?q=windows+enable+developer+mode)
   (これをしないとシンボリックリンクは管理者権限を必要とします)。
2. gitのバージョンが 2.19.2.windows.1 以降であるか確認してください。
3. チェックアウトの前に `core.symlinks=true` を設定してください:
   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

<!-- ### Prerequisites -->
### 前提条件

<!--
You will need to [install Rust](https://www.rust-lang.org/tools/install). Make
sure to fetch the latest stable release as Deno does not support nightly builds.
Check that you have the required tools:
-->
[Rustのインストール](https://www.rust-lang.org/tools/install) が必要です。
Denoはナイトリービルドをサポートしていないので最新の安定版リリースを取得してください。
必要なツールを持っていることを確認してください:

```
rustc -V
cargo -V
```

<!-- ### Setup rust targets and components -->
### rustターゲットとコンポーネントの設定

```shell
rustup target add wasm32-unknown-unknown
rustup target add wasm32-wasi
```

<!-- ### Building Deno -->
### Denoのビルド

<!-- The easiest way to build Deno is by using a precompiled version of V8: -->
Denoの最も簡単なビルドの方法はプリコンパイルバージョンのV8を使う方法です:

```
cargo build -vv
```

<!-- However if you want to build Deno and V8 from source code: -->
しかし、DenoとV8をソースからビルドしたい場合は:

```
V8_FROM_SOURCE=1 cargo build -vv
```

<!-- When building V8 from source, there are more dependencies: -->
V8をソースからビルドする場合は、他の依存関係があります:

<!--
[Python 2](https://www.python.org/downloads). Ensure that a suffix-less
`python`/`python.exe` exists in your `PATH` and it refers to Python 2,
[not 3](https://github.com/denoland/deno/issues/464#issuecomment-411795578).
-->
[Python 2](https://www.python.org/downloads)。`PATH` の接頭辞がない `python`/`python.exe` が [Python 3](https://github.com/denoland/deno/issues/464#issuecomment-411795578) でなく、Python 2を指していることを確認してください。

<!--
For Linux users glib-2.0 development files must also be installed. (On Ubuntu,
run `apt install libglib2.0-dev`.)
-->
Linuxユーザーはglib-2.0開発環境ファイルも必要です。(Ubuntuでは `apt install libglib2.0-dev` を実行してください。)

<!--
Mac users must have Command Line Tools installed.
([XCode](https://developer.apple.com/xcode/) already includes CLT. Run
`xcode-select --install` to install it without XCode.)
-->
Macユーザーはコマンドラインツールが必要です。([XCode](https://developer.apple.com/xcode/) はCLTを含んでいます。
XCodeをインストールしない場合 `xcode-select --install` を実行してください。)

<!-- For Windows users: -->
Windowsユーザー:

<!--
1. Get [VS Community 2019](https://www.visualstudio.com/downloads/) with
   "Desktop development with C++" toolkit and make sure to select the following
   required tools listed below along with all C++ tools.

   - Visual C++ tools for CMake
   - Windows 10 SDK (10.0.17763.0)
   - Testing tools core features - Build Tools
   - Visual C++ ATL for x86 and x64
   - Visual C++ MFC for x86 and x64
   - C++/CLI support
   - VC++ 2015.3 v14.00 (v140) toolset for desktop

2. Enable "Debugging Tools for Windows". Go to "Control Panel" → "Programs" →
   "Programs and Features" → Select "Windows Software Development Kit - Windows
   10" → "Change" → "Change" → Check "Debugging Tools For Windows" → "Change" ->
   "Finish". Or use:
   [Debugging Tools for Windows](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
   (Notice: it will download the files, you should install
   `X64 Debuggers And Tools-x64_en-us.msi` file manually.)
-->
1. [VS Community 2019](https://www.visualstudio.com/downloads/)を "Desktop development with C++" ツールキット付きで取得し、すべてのC++ツールとともに次の要求されているツールを選択してください。

   - Visual C++ tools for CMake
   - Windows 10 SDK (10.0.17763.0)
   - Testing tools core features - Build Tools
   - Visual C++ ATL for x86 and x64
   - Visual C++ MFC for x86 and x64
   - C++/CLI support
   - VC++ 2015.3 v14.00 (v140) toolset for desktop

2. "Debugging Tools for Windows" を有効にしてください。"Control Panel" → "Programs" →
   "Programs and Features" → Select "Windows Software Development Kit - Windows
   10" → "Change" → "Change" → Check "Debugging Tools For Windows" → "Change" ->
   "Finish"。もしくは以下を使用してください:
   [Debugging Tools for Windows](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
   (注意: これはファイルをダウンロードします、
   手動で `X64 Debuggers And Tools-x64_en-us.msi` をインストールしてください。)

<!--
See [rusty_v8's README](https://github.com/denoland/rusty_v8) for more details
about the V8 build.
-->
V8ビルドの詳しい情報は [rusty_v8's README](https://github.com/denoland/rusty_v8) を参照してください。

<!-- ### Building -->
### ビルド

<!-- Build with Cargo: -->
Cargoでビルド:

<!--
```shell
# Build:
cargo build -vv

# Build errors?  Ensure you have latest master and try building again, or if that doesn't work try:
cargo clean && cargo build -vv

# Run:
./target/debug/deno run cli/tests/002_hello.ts
```
-->
```shell
# ビルド:
cargo build -vv

# ビルドエラー？最新のmasterを取得しているか確かめて、もう一度ビルドしてください、もしくは動かない場合はこれを試してください:
cargo clean && cargo build -vv

# 実行:
./target/debug/deno run cli/tests/002_hello.ts
```
