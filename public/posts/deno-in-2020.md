随着 API 稳定化改造、若干大型基础结构进行重构，Deno 1.0 版本正式发布。同时
，shipping the single most requested feature ⚠️，2020 年 Deno 项目迎来了众多的挑
战和变化。

请填写[这份 Deno 调查问卷](https://forms.gle/hbhP46LUAfVFMggU6)来向我们反馈以让
Deno 在 2021 年变得更好。

下文是 Deno 的 2020 年度回顾。

## January: Goodbye libdeno, hello rusty_v8

## 一月：再见 libdeno，你好 rusty_v8

`libdeno` 是一个 C++ 库，可以桥接 Deno 中的 V8 引擎和 Rust 代码 ⚠️。此库很难进行
推理 ⚠️ 并在其上开发额外的功能。基于这种情况，最终导致了 `rusty_v8` 在 2019 年秋
季的诞生。[`rusty_v8`](https://github.com/denoland/rusty_v8) 是一个为 V8 引擎提
供相关 API 的 Rust 库 ⚠️。到了同年 12 月，`rusty_v8` 已具有所有必需的绑定 ⚠️ 来
替换 `libdeno`。这项工作始于 2019 年年底，当时先使用 `rusty_v8` 重写了 `libdeno`
的一部分。由于 Deno 代码库中测试覆盖率的不断提高，我们很有信心地继续推进了相关工
作，并在两周内完成了这项工作。`libdeno` 最终在 0.29.0 版本中被完全替换删除，此后
rusty_v8 也经历了绑定类型安全性的重要重构 ⚠️。

**本月发布的版本：**

- [0.28.0](https://github.com/denoland/deno/releases/tag/v0.28.0)
- [0.28.1](https://github.com/denoland/deno/releases/tag/v0.28.1)
- [0.29.0](https://github.com/denoland/deno/releases/tag/v0.29.0)
- [0.30.0](https://github.com/denoland/deno/releases/tag/v0.30.0)
- [0.31.0](https://github.com/denoland/deno/releases/tag/v0.31.0)

## 二月：deno fmt 现由 dprint 构建、deno test 子命令

本月我们彻底地重构了 `deno fmt`。与此之前，`deno fmt` 是一个简单的子命令，其在背
后只是最终指向 `prettier` 的“deno run”的一个别名。这意味着在首次运行 `deno fmt`
以及每次 `prettier` 升级后，用户都必须下载 `prettier` 的最新版本。这和 Deno 承诺
的内置工具开箱即用的原则很不契合。同时，`prettier` 真的很慢，其性能问题也值得被
质询【⚠️ 质询？】。

我们被推荐了 [David Sherret](https://github.com/dsherret) 的
[dprint](https://dprint.dev/) 库——一个基于
[Kang Dong Yun](https://github.com/kdy1) 的 SWC JavaScript 编辑器并由 Rust 编写
的代码格式化工具。`dprint` 可以和 `prettier` 库一样的工作，但速度却要快上好几个
数量级。经过了一些初步测算后，我们决定在 `deno fmt` 中使用 `dprint`。

`deno test` 也有在首次运行该命令时从标准库中下载模块的问题【⚠️ 也有这个要求/问题
？】。这导致添加了新的 `Deno.test()` API 和 `deno test` CLI 子命令【⚠️ which
made testing in Deno first class citizen.】

**本月发布的版本：**

- [0.32.0](https://github.com/denoland/deno/releases/tag/v0.32.0)
- [0.33.0](https://github.com/denoland/deno/releases/tag/v0.33.0)
- [0.34.0](https://github.com/denoland/deno/releases/tag/v0.34.0)
- [0.35.0](https://github.com/denoland/deno/releases/tag/v0.35.0)

## 三月：V8 调试器、deno doc、deno upgrade

如若缺少 Chrome Devtools 的支持将会 1.0 版本的主要缺陷【⚠️ 1.0 最终好像支持了
Chrome 调试工具？支持了就能翻译为“如若”】【⚠️ Devtools 是否需要翻译】【⚠️ major
blocker 主要障碍/缺陷？】。因此，我们花了很多精力来增加对 V8 调试器的支持以及使
用 Chrome Devtools 连接到 Deno 进程的能力。

CLI 中也添加了两个新的命令：

- `deno doc`
- `deno upgrade`

我们同时经历了构建过程的巨大改进。与此之前，Deno 中的每一次构建都会导致 V8 从源
码级别进行重新构建。V8 是一个庞大的 C++ 项目，常常需要花费 30 多分钟来对其进行构
建。尽管有大量的构建缓存和更多技巧，我们也一直难以克服得更好。现在，我们增加了
rusty_v8 在 Github 发行版上生成和下载预构建过的静态库的能力，从而允许 Deno 构建
过程完全绕过 V8 的构建。这简化并加快了 CI 的构建，同时更重要的是，这让贡献者变得
可以更轻松地构建 Deno。

**本月发布的版本：**

- [0.36.0](https://github.com/denoland/deno/releases/tag/v0.36.0)
- [0.37.0](https://github.com/denoland/deno/releases/tag/v0.37.0)
- [0.37.1](https://github.com/denoland/deno/releases/tag/v0.37.1)
- [0.38.0](https://github.com/denoland/deno/releases/tag/v0.38.0)

## 四月：破坏所有的 API 来构造稳定性 ⚠️

本月为 1.0 的正式发布做准备，重点关注在审阅 `Deno` global 全局中的 API。这导致了
诸多破坏性的改动。对此我们需要很谨慎：我们不确定的所有 API 都需要被移到
`--ubstable` 标志之后。

这也是 1.0 版本的重要承诺；在 2.0 发布之前，标记为稳定的 Deno API 将不会有破坏性
的更改。

本月是 Deno 版本以 0.x.y 命名的最后阶段。

**本月发布的版本：**

- [0.39.0](https://github.com/denoland/deno/releases/tag/v0.39.0)
- [0.40.0](https://github.com/denoland/deno/releases/tag/v0.40.0)
- [0.41.0](https://github.com/denoland/deno/releases/tag/v0.41.0)
- [0.42.0](https://github.com/denoland/deno/releases/tag/v0.42.0)

## 五月：Deno 1.0 正式发布

本月初标记删除了如下功能：

- JSON imports
- WASM imports
- `window.location`  API
- Rust API for  `deno` crate【⚠️ 需要怎么翻译】

删除的原因是，我们不想因为 JSON/WASM imports 缺少底层规范支持、或者 Rust
API【⚠️or additional maintenance burden in case of Rust API for  `deno`
 crate.】的情况下提供相关 API。

终于在 5 月 13 日
——[Ryan 最初发表 Deno 演讲](https://www.youtube.com/watch?v=M3BM9TB-8yA)的整整两
年后，我们正式发布了 1.0。

在社交媒体上，这个版本非常受到欢迎。我们的[相关博客](https://deno.land/v1)被广为
传播。我们也收获了大量的新用户和新贡献者。

But the dust had barely settled before we were back to work on another major
component of the runtime【⚠️】：TypeScript 宿主中的依赖关系分析是使用
[SWC](<(https://swc.rs/)>) 重写的。这次的改动标志着我们开始着手用 Rust 来重写
TypeScript 基础结构的一些部分。

**本月发布的版本：**

- [1.0.0-rc1](https://github.com/denoland/deno/releases/tag/v1.0.0-rc1)
- [1.0.0-rc2](https://github.com/denoland/deno/releases/tag/v1.0.0-rc2)
- [1.0.0-rc3](https://github.com/denoland/deno/releases/tag/v1.0.0-rc3)
- [1.0.0](https://github.com/denoland/deno/releases/tag/v1.0.0)
- [1.0.1](https://github.com/denoland/deno/releases/tag/v1.0.1)
- [1.0.2](https://github.com/denoland/deno/releases/tag/v1.0.2)
- [1.0.3](https://github.com/denoland/deno/releases/tag/v1.0.3)

## 六月：增量类型检查以及 deno lint

1.0 发布后，从社区中收到最多的反馈之一就是 TypeScript 的编译和类型检查非常地慢。
此后我们着眼于改进 TSC 集成来支持增量类型检查【⚠️ 增量类型检查？】。经过几次反复
试验的 PR，我们便能使缩短开发周期的功能正常跑通，并达到缩短的目的。尽管我们通过
利用 TSC 的增量 API 设法提高了类型的检查的速度，但我们仍然需要依靠它来 emit 已转
换的源【⚠️ emit transpiled sources】。TypeScript 的伟大设计原则之一是它只是一个
具有附加预发的 JavaScript，因此剥离类型信息（转换为 JavaScript）是相对容易的操作
。所以我们设定了能够在 Rust 中使用 SWC 进行转移的同时，继续使用 TSC 进行类型检查
的目标。

经过几个月的开发，在一个单独的仓库中，我们添加了新的 `deno lint` 子命令。这是另
一个建立在 SWC JavaScript 解析器之上的项目。

**本月发布的版本：**

- [1.0.4](https://github.com/denoland/deno/releases/tag/v1.0.4)
- [1.0.5](https://github.com/denoland/deno/releases/tag/v1.0.5)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.2](https://github.com/denoland/deno/releases/tag/v1.1.2)

**Releases that month:**

- [1.0.4](https://github.com/denoland/deno/releases/tag/v1.0.4)
- [1.0.5](https://github.com/denoland/deno/releases/tag/v1.0.5)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.2](https://github.com/denoland/deno/releases/tag/v1.1.2)

## 七月：将内部运行时代码从 TypeScript 转换为 JavaScript

这个月，我们做出了一个艰难的决定
：[将内部运行时代码从 TypeScript 转换为 JavaScript](https://github.com/denoland/deno/pull/6793)。
有几个因素导致了我们做出这个决定：Deno 内部运行时代码的每个构建过程中，类型检查
、[快照](https://v8.dev/blog/custom-startup-snapshots)前绑定【⚠️】，都是复杂而缓
慢的构建步骤。我们有两个独立的 TypeScript 编译器宿主。一个是 `deno_typescript`
crate 只用于构建过程，另一个被包含在 `Deno` 二进制文件中。此外，整个过程对构建时
间有显著影响：2 分钟的增量重建【⚠️】！通过使用普通的 JavaScript，我们能够极大地
简化内部构建依赖关系和总体复杂性。因为实际的 JavaScript 代码是由 TypeScript 编译
器作为单个文件包生成的，所以我们几乎无法控制输出代码的类型。ES 模块被转换为使用
捆绑包中的 SystemJS 加载程序，这为最终捆绑包添加了大量代码【⚠️】。

**本月发布的版本：**

- [1.1.3](https://github.com/denoland/deno/releases/tag/v1.1.3)
- [1.2.0](https://github.com/denoland/deno/releases/tag/v1.2.0)
- [1.2.1](https://github.com/denoland/deno/releases/tag/v1.2.1)
- [1.2.2](https://github.com/denoland/deno/releases/tag/v1.2.2)

## 八月：新的镜像源网站发布

原始文章：
[https://deno.land/posts/registry2](https://deno.land/posts/registry2)

八月三日，我们发布了一个全新的 [deno.land/x](https://deno.land/x) 镜像源，可以用
来通过使用 WebHooks 与 Github 集成。每当一个模块被更新，我们的系统会下载并永远保
存其源代码，这样我们就可以依赖不可变的源代码链接。

由于在使用 Deno 基础设施时进行了一些非公开工作，我们开始努力将 Deno 系统分解成更
小的“op crates”，可以混合和匹配以生成定制的 V8 运行时。8 月份，我们朝着这个目标
迈出了第一步，发布了 [deno_web crate](https://crates.io/crates/deno_web)，它提供
了一些基本的 Web API，比如 `Event`、`TextUncoder` 和 `TextDecoder`。

这个月，基准系统使用 Rust 重写，这标志着减少 Deno 项目的构建依赖性的单调工作的开
始。

**本月发布的版本：**

- [1.2.3](https://github.com/denoland/deno/releases/tag/v1.2.3)
- [1.3.0](https://github.com/denoland/deno/releases/tag/v1.3.0)
- [1.3.1](https://github.com/denoland/deno/releases/tag/v1.3.1)
- [1.3.2](https://github.com/denoland/deno/releases/tag/v1.3.2)

## 九月：WebSocket API、终端下的 CSS 样式、文件监听、测试覆盖

本月，我们发布了自 1.0 以来最大的功能版本。更多细节请参见
[1.4.0 发布说明](https://deno.land/posts/v1.4)文档。

另一个重要变化是关于项目的版本维护部分。发布时间表正式改变：从每月发布一次改为每
六周发布一次新的版本，以与 Rust 和 Chrome 项目相匹配。

**本月发布的版本：**

- [1.3.3](https://github.com/denoland/deno/releases/tag/v1.3.3)
- [1.4.0](https://github.com/denoland/deno/releases/tag/v1.4.0)
- [1.4.1](https://github.com/denoland/deno/releases/tag/v1.4.1)
- [1.4.2](https://github.com/denoland/deno/releases/tag/v1.4.2)

## 十月：REPL 翻新、捆绑改进、默认 isolatedModules

[1.5.0 发布说明](https://deno.land/posts/v1.5)。

本月发生的最大变化是在 TypeScript 编译器宿主中默认启用 `isolatedModules` 选项。
此设置更改了 TypeScript 的行为，以确保每个文件都可以由 TSC 以外的工具（如 SWC 和
Babel）隔离编译（而无需知道其类型或其它模块）。这一变化对模块生态系统产生了重大
影响，一度使得一些流行的模块无法使用，直到维护人员调整代码来支持
`isolatedModules`。

这个月我们还在 SWC 中采用了新的 bundle 特性，这是对原始 TypeScript 编译器转向使
用 Rust 方向的又一步迈进。

**本月发布的版本：**

- [1.4.3](https://github.com/denoland/deno/releases/tag/v1.4.3)
- [1.4.4](https://github.com/denoland/deno/releases/tag/v1.4.4)
- [1.4.5](https://github.com/denoland/deno/releases/tag/v1.4.5)
- [1.4.6](https://github.com/denoland/deno/releases/tag/v1.4.6)
- [1.5.0](https://github.com/denoland/deno/releases/tag/v1.5.0)
- [1.5.1](https://github.com/denoland/deno/releases/tag/v1.5.1)

## 十一月：大改 TSC 编译器基础结构

本月我们看到了 [Kitson Kelly](https://github.com/kitsonk) 长达数周重写编译管道
（compilation pipeline）的总结。它进一步地提高了 TypeScript 的编译速度，更最重要
的是减轻了大量的技术债务。

[deno_crypto op crate](https://crates.io/crates/deno_crypto) 也被添加。

**本月发布的版本：**  1.5.2, 1.5.3, 1.5.4

## 十二月：自包含的二进制文件以及 LSP

[1.6.0 发布说明](https://deno.land/posts/v1.6)。

在 12 月，我们发布了 1.6 版本，包含了两个里程碑特性：自包含的二进制文件和语言服
务器。`deno compile` 是 deno 的 bug 追踪器中被访问最多的一个功能【⚠️ single most
requested】。

通过提供的内置语言服务器提高了所有能够使用 LSP 协议的编辑器的良好开发体验。它导
致了对 vscode_code 的第三次翻新，此项工作目前还在进行中。

**本月发布的版本：**

- [1.6.0](https://github.com/denoland/deno/releases/tag/v1.6.0)
- [1.6.1](https://github.com/denoland/deno/releases/tag/v1.6.1)
- [1.6.2](https://github.com/denoland/deno/releases/tag/v1.6.2)
- [1.6.3](https://github.com/denoland/deno/releases/tag/v1.6.3)

## 2021 展望

到 2020 年，我们在项目和社区中看到了许多的增长。这让我们对 Deno 进入 2021 年背后
的支持倍感信心。请继续关注即将推出的激动人心的公告！

如果你有兴趣为 Deno 做贡献，或者只是想了解我们的进展，请查看以下内容：

- 回答这份 [Deno 问卷调查](https://forms.gle/hbhP46LUAfVFMggU6)；
- [查看 Q1 路线图](https://github.com/denoland/deno/issues/8824)；
- 通过添加[新的语言服务器](https://github.com/denoland/deno/issues/8643)的功能来
  提高对 IDE 的支持；
- 通过使用 [Web 平台测试套件](https://github.com/denoland/deno/issues/9001)来确
  保对 Web 的兼容性。
