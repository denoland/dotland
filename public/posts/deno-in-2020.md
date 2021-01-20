With API stabilizations, several large infrastructure refactors, the 1.0
release, and shipping the single most requested feature, 2020 brought a lot of
action to the Deno project.

Please fill out [the Deno survey](https://forms.gle/hbhP46LUAfVFMggU6) to help
guide our development in 2021.

Read on for Deno's review of the year.

## January: Goodbye libdeno, hello rusty_v8

`libdeno` was a C++ library that facilitated an interface between V8 engine and
Rust code in Deno. The library was hard to reason about and develop additional
functionality. The situation led to the birth of `rusty_v8` in fall of 2019.
[`rusty_v8`](https://github.com/denoland/rusty_v8) is a Rust crate that provides
API for the V8 engine. By December `rusty_v8` had all required bindings to
replace `libdeno`. The effort started at the end of 2019, where the first parts
of `libdeno` were rewritten using `rusty_v8`. Thanks to the growing test
coverage in the Deno codebase we were confident moving forward and wrapped up
the effort in a fortnight. `libdeno` was completely removed in release 0.29.0
and since then `rusty_v8` has undergone major refactors to type safety of the
bindings.

**Releases that month:**

- [0.28.0](https://github.com/denoland/deno/releases/tag/v0.28.0)
- [0.28.1](https://github.com/denoland/deno/releases/tag/v0.28.1)
- [0.29.0](https://github.com/denoland/deno/releases/tag/v0.29.0)
- [0.30.0](https://github.com/denoland/deno/releases/tag/v0.30.0)
- [0.31.0](https://github.com/denoland/deno/releases/tag/v0.31.0)

## February: deno fmt now uses dprint, deno test subcommand

This month we changed `deno fmt` drastically. Up to this point `deno fmt` was a
simple subcommand that under the hood was only an alias to "deno run" that
pointed to `prettier`. It meant that on the first run of `deno fmt` and after
each upgrade, users had to download the latest version of the `prettier` module.
This situation didn’t feel right as Deno promised to provide these tools out of
the box. `prettier` was also pretty slow and the performance left a lot to be
asked.

We got introduced to [`dprint`](https://dprint.dev/) by
[David Sherret](https://github.com/dsherret), a code formatter written in Rust
and based on the SWC JavaScript parser by
[Kang Dong Yun](https://github.com/kdy1). `dprint` could format the code the
same way the `prettier` module did but it was orders of magnitude faster. After
some preliminary testing we decided to use `dprint` in `deno fmt`.

`deno test` had the same requirement of downloading modules from the standard
library on the first run. That led to the addition of a new `Deno.test()` API
and `deno test` CLI subcommand which made testing in Deno first class citizen.

**Releases that month:**

- [0.32.0](https://github.com/denoland/deno/releases/tag/v0.32.0)
- [0.33.0](https://github.com/denoland/deno/releases/tag/v0.33.0)
- [0.34.0](https://github.com/denoland/deno/releases/tag/v0.34.0)
- [0.35.0](https://github.com/denoland/deno/releases/tag/v0.35.0)

## March: V8 debugger, deno doc, deno upgrade

Missing Chrome Devtools support was a major blocker for the 1.0 release. A lot
of effort was spent adding support for V8 debugger and ability to connect to
Deno process using Chrome Devtools.

Two new subcommands were added to the CLI:

- `deno doc`
- `deno upgrade`

We also saw a huge improvement to the build process. Up to this point, V8 was
built from source for each and every build of Deno. V8 is a massive C++ project
that can easily take over 30 minutes to build. Despite lots of build caches and
other tricks, it was continuously a difficulty for us to contend with. We added
the ability for `rusty_v8` to produce and download a pre-built static lib on
Github releases, allowing Deno builds to bypass the V8 build completely. This
simplified and sped up the build in CI, but most importantly allowed
contributors to build Deno more easily.

**Releases that month:**

- [0.36.0](https://github.com/denoland/deno/releases/tag/v0.36.0)
- [0.37.0](https://github.com/denoland/deno/releases/tag/v0.37.0)
- [0.37.1](https://github.com/denoland/deno/releases/tag/v0.37.1)
- [0.38.0](https://github.com/denoland/deno/releases/tag/v0.38.0)

## April: Break all the APIs for the grand stabilization

This month was spent on reviewing APIs in `Deno` global in preparation for the
1.0 release. This led to many breaking changes. We were conservative, so any
APIs that we were unsure of were moved behind the `--unstable` flag.

This was the major commitment for the 1.0 release; the Deno APIs marked as
stable won’t have breaking changes until 2.0 release.

This month marked the last 0.x.y release of Deno.

**Releases that month:**

- [0.39.0](https://github.com/denoland/deno/releases/tag/v0.39.0)
- [0.40.0](https://github.com/denoland/deno/releases/tag/v0.40.0)
- [0.41.0](https://github.com/denoland/deno/releases/tag/v0.41.0)
- [0.42.0](https://github.com/denoland/deno/releases/tag/v0.42.0)

## May: Deno 1.0 released

Beginning of the month marked removal of various features:

- JSON imports
- WASM imports
- `window.location` API
- Rust API for `deno` crate

The reason for removal was that we didn't want to commit to supporting APIs in
the current form either because of: lacking underlying specification in case of
JSON/WASM imports; or additional maintenance burden in case of Rust API for
`deno` crate.

Finally on May 13, exactly two years after
[Ryan's original Deno presentation](https://www.youtube.com/watch?v=M3BM9TB-8yA),
we cut the 1.0.

On social media, the release was very well received. Our
[blog post](https://deno.land/v1) was shared widely, we gained many new users
and contributors.

But the dust had barely settled before we were back to work on another major
component of the runtime: the dependency analysis in TypeScript host was
rewritten using [SWC](https://swc.rs/). This change marked the beginning of
efforts to rewrite parts of our TypeScript infrastructure in Rust.

**Releases that month:**

- [1.0.0-rc1](https://github.com/denoland/deno/releases/tag/v1.0.0-rc1)
- [1.0.0-rc2](https://github.com/denoland/deno/releases/tag/v1.0.0-rc2)
- [1.0.0-rc3](https://github.com/denoland/deno/releases/tag/v1.0.0-rc3)
- [1.0.0](https://github.com/denoland/deno/releases/tag/v1.0.0)
- [1.0.1](https://github.com/denoland/deno/releases/tag/v1.0.1)
- [1.0.2](https://github.com/denoland/deno/releases/tag/v1.0.2)
- [1.0.3](https://github.com/denoland/deno/releases/tag/v1.0.3)

## June: Incremental type checking and `deno lint`

One of major complaints received from community after 1.0 release was that
TypeScript compilation and type-checking are extremely slow. There we set our
eyes on improving out TSC integration to support incremental typechecking. After
a few trial and error PRs we were able to get functionality working and
significantly improvement development loop time. Even though we managed to
improvement type checking speed by leveraging TSC's incremental APIs we were
still relying on it to emit transpiled sources. One of the great design
principles of TypeScript is that it's just JavaScript with additional syntax, so
stripping out the type information (transpiling to JavaScript) is a relatively
easy operation. So we set the goal of being able to use SWC in Rust to do
transpilation, while continuing to use TSC for type checking.

After a few months of development out of sight, in a separate repository, a new
`deno lint` subcommand was added. It's yet another project that is built on top
of the SWC JavaScript parser.

**Releases that month:**

- [1.0.4](https://github.com/denoland/deno/releases/tag/v1.0.4)
- [1.0.5](https://github.com/denoland/deno/releases/tag/v1.0.5)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.2](https://github.com/denoland/deno/releases/tag/v1.1.2)

## July: Converting internal runtime code from TypeScript to JavaScript

This month we made a hard decision to
[convert our internal runtime code from TypeScript to JavaScript](https://github.com/denoland/deno/pull/6793).
There were several factors that led us to this decision: Complicated and slow
build process on each build of the Deno internal runtime code was typechecked
and bundled before being
[snapshotted](https://v8.dev/blog/custom-startup-snapshots). We had two separate
implementations of TypeScript compiler host. One just for the build step, which
was called the `deno_typescript` crate. The other one included in the `deno`
binary. Additionally the whole process had a significant impact on the build
times: 2 minutes incremental rebuilds! By using plain old JavaScript we were
able to vastly simplify the internal build dependencies and overall complexity.
Because the actual JavaScript code was produced by TypeScript compiler as a
single file bundle, we had very little control of what the output code would
look like. ES modules were transformed to use SystemJS loader in the bundle
which added significant amount of code to the final bundle.

**Releases that month:**

- [1.1.3](https://github.com/denoland/deno/releases/tag/v1.1.3)
- [1.2.0](https://github.com/denoland/deno/releases/tag/v1.2.0)
- [1.2.1](https://github.com/denoland/deno/releases/tag/v1.2.1)
- [1.2.2](https://github.com/denoland/deno/releases/tag/v1.2.2)

## August: New registry released

Original post: https://deno.land/posts/registry2

August 3, we released a new [deno.land/x](https://deno.land/x) registry that
uses webhooks to integrate with GitHub. When a module is updated our system
downloads and forever preserves the source code, so that we can rely on
immutable source code links.

Due to some non-public work happening to use the Deno infrastructure, we began
the effort to break the Deno system up into smaller "op crates" which could be
mixed and matched to produce custom V8 runtimes. First steps were taken towards
this in August, and the [deno_web crate](https://crates.io/crates/deno_web) was
released providing some basic web APIs like `Event`, `TextEncoder`,
`TextDecoder`.

This month the benchmark system was rewritten in Rust; which marked the start of
tedious efforts of reducing the number of build dependencies for the Deno
project.

**Releases that month:**

- [1.2.3](https://github.com/denoland/deno/releases/tag/v1.2.3)
- [1.3.0](https://github.com/denoland/deno/releases/tag/v1.3.0)
- [1.3.1](https://github.com/denoland/deno/releases/tag/v1.3.1)
- [1.3.2](https://github.com/denoland/deno/releases/tag/v1.3.2)

## September: WebSocket API, CSS styling in console, file watcher, test coverage

This month we shipped our biggest feature release since 1.0. More details in
[the 1.4.0 blog post](https://deno.land/posts/v1.4).

There was another important change on the maintenance part of the project. The
release schedule was changed, from monthly minor release, to shipping new minor
release every six weeks, matching the Rust and Chrome projects.

**Releases that month:**

- [1.3.3](https://github.com/denoland/deno/releases/tag/v1.3.3)
- [1.4.0](https://github.com/denoland/deno/releases/tag/v1.4.0)
- [1.4.1](https://github.com/denoland/deno/releases/tag/v1.4.1)
- [1.4.2](https://github.com/denoland/deno/releases/tag/v1.4.2)

## October: REPL revamp, improved bundling, isolatedModules by default

[1.5.0 blog post](https://deno.land/posts/v1.5)

The biggest change that happened in this month was enabling `isolatedModules`
option in TypeScript compiler host by default. This setting changes the behavior
of TypeScript in such a way that ensures that each file can be transpiled in
isolation (without knowledge of types and/or other modules) by tools other than
TSC like SWC and Babel. This change had a significant impact on the module
ecosystem, making some popular modules unusable until maintainers adjusted the
code to work with `isolatedModules`.

This month we also adopted the new bundle feature in SWC, yet another step in
the direction of using Rust over the original TypeScript compiler.

**Releases that month:**

- [1.4.3](https://github.com/denoland/deno/releases/tag/v1.4.3)
- [1.4.4](https://github.com/denoland/deno/releases/tag/v1.4.4)
- [1.4.5](https://github.com/denoland/deno/releases/tag/v1.4.5)
- [1.4.6](https://github.com/denoland/deno/releases/tag/v1.4.6)
- [1.5.0](https://github.com/denoland/deno/releases/tag/v1.5.0)
- [1.5.1](https://github.com/denoland/deno/releases/tag/v1.5.1)

## November: Grand rewrite of TSC compiler infrastructure

This month we saw a conclusion to [Kitson Kelly's](https://github.com/kitsonk)
weeks-long project of rewrite compilation pipeline. It improved the speed of
TypeScript transpilation even more, but most importantly paid off a lot of
technical debt.

The [deno_crypto op crate](https://crates.io/crates/deno_crypto) was added.

**Releases that month:** 1.5.2, 1.5.3, 1.5.4

## December: Self-contained binaries and LSP

[1.6.0 blog post](https://deno.land/posts/v1.6)

In December we released version 1.6 containing two milestone features:
self-contained binaries and the language server. `deno compile` was single most
requested feature in Deno’s bug tracker.

Providing built-in language server allows to provide great development
experience to all editors that can talk LSP protocol. It leads to third revamp
of vscode_code that is still work-in-progress.

**Releases that month:**

- [1.6.0](https://github.com/denoland/deno/releases/tag/v1.6.0)
- [1.6.1](https://github.com/denoland/deno/releases/tag/v1.6.1)
- [1.6.2](https://github.com/denoland/deno/releases/tag/v1.6.2)
- [1.6.3](https://github.com/denoland/deno/releases/tag/v1.6.3)

# 2021

We've seen a lot of growth in the project and community in 2020. Going into 2021
we feel strongly about momentum behind Deno. Stay tuned for some exciting
announcements coming soon!

If you're interested in contributing to Deno or just want to follow our progress
please look into the following:

- Answer [the Deno survey](https://forms.gle/hbhP46LUAfVFMggU6).

- [Review the Q1 roadmap](https://github.com/denoland/deno/issues/8824).

- Improving IDE support by adding
  [new language server capabilities](https://github.com/denoland/deno/issues/8643)

- Ensuring Web compatibility by using
  [Web Platform Test suite](https://github.com/denoland/deno/issues/9001)
