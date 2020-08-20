<!-- ## Assertions -->
## アサーション

<!--
To help developers write tests the Deno standard library comes with a built in
[assertions module](https://deno.land/std@$STD_VERSION/testing/asserts.ts) which
can be imported from `https://deno.land/std@$STD_VERSION/testing/asserts.ts`.
-->
開発者がテストを書くのを助けるためにDeno標準ライブラリはビルトインで [アサーションモジュール](https://deno.land/std@$STD_VERSION/testing/asserts.ts) を備えています。`https://deno.land/std@$STD_VERSION/testing/asserts.ts` からインポートできます。

```js
import { assert } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";

Deno.test("Hello Test", () => {
  assert("Hello");
});
```

<!-- The assertions module provides nine assertions: -->
アサーションモジュールは9個のアサーションを提供します:

- `assert(expr: unknown, msg = ""): asserts expr`
- `assertEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertNotEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertStrictEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertStringContains(actual: string, expected: string, msg?: string): void`
- `assertArrayContains(actual: unknown[], expected: unknown[], msg?: string): void`
- `assertMatch(actual: string, expected: RegExp, msg?: string): void`
- `assertThrows(fn: () => void, ErrorClass?: Constructor, msgIncludes = "", msg?: string): Error`
- `assertThrowsAsync(fn: () => Promise<void>, ErrorClass?: Constructor, msgIncludes = "", msg?: string): Promise<Error>`

<!-- ### Assert -->
### アサート

<!--
The assert method is a simple 'truthy' assertion and can be used to assert any
value which can be inferred as true.
-->
アサートメソッドはシンプルな 'truthy' アサーションであり、trueに推測されるどんな値でもアサートできます。

```js
Deno.test("Test Assert", () => {
  assert(1);
  assert("Hello");
  assert(true);
});
```

<!-- ### Equality -->
### 同等性

<!--
There are three equality assertions available, `assertEquals()`,
`assertNotEquals()` and `assertStrictEquals()`.
-->
`assertEquals()`、`assertNotEquals()`、`assertStrictEquals()` の3つのアサーションが利用可能です。

<!--
The `assertEquals()` and `assertNotEquals()` methods provide a general equality
check and are capable of asserting equality between primitive types and objects.
-->
`assertEquals()` と `assertNotEquals()` メソッドは一般的な同等性チェックを提供し、プリミティブ型とオブジェクト間の同等性を保証します。

```js
Deno.test("Test Assert Equals", () => {
  assertEquals(1, 1);
  assertEquals("Hello", "Hello");
  assertEquals(true, true);
  assertEquals(undefined, undefined);
  assertEquals(null, null);
  assertEquals(new Date(), new Date());
  assertEquals(new RegExp("abc"), new RegExp("abc"));

  class Foo {}
  const foo1 = new Foo();
  const foo2 = new Foo();

  assertEquals(foo1, foo2);
});

Deno.test("Test Assert Not Equals", () => {
  assertNotEquals(1, 2);
  assertNotEquals("Hello", "World");
  assertNotEquals(true, false);
  assertNotEquals(undefined, "");
  assertNotEquals(new Date(), Date.now());
  assertNotEquals(new RegExp("abc"), new RegExp("def"));
});
```

<!--
By contrast `assertStrictEquals()` provides a simpler, stricter equality check
based on the `===` operator. As a result it will not assert two instances of
identical objects as they won't be referentially the same.
-->
対して、`assertStrictEquals()` は `===` 演算子に基づいたよりシンプルで厳密な同等性チェックを提供します。その結果、同一のオブジェクトのインスタンスが2つある場合、それらは参照的に同じではないためアサートしません。

```js
Deno.test("Test Assert Strict Equals", () => {
  assertStrictEquals(1, 1);
  assertStrictEquals("Hello", "Hello");
  assertStrictEquals(true, true);
  assertStrictEquals(undefined, undefined);
});
```

<!--
The `assertStrictEquals()` assertion is best used when you wish to make a
precise check against two primitive types.
-->
`assertStrictEquals()` アサーションは2つのプリミティブ型に対して正確なチェックを行いたい場合に最適です。

<!-- ### Contains -->
### 含有性

<!--
There are two methods available to assert a value contains a value,
`assertStringContains()` and `assertArrayContains()`.
-->
値に含まれる値をアサートするには、`assertStringContains()` と `assertArrayContains()` の二つのメソッドが利用可能です。

<!--
The `assertStringContains()` assertion does a simple includes check on a string
to see if it contains the expected string.
-->
`assertStringContains()` アサーションは予測される文字列が含まれているかどうかを確認するための、文字列に対する簡単な含有チェックです。

```js
Deno.test("Test Assert String Contains", () => {
  assertStringContains("Hello World", "Hello");
});
```

<!--
The `assertArrayContains()` assertion is slightly more advanced and can find
both a value within an array and an array of values within an array.
-->
`assertArrayContains()` アサーションは、配列の値と配列内の値の配列の両方を見つけることができる少し高度なアサーションです。

```js
Deno.test("Test Assert Array Contains", () => {
  assertArrayContains([1, 2, 3], [1]);
  assertArrayContains([1, 2, 3], [1, 2]);
  assertArrayContains(Array.from("Hello World"), Array.from("Hello"));
});
```

### Regex

<!-- You can assert regular expressions via the `assertMatch()` assertion. -->
`assertMatch()` アサーションを通して正規表現でアサートできます。

```js
Deno.test("Test Assert Match", () => {
  assertMatch("abcdefghi", new RegExp("def"));

  const basicUrl = new RegExp("^https?://[a-z.]+.com$");
  assertMatch("https://www.google.com", basicUrl);
  assertMatch("http://facebook.com", basicUrl);
});
```

### Throws

<!--
There are two ways to assert whether something throws an error in Deno,
`assertThrows()` and `assertAsyncThrows()`. Both assertions allow you to check
an
[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
has been thrown, the type of error thrown and what the message was.
-->
Denoにエラーを投げる際のアサートは `assertThrows()` と `assertAsyncThrows()` の二つの方法があります。どちらのアサーションもエラーの型とメッセージの内容が投げられた時は [Error](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error) をチェックすることができます。

<!--
The difference between the two assertions is `assertThrows()` accepts a standard
function and `assertAsyncThrows()` accepts a function which returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
-->
二つのアサーションの違いは、`assertThrows()` は標準的な機能を備え持っていて、`assertAsyncThrows()` は [Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise) を返す機能を備え持っているところです。

<!--
The `assertThrows()` assertion will check an error has been thrown, and
optionally will check the thrown error is of the correct type, and assert the
error message is as expected.
-->
`assertThrows()` アサーションは投げられたエラーをチェックし、必要に応じて、投げられたエラーの型が正しい型であるかどうかをチェックし、エラーメッセージが予測通りかどうかをアサートします。

```js
Deno.test("Test Assert Throws", () => {
  assertThrows(
    () => {
      throw new Error("Panic!");
    },
    Error,
    "Panic!",
  );
});
```

<!--
The `assertAsyncThrows()` assertion is a little more complicated, mainly because
it deals with Promises. But basically it will catch thrown errors or rejections
in Promises. You can also optionally check for the error type and error message.
-->
`assertAsyncThrows()` アサーションは少し複雑で、主にPromiseを伴って処理をします。しかし、基本的には投げられたエラーかPromiseの中のリジェクションをキャッチします。必要に応じて、エラーの方やエラーメッセージのチェックができます。

```js
Deno.test("Test Assert Throws Async", () => {
  assertThrowsAsync(
    () => {
      return new Promise(() => {
        throw new Error("Panic! Threw Error");
      });
    },
    Error,
    "Panic! Threw Error",
  );

  assertThrowsAsync(
    () => {
      return Promise.reject(new Error("Panic! Reject Error"));
    },
    Error,
    "Panic! Reject Error",
  );
});
```

<!-- ### Custom Messages -->
### カスタムメッセージ

<!--
Each of Deno's built in assertions allow you to overwrite the standard CLI error
message if you wish. For instance this example will output "Values Don't Match!"
rather than the standard CLI error message.
-->
それぞれのDenoビルトインのアサーションはCLIエラーメッセージを好きなものに上書き可能です。例えば、この例では標準CLIエラーメッセージの代わりに"Values Don't Match!"を出力します。

```js
Deno.test("Test Assert Equal Fail Custom Message", () => {
  assertEquals(1, 2, "Values Don't Match!");
});
```
