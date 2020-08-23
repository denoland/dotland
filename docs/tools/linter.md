<!-- ## Linter -->
## リンター

<!-- Deno ships with a built in code linter for JavaScript and TypeScript. -->
DenoはTypeScriptとJavaScriptのコードリンターをビルトインで備えています。

<!--
**Note: linter is a new feature and still unstable thus it requires `--unstable`
flag**
-->
**注意: リンターはまだ不安定版なので `--unstable` が必要です**

<!--
```shell
# lint all JS/TS files in the current directory and subdirectories
deno lint --unstable
# lint specific files
deno lint --unstable myfile1.ts myfile2.ts
```
-->
```shell
# 現在のディレクトリとサブディレクトリのすべてのJS/TSファイルをリント
deno lint --unstable
# 特定のファイルをリント
deno lint --unstable myfile1.ts myfile2.ts
```

<!-- ### Available rules -->
### 利用可能なルール

- `ban-ts-comment`
- `ban-untagged-ignore`
- `constructor-super`
- `for-direction`
- `getter-return`
- `no-array-constructor`
- `no-async-promise-executor`
- `no-case-declarations`
- `no-class-assign`
- `no-compare-neg-zero`
- `no-cond-assign`
- `no-debugger`
- `no-delete-var`
- `no-dupe-args`
- `no-dupe-keys`
- `no-duplicate-case`
- `no-empty-character-class`
- `no-empty-interface`
- `no-empty-pattern`
- `no-empty`
- `no-ex-assign`
- `no-explicit-any`
- `no-func-assign`
- `no-misused-new`
- `no-namespace`
- `no-new-symbol`
- `no-obj-call`
- `no-octal`
- `no-prototype-builtins`
- `no-regex-spaces`
- `no-setter-return`
- `no-this-alias`
- `no-this-before-super`
- `no-unsafe-finally`
- `no-unsafe-negation`
- `no-with`
- `prefer-as-const`
- `prefer-namespace-keyword`
- `require-yield`
- `triple-slash-reference`
- `use-isnan`
- `valid-typeof`

### Ignore directives

<!-- #### Files -->
#### ファイル

<!--
To ignore whole file `// deno-lint-ignore-file` directive should placed at the
top of the file:
-->
ファイルをすべて無視するには `// deno-lint-ignore-file` ディレクティブをファイルの一番初めに置いてください:

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

<!-- Ignore directive must be placed before first stament or declaration: -->
Ignore directiveは文や宣言の前に置く必要があります:

<!--
```ts
// Copyright 2020 the Deno authors. All rights reserved. MIT license.

/**
 * Some JS doc
 **/

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```
-->
```ts
// Copyright 2020 the Deno authors. All rights reserved. MIT license.

/**
 * なにかJSDoc
 **/

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

<!-- #### Diagnostics -->
#### 診断

<!--
To ignore certain diagnostic `// deno-lint-ignore <codes...>` directive should
be placed before offending line. Specifying ignored rule name is required:
-->
特定の診断を無視するには `// deno-lint-ignore <codes...>` ディレクティブを違反行の前においてください。無視するルールを指定する必要があります:

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

<!--
To provide some compatibility with ESLint `deno lint` also supports
`// eslint-ignore-next-line` directive. Just like with `// deno-lint-ignore`,
it's required to specify the ignored rule name:
-->
ESLintとの互換性を確保するために `deno lint` は `// eslint-ignore-next-line` ディレクティブをサポートします。`// deno-lint-ignore` と同様に無視するルールを指定する必要があります:

```ts
// eslint-ignore-next-line no-empty
while (true) {}

// eslint-ignore-next-line @typescript-eslint/no-explicit-any
function bar(a: any) {
  // ...
}
```
