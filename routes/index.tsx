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
          <div class="w-136 text-white space-y-6">
            <p class="font-semibold text-3xl leading-none">Meet Deno</p>
            <p class="font-bold text-[5rem] leading-none">
              The easiest, fastest, and most secure JavaScript runtime.
            </p>
            <div class="space-x-7">
              <a class="button-primary" href="">Installation</a>
              <a class="button-primary" href="">Documentation</a>
            </div>
          </div>
        </div>

        <a
          class="flex items-center justify-center py-3 bg-mainBlue text-2xl text-white text-center font-semibold bg-gradient-to-r from-yellow-500 via-red-500 to-pink-600"
          href="deno.com/blog"
        >
          NPM compatibility is now live! Click here to get started
        </a>

        <Section
          type="Easy"
          header="The best developer experience"
          subheader="Without the learning curve…"
        >
          <ImageSubSection
            src="/images/Dependencies_Placeholder.png"
            alt="Dependencies"
            header="Avoid installing dependencies"
          >
            Dive right into the code<br />and skip the setup.
          </ImageSubSection>

          <ImageSubSection
            src="/images/web_compatibility.png"
            alt="Web APIs"
            header="Web-standard APIs"
            reverse
          >
            A runtime that resembles the web, using browser APIs that work on
            the server.
          </ImageSubSection>

          <div class="flex items-center justify-between gap-[8%]">
            <div class="space-y-5">
              <Icons.Logo class="w-15" />
              <h3 class="font-bold text-4xl text-darkBlue">
                TypeScript out of the box
              </h3>
              <p class="text-2xl text-normalBlue">
                First-class support for TypeScript – no need to spend hours
                configuring things that break as soon as you update a
                dependency.
              </p>
            </div>
            <div class="space-y-5">
              <Icons.Logo class="w-15" />
              <h3 class="font-bold text-4xl text-darkBlue">
                Great all-in-one tooling
              </h3>
              <p class="text-2xl text-normalBlue">
                Built in linter, code formatter, ability to build a
                self-contained executable, test runner, IDE integration, and
                more.
              </p>
            </div>
            <div class="space-y-5">
              <Icons.Logo class="w-15" />
              <h3 class="font-bold text-4xl text-darkBlue">
                Hassle-free deployment
              </h3>
              <p class="text-2xl text-normalBlue">
                Launch to Deno Deploy with one line of code and zero server
                configuration, or host with other platforms of your choice.
              </p>
            </div>
          </div>
        </Section>

        <Quote
          author="Stack Overflow"
          href="https://survey.stackoverflow.co/2022/#most-loved-dreaded-and-wanted-webframe-love-dread"
          size="5xl"
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
            src="/images/benchmark.png"
            alt="HTTP Benchmark"
            header="Best in class HTTP server speeds"
          >
            The fastest JavaScript web server ever built.
          </ImageSubSection>

          <ImageSubSection
            src=""
            alt=""
            header="Powered by Chrome's V8"
            reverse
          >
            Built on top of the fastest and most complete JavaScript engine.
          </ImageSubSection>
        </Section>

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

        <Section
          type="Secure"
          header="Secure by default."
          subheader="Take total control over your workflow."
        >
          <ImageSubSection src="" alt="" header="Run untrusted code">
            By default Deno provides no I/O access and is appropriate for
            running untrusted code and auditing new third-party code.
          </ImageSubSection>

          <div class="grid items-center justify-between gap-22 grid-cols-2">
            <div class="grid gap-5">
              <Icons.Logo class="w-15 col-start-1" />
              <h3 class="col-start-2 font-bold text-4xl text-darkBlue">
                Fine grained<br />permission checks
              </h3>
              <p class="col-start-2 text-2xl text-normalBlue">
                Provide an allow-list to access only certain file system
                directories, network hosts, and environment variables.
              </p>
            </div>

            <div class="grid gap-5">
              <Icons.Logo class="w-15 col-start-1" />
              <h3 class="col-start-2 font-bold text-4xl text-darkBlue">
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

function Section(
  { type, header, subheader, children }: {
    type: string;
    header: string;
    subheader: string;
    children: ComponentChildren;
  },
) {
  return (
    <div class="section-x-inset-xl pt-18 pb-24">
      <div class="colorWash rounded-2.5xl w-44 py-4 text-white font-semibold text-2xl leading-none text-center mx-auto">
        {type}
      </div>
      <h2 class="text-center font-bold text-6xl text-darkBlue leading-none my-5">
        {header}
      </h2>
      <p class="text-center font-semibold text-2xl text-normalBlue">
        {subheader}
      </p>

      <div class="mt-20 space-y-28">
        {children}
      </div>
    </div>
  );
}

function ImageSubSection(
  { src, alt, header, children, reverse }: {
    src: string;
    alt: string;
    header: string;
    children: ComponentChildren;
    reverse?: boolean;
  },
) {
  return (
    <div
      class={`flex items-center justify-between gap-12 flex-row${
        reverse ? "-reverse" : ""
      }`}
    >
      <div class="space-y-3">
        <h3 class="font-bold text-4xl text-darkBlue">
          {header}
        </h3>
        <p class="text-2xl text-normalBlue">
          {children}
        </p>
      </div>
      <div
        class={tw`p-8 w-[70%] box-border flex-none rounded-2xl bg-lightWhiteBlue ${
          css({
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          })
        }`}
      >
        <img class="w-full" src={src} alt={alt} />
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
    <div class="pt-24 pb-20 colorWash">
      <figure class="section-x-inset-xl space-y-11 text-center">
        <blockquote
          class={`text-white font-semibold text-${size} leading-tight`}
        >
          {children}
        </blockquote>
        <figcaption class="text-white text-2xl">
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
