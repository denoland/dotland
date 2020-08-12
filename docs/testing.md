<!-- # Testing -->
# テスト

<!--
Deno has a built-in test runner that you can use for testing JavaScript or
TypeScript code.
-->
DenoはJavaScriptやTypeScriptのコードをテストするためにビルトインテストランナーを持っています。

<!-- ## Writing tests -->
## テストを書く

<!--
To define a test you need to call `Deno.test` with a name and function to be
tested. There are two styles you can use.
-->
テストを定義するにはテストする名前と関数をつけて `Deno.test` を呼び出してください。

<!--
```ts
// Simple name and function, compact form, but not configurable
Deno.test("hello world #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// Fully fledged test definition, longer form, but configurable (see below)
Deno.test({
  name: "hello world #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});
```
-->
```ts
// シンプルな名前と関数コンパクトですが、設定可能ではないです。
Deno.test("hello world #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// 完全で本格的なテスト定義で長いですが、設定可能です(下記参照)
Deno.test({
  name: "hello world #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});
```

<!-- ## Assertions -->
## アサーション

<!--
There are some useful assertion utilities at
https://deno.land/std@$STD_VERSION/testing#usage to make testing easier:
-->
テストを簡単にするアサーションユーティリティは https://deno.land/std@$STD_VERSION/testing#usage にあります:

```ts
import {
  assertEquals,
  assertArrayContains,
} from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";

Deno.test("hello world", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
  assertArrayContains([1, 2, 3, 4, 5, 6], [3], "Expected 3 to be in the array");
});
```

<!-- ### Async functions -->
### Async 関数

<!--
You can also test asynchronous code by passing a test function that returns a
promise. For this you can use the `async` keyword when defining a function:
-->
promise を返すテスト関数を渡すことで非同期のコードテストできます。これをするために関数を定義するときに `async` キーワードを使うことが出来ます:

<!--
```ts
import { delay } from "https://deno.land/std@$STD_VERSION/async/delay.ts";

Deno.test("async hello world", async () => {
  const x = 1 + 2;

  // await some async task
  await delay(100);

  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});
```
-->
```ts
import { delay } from "https://deno.land/std@$STD_VERSION/async/delay.ts";

Deno.test("async hello world", async () => {
  const x = 1 + 2;

  // 非同期タスクをまつ
  await delay(100);

  if (x !== 3) {
    throw Error("x は 3 になるはずです");
  }
});
```

### Resource and async op sanitizers

Certain actions in Deno create resources in the resource table
([learn more here](./contributing/architecture.md)). These resources should be
closed after you are done using them.

For each test definition, the test runner checks that all resources created in
this test have been closed. This is to prevent resource 'leaks'. This is enabled
by default for all tests, but can be disabled by setting the `sanitizeResources`
boolean to false in the test definition.

The same is true for async operation like interacting with the filesystem. The
test runner checks that each operation you start in the test is completed before
the end of the test. This is enabled by default for all tests, but can be
disabled by setting the `sanitizeOps` boolean to false in the test definition.

```ts
Deno.test({
  name: "leaky test",
  fn() {
    Deno.open("hello.txt");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
```

## Running tests

To run the test, call `deno test` with the file that contains your test
function. You can also omit the file name, in which case all tests in the
current directory (recursively) that match the glob
`{*_,*.,}test.{js,mjs,ts,jsx,tsx}` will be run. If you pass a directory, all
files in the directory that match this glob will be run.

```shell
# Run all tests in the current directly and all sub-directories
deno test

# Run all tests in the util directory
deno test util/

# Run just my_test.ts
deno test my_test.ts
```

`deno test` uses the same permission model as `deno run` and therefore will
require, for example, `--allow-write` to write to the file system during
testing.

To see all runtime options with `deno test`, you can reference the command line
help:

```shell
deno help test
```

<!-- ## Filtering -->
## フィルタリング

<!-- There are a number of options to filter the tests you are running. -->
実行しているテストをフィルタリングするためのいくつか選択肢があります。

<!-- ### Command line filtering -->
### コマンドラインフィルタリング

<!--
Tests can be run individually or in groups using the command line `--filter`
option.
-->
`--filter` オプションを使うことで個別にあるいはグループでテストをする事ができます。

<!-- The filter flags accept a string or a pattern as value. -->
フィルターフラグは string やパターンを値として受け取ることが出来ます。

<!-- Assuming the following tests: -->
次のテストを想定:

```ts
Deno.test({ name: "my-test", fn: myTest });
Deno.test({ name: "test-1", fn: test1 });
Deno.test({ name: "test2", fn: test2 });
```

<!--
This command will run all of these tests because they all contain the word
"test".
-->
これらはすべて "test" の単語を含んでいるので、このコマンドはすべてのテストを実行します。

```shell
deno test --filter "test" tests/
```

<!--
On the flip side, the following command uses a pattern and will run the second
and third tests.
-->
逆に、次のコマンドはパターンを使用して2番目3番目のテストを実行します。

```shell
deno test --filter "/test-*\d/" tests/
```

<!--
_To let Deno know that you want to use a pattern, wrap your filter with
forward-slashes like the JavaScript syntactic sugar for a REGEX._
-->
_パターンを使いたいことをDenoに知らせるには、JavaScriptのREGEX構文のようにフィルターをフォーワードスラッシュで囲んでください。_

<!-- ### Test definition filtering -->
### 定義フィルタリングのテスト

<!-- Within the tests themselves, you have two options for filtering. -->
テスト自体にはフィルタリングのための2つのオプションがあります。

#### Filtering out (Ignoring these tests)

Sometimes you want to ignore tests based on some sort of condition (for example
you only want a test to run on Windows). For this you can use the `ignore`
boolean in the test definition. If it is set to true the test will be skipped.

```ts
Deno.test({
  name: "do macOS feature",
  ignore: Deno.build.os !== "darwin",
  fn() {
    doMacOSFeature();
  },
});
```

#### Filtering in (Only run these tests)

Sometimes you may be in the middle of a problem within a large test class and
you would like to focus on just that test and ignore the rest for now. For this
you can use the `only` option to tell the test framework to only run tests with
this set to true. Multiple tests can set this option. While the test run will
report on the success or failure of each test, the overall test run will always
fail if any test is flagged with `only`, as this is a temporary measure only
which disables nearly all of your tests.

```ts
Deno.test({
  name: "Focus on this test only",
  only: true,
  fn() {
    testComplicatedStuff();
  },
});
```

## Failing fast

<!--
If you have a long running test suite and wish for it to stop on the first
failure, you can specify the `--failfast` flag when running the suite.
-->
もしテストスイートの実行時間が長く最初のエラーでやめたい場合、スイートを実行の際 `--failfast` フラグを指定する事ができます。

```shell
deno test --failfast
```
