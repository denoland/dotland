On Tuesday at 02:01 AM UTC serveral services provided by the Deno organization
had a 98 minute service disruption. This impacted images and videos on the
deno.land website, serving of TypeScript files on deno.land/x and deno.land/std,
generation of documentation reports on doc.deno.land, and downloading of
registry metadata from cdn.deno.land. We have concluded that this outage was the
result of a rouge abuse prevention filter at an upstream service provider,
Cloudflare. This post details what exactly happened, how we recovered the
systems, and what we are doing to prevent this in the future.

All services are now operating norally again. The registry api at api.deno.land
was not impacted by this incident. No data was lost. We take outages like these
seriously and sincerely apologize for the disruption.

To understand what actually happened it is important to know that we released
Deno 1.8 and published the release notes in a blog post 1.5 hours before the
incident. This blog post ended up on Hacker News about 30 minutes before the
incident. At the time of incident we were receiving about 9x the regular traffic
to the site.

## Timeline of events

At 02:00 AM UTC we received an email from an automated system at Cloudflare
notifying us that serving media deno.land had been blocked due to a suspected
violation of section 2.8 or their TOS. This section of the TOS details that
Cloudflare may not be used to serve primarially media files. Upon receival of
this email we decided to remove the screen captures and media files from the 1.8
blog post as a temporary mitigation. This was done at 02:09 AM UTC. At 02:22 AM
UTC we opened a support ticket with Cloudflare.

At 03:00 AM UTC we decided we would move our infrastrucutre to an alternative
infrastructure provider (https://fly.io) to mitigate the outage. Huge thanks to
[Kurt Mackey](https://twitter.com/mrkurt) from Fly.io for helping with this
effort and providing us with infrastructure right away. We switched over the DNS
records for the affected services at 03:24 AM UTC. This resolved the outage for
the majority of users worldwide at 03:41 AM UTC.

Cloudflare resolved the issue false positive block at 18:40 PM UTC - 16.5 hours
after the incident started, and 16 hours after we reached out.

## Root cause

Our initial anlysis of the incident yesterday evening concluded that Cloudflare
had blocked all media files for the deno.land zone. This alone should have not
taken down deno.land/x or deno.land/std - these do not serve media, but source
code. The issue was that Cloudflare was seemingly interpreting all .ts files,
regardless of content or content-type header, as MPEG transport streams (which
fall under the media block). In our case this is invalid because .ts files can
be both MPEG transport streams, or TypeScript files.

## Whats next?

Cloudflare reached out to us yesterday to discuss what happened. After an
initital investigation they have concluded that this was an error in their abuse
monitoring system. Cloudflare has assured us this issue will not occur again,
and that they will implement changes in their systems to make sure this will not
happen to any other Cloudflare customers.

Cloudflare has also assured us that a 16 hour gap between false detection and
remediation is not acceptable, and that this will be an area of immediate focus
for them.

This experience has solidified our belief that building the Deno runtime on
standardized, open web APIs like `fetch` was the right move. Because Cloudflare
Workers builds these standard web APIs too, we were able to migrate our primary
Cloudflare Worker to a Deno script running on Fly.io in under 20 minutes. We
only had to polyfill the "fetch" event to get our workers running.

If you are interested, this is the code we used to polyfill the "fetch" event:
https://gist.github.com/lucacasonato/1a30a4fa6ef6c053a93f271675ef93fc. Try run
this example locally, then visit http://0.0.0.0:8080.

```shell
$ deno run --allow-net https://gist.githubusercontent.com/lucacasonato/1a30a4fa6ef6c053a93f271675ef93fc/raw/efcdc8e798604e194831830fcb962b50261384b3/example-worker.js
Listening on http://0.0.0.0:8080
```
