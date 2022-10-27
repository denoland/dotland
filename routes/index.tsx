// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { type ComponentChildren, h } from "preact";
import { css, tw } from "@twind";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import HelloBar from "@/islands/HelloBar.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import * as Icons from "@/components/Icons.tsx";

import { getCookies } from "https://deno.land/std@0.143.0/http/cookie.ts";

interface Data {
  hellobarClosedTo: string;
}

export default function Home({ data }: PageProps<Data>) {
  const hellobarTo =
    "https://deno.news/archive/52-deno-126-isolate-clouds-and-the-edge";

  return (
    <div>
      <ContentMeta
        title="Deno — A modern runtime for JavaScript and TypeScript"
        description="Deno is a simple, modern runtime for JavaScript and
          TypeScript that uses V8 and is built in Rust."
        creator="@deno_land"
        noAppendTitle
      />
      {hellobarTo !== data.hellobarClosedTo &&
        (
          <HelloBar to={hellobarTo}>
            Check out Deno News issue #52!
          </HelloBar>
        )}
      <div>
        <Header />

        <div
          class={tw`px-36 py-20 ${
            css({
              background:
                'url("/images/cover.png") 68% 23%/120% no-repeat, linear-gradient(to right, #000059, #0094FF)',
            })
          }`}
        >
          <div class={tw`w-136 text-white space-y-6`}>
            <p class={tw`font-semibold text-3xl leading-none`}>Meet Deno</p>
            <p class={tw`font-semibold text-[5rem] leading-none`}>
              The easiest, fastest, and most secure JavaScript runtime.
            </p>
            <div class={tw`space-x-7`}>
              <a class={tw`button-primary`} href="">Installation</a>
              <a class={tw`button-primary`} href="">Documentation</a>
            </div>
          </div>
        </div>

        <a
          class={tw`flex items-center justify-center py-3 bg-mainBlue text-2xl text-white text-center font-semibold bg-gradient-to-r from-yellow-500 via-red-500 to-pink-600`}
          href="deno.com/blog"
        >
          NPM compatibility is now live! Click here to get started
        </a>

        <div class={tw`section-x-inset-xl pt-18 pb-24`}>
          <div
            class={tw`block colorWash rounded-full w-44 py-4 text-white font-semibold text-3xl text-center mx-auto mb-8`}
          >
            Easy
          </div>
          <h2
            class={tw`text-center font-bold text-6xl text-darkBlue leading-snug`}
          >
            The best developer experience
          </h2>
          <p class={tw`text-center font-semibold text-2xl text-normalBlue`}>
            Without the learning curve…
          </p>

          <div class={tw`mt-20 space-y-32`}>
            <div class={tw`flex items-center justify-between gap-18`}>
              <div class={tw`space-y-3`}>
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Avoid installing dependencies
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  Dive right into the code<br />and skip the setup.
                </p>
              </div>
              <div class={tw`featurePad`}>
                <img
                  src="/images/Dependencies_Placeholder.png"
                  alt="Dependencies"
                />
              </div>
            </div>

            <div class={tw`flex items-center justify-between gap-18`}>
              <div class={tw`featurePad py-12 px-20`}>
                <img src="/images/web_compatibility.png" alt="Web APIs" />
              </div>
              <div class={tw`space-y-3`}>
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Web-standard APIs
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  A runtime that resembles the web, using browser APIs that work
                  on the server.
                </p>
              </div>
            </div>

            <div class={tw`flex items-center justify-between gap-22`}>
              <div class={tw`space-y-5`}>
                <Icons.Logo class="w-15" />
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  TypeScript out of the box
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  First-class support for TypeScript – no need to spend hours
                  configuring things that break as soon as you update a
                  dependency.
                </p>
              </div>
              <div class={tw`space-y-5`}>
                <Icons.Logo class="w-15" />
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Great all-in-one tooling
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  Built in linter, code formatter, ability to build a
                  self-contained executable, test runner, IDE integration, and
                  more.
                </p>
              </div>
              <div class={tw`space-y-5`}>
                <Icons.Logo class="w-15" />
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Hassle-free deployment
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  Launch to Deno Deploy with one line of code and zero server
                  configuration, or host with other platforms of your choice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Quote
          author="Stack Overflow"
          href="https://survey.stackoverflow.co/2022/#most-loved-dreaded-and-wanted-webframe-love-dread"
          size="5xl"
        >
          Voted one of the most loved web technologies
          <br />in a survey of over 70,000 developers
        </Quote>

        <div class={tw`section-x-inset-xl pt-18 pb-24`}>
          <div
            class={tw`block colorWash rounded-full w-44 py-4 text-white font-semibold text-3xl text-center mx-auto mb-8`}
          >
            Fast
          </div>
          <h2
            class={tw`text-center font-bold text-6xl text-darkBlue leading-snug`}
          >
            Built to perform at your speed.
          </h2>
          <p class={tw`text-center font-semibold text-2xl text-normalBlue`}>
            Designed from the ground-up for high-performance.
          </p>

          <div class={tw`mt-20 space-y-32`}>
            <div class={tw`flex items-center justify-between gap-18`}>
              <div class={tw`space-y-3`}>
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Best in class HTTP server speeds
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  The fastest JavaScript web server ever built.
                </p>
              </div>
              <div class={tw`featurePad p-18`}>
                <img src="/images/benchmark.png" alt="HTTP Benchmark" />
              </div>
            </div>

            <div class={tw`flex items-center justify-between gap-18`}>
              <div class={tw`featurePad`}>
              </div>
              <div class={tw`space-y-3`}>
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Powered by Chrome's V8
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  Built on top of the fastest and most complete JavaScript
                  engine.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Quote
          author="Slack"
          href="https://deno.com/blog/slack-open-beta"
          size="4xl"
        >
          What stood out first and foremost to our team was their laser focus on
          security. Deno’s secure architecture means developers get built-in
          granular controls, like the ability to execute code with limited
          access to the file system or external domains.
        </Quote>

        <div class={tw`section-x-inset-xl pt-18 pb-24`}>
          <div
            class={tw`block colorWash rounded-full w-44 py-4 text-white font-semibold text-3xl text-center mx-auto mb-8`}
          >
            Secure
          </div>
          <h2
            class={tw`text-center font-bold text-6xl text-darkBlue leading-snug`}
          >
            Secure by default.
          </h2>
          <p class={tw`text-center font-semibold text-2xl text-normalBlue`}>
            Take total control over your workflow.
          </p>

          <div class={tw`mt-20 space-y-32`}>
            <div class={tw`flex items-center justify-between gap-18`}>
              <div class={tw`space-y-3`}>
                <h3 class={tw`font-bold text-4xl text-darkBlue`}>
                  Run untrusted code
                </h3>
                <p class={tw`text-2xl text-normalBlue`}>
                  By default Deno provides no I/O access and is appropriate for
                  running untrusted code and auditing new third-party code.
                </p>
              </div>
              <div class={tw`featurePad`}></div>
            </div>

            <div
              class={tw`grid items-center justify-between gap-22 grid-cols-2`}
            >
              <div class={tw`grid gap-5`}>
                <Icons.Logo class="w-15 col-start-1" />
                <h3 class={tw`col-start-2 font-bold text-4xl text-darkBlue`}>
                  Fine grained<br />permission checks
                </h3>
                <p class={tw`col-start-2 text-2xl text-normalBlue`}>
                  Provide an allow-list to access only certain file system
                  directories, network hosts, and environment variables.
                </p>
              </div>

              <div class={tw`grid gap-5`}>
                <Icons.Logo class="w-15 col-start-1" />
                <h3 class={tw`col-start-2 font-bold text-4xl text-darkBlue`}>
                  Safer NPM<br />packages
                </h3>
                <p class={tw`col-start-2 text-2xl text-normalBlue`}>
                  Install and run npm packages without having to audit them
                  first.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class={tw`pt-28 pb-24 colorWash`}>
          <div class={tw`section-x-inset-2xl space-y-11`}>
            <p class={tw`text-white font-semibold text-3xl text-center`}>
              Used by a large community of developers<br />and leading
              technology companies:
            </p>
            <p class={tw`text-white font-bold text-7xl text-center`}>
              Over 300k Monthly Actives
            </p>
            <ul class={tw`flex justify-center gap-18 text-white`}>
              {companies.map((company) => (
                <li key={company.url}>
                  <a
                    class={tw`flex items-center gap-2 flex-nowrap opacity-70 hover:opacity-100`}
                    href={company.url}
                    target="_blank"
                  >
                    <img
                      class={tw`w-11`}
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/${company.logo}`}
                      alt={company.name}
                      title={company.name}
                    />{" "}
                    <span class={tw`font-medium text-4xl`}>{company.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function Quote(
  { children, size, author, href }: {
    children: ComponentChildren;
    size: string;
    author: string;
    href: string;
  },
) {
  return (
    <div class={tw`pt-24 pb-20 colorWash`}>
      <figure class={tw`section-x-inset-xl space-y-11 text-center`}>
        <blockquote
          class={tw`text-white font-semibold text-${size} leading-tight`}
        >
          {children}
        </blockquote>
        <figcaption class={tw`text-white text-2xl`}>
          {author} –{" "}
          <cite>
            <a
              href={href}
              class={tw`text-white hover:(text-yellow-400 underline)`}
            >
              {href}
            </a>
          </cite>
        </figcaption>
      </figure>
    </div>
  );
}

const companies = [{
  name: "Slack",
  logo: "slack.svg",
  url: "https://slack.com",
}, {
  name: "Netlify",
  logo: "netlify.svg",
  url: "https://netlify.com",
}, {
  name: "GitHub",
  logo: "github.svg",
  url: "https://github.com",
}, {
  name: "Supabase",
  logo: "supabase.svg",
  url: "https://supabase.com",
}];

export const handler: Handlers<Data> = {
  GET(req, { render }) {
    const cookies = getCookies(req.headers);
    return render!({
      hellobarClosedTo: cookies.hellobar ?? "",
    });
  },
};
