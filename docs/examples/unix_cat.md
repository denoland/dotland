<!-- # An implementation of the unix "cat" program -->
# unix "cat" プログラムの実装

<!-- ## Concepts -->
## 概念

<!--
- Use the Deno runtime API to output the contents of a file to the console
- [Deno.args](https://doc.deno.land/builtin/stable#Deno.args) accesses the
  command line arguments
- [Deno.open](https://doc.deno.land/builtin/stable#Deno.open) is used to get a
  handle to a file
- [Deno.copy](https://doc.deno.land/builtin/stable#Deno.copy) is used to
  transfer data from the file to the output stream
- Files should be closed when you are finished with them
- Modules can be run directly from remote URLs
-->
- DenoランタイムAPIを使用し、ファイルの内容をコンソールに出力します
- [Deno.args](https://doc.deno.land/builtin/stable#Deno.args) はコマンドライン引数にアクセスします
- [Deno.open](https://doc.deno.land/builtin/stable#Deno.open) はファイルの取得に使用します
- [Deno.copy](https://doc.deno.land/builtin/stable#Deno.copy) はファイルから出力ストリームにデータを転送します
- ファイルは終了したあとに閉じられるべきです
- モジュールはリモートURLから直接実行できます

## Example

<!--
In this program each command-line argument is assumed to be a filename, the file
is opened, and printed to stdout (e.g. the console).
-->
このプログラムはそれぞれのコマンドライン引数をファイル名とし、そのファイルを開き標準出力に表示します(例、コンソール)。

```ts
/**
 * cat.ts
 */
for (let i = 0; i < Deno.args.length; i++) {
  const filename = Deno.args[i];
  const file = await Deno.open(filename);
  await Deno.copy(file, Deno.stdout);
  file.close();
}
```
<!-- To run the program: -->
プログラムを実行:

```shell
deno run --allow-read https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
```
