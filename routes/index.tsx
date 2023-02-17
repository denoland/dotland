// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import type { ComponentChildren } from "preact";
import { tw } from "twind";
import { css } from "twind/css";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import HelloBar from "@/islands/HelloBar.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import * as Icons from "@/components/Icons.tsx";
import { Footer } from "$doc_components/footer.tsx";
import ScrollInGif from "@/islands/ScrollInGif.tsx";

import { getCookies } from "https://deno.land/std@0.143.0/http/cookie.ts";

interface Data {
  hellobarClosedTo: string;
}

const announcement = {
  major: true,
  href: "/manual/node",
  text: "npm compatibility has landed! Click here to get started",
} as const;

export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
      <ContentMeta
        title="Deno — A modern runtime for JavaScript and TypeScript"
        description="Deno is a simple, modern runtime for JavaScript and
          TypeScript that uses V8 and is built in Rust."
        creator="@deno_land"
        noAppendTitle
      />
      {announcement.href !== data.hellobarClosedTo && !announcement.major &&
        (
          <HelloBar to={announcement.href}>
            {announcement.text}
          </HelloBar>
        )}
      <div>
        <Header />

        <div
          class="relative pt-12 pb-28 lg:(pt-24 pb-40) bg-no-repeat bg-contain"
          style="background-image: url(/images/abstract-graphic.svg);background-size: 1000px; background-position: 130% 90%;"
        >
          <div class="section-x-inset-xl flex gap-32">
            <div class="relative text-gray-900 space-y-6 lg:(space-y-16 w-[40rem]) flex-1">
              <div class="space-y-2.5 py-16 lg:space-y-8">
                <h1 class="font-bold text-5xl lg:text-7xl leading-none">
                  The easiest,<br />most secure{" "}
                  <br class="hidden sm:block lg:hidden" />JavaScript runtime.
                </h1>
              </div>
              {
                /* <div class="inline-flex gap-4 flex-col lg:(gap-7 flex-row)">
                <a
                  class="button-primary bg-black shadow-xl text-white justify-center"
                  href="/manual/getting_started/installation"
                >
                  Installation
                </a>
                <a class="button-primary shadow-xl" href="/manual">
                  Documentation
                </a>
              </div> */
              }
            </div>
            <div class="flex items-center">
              <div class="flex gap-8">
                <div class="bg-white w-72 rounded-lg shadow p-8 space-y-4 border border-1 border-gray-300">
                  <div class="text-4xl font-bold">Open Source</div>

                  <div class="text-gray-700">
                    JavaScript, TypeScript, and WebAssembly runtime with secure
                    defaults and a great developer experience.
                  </div>
                  <div>
                    <a
                      class="button-primary bg-black hover:bg-gray-900 text-white justify-center "
                      href="/manual/getting_started/installation"
                    >
                      Install
                    </a>

                    <a
                      class="button-primary bg-white hover:bg-gray-100 border border-1 text-black justify-center ml-4"
                      href="/manual"
                    >
                      Docs
                    </a>
                  </div>
                </div>
                <div class="bg-white w-72 rounded-lg shadow p-8 space-y-4 border border-1 border-gray-300 flex flex-col items-start">
                  <div class="flex-1 space-y-4">
                    <div class="text-4xl font-bold">Cloud</div>

                    <div class="text-gray-700">
                      Serverless JavaScript hosting with zero config, worldwide.
                    </div>
                  </div>
                  <a class="button-primary hover:bg-blue-400" href="/manual">
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {announcement.major &&
          (
            <a
              class="block items-center justify-center py-3 px-4 text-white text-center font-semibold bg-gray-900"
              href={announcement.href}
            >
              {announcement.text}
            </a>
          )}

        <Section
          type="Easy"
          header="The best developer experience"
          subheader="Without the learning curve…"
        >
          <ImageSubSection
            image={<ScrollInGif src="/images/lp/dependencies" alt="" />}
            header="Avoid installing dependencies"
            additionalContent={
              <img
                src="/images/lp/typing_deno.png"
                class="absolute hidden lg:(block h-40 -bottom-7 right-2)"
                aria-hidden
              />
            }
            reverse
          >
            Dive right into the code and skip the setup.
          </ImageSubSection>

          <ImageSubSection
            image={
              <picture>
                <source
                  srcset="/images/lp/web_compatibility@lg.avif"
                  type="image/avif"
                  media="(min-width: 1024px)"
                />
                <source
                  srcset="/images/lp/web_compatibility@lg.webp"
                  type="image/webp"
                  media="(min-width: 1024px)"
                />
                <source
                  srcset="/images/lp/web_compatibility@lg.png"
                  type="image/png"
                  media="(min-width: 1024px)"
                />

                <source
                  srcset="/images/lp/web_compatibility.avif"
                  type="image/avif"
                />
                <source
                  srcset="/images/lp/web_compatibility.webp"
                  type="image/webp"
                />
                <img
                  class="py-7 pl-5 pr-7 lg:(py-12 pl-16 pr-22)"
                  src="/images/lp/web_compatibility.png"
                  alt="Web APIs"
                />
              </picture>
            }
            header="Web-standard APIs"
          >
            A runtime that resembles the web, using browser APIs that work on
            the server.
          </ImageSubSection>

          <div class="flex justify-between flex-col gap-11 lg:(flex-row gap-[8%])">
            {[{
              Icon: Icons.OutOfTheBox,
              title: "TypeScript out of the box",
              body: (
                <>
                  First-class support for TypeScript – no need to spend hours
                  configuring things that break as soon as you update
                  a&nbsp;dependency.
                </>
              ),
            }, {
              Icon: Icons.Tooling,
              title: "Great all-in-one tooling",
              body: (
                <>
                  Built in linter, code formatter, ability to build a
                  self-contained executable, test runner, IDE integration,
                  and&nbsp;more.
                </>
              ),
            }, {
              Icon: Icons.HassleFree,
              title: "Hassle-free deployment",
              body: (
                <>
                  Launch to Deno Deploy with one line of code and zero server
                  configuration, or host with other platforms of
                  your&nbsp;choice.
                </>
              ),
            }].map(({ Icon, title, body }) => (
              <div class="flex items-start flex-row-reverse gap-8 lg:(flex-col gap-9)">
                <Icon class="flex-none w-[3.25rem] md:w-16 lg:w-18" />
                <div class="inline space-y-3 lg:space-y-4">
                  <h3 class="font-bold text-default text-[1.375rem] md:text-3xl lg:text-4xl">
                    {title}
                  </h3>
                  <p class="text-normalBlue font-medium md:text-xl lg:text-2xl">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Quote
          author="Stack Overflow"
          href="https://survey.stackoverflow.co/2022/#most-loved-dreaded-and-wanted-webframe-love-dread"
          size="2xl"
          lgSize="5xl"
        >
          Voted one of the most loved web technologies{" "}
          <br class="hidden lg:block" />in a survey of over
          70,000&nbsp;developers
        </Quote>

        <Section
          type="Fast"
          header="Built to perform at your speed."
          subheader="Designed from the ground-up for high-performance."
        >
          <ImageSubSection
            image={
              <picture>
                <source
                  srcset="/images/lp/benchmark@lg.avif"
                  type="image/avif"
                  media="(min-width: 1024px)"
                />
                <source
                  srcset="/images/lp/benchmark@lg.webp"
                  type="image/webp"
                  media="(min-width: 1024px)"
                />
                <source
                  srcset="/images/lp/benchmark@lg.png"
                  type="image/png"
                  media="(min-width: 1024px)"
                />

                <source
                  srcset="/images/lp/benchmark.avif"
                  type="image/avif"
                />
                <source
                  srcset="/images/lp/benchmark.webp"
                  type="image/webp"
                />
                <img
                  class="py-9 px-5.5 lg:(pt-18 pb-22 px-12)"
                  src="/images/lp/benchmark.png"
                  alt="HTTP Benchmark"
                />
              </picture>
            }
            header="Best in class HTTP server speeds"
            reverse
          >
            The fastest JavaScript web server ever built.
            <br />
            (<a
              class="text-mainBlue hover:underline"
              href="https://github.com/denoland/deno/blob/v1.28.0/cli/bench/http/deno_http_flash.js"
            >
              HTTP hello&#8288;-&#8288;world
            </a>{" "}
            using wrk on&nbsp;mac&#8288;)
          </ImageSubSection>

          <ImageSubSection
            image={
              <picture>
                <source srcset="/images/lp/v8.avif" type="image/avif" />
                <source srcset="/images/lp/v8.webp" type="image/webp" />
                <img src="/images/lp/v8.png" alt="" />
              </picture>
            }
            header="Powered by Chrome's V8"
            noBackground
          >
            Built on top of the fastest and&nbsp;most complete
            JavaScript&nbsp;engine.
          </ImageSubSection>
        </Section>

        <Quote
          author="Slack"
          href="https://deno.com/blog/slack-open-beta"
          size="xl"
          lgSize="[2.75rem]"
        >
          What stood out first and foremost to our team was their laser focus on
          security... like the ability to execute code with limited access to
          the file system or external domains.
        </Quote>

        <Section
          type="Secure"
          header="Secure by default."
          subheader="Take total control over your workflow."
        >
          <ImageSubSection
            image={<ScrollInGif src="/images/lp/secure" alt="" />}
            header="Run untrusted code"
            additionalContent={
              <img
                src="/images/lp/armor_deno.png"
                class="absolute hidden lg:(block w-44 -bottom-10 -right-8)"
                aria-hidden
              />
            }
            reverse
          >
            By default Deno provides no I/O access and is appropriate for
            running untrusted code and auditing new
            third&#8288;-&#8288;party&nbsp;code.
          </ImageSubSection>

          <div class="grid items-center justify-between gap-18 lg:(gap-22 grid-cols-2)">
            {[{
              title: (
                <>
                  Fine grained<br />permission&nbsp;checks
                </>
              ),
              body: (
                <>
                  Provide an allow-list to access only certain file system
                  directories, network hosts, and environment&nbsp;variables.
                </>
              ),
              Icon: Icons.Permissions,
            }, {
              title: (
                <>
                  Safer NPM <br class="hidden lg:block" />packages
                </>
              ),
              body: (
                <>
                  Install and run npm packages with less&nbsp;worry.
                </>
              ),
              Icon: Icons.Secure,
            }].map(({ title, body, Icon }) => (
              <div class="flex justify-between items-start gap-8 flex-row-reverse lg:flex-row">
                <Icon class="mt-1.5 flex-none w-[3.25rem] md:w-16 lg:w-18" />
                <div class="space-y-3 lg:space-y-5">
                  <h3 class="font-bold text-[1.375rem] md:text-3xl lg:text-4xl text-default">
                    {title}
                  </h3>
                  <p class="text-normalBlue font-medium md:text-xl lg:text-2xl">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div class="colorWash pt-11 pb-12 lg:(pt-28 pb-24)">
          <div class="section-x-inset-2xl md:text-center">
            <p class="text-white font-semibold text-xl pr-18 lg:(text-3xl pr-0)">
              Used by a large community of developers and leading
              technology&nbsp;companies:
            </p>
            <p class="text-white font-bold mt-4 mb-10 text-4xl lg:(mt-7 mb-13 text-7xl)">
              Over 200k Monthly&nbsp;Actives
            </p>
            <div class="grid grid-cols-2 justify-center items-center text-white gap-6 md:(gap-18 grid-cols-none grid-flow-col)">
              {companies.map((company) => (
                <div key={company.url}>
                  <a
                    class="lg:(opacity-70 hover:opacity-100)"
                    href={company.url}
                    target="_blank"
                  >
                    <img
                      class="h-7 lg:h-12"
                      src={`/images/lp/companies/${company.name.toLowerCase()}.svg`}
                      alt={company.name}
                      title={company.name}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

const gradientLabelBeforeAfter =
  "absolute z-10 inset-0 rounded-full border-transparent box-border border-[3px] lg:border-4";

function Section(
  { type, header, subheader, children }: {
    type: string;
    header: string;
    subheader: string;
    children: ComponentChildren;
  },
) {
  return (
    <div class="section-x-inset-xl pt-12 pb-18 lg:(pt-18 pb-24)">
      <div
        class={tw`border-blue-300 border border-2 rounded-full relative py-2 w-22 md:(py-2.5 w-36 mx-auto)`}
      >
        <span
          class={tw`text-black relative block z-20 font-semibold leading-tight text-center md:text-[1.75rem]`}
        >
          {type}
        </span>
      </div>
      <h2 class="font-bold text-default leading-none mt-5 mb-4 text-3xl md:(my-5 text-5xl text-center) lg:text-6xl">
        {header}
      </h2>
      <p class="font-semibold text-normalBlue text-xl md:(text-2xl text-center)">
        {subheader}
      </p>

      <div class="mt-14 space-y-14 md:space-y-20 lg:(mt-20 space-y-28)">
        {children}
      </div>
    </div>
  );
}

function ImageSubSection(
  {
    image,
    header,
    additionalContent,
    children,
    noBackground,
    reverse,
  }: {
    image: ComponentChildren;
    header: string;
    children: ComponentChildren;
    additionalContent?: ComponentChildren;
    noBackground?: boolean;
    reverse?: boolean;
  },
) {
  return (
    <div
      class={`flex items-center justify-between gap-5 flex-col md:gap-10 lg:(gap-12 flex-row${
        reverse ? "-reverse" : ""
      })`}
    >
      <div
        class={`relative w-full rounded-lg md:rounded-2xl lg:w-[70%] box-border flex-none ${
          !noBackground
            ? tw`bg-azure ${
              css({
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              })
            }`
            : ""
        }`}
      >
        {additionalContent}
        <div class="w-full children:w-full children:children:w-full overflow-hidden rounded-lg md:rounded-2xl">
          {image}
        </div>
      </div>
      <div class="space-y-3 p-1.5 lg:p-0">
        <h3 class="font-bold text-default text-3xl md:text-4xl">
          {header}
        </h3>
        <p class="text-normalBlue font-medium text-lg md:text-2xl">
          {children}
        </p>
      </div>
    </div>
  );
}

function Quote(
  { children, size, lgSize, author, href }: {
    children: ComponentChildren;
    size: string;
    lgSize: string;
    author: string;
    href: string;
  },
) {
  return (
    <div class="colorWash pt-18 pb-14 lg:(pt-24 pb-20)">
      <div class="section-x-inset-xl space-y-8 lg:space-y-11 lg:text-center">
        <blockquote
          class={`text-white font-semibold text-${size} lg:text-${lgSize} leading-tight`}
        >
          "{children}"
        </blockquote>
        <a class="inline-block mx-auto lg:mx-none" href={href}>
          <img
            class="h-7 lg:h-10"
            src={`/images/lp/companies/${author.toLowerCase()}.svg`}
            alt={author}
            title={author}
          />
        </a>
      </div>
    </div>
  );
}

const companies = [{
  name: "Slack",
  url: "https://slack.com",
}, {
  name: "Netlify",
  url: "https://netlify.com",
}, {
  name: "GitHub",
  url: "https://github.com",
}, {
  name: "Supabase",
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
