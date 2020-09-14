<!-- # Read and Write Files -->
# ファイルの読み書き

<!-- ## Concepts -->
## 概念

<!--
- Deno's runtime API provides the
  [Deno.readTextFile](https://doc.deno.land/builtin/stable#Deno.readTextFile)
  and
  [Deno.writeTextFile](https://doc.deno.land/builtin/stable#Deno.writeTextFile)
  asynchronous functions for reading and writing entire text files
- Like many of Deno's APIs, synchronous alternatives are also available. See
  [Deno.readTextFileSync](https://doc.deno.land/builtin/stable#Deno.readTextFileSync)
  and
  [Deno.writeTextFileSync](https://doc.deno.land/builtin/stable#Deno.writeTextFileSync)
- Deno's [standard library]() provides additional functionality for file system
  access, for example reading and writing JSON
- Use `--allow-read` and `--allow-write` permissions to gain access to the file
  system
-->
- テキストファイルの読み書きのために、DenoのランタイムAPIは [Deno.readTextFile](https://doc.deno.land/builtin/stable#Deno.readTextFile) と [Deno.writeTextFile](https://doc.deno.land/builtin/stable#Deno.writeTextFile) 非同期関数を提供します
- 多くのDENOのAPIと同じように、同等の同期関数も利用可能です。[Deno.readTextFileSync](https://doc.deno.land/builtin/stable#Deno.readTextFileSync) と [Deno.writeTextFileSync](https://doc.deno.land/builtin/stable#Deno.writeTextFileSync) を見てください
- Denoの [標準ライブラリ]() はJSONの読み書きなどのファイルシステムアクセスへの追加の関数を提供しています
- ファイルシステムへのアクセスには `--allow-read` と `--allow-write` パーミッションが必要です

<!-- ## Overview -->
## 概要

Interacting with the filesystem to read and write files is a common requirement.
Deno provides a number of ways to do this via the
[standard library](https://deno.land/std) and the
[Deno runtime API](https://doc.deno.land/builtin/stable).

<!--
As highlighted in the [Fetch Data example](./fetch_data) Deno restricts access
to Input / Output by default for security reasons. Therefore when interacting
with the filesystem the `--allow-read` and `--allow-write` flags must be used
with the `deno run` command.
-->
[データ取得の例](./fetch_data) で強調されていたようにDenoはセキュリティ上の理由からデフォルトでInput/Outputのアクセスを制限しています。そのためファイルシステムを操作する場合 `deno run` コマンドで `--allow-read` と `--allow-write` フラグを使用しなければいけません。

<!-- ## Reading a text file -->
## テキストファイルの読み込み

<!--
The Deno runtime API makes it possible to read text files via the
`readTextFile()` method, it just requires a path string or URL object. The
method returns a promise which provides access to the file's text data.
-->
DenoランタイムAPIは `readTextFile()` メソッドを通してテキストファイルを読み込むことを可能にしています。このメソッドはパスかURLオブジェクトを要求します。
このメソッドはファイルのテキストデータへのアクセスを提供するプロミスを返します。

**Command:** `deno run --allow-read read.ts`

```typescript
/**
 * read.ts
 */
async function readFile(path: string): Promise<string> {
  return await Deno.readTextFile(new URL(path, import.meta.url));
}

const text = readFile("./people.json");

text.then((response) => console.log(response));

/**
 * Output:
 *
 * [
 *   {"id": 1, "name": "John", "age": 23},
 *   {"id": 2, "name": "Sandra", "age": 51},
 *   {"id": 5, "name": "Devika", "age": 11}
 * ]
 */
```

<!--
The Deno standard library enables more advanced interaction with the filesystem
and provides methods to read and parse files. The `readJson()` and
`readJsonSync()` methods allow developers to read and parse files containing
JSON. All these methods require is a valid file path string which can be
generated using the `fromFileUrl()` method.
-->
Deno標準ライブラリはより高度なファイルシステムの操作を可能にし、読み込むファイルのパースのメソッドを提供します。`readJson()` と `readJsonSync()` メソッドは開発者に読み込みとJSONを含んでいるファイルのパースを可能にします。これら全てのメソッドは `fromFileUrl()` メソッドを使って生成された有効なファイルパスが必要です。

<!--
In the example below the `readJsonSync()` method is used. For asynchronous
execution use the `readJson()` method.
-->
下記の例では `readJsonSync()` メソッドが使われています。非同期実行では `readJson()` が使われています。

<!--
Currently some of this functionality is marked as unstable so the `--unstable`
flag is required along with the `deno run` command.
-->
現在いくつかの機能は不安定版のため、`deno run` コマンドで `--unstable` フラグが必要です。

**Command:** `deno run --unstable --allow-read read.ts`

```typescript
/**
 * read.ts
 */
import { readJsonSync } from "https://deno.land/std@$STD_VERSION/fs/mod.ts";
import { fromFileUrl } from "https://deno.land/std@$STD_VERSION/path/mod.ts";

function readJson(path: string): object {
  const file = fromFileUrl(new URL(path, import.meta.url));
  return readJsonSync(file) as object;
}

console.log(readJson("./people.json"));

/**
 * Output:
 *
 * [
 *   {"id": 1, "name": "John", "age": 23},
 *   {"id": 2, "name": "Sandra", "age": 51},
 *   {"id": 5, "name": "Devika", "age": 11}
 * ]
 */
```

<!-- ## Writing a text file -->
## テキストファイルの書き込み

<!--
The Deno runtime API allows developers to write text to files via the
`writeTextFile()` method. It just requires a file path and text string. The
method returns a promise which resolves when the file was successfully written.
-->
DenoランタイムAPIは `writeTextFile()` メソッドを通してテキストファイルを読み込むことを可能にしています。このメソッドはパスかURLオブジェクトを要求します。このメソッドはファイルが正常に書き込まれたときに解決するプロミスを返します。

<!--
To run the command the `--allow-write` flag must be supplied to the `deno run`
command.
-->
コマンドを実行するためには、`deno run` コマンドに `--allow-write` フラグが必要です。

**Command:** `deno run --allow-write write.ts`

```typescript
/**
 * write.ts
 */
async function writeFile(path: string, text: string): Promise<void> {
  return await Deno.writeTextFile(path, text);
}

const write = writeFile("./hello.txt", "Hello World!");

write.then(() => console.log("File written to ./hello.txt"));

/**
 * Output: File written to ./hello.txt
 */
```

<!--
The Deno standard library makes available more advanced features to write to the
filesystem. For instance it is possible to write an object literal to a JSON
file.
-->
Deno標準ライブラリはファイルシステムに書き込むための高度な機能を提供します。例えば、オブジェクトリテラルをJSONファイルに書き込むことが出来ます。

<!--
This requires a combination of the `ensureFile()`, `ensureFileSync()`,
`writeJson()` and `writeJsonSync()` methods. In the example below the
`ensureFileSync()` and the `writeJsonSync()` methods are used. The former checks
for the existence of a file, and if it doesn't exist creates it. The latter
method then writes the object to the file as JSON. If asynchronous execution is
required use the `ensureFile()` and `writeJson()` methods.
-->
これには、`ensureFile()`、`ensureFileSync()`、`writeJson()`、`writeJsonSync()` メソッドの組み合わせが必要です。下記の例では、`ensureFileSync()` と `writeJsonSync()` メソッドが使われています。前者はファイルが存在するかどうかチェックし、存在しなければ作成します。後者はオブジェクトをJSONとしてファイルに書き込みます。非同期での実行が必要な時は `ensureFile()` と `writeJson()` を用いてください。

<!--
To execute the code the `deno run` command needs the unstable flag and both the
write and read flags.
-->
コードを実行するには `deno run` コマンドで不安定フラグと読み書きフラグが必要です。

**Command:** `deno run --allow-write --allow-read --unstable write.ts`

```typescript
/**
 * write.ts
 */
import {
  ensureFileSync,
  writeJsonSync,
} from "https://deno.land/std@$STD_VERSION/fs/mod.ts";

function writeJson(path: string, data: object): string {
  try {
    ensureFileSync(path);
    writeJsonSync(path, data);

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

console.log(writeJson("./data.json", { hello: "World" }));

/**
 * Output: Written to ./data.json
 */
```