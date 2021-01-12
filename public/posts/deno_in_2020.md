# Deno in 2020

2020 brought a lot of action to the Deno project. Starting with major refactor
of low level infrastructure, through API stabilizations, 1.0 release, overhauls
of major parts of the system, wrapping up the year by shipping the single most
requested feature. Buckle up for 2020 rewind in Deno!

### January: Goodbye libdeno, hello rusty_v8

`libdeno` was a C++ library that facilitated an interface between V8 engine and
Rust code in Deno. The library was hard to reason about and develop additional
functionality. The situation led to the birth of `rusty_v8` in fall of 2019.
[`rusty_v8`](https://github.com/denoland/rusty_v8) is a Rust crate that provides
Rust API for V8 engine. By December `rusty_v8` had all required bindings to
replace `libdeno`. The effort started at the end of 2019, where the first parts
of `libdeno` were rewritten using `rusty_v8`. Thanks to a lot of tests in the
Deno codebase we were confident moving forward and wrapped up the effort in a
fortnight. `libdeno` was completely removed in release 0.29.0 and since then
`rusty_v8` has undergone major refactors to type safety of the bindings.

**Releases that month:**

- [0.28.0](https://github.com/denoland/deno/releases/tag/v0.28.0)
- [0.28.1](https://github.com/denoland/deno/releases/tag/v0.28.1)
- [0.29.0](https://github.com/denoland/deno/releases/tag/v0.29.0)
- [0.30.0](https://github.com/denoland/deno/releases/tag/v0.30.0)
- [0.31.0](https://github.com/denoland/deno/releases/tag/v0.31.0)

### February: deno fmt now uses dprint, deno test subcommand

This month we changed `deno fmt` drastically. Up to this point `deno fmt` was a
simple subcommand that under the hood was only an alias to "den" run” that
pointed to `prettier` module in the standard library. It meant that on the first
run of `deno fmt` after each upgrade; users had to download the latest version
of the `prettier` module. This situation didn’t feel right as the promised to
have those tools out of the box. `prettier` module was also pretty slow and the
performance left a lot to be asked.

We got introduced to [`dprint`](https://dprint.dev/) by David Sherret, a code
formatter written in Rust. `dprint` could format the code the same way the
"prettier" module did but it was orders of magnitude faster. After some
preliminary testing we decided to `dprint` in `deno fmt`.

`deno test` had the same requirement of downloading modules from the standard
library on the first run. That led to the addition of a new `Deno.test()` API
and `deno test` CLI subcommand which made testing in Deno first class citizen.

**Releases that month:**

- [0.32.0](https://github.com/denoland/deno/releases/tag/v0.32.0)
- [0.33.0](https://github.com/denoland/deno/releases/tag/v0.33.0)
- [0.34.0](https://github.com/denoland/deno/releases/tag/v0.34.0)
- [0.35.0](https://github.com/denoland/deno/releases/tag/v0.35.0)

### March: v8 debugger, deno doc, deno upgrade

Set 1.0 release date (or was it in Feb?)

Missing Chrome Devtools support was a major blocker for the 1.0 release. A lot
of effort was spent adding support for V8 debugger and ability to connect to
Deno process using Chrome Devtools…

Two new subcommands were added to the CLI:

- `deno doc`
- `deno upgrade`

We also saw a huge improvement to the build process. Up to this point, each
build of the `deno`, V8 engine was built from source. V8 is a huge C++ project
that can easily take 30 minutes to build. Thanks to the changes in `rusty_v8`
and the deno build process we were able to cut compile times to a couple
minutes, speeding up the development cycle significantly.

**Releases that month:**

- [0.36.0](https://github.com/denoland/deno/releases/tag/v0.36.0)
- [0.37.0](https://github.com/denoland/deno/releases/tag/v0.37.0)
- [0.37.1](https://github.com/denoland/deno/releases/tag/v0.37.1)
- [0.38.0](https://github.com/denoland/deno/releases/tag/v0.38.0)

### April: Break all the APIs or the grand stabilization

This month was spent on reviewing APIs in `Deno` global which lead to breaking
changes in many APIs. We leaned on the "safe" side so any API that didn’t "feel"
right at that moment was made unstable or completely removed.

This was the major commitment for 1.0 release; `Deno` APIs marked as stable
won’t have breaking changes until 2.0 release.

This month marked the last 0.x.y release of Deno.

**Releases that month:**

- [0.39.0](https://github.com/denoland/deno/releases/tag/v0.39.0)
- [0.40.0](https://github.com/denoland/deno/releases/tag/v0.40.0)
- [0.41.0](https://github.com/denoland/deno/releases/tag/v0.41.0)
- [0.42.0](https://github.com/denoland/deno/releases/tag/v0.42.0)

### May: Deno 1.0 released

Beginning of the month marked removal of various features:

- JSON imports
- WASM imports
- `window.location` API
- Rust API for `deno` crate

The reason for that was we didn't want to commit to supporting those APIs in the
current form either because of lacking underlying specification (JSON/WASM
imports, import assertion are now at Stage 3 and we plan to bring back those
imports into Deno soon) or would place additional maintenance burden (Rust API
for `deno` crate).

And then May, 13th came. We prepared the release as always. Reviewd, merged,
tagged. Thirty minutes waiting for CI pipeline to pass. It passed, binaries were
ready to ship. So we shipped. Exactly two years after
[Ryan's original presentation](https://www.youtube.com/watch?v=M3BM9TB-8yA) that
introduced Deno to the world, Deno 1.0 was released.

Link to original post: https://deno.land/v1

And then it all exploded... There was a massive interest coming the community,
with almost a hundred issues opened in a 48 hour window post-release. The
development did not slow down, releasing `1.0.1` just a week after.

The release dust hasn't yet settled and we were back to work on another major
component of the runtime; the dependency analysis in TypeScript host was
rewritten using [`swc`](https://swc.rs/). This changed marked the beginning of
efforts to rewrite TypeScript compiler host (or some parts of it) in Rust.

**Releases that month:**

- [1.0.0-rc1](https://github.com/denoland/deno/releases/tag/v1.0.0-rc1)
- [1.0.0-rc2](https://github.com/denoland/deno/releases/tag/v1.0.0-rc2)
- [1.0.0-rc3](https://github.com/denoland/deno/releases/tag/v1.0.0-rc3)
- [1.0.0](https://github.com/denoland/deno/releases/tag/v1.0.0)
- [1.0.1](https://github.com/denoland/deno/releases/tag/v1.0.1)
- [1.0.2](https://github.com/denoland/deno/releases/tag/v1.0.2)
- [1.0.3](https://github.com/denoland/deno/releases/tag/v1.0.3)

### June: Incremental type checking and `deno lint`

One of major complaints received from community after 1.0 release was that
TypeScript compliation and type-checking are extremely slow. There we set our
eyes on upgrading out TS compiler host to support incremental typechecking.
After a few trial and error PRs we were able to get functionality working and
significantly improvement development loop time. Even though we managed to
improvement type checking speed by leveraging TS compiler's incremental APIs we
were still relying on it to emit transpiled sources. The transpilation step
contributed a significant time slice to the overall compilation pipeline.
(reword)

After a few months of development out of sight, in a separate repository, a new
`deno lint` subcommand was added. It's yet another project that is built on top
of `swc`.

**Releases that month:**

- [1.0.4](https://github.com/denoland/deno/releases/tag/v1.0.4)
- [1.0.5](https://github.com/denoland/deno/releases/tag/v1.0.5)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.2](https://github.com/denoland/deno/releases/tag/v1.1.2)

### July: Converting internal runtime code from TypeScript to JavaScript

This month we made a hard decision to convert internal runtime code from
TypeScript to JavaScript. There were several factors that leads us to this
decision: Complicated and slow build process On each build of deno internal
runtime code was typechecked and bundled before being "snapshotted" (link to v8
snapshot article). We had two separate implementations of TypeScript compiler
host. One just for the build step, which was a `deno_typescript` crate. The
other one included in the `deno` binary. Additionally the whole process had a
significant impact on the build times leading to 2 minute incremental rebuild.
Reducing the size and of runtime and taking control of what goes there All
runtime code was written as ES modules in TypeScript. Because the actual
JavaScript code was produced by TypeScript compiler as a single file bundle, we
had very little control of what the output code would look like. ES modules were
transformed to use SystemJS loader in the bundle which added significant amount
of code to the final bundle.

Next steps towards rewriting TypeScript compiler host in Rust by using `swc` to
transpile TS source into JS source when `--no-check` flag was present.

**Releases that month:**

- [1.1.3](https://github.com/denoland/deno/releases/tag/v1.1.3)
- [1.2.0](https://github.com/denoland/deno/releases/tag/v1.2.0)
- [1.2.1](https://github.com/denoland/deno/releases/tag/v1.2.1)
- [1.2.2](https://github.com/denoland/deno/releases/tag/v1.2.2)

### August: New registry released

Original post: https://deno.land/posts/registry2

August 3, we released a new registry that uses webhooks. you can probably copy
some text from

First steps towards "op crates" were taken and `deno_web` was born. The whole
idea of op crates is to modularize parts of the Deno runtime into separate Rust
crates. This approach allows to build custom runtimes based on Deno code, but
using only those APIs that are of interest.

This month the benchmark system was rewritten in Rust; which marked the start of
tedious efforts of reducing the number of build dependencies for the Deno
project. Deno depended on Python 2, node.js...

**Releases that month:**

- [1.2.3](https://github.com/denoland/deno/releases/tag/v1.2.3)
- [1.3.0](https://github.com/denoland/deno/releases/tag/v1.3.0)
- [1.3.1](https://github.com/denoland/deno/releases/tag/v1.3.1)
- [1.3.2](https://github.com/denoland/deno/releases/tag/v1.3.2)

### September: WebSocket API, CSS styling in console, file watcher, test coverage

This month we shipped our biggest feature release to date, with detailed
description in 1.4.0 blog post: https://deno.land/posts/v1.4

There was another imporant change on the maintaince part of the project. The
release schedule was changed, from monthly minor release, to shipping new minor
release every six weeks, similarly to Rust or Chrome projects.

**Releases that month:**

- [1.3.3](https://github.com/denoland/deno/releases/tag/v1.3.3)
- [1.4.0](https://github.com/denoland/deno/releases/tag/v1.4.0)
- [1.4.1](https://github.com/denoland/deno/releases/tag/v1.4.1)
- [1.4.2](https://github.com/denoland/deno/releases/tag/v1.4.2)

### October: REPL revamp, improved(\*) bundling, isolatedModules by default

Not really, everything broke, but oh well

1.5.0 blog post: https://deno.land/posts/v1.5

The biggest changed that happened in this months was enabling `isolateModules`
option in TypeScript compiler host by default. This settings changes the
behavior of TypeScript in such a way that ensures that each file can be
transpiled in isolation (without knowledge of types and/or other modules) by
tools other than TypeScript, eg. `babel`, `swc`. This change had a significant
impact on the module ecosystem, making some popular modules unusable until
maintainers adjusted the code to work with `isolatedModules`. We still firmly
believe that it way the right step to take to ensure a certain "Deno" flavor of
TypeScript that works out of the box.

**Releases that month:**

- [1.4.3](https://github.com/denoland/deno/releases/tag/v1.4.3)
- [1.4.4](https://github.com/denoland/deno/releases/tag/v1.4.4)
- [1.4.5](https://github.com/denoland/deno/releases/tag/v1.4.5)
- [1.4.6](https://github.com/denoland/deno/releases/tag/v1.4.6)
- [1.5.0](https://github.com/denoland/deno/releases/tag/v1.5.0)
- [1.5.1](https://github.com/denoland/deno/releases/tag/v1.5.1)

### November: Grand rewrite of TSC compiler infrastructure

In November we wrapped up multi-month rewrite of TypeScript compiler host; which
resulted in even more work being done in Rust instead of JavaScript.

`deno_crypto` op crate

Simplify tooling in the repo

**Releases that month:** 1.5.2, 1.5.3, 1.5.4

### December: Self-contained binaries and LSP

1.6.0 blog post: https://deno.land/posts/v1.6

In December we released version 1.6 containing two milestone features:
self-contained binaries and the language server. `deno compile` was single most
requested feature in Deno’s bug tracker.

Providing built-in language server allows to provide great development
experience to all editors that can talk LSP protocol. It leads to third revamp
of vscode_code that is still work-in-progress.

TypeScript 4.1 (add to previous months when TS was bumped) Canary builds
Deno_runtime crate - build your own deno

**Releases that month:**

- [1.6.0](https://github.com/denoland/deno/releases/tag/v1.6.0)
- [1.6.1](https://github.com/denoland/deno/releases/tag/v1.6.1)
- [1.6.2](https://github.com/denoland/deno/releases/tag/v1.6.2)
- [1.6.3](https://github.com/denoland/deno/releases/tag/v1.6.3)

### 2021

We've seen a lot of growth in the project and community in 2020 and going into
2021 we feel strongly about momentum behind Deno.

Stay tuned for some exciting annoucements coming soon!
