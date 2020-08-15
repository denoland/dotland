<!-- ## Testing if current file is the main program -->
## 現在のファイルがmainプログラムかどうかのテスト

<!--
To test if the current script has been executed as the main input to the program
check `import.meta.main`.
-->
現在のスクリプトがプログラムのmainかどうかをテストするには `import.meta.main` を確認してください。

```ts
if (import.meta.main) {
  console.log("main");
}
```
