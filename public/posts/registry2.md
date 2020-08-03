The goal of deno.land/x has been to provide a central location for third party
Deno modules consistant with how Deno operates. We want people to be able to
copy and paste source code URLs like https://deno.land/x/oak/mod.ts directly
into the browser and be able to view marked up source code and have links to
auto-generated documentation.

Today we are releasing a major rewrite of the deno.land/x service that solves
some long standing issues like rate limits on the GitHub API and providing
immutable source code downloads (like on crates.io).

## Goals

- make all source code links immutable
- remove the GitHub API rate limits on the website
- remove non versioned imports
- remove the need to manually update database.json to add modules

To do this we settled on a design where we provide a webhook, which when
integrated into your repository, will save an immutable version of any git tags.

## What has changed?

- Source code is no longer fetched from raw.githubusercontent.com but rather
  from our S3 bucket, where we can preserve it forever.
- Publishing modules works through a Webhook now, rather than by opening a PR on
  the deno_website2 repository.
- You can not import from arbitrary commits or branches anymore, only tags /
  releases. Example: `https://deno.land/std@BRANCH` will not work anymore, only
  tagged commits like `https://deno.land/std@0.63.0`.
- All files served from the registry are immutable. They can not be changed or
  removed by the package author.

## How does this affect you?

If you only **consume modules** from deno.land/x you should see very few
functional differences. Downloads and navigating through files/folders on the
website should be faster, and all modules now display their GitHub star count.

If you are the **author of a module**, there are a few things you need to do:

1. Add a GitHub Webhook to your repository. You can find instructions for how to
   do so on https://deno.land/x by pressing the "Add a module" button.
2. If you do not have any Git tags in your repository, please create a tag. Only
   tagged versions are published on deno.land/x.

We will remove all modules that don't publish a tag within 30 days of publishing
a release.

## Future plans

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

If you have any comments or feedback, please let open an issue on the
[deno_registry2](https://github.com/denoland/deno_registry2) repository or come
chat on the Deno [Discord](https://discord.gg/deno).
