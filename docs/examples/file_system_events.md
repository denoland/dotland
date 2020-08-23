<!-- ### File system events -->
## ファイルシステムイベント

<!-- To poll for file system events: -->
ファイルシステムイベントをポーリングするには:

```ts
const watcher = Deno.watchFs("/");
for await (const event of watcher) {
  console.log(">>>> event", event);
  // { kind: "create", paths: [ "/foo.txt" ] }
}
```

<!--
Note that the exact ordering of the events can vary between operating systems.
This feature uses different syscalls depending on the platform:
-->
イベントの順番はオペレーションシステムによって変わる可能性があります。この機能はプロットフォームによって別々のシステムコールを使います:

- Linux: inotify
- macOS: FSEvents
- Windows: ReadDirectoryChangesW
