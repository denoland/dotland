<!-- ## Internal details -->
## 内部の詳細

<!-- ### Deno and Linux analogy -->
### DenoとLinuxの類推

|                       **Linux** | **Deno**                                     |
| ------------------------------: | :------------------------------------------- |
|                       Processes | Web Workers                                  |
|                        Syscalls | Ops                                          |
|           File descriptors (fd) | [Resource ids (rid)](architecture#resources) |
|                       Scheduler | Tokio                                        |
| Userland: libc++ / glib / boost | https://deno.land/std/                       |
|                 /proc/\$\$/stat | [Deno.metrics()](architecture#metrics)       |
|                       man pages | deno types                                   |

<!-- #### Resources -->
#### リソース

<!--
Resources (AKA `rid`) are Deno's version of file descriptors. They are integer
values used to refer to open files, sockets, and other concepts. For testing it
would be good to be able to query the system for how many open resources there
are.
-->
リソース(別名 `rid`)はファイル記述子のDeno版である。これらは開いているファイル、ソケット、その他の概念を参照するために使用される整数値です。テストでは開いているリソースの数を数えることが出来ると良いでしょう。

```ts
console.log(Deno.resources());
// { 0: "stdin", 1: "stdout", 2: "stderr" }
Deno.close(0);
console.log(Deno.resources());
// { 1: "stdout", 2: "stderr" }
```

<!-- #### Metrics -->
#### メトリック

<!-- Metrics is Deno's internal counter for various statistics. -->
メトリックは各種統計のためのDenoの内部カウンターです。

```shell
> console.table(Deno.metrics())
┌──────────────────┬────────┐
│     (index)      │ Values │
├──────────────────┼────────┤
│  opsDispatched   │   9    │
│   opsCompleted   │   9    │
│ bytesSentControl │  504   │
│  bytesSentData   │   0    │
│  bytesReceived   │  856   │
└──────────────────┴────────┘
```

<!-- ### Schematic diagram -->
### 概要図

![architectural schematic](https://deno.land/images/schematic_v0.2.png)
