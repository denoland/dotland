<!--
With API stabilizations, several large infrastructure refactors, the 1.0
release, and shipping the single most requested feature, 2020 brought a lot of
action to the Deno project.

Please fill out [the Deno survey](https://forms.gle/hbhP46LUAfVFMggU6) to help
guide our development in 2021.

Read on for Deno's review of the year.
-->
Deno 프로젝트는 2020년 동안 API 안정화, 대규모 인프라 구조 리팩토링, 1.0 릴리즈, 개발자 요구사항 릴리즈 등 수많은 작업을 해왔습니다.

[Deno 설문조사](https://forms.gle/hbhP46LUAfVFMggU6)에 응답해 주시면 2021년 개발 방향을 잡는 데에 큰 도움이 될 것입니다.

2020년에 어떤 일이 있었는지 돌아봅시다.


<!--
## January: Goodbye libdeno, hello rusty_v8
-->
## 1월: libdeno 바이~ rusty_v8 하이!

<!--
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
-->
`libdeno`는 V8 엔진과 Rust 코드를 중개하기 위한 C++ 라이브러리였습니다.
하지만 이 라이브러리는 동작을 예상하기 어려웠고 추가 기능을 개발하기도 어려웠습니다.
이 상황을 개선하기 위해 2019년 가을에 `rusty_v8` 개발이 시작되었습니다.
[`rusty_v8`](https://github.com/denoland/rusty_v8)은 V8 엔진용 API를 제공하는 Rust 크레이트입니다.
12월이 되자 `rusty_v8`은 기존에 사용하던 `libdeno`를 완전히 대체할 수 있을 정도로 개발되었습니다.
그래서 2019년부터 `libdeno`를 제거하고 `rusty_v8`을 도입하기 위한 작업이 시작되었습니다.
이 과정을 위해 수많은 테스트 커버리지를 작성해준 분들 덕에 2주만에 이 작업을 빠르게 끝날 수 있었습니다.
`libdeno`는 0.29.0 릴리즈부터 완전히 제거되었고 이제는 `rusty_v8`의 타입 시스템을 리팩토링하는 작업을 시작했습니다.

**이 달에 나온 릴리즈:**

- [0.28.0](https://github.com/denoland/deno/releases/tag/v0.28.0)
- [0.28.1](https://github.com/denoland/deno/releases/tag/v0.28.1)
- [0.29.0](https://github.com/denoland/deno/releases/tag/v0.29.0)
- [0.30.0](https://github.com/denoland/deno/releases/tag/v0.30.0)
- [0.31.0](https://github.com/denoland/deno/releases/tag/v0.31.0)


<!--
## February: deno fmt now uses dprint, deno test subcommand
-->
## 2월: `deno fmt`에 dprint 도입, `deno test` 세부 명령 추가

<!--
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
-->
이 달에는 `deno fmt`가 크게 개선되었습니다.
`deno fmt`는 이전까지만 해도 `deno run`으로 `prettier`를 실행하는 단순한 기능만 제공했습니다.
이 말은 처음 `deno fmt`를 실행하거나 `prettier`가 업그레이드 될 때마다 계속 `prettier`의 최신 버전을 내려받아야 한다는 것을 의미합니다.
이런 상황은 Deno가 원하는 방향이 아니었기 때문에 개선하기로 결정되었습니다.
게다가 `prettier`는 성능면에서도 아주 느렸기 때문에 관련 문의를 많이 받는 모듈이기도 했습니다.

`deno fmt`는 이제 [David Sherret](https://github.com/dsherret)가 개발한 [`dprint`](https://dprint.dev/)를 사용합니다.
이 라이브러리는 Rust로 구현된 코드 포매터이며, [Kang Dong Yun](https://github.com/kdy1)이 만든 SWC JavsScript 파서를 기반으로 한 것입니다.
`dprint`는 `prettier` 모듈과 같은 방식으로 코드를 포매팅하지만, 속도는 비교할 수 없을 만큼 빠릅니다.
그래서 내부 테스트를 거친 후 `deno fmt`에 `dprint`를 사용하기로 결정했습니다.

`deno test`도 처음 실행할 때 표준 라이브러리를 다운로드해야 했습니다.
이제 새로 추가된 `Deno.test()` API와 `deno test` CLI 세부 명령은 Deno 일급 클래스(first class)를 활용합니다.

**이 달에 나온 릴리즈:**

- [0.32.0](https://github.com/denoland/deno/releases/tag/v0.32.0)
- [0.33.0](https://github.com/denoland/deno/releases/tag/v0.33.0)
- [0.34.0](https://github.com/denoland/deno/releases/tag/v0.34.0)
- [0.35.0](https://github.com/denoland/deno/releases/tag/v0.35.0)


<!--
## March: V8 debugger, deno doc, deno upgrade
-->
## 3월: V8 디버거, `deno doc`, `deno upgrade`

<!--
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
-->
버전 1.0을 릴리즈하기 전까지 Chrome 개발자도구를 사용할 수 없다는 것이 큰 장애물이었습니다.
수많은 노력 끝에 이제 Deno 프로페스와 Chrome 개발자도구를 연결하는 V8 디버거가 추가되었습니다.

그리고 Deno CLI 세부 명령 2개가 추가되었습니다:

- `deno doc`
- `deno upgrade`

번들링 과정도 크게 개선되었습니다.
이 시점에는 Deno 버전이 새로 나올 때마다 V8 엔진을 새로 빌드했었습니다.
V8은 C++ 프로젝트 중에서도 아주 큰 규모이기 때문에 이 엔진을 빌드하는 데에만 30분 이상 걸립니다.
빌드하는 과정에서도 캐시가 많이 쌓이고, 꼼수를 종종 사용하다보니 더이상 관리하기 힘들어졌기 때문에, 이제는 `rusty_v8`을 활용해서 미리 빌드된 정적 lib를 GitHub에서 내려받는 방식으로 개선했습니다.
이제는 Deno를 빌드할 때 V8을 빌드하지 않습니다.
이렇게 개선되면서 CI 빌드 프로세스가 단순해지고 빌드 시간도 단축되었지만, Deno 컨트리뷰터들이 참여하기 더 쉬워졌다는 점이 가장 중요했습니다.

**이 달에 나온 릴리즈:**

- [0.36.0](https://github.com/denoland/deno/releases/tag/v0.36.0)
- [0.37.0](https://github.com/denoland/deno/releases/tag/v0.37.0)
- [0.37.1](https://github.com/denoland/deno/releases/tag/v0.37.1)
- [0.38.0](https://github.com/denoland/deno/releases/tag/v0.38.0)


<!--
## April: Break all the APIs for the grand stabilization
-->
## 4월: API 전체 개편

<!--
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
-->
이 달에는 1.0 릴리즈를 위해 전역 `Deno`에 있는 API를 검토하는 데에 온 시간을 썼습니다.
이 과정 중에 크게 변경된 부분도 있습니다.
저희는 보수적으로 접근하면서 앞으로 변경될 여지가 있는 API는 모두 `--unstable` 플래그 안쪽으로 옮겨두었습니다.

1.0 버전을 릴리즈하기 위해 이 과정이 정말 중요했습니다.
1.0 버전에서 확정된 API들은 최소한 2.0 버전이 나올때까지는 변경되지 않을 것입니다.

0.x.y 형식으로 버전을 배포한 것은 이 달까지 입니다.

**이 달에 나온 릴리즈:**

- [0.39.0](https://github.com/denoland/deno/releases/tag/v0.39.0)
- [0.40.0](https://github.com/denoland/deno/releases/tag/v0.40.0)
- [0.41.0](https://github.com/denoland/deno/releases/tag/v0.41.0)
- [0.42.0](https://github.com/denoland/deno/releases/tag/v0.42.0)


<!--
## May: Deno 1.0 released
-->
## 5월: Deno 1.0 릴리즈

<!--
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
-->
이 달이 시작되면서 몇가지 기능이 제거되었습니다:

- JSON 로드
- WASM 로드
- `window.location` API
- `deno` 크레이트용 Rust API

이 기능들은 현재 제공되는 API 모습이 최선이 아니라고 판단했기 때문에 제거하기로 결정했습니다.
JSON이나 WASM 로드와 관련해서는 스펙이 아직 정해져있지 않았으며, `deno` 크레이트용 Rust API를 관리하는 것이 부담인 것도 영향을 미쳤습니다.

그리고 5월 13일, [Ryan의 Deno 프리젠테이션](https://www.youtube.com/watch?v=M3BM9TB-8yA)으로부터 딱 2년이 지난 후에 1.0 버전을 확정했습니다.

소셜 미디어에서도 큰 호응을 받았습니다.
저희 [블로그 글](https://deno.land/v1)이 여기저기에 공유되었고 수많은 사용자와 컨트리뷰터도 얻게 되었습니다.

하지만 Deno 1.0이 발표되기가 무섭게 저희는 또다른 작업을 시작했습니다.
TypeScript 호스트에서 의존성 관계를 분석하는 툴이 [SWC](https://swc.rs/)로 재작성되었습니다.
이 변경사항은 앞으로 Rust 기반으로 구현한 TypeScript 내부 구조를 개선하기 위한 첫걸음이었습니다.

**이 달에 나온 릴리즈:**

- [1.0.0-rc1](https://github.com/denoland/deno/releases/tag/v1.0.0-rc1)
- [1.0.0-rc2](https://github.com/denoland/deno/releases/tag/v1.0.0-rc2)
- [1.0.0-rc3](https://github.com/denoland/deno/releases/tag/v1.0.0-rc3)
- [1.0.0](https://github.com/denoland/deno/releases/tag/v1.0.0)
- [1.0.1](https://github.com/denoland/deno/releases/tag/v1.0.1)
- [1.0.2](https://github.com/denoland/deno/releases/tag/v1.0.2)
- [1.0.3](https://github.com/denoland/deno/releases/tag/v1.0.3)


<!--
## June: Incremental type checking and `deno lint`
-->
## 6월: 증분 타입 검사, `deno lint`

<!--
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
-->
1.0 릴리즈 이후 커뮤니티에서 받은 불만사항 중 가장 많았던 것은 TypeScript 컴파일 과정과 타입 검사 과정이 너무 느리다는 것이었습니다.
그래서 저희는 TSC 연동을 개선하기 위해 증분 타입체크 기능을 추가하기로 결정했습니다.
그 이후 수차례 테스트와 에러를 처리한 끝에 이 기능을 도입하면서 개발 단계에 소모되는 시간을 크게 줄일 수 있었습니다.
Deno 팀은 TSC의 증분 API를 활용해서 타입 검사 시간을 크게 단축했지만, 트랜스파일 된 소스를 생성할 때는 여전히 이 API를 사용합니다.
TypeScript는 JavaScript에 문법을 추가한 것이라는 TypeScript의 기본 설계 원칙을 생각해보면 TypeScript 코드에서 타입과 관련된 내용을 단순하게 제거하는 것이 더 쉬운 방법일 수 있습니다.
그래서 당장은 타입 검사에 TSC를 활용하지만, Rust 안에 SWC를 도입해야겠다는 목표를 세웠습니다.

이 달에는 다른 코드저장소에서 몇달간 개발한 `deno lint` 세부 명령이 추가되었습니다.
이 명령은 SWC JavaScript 파서를 기반으로 개발되었습니다.

**이 달에 나온 릴리즈:**

- [1.0.4](https://github.com/denoland/deno/releases/tag/v1.0.4)
- [1.0.5](https://github.com/denoland/deno/releases/tag/v1.0.5)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.0](https://github.com/denoland/deno/releases/tag/v1.1.0)
- [1.1.2](https://github.com/denoland/deno/releases/tag/v1.1.2)


<!--
## July: Converting internal runtime code from TypeScript to JavaScript
-->
## 7월: 내부 실행 코드를 TypeScript에서 JavaScript로 변경

<!--
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
-->
이 달에는 [TypeScript로 구현된 내부 실행 코드를 JavaScript로 전환](https://github.com/denoland/deno/pull/6793)하겠다는 큰 결정을 내렸습니다.
이렇게 결정된 이유가 몇가지 있습니다.
Deno 내부 실행 코드는 새로운 버전이 나올때마다 [스냅샷](https://v8.dev/blog/custom-startup-snapshots)으로 관리하기 위해 타입을 검사하고 번들링해야 했지만, 이 과정이 너무 복잡하고 느렸습니다.
그래서 저희는 TypeScript 컴파일러를 2개로 나누어서 개발했습니다.
하나는 빌드할 때만 사용되는 `deno_typescript` 크레이트이고, 다른 하나는 `deno` 바이너리가 포함된 컴파일러입니다.
이 과정에 발생하는 모든 프로세스가 빌드 시간에 큰 영향을 미쳤습니다.
증분 빌드를 적용했음에도 재빌드 시간이 2분이나 걸렸습니다!
그래서 이런 상황이라면 전통적인 JavaScript를 사용하는 것이 훨씬 간단하고 내부 의존성 관리도 편하다는 결론을 내렸습니다.
TypeScript 컴파일러가 생성한 JavaScript 코드는 파일 하나로 생성되며, 이 파일의 내용은 이해하기도 쉽습니다.
다만 ES 모듈은 SystemJS 로더를 사용하기 위한 형태로 변환되기 때문에 최종 빌드 파일의 용량이 많이 늘어나긴 했습니다.

**이 달에 나온 릴리즈:**

- [1.1.3](https://github.com/denoland/deno/releases/tag/v1.1.3)
- [1.2.0](https://github.com/denoland/deno/releases/tag/v1.2.0)
- [1.2.1](https://github.com/denoland/deno/releases/tag/v1.2.1)
- [1.2.2](https://github.com/denoland/deno/releases/tag/v1.2.2)


<!--
## August: New registry released
-->
## 8월: 새 코드저장소 릴리즈

<!--
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
-->
원문: https://deno.land/posts/registry2

8월 3일에 저희는 새로운 [deno.land/x](https://deno.land/x) 코드저장소를 릴리즈했습니다.
이 코드저장소는 GitHub과 통합된 웹훅(webhook) 형태입니다.
모듈이 업데이트되면 시스템이 이 모듈을 다운로드하고 소스 코드를 영원히 보존합니다.
그래서 절대로 변하지 않는 소스 코드 링크를 제공할 수 있게 되었습니다.

Deno 내부 코드에 사전에 계획되지 않은 외부 작업들이 도입되면서, 저희는 Deno 시스템을 더 작은 "op 크레이트"들로 쪼개서 커스텀 V8 실행환경을 구성하는 방식으로 변경하기로 결정했습니다.
이 작업은 8월에 시작되었으며, `Event`, `TextEncoder`, `TextDecoder`와 같은 기본 웹 API를 제공하는 [deno_web 크레이트](https://crates.io/crates/deno_web)가 릴리즈되었습니다.

이 달에는 벤치마크 시스템이 Rust 기반으로 재구축되었습니다.
덕분에 Deno 프로젝트 안에 있던 수많은 빌드 의존성 관계가 크게 단순해졌습니다.

**이 달에 나온 릴리즈:**

- [1.2.3](https://github.com/denoland/deno/releases/tag/v1.2.3)
- [1.3.0](https://github.com/denoland/deno/releases/tag/v1.3.0)
- [1.3.1](https://github.com/denoland/deno/releases/tag/v1.3.1)
- [1.3.2](https://github.com/denoland/deno/releases/tag/v1.3.2)


<!--
## September: WebSocket API, CSS styling in console, file watcher, test coverage
-->
## 9월: WebSocket API, 콘솔 CSS 스타일, 파일 워처, 테스트 커버리지

<!--
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
-->
이 달에는 1.0 릴리즈 이후 가장 큰 변경사항이 배포되었습니다.
자세한 내용은 [1.4.0 배포와 관련된 블로그](https://deno.land/posts/v1.4)을 참고하세요.

유지보수 측면에서도 큰 변경사항이 있었습니다.
Deno 릴리즈 스케쥴이 변경되었는데, 매달 나오던 마이너 릴리즈가 Rust와 Chrome 프로젝트 배포 일정에 맞춰 6주 단위로 변경되었습니다.

**이 달에 나온 릴리즈:**

- [1.3.3](https://github.com/denoland/deno/releases/tag/v1.3.3)
- [1.4.0](https://github.com/denoland/deno/releases/tag/v1.4.0)
- [1.4.1](https://github.com/denoland/deno/releases/tag/v1.4.1)
- [1.4.2](https://github.com/denoland/deno/releases/tag/v1.4.2)


<!--
## October: REPL revamp, improved bundling, isolatedModules by default
-->
## 10월: REPL 개조, 번들링 개선, isolatedModules 기본 적용

<!--
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
-->
[1.5.0 블로그 글](https://deno.land/posts/v1.5)

이 달에 변경된 내용 중 가장 중요한 것은 `isolatedModules` TypeScript 컴파일러 옵션이 기본으로 적용된다는 것이었습니다.
이 옵션이 적용되면 개별 파일이 독립된 컨텍스트에서 트랜스파일됩니다.
타입 유무와 관계없으며 다른 모듈을 참조하는 경우에도 그렇습니다.
이 변경사항은 모듈 생태계에 큰 영향을 주기 때문에 이 옵션을 지원하지 않는 모듈은 `isolatedModules`를 지원할 수 있도록 수정해야 합니다.

이 달에는 기존에 사용하던 TypeScript 컴파일러를 Rust로 전환하는 과정 중 하나로, SWC에 새로운 번들링 기능이 추가되기도 했습니다.

**이 달에 나온 릴리즈:**

- [1.4.3](https://github.com/denoland/deno/releases/tag/v1.4.3)
- [1.4.4](https://github.com/denoland/deno/releases/tag/v1.4.4)
- [1.4.5](https://github.com/denoland/deno/releases/tag/v1.4.5)
- [1.4.6](https://github.com/denoland/deno/releases/tag/v1.4.6)
- [1.5.0](https://github.com/denoland/deno/releases/tag/v1.5.0)
- [1.5.1](https://github.com/denoland/deno/releases/tag/v1.5.1)


<!--
## November: Grand rewrite of TSC compiler infrastructure
-->
## 11월: TSC 컴파일러 구조 대개편

<!--
This month we saw a conclusion to [Kitson Kelly's](https://github.com/kitsonk)
weeks-long project of rewrite compilation pipeline. It improved the speed of
TypeScript transpilation even more, but most importantly paid off a lot of
technical debt.

The [deno_crypto op crate](https://crates.io/crates/deno_crypto) was added.

**Releases that month:** 1.5.2, 1.5.3, 1.5.4
-->
이 달에는 [Kitson Kelly](https://github.com/kitsonk)의 프로젝트를 사용해서 컴파일 파이프라인을 개선하기로 계획했습니다.
이 프로젝트를 적용하면 TypeScript 트랜스파일 속도도 빨라지지만, 무엇보다도 기술 부채를 크게 줄일 수 있다는 점이 더 중요했습니다.

[deno_crypto op 크레이트](https://crates.io/crates/deno_crypto)도 이 때 추가되었습니다.

**이 달에 나온 릴리즈:** 1.5.2, 1.5.3, 1.5.4


<!--
## December: Self-contained binaries and LSP
-->
## 12월: 독립 실행 가능한 바이너리, LSP

<!--
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
-->
[1.6.0 블로그 글](https://deno.land/posts/v1.6)

12월에는 1.6 버전을 릴리즈하면서 독립 실행 가능한 바이너리, 언어 서버와 같은 큰 기능 2개가 추가되었습니다.
그리고 Deno 버그 트래커 이용자들이 가장 시급하게 요청하던 `deno compile` 명령도 추가되었습니다.

이제 언어 서버가 내장되었기 때문에 LSP 프로토콜을 활용하는 모든 코드 에디터 사용자들의 개발 효율이 크게 개선될 것입니다.
이 기능을 도입하기 위한 vscode_code는 아직 작업중입니다.

**이 달에 나온 릴리즈:**

- [1.6.0](https://github.com/denoland/deno/releases/tag/v1.6.0)
- [1.6.1](https://github.com/denoland/deno/releases/tag/v1.6.1)
- [1.6.2](https://github.com/denoland/deno/releases/tag/v1.6.2)
- [1.6.3](https://github.com/denoland/deno/releases/tag/v1.6.3)


# 2021

<!--
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
-->
2020년 내내 저희는 프로젝트와 커뮤니티가 크게 성장하는 것을 지켜봤습니다.
2021년에도 이 성장은 계속될 것입니다.
조만간 발표될 흥미진진한 내용도 기대해 주세요!

Deno에 기여하고 싶거나, 아니면 Deno가 어떻게 나아가는지 확인하려면 이런 내용을 참고하세요:

- [the Deno 설문조사](https://forms.gle/hbhP46LUAfVFMggU6)에 참여해 주세요.

- [Q1 로드맵](https://github.com/denoland/deno/issues/8824)을 확인해 보세요.

- [언어 서버에 새 기능](https://github.com/denoland/deno/issues/8643)을 추사해서 IDE를 개선해 보세요.

- [Web Platform Test 스펙](https://github.com/denoland/deno/issues/9001)으로 웹 호환성을 확인해 주세요.
