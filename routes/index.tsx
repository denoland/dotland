// Copyright 2022 the Deno authors. All rights reserved. MIT license.

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
  href: "https://deno.com/blog",
  text: "NPM compatibility is now live! Click here to get started",
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
          class={tw`px-8 pt-12 pb-28 lg:(px-36 py-20) ${
            css({
              background: 'url("/images/lp/cover.png") left / cover no-repeat',
            })
          } md:(${
            css({
              background:
                'url("/images/lp/cover@lg.png") center / cover no-repeat',
            })
          }) xl:(${
            css({
              background:
                'url("/images/lp/cover@xl.png") center / cover no-repeat',
            })
          })`}
        >
          <div class="text-white lg:w-136">
            <div class="space-y-2.5 lg:space-y-5.5">
              <p class="font-semibold text-xl lg:text-3xl leading-none">
                Meet Deno
              </p>
              <p class="font-bold text-5xl lg:text-[5rem] leading-none">
                The easiest and most secure JavaScript runtime.
              </p>
            </div>
            <div class="mt-6 lg:(mt-16 space-x-7)">
              <a class="hidden lg:inline button-primary" href="/manual/getting_started/installation">
                Installation
              </a>
              <a class="button-primary" href="/manual">Documentation</a>
            </div>
          </div>
        </div>

        {announcement.major &&
          (
            <a
              class="flex items-center justify-center py-3 px-4 bg-mainBlue text-2xl text-white text-center font-semibold bg-gradient-to-r from-yellow-500 via-red-500 to-pink-600"
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
            image={<ScrollInGif />}
            header="Avoid installing dependencies"
            additionalContent={
              <img
                src="/images/lp/typing_deno.png"
                class="absolute hidden lg:(block h-64 -bottom-20 -right-12)"
              />
            }
            reverse
          >
            Dive right into the code and skip the setup.
          </ImageSubSection>

          <ImageSubSection
            image={
              <>
                <img
                  class="lg:hidden"
                  src="/images/lp/web_compatibility.png"
                  alt="Web APIs"
                />
                <img
                  class="hidden lg:block"
                  src="/images/lp/web_compatibility@lg.png"
                  alt="Web APIs"
                />
              </>
            }
            header="Web-standard APIs"
          >
            A runtime that resembles the web, using browser APIs that work on
            the server.
          </ImageSubSection>

          <div class="flex items-center justify-between flex-col gap-11 lg:(flex-row gap-[8%])">
            {[{
              Icon: Icons.OutOfTheBox,
              title: "TypeScript out of the box",
              body:
                "First-class support for TypeScript – no need to spend hours configuring things that break as soon as you update a dependency.",
            }, {
              Icon: Icons.Tooling,
              title: "Great all-in-one tooling",
              body:
                "Built in linter, code formatter, ability to build a self-contained executable, test runner, IDE integration, and more.",
            }, {
              Icon: Icons.HassleFree,
              title: "Hassle-free deployment",
              body:
                "Launch to Deno Deploy with one line of code and zero server configuration, or host with other platforms of your choice.",
            }].map(({ Icon, title, body }) => (
              <div class="flex items-start flex-row-reverse gap-8 lg:(flex-col gap-9)">
                <Icon class="flex-none w-[3.25rem] lg:w-18" />
                <div class="inline space-y-3 lg:space-y-4">
                  <h3 class="font-bold text-default text-[1.375rem] lg:text-4xl">
                    {title}
                  </h3>
                  <p class="text-normalBlue lg:text-2xl">
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
          Voted one of the most loved web technologies
          <br />in a survey of over 70,000 developers
        </Quote>

        <Section
          type="Fast"
          header="Built to perform at your speed."
          subheader="Designed from the ground-up for high-performance."
        >
          <ImageSubSection
            image={
              <>
                <img
                  class="lg:hidden"
                  src="/images/lp/benchmark.png"
                  alt="HTTP Benchmark"
                />
                <img
                  class="hidden lg:block"
                  src="/images/lp/benchmark@lg.png"
                  alt="HTTP Benchmark"
                />
              </>
            }
            header="Best in class HTTP server speeds"
            reverse
          >
            The fastest JavaScript web server ever built.
          </ImageSubSection>

          <ImageSubSection
            image={<img src="/images/lp/v8.png" alt="" />}
            header="Powered by Chrome's V8"
            noBackground
          >
            Built on top of the fastest and most complete JavaScript engine.
          </ImageSubSection>
        </Section>

        <Quote
          author="Slack"
          href="https://deno.com/blog/slack-open-beta"
          size="xl"
          lgSize="4xl"
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
            image={<img src="" alt="" />}
            header="Run untrusted code"
            additionalContent={
              <img
                src="/images/lp/armor_deno.png"
                class="absolute hidden lg:(block w-52 -top-14 -right-24)"
              />
            }
            reverse
          >
            By default Deno provides no I/O access and is appropriate for
            running untrusted code and auditing new third-party code.
          </ImageSubSection>

          <div class="grid items-center justify-between gap-18 lg:(gap-22 grid-flow-col)">
            <div class="grid gap-5">
              <Icons.Permissions class="w-[3.25rem] lg:w-18 col-start-1" />
              <h3 class="col-start-2 font-bold text-4xl text-default">
                Fine grained<br />permission checks
              </h3>
              <p class="col-start-2 text-2xl text-normalBlue">
                Provide an allow-list to access only certain file system
                directories, network hosts, and environment variables.
              </p>
            </div>

            <div class="grid gap-5">
              <Icons.Secure class="w-[3.25rem] lg:w-18 col-start-1" />
              <h3 class="col-start-2 font-bold text-4xl text-default">
                Safer NPM<br />packages
              </h3>
              <p class="col-start-2 text-2xl text-normalBlue">
                Install and run npm packages without having to audit them first.
              </p>
            </div>
          </div>
        </Section>

        <div class="pt-28 pb-24 colorWash">
          <div class="section-x-inset-2xl space-y-11">
            <p class="text-white font-semibold text-3xl text-center">
              Used by a large community of developers<br />and leading
              technology companies:
            </p>
            <p class="text-white font-bold text-7xl text-center">
              Over 300k Monthly Actives
            </p>
            <ul class="flex justify-center gap-18 text-white">
              {companies.map((company) => (
                <li key={company.url}>
                  <a
                    class="flex items-center gap-2 flex-nowrap opacity-70 hover:opacity-100"
                    href={company.url}
                    target="_blank"
                  >
                    <img
                      class="w-11"
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/${company.logo}`}
                      alt={company.name}
                      title={company.name}
                    />{" "}
                    <span class="font-medium text-4xl">{company.name}</span>
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
        class={tw`colorWash rounded-full relative border-0 py-2 w-22 lg:(py-2.5 w-36 mx-auto) before:(${gradientLabelBeforeAfter} ${
          css({
            content: '""',
            "background-clip": "border-box",
          })
        }) after:(${gradientLabelBeforeAfter} bg-white ${
          css({
            content: '""',
            "background-clip": "content-box",
          })
        })`}
      >
        <span
          class={tw`relative block z-20 text-transparent font-semibold leading-tight text-center text-lg lg:text-[1.75rem] ${
            css({
              background: "inherit",
              "background-clip": "text",
              "-webkit-background-clip": "text",
            })
          }`}
        >
          {type}
        </span>
      </div>
      <h2 class="font-bold text-default leading-none mt-5 mb-4 text-3xl lg:(my-5 text-6xl text-center)">
        {header}
      </h2>
      <p class="font-semibold text-normalBlue text-xl lg:(text-2xl text-center)">
        {subheader}
      </p>

      <div class="mt-14 space-y-14 lg:(mt-20 space-y-28)">
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
      class={`flex items-center justify-between gap-5 flex-col lg:(gap-12 flex-row${
        reverse ? "-reverse" : ""
      })`}
    >
      <div
        class={`relative w-full rounded-lg lg:(w-[70%] rounded-2xl) box-border flex-none ${
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
        <div class="w-full children:w-full overflow-hidden rounded-lg lg:rounded-2xl">
          {image}
        </div>
      </div>
      <div class="space-y-3 p-1.5 lg:p-0">
        <h3 class="font-bold text-default text-3xl lg:text-4xl">
          {header}
        </h3>
        <p class="text-normalBlue text-lg lg:text-2xl">
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
      <figure class="section-x-inset-xl space-y-8 lg:space-y-11 text-center">
        <blockquote
          class={`text-white font-semibold text-${size} lg:text-${lgSize} leading-tight`}
        >
          {children}
        </blockquote>
        <figcaption class="text-white lg:text-2xl">
          {author} –{" "}
          <cite>
            <a
              href={href}
              class="text-white hover:(text-yellow-400 underline)"
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
