On Tuesday at 02:01 AM UTC serveral services provided by the Deno organization
had a 98 minute service disruption. This impacted images and videos on the
deno.land website, serving of TypeScript files on deno.land/x and deno.land/std,
generation of documentation reports on doc.deno.land, and downloading of
registry metadata from cdn.deno.land. We have concluded that this outage was the
result of a rouge abuse prevention filter at an upstream service provider,
Cloudflare. This post details what exactly happened, how we recovered the
systems, and what we are doing to prevent this in the future.

All services are now operating normally again. The registry API at api.deno.land
was not impacted by this incident. No data was lost. We take outages like these
seriously and sincerely apologize for the disruption.

To understand what actually happened it is important to know that we released
Deno 1.8 and published the release notes in a blog post 1.5 hours before the
incident. This blog post ended up on Hacker News about 30 minutes before the
incident. At the time of incident we were receiving about 9x the regular traffic
to the site.

## Timeline of events

At 02:00 AM UTC we received an email from an automated system at Cloudflare
notifying us that all media on deno.land had been blocked due to a suspected
violation of section 2.8 or their TOS. This section of the TOS details that
Cloudflare may not be used to serve primarially media files. Upon receival of
this email we decided to remove the screen captures and images from the 1.8 blog
post as a temporary mitigation. This was done at 02:09 AM UTC. This did not
resolve the issue. At 02:22 AM UTC we opened a support ticket with Cloudflare.

At 03:00 AM UTC we decided we would move our infrastrucutre to an alternative
infrastructure provider (https://fly.io) to mitigate the outage. Huge thanks to
[Kurt Mackey](https://twitter.com/mrkurt) from Fly.io for helping with this
effort and providing us with infrastructure right away. We switched over the DNS
records for the affected services at 03:24 AM UTC. This resolved the outage for
the majority of users worldwide at 03:41 AM UTC.

Cloudflare resolved the block they had put on our site at 18:40 PM UTC - 16.5
hours after the incident started, and 16 hours after we reached out. This was
the first non-standardized response we got from them after opening the ticket.

## Root cause

Our initial anlysis of the incident concluded that Cloudflare had blocked all
media files for the deno.land zone - likely due to the steep increase of traffic
due to Hacker News. This alone should have not taken down deno.land/x or
deno.land/std as these do not serve media, but source code. This was caused by
Cloudflare seemingly interpreting all .ts files, regardless of content or
content-type header, as MPEG transport streams (which fall under the media
block). In our case this was not correct because .ts files can be both MPEG
transport streams, or TypeScript files (as is the case for us). All of our
typescript files are served with `application/typescript`.

## Impact

As you might know, Deno imports remote code using URLs. This means that if the
host of the module you want to import experiences an outage, you will not be
able to download this module from that host anymore. This is the same problem
all package managers have - for example when npmjs.org experiences an outage,
you can not `npm install` anymore.

Does this mean that you are not able to run your project when the module host
goes down? No. Deno caches all remote imports in a global cache directory on
your system. This means that when you import the a bit of code for the first
time it will be downloaded and cached, and then on subsequent runs you will be
able to use that code offline without needing network access - just like with
node_modules.

We expect the impact of this outage to be relatively minimal to most developers
who use Deno on active projects, as they would have likely had their
dependencies cached already. This outage overwhelmingly impacted new Deno users,
and CI pipelines.

It is also important to note that the Deno CLI does not depend on the deno.land
domain to be online to function. It is completly registry agnostic. If your
project is only made up of modules from other registries, like esm.sh,
skypack.dev, jspm.dev, or nest.land, you would have seen no impact from this
outage.

## What's next?

Cloudflare reached out to us Tuesday evening to discuss what happened. After an
initital investigation they concluded that this was an error in their abuse
monitoring system. Cloudflare has assured us this issue will not occur again,
and that they will implement changes in their systems to make sure this will not
happen to any other Cloudflare customers.

Cloudflare has also assured us that a 16 hour gap between false detection and
remediation is not acceptable, and that this will be an area of immediate focus
for them.

This experience has solidified our belief that building the Deno runtime on
standardized, open web APIs like `fetch` was the right move. Because Cloudflare
Workers builds on these standard web APIs too, we were able to migrate our
primary Cloudflare Worker to a Deno script running on Fly.io in under 20
minutes. We only had to polyfill the "fetch" event to get our workers running.

If you are interested, this is the code we used to polyfill the "fetch" event:
https://gist.github.com/lucacasonato/1a30a4fa6ef6c053a93f271675ef93fc. Try run
this example locally, then visit http://0.0.0.0:8080.

```shell
$ deno run --allow-net https://gist.githubusercontent.com/lucacasonato/1a30a4fa6ef6c053a93f271675ef93fc/raw/efcdc8e798604e194831830fcb962b50261384b3/example-worker.js
Listening on http://0.0.0.0:8080
```

As a result of this incident we have set up a public status page. This page
shows the current status of deno.land/x, deno.land/std, cdn.deno.land, and
api.deno.land. You can view it at https://status.deno.land/.
