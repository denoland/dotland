Since the beginning the goal for deno.land/x is to give all modules in the Deno
ecosystem a reliable, easy to use, and free host. With the increased adoption of
Deno in the recent month there have been more and more requests to add features
like download counts, immutable versions, and a self service module upload.

We also have some long standing issues like rate limits on the GitHub API that
we use, and `https://deno.land/std` being an alias to
`https://deno.land/std@master` rather than the latest version. These were issues
we could not adress without a redesign of deno.land/x.

## Issues to solve

The main issues we wanted to address in this first stage were:

- making module upload self service
- making all versions immutable
- removing non versioned imports
- and removing the GitHub API rate limits on the website

To do this we setteled on a design where all source code is stored our servers,
and we retrieve a new version from GitHub whenever it is published. We get
notified of this by a GitHub Webhook you add to your repository.

## What has changed?

- Source code is now not stored on raw.githubusercontent.com, rather on our own
  servers.
- Publishing modules works through a GitHub Webhook now, rather than by opening
  a PR on the deno_website2 repository.
- You can not import from arbitrary commits or branches anymore, only tags /
  releases. No more `https://deno.land/std@master`.
- All files served from the registry are immutable. They can not be changed or
  removed by the package author.

## How does this affect you?

If you only **consume modules** from deno.land/x you should see very few
functional differences. Downloads and navigating through files/folders on the
website should be faster, and all modules now display their GitHub star count.

If you are the **author of a module**, there are a few things you need to do:

1. Add a GitHub Webhook to your repository. You can find instructions for how to
   do so on https://deno.land/x by pressing the `Add a module` button. If you
   have any questions about this process, please reach out on
   [Discord](https://discord.gg/deno).
2. If you do not have any Git tags in your repository, please create a tag. Only
   tagged versions are published on deno.land/x.

We will remove all modules that don't publish a tag within 30 days of publishing
a release.

## Future plans

With this architechture we have the possibility to add all kinds of features.
Here are a few that we have planned:

1. Display download counts for all modules
2. Give all modules a score based on how well their module is maintained
   - do `deno lint`, `deno fmt`, `deno doc`, and the TypeScript compiler report
     any issues
   - are imports version locked
   - does the module have a LICENCE, README.md
3. Display dependencies of modules on the site
4. Serve a JS (type stripped) version of all TypeScript files in a module, to be
   imported directly from a web browser

If you have any comments or feedback, please let open an issue on the
[deno_registry2](https://github.com/denoland/deno_registry2) repository or come
chat on the Deno [Discord](https://discord.gg/deno).
