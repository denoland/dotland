<!--
The goal of deno.land/x has been to provide a central location for third party
Deno modules consistent with how Deno operates. We want people to be able to
copy and paste source code URLs like https://deno.land/x/oak/mod.ts directly
into the browser and be able to view marked up source code and have links to
auto-generated documentation.

Today we are releasing a rewrite of the deno.land/x service that solves many
long standing issues like rate limits on the GitHub API and providing immutable
source code downloads (like on crates.io).
-->
deno.land/x의 목표는 Deno용 서드 파티 모듈을 중앙집중해서 제공하는 것입니다.
저희는 사람들이 https://deno.land/x/oak/mod.ts 와 같은 소스 코드 URL을 복사해서 브라우저에 붙여넣기만 하면 코드를 확인할 수 있도록 만들고 싶습니다.

오늘 저희는 기존 deno.land/x에 있었던 GitHub API 요청수 제한 문제를 해결하고 코드의 불변성을 보장하는 방식으로 서비스를 새롭게 릴리즈 했습니다.


<!--
## Goals
-->
## 목표

<!--
- Make source code immutable.
- Remove the GitHub API rate limits on the website.
- Remove the need to manually update database.json to add modules.

The way the website currently works is by querying github in the background to
receive source code. This worked okay, but we would hit API limits, and the code
could change out from under users. The change we settled on would be to keep a
copy of any published code ourselves, so we could ensure content availability
and integrity.
-->
- 소스 코드의 불변성을 보장한다.
- GitHub API 요청수 제한을 해결한다.
- 모듈이 추가되면 database.json을 자동으로 갱신한다.

지금까지는 소스 코드를 받아오기 위해 백그라운드에서 GitHub을 쿼리해야 했습니다.
이 방식도 동작하기는 하지만, GitHub API의 요청 제한이 문제가 될 수 있었고, 코드가 변경될 가능성도 있었습니다.
그래서 저희는 GitHub에 배포된 코드의 복제본을 따로 관리해서 가용성과 안정성을 확보했습니다.


<!--
## Changes
-->
## 변경사항

<!--
We settled on a design where we provide a webhook, which when integrated into
your repository, will save an immutable version of any git tagged code.

- Source code is no longer fetched from raw.githubusercontent.com but rather
  from our S3 bucket, where we can preserve it forever.
- Publishing modules works through a Webhook now, rather than by opening a PR on
  the deno_website2 repository.
- You can not import from arbitrary commits or branches anymore, only tags /
  releases. Example: `https://deno.land/std@BRANCH` will not work anymore, only
  tagged commits like `https://deno.land/std@0.63.0`.
- All files served from the registry are immutable. They can not be changed or
  removed by the package author.
-->
저희는 코드 저장소를 통합하는 개념으로 설계 개념을 다시 잡았습니다.
이제 GitHub 저장소에서 태그가 붙은 코드는 모두 이뮤터블로 관리됩니다.

- 소스 코드는 이제 raw.githubusercontent.com에서 받아오지 않고 자체 S3 버킷에서 받아옵니다.
이 버킷은 영원히 유지될 것입니다.
- 모듈 배포는 지금처럼 deno_website2 저장소에 PR로 요청하는 대신 Webhook을 사용합니다.
- 이제는 특정 커밋이나 브랜치을 기준으로 로드할 수 없고 반드시 태그로 가리켜야 합니다.
ex: `https://deno.land/std@브랜치` 는 이제 동작하지 않습니다.
`https://deno.land/std@0.63.0` 과 같은 코드만 동작합니다.
- deno.land/x로 제공되는 모든 파일은 변경되지 않습니다.
패키지 관리자라도 수정하거나 삭제할 수 없습니다.


<!--
## How does this affect you?
-->
## 어떻게 수정하면 되나요?

<!--
If you only **consume modules** from deno.land/x you should see very few
functional differences. Downloads and navigating through files/folders on the
website should be faster, and all modules now display their GitHub star count.

If you are the **author of a module**, there are a few things you need to do:

1. Add a GitHub Webhook to your repository. You can find instructions for how to
   do so on https://deno.land/x by pressing the "Add a module" button.
2. If you do not have any Git tags in your repository, please create a tag. Only
   tagged versions are published on deno.land/x.

We will remove all modules that don't publish a tag within 30 days of adding the
webhook.
-->
deno.land/x에서 **모듈을 사용하기만** 한다면 변경할 내용은 거의 없습니다.
소스 파일을 다운로드받고 화면을 전환하는 과정은 이전보다 더 빨라질 것입니다.
GitHub 스타 카운트도 확인할 수 있습니다.

그리고 **모듈 개발자**라면 이런 내용을 수정해야 합니다:

1. 코드 저장소에 GitHub Webhook을 추가합니다.
https://deno.land/x 에서 "add a module" 버튼을 클릭하면 자세한 내용을 확인할 수 있습니다.
2. 코드 저장소에 Git 태그가 아무것도 없다면 태그를 생성하세요.
deno.land/x 에는 태그가 지정된 버전만 배포할 수 있습니다.

<!--
## Future plans
-->
## 이후 계획

<!--
With this new architecture we have the possibility to add all kinds of features.
Here are a few that we have planned:

1. Display download counts for all modules
2. Give all modules a score based on how well their module is maintained
   - verify that `deno lint`, `deno fmt`, `deno doc` and type checking produce
     no errors
   - are dependencies pinned to specific version
   - does the module have a LICENCE, README.md
3. Display dependencies of modules on the site
4. Serve a JS (type stripped) version of all TypeScript files in a module, to be
   imported directly from a web browser

If you have any comments or feedback, please open an issue on the
[deno_registry2](https://github.com/denoland/deno_registry2) repository or come
chat on the Deno [Discord](https://discord.gg/deno).
-->
새로 구성된 아키텍처 덕에 더 많은 기능을 추가할 가능성이 열렸습니다.
앞으로는 이런 기능을 추가할 예정입니다:

1. 모듈 다운로드 카운트 표시
2. 모듈이 잘 관리되고 있는지 점수로 표시
   - `deno lint`, `deno fmt`, `deno doc`을 사용할 수 있는지 확인하며 타입을 검사했을 때 오류가 없는지
   - 의존성 객체가 특정 버전을 정확하게 지정하는지
   - LICENCE, REDME.md 파일이 작성되어 있는지
3. 웹사이트에서 모듈의 의존성 관계를 확인하는 기능
4. 웹 브라우저에서 바로 로드할 수 있도록 모듈의 전체 TypeScript 파일을 JS 버전으로 제공하기
