// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head } from "$fresh/runtime.ts";
import { tw } from "twind";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import * as Icons from "@/components/Icons.tsx";

import projects from "@/showcase.json" assert { type: "json" };

const PROJECTS: Project[] = projects;

interface Project {
  image: string;
  title: string;
  link: string;
  github?: string;
}

export default function ShowcasePage() {
  return (
    <>
      <Head>
        <title>Showcase | Deno</title>
      </Head>
      <Header />
      <div class={tw`max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-24`}>
        <div class={tw`max-w-screen-lg mx-auto`}>
          <h4 class={tw`text-4xl font-bold tracking-tight`}>Showcase</h4>
          <p class={tw`mt-4 text-lg`}>
            Check out some websites, apps, and other products built with Deno.
          </p>
          <div
            class={tw
              `my-16 flex flex-row flex-wrap gap-16 justify-evenly items-end`}
          >
            {PROJECTS.map((project, i) => <Item key={i} project={project} />)}
          </div>
          <p class={tw`mt-4 text-lg`}>
            Do you have a project using Deno?{" "}
            <a
              href="https://github.com/denoland/dotland/blob/main/showcase.json"
              class={tw`link`}
            >
              Add it!
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Item({ project }: { project: Project }) {
  return (
    <div>
      <a href={project.link}>
        <img
          loading="lazy"
          src={project.image}
          alt={project.title}
          class={tw`object-contain shadow-lg rounded-lg w-72`}
        />
      </a>
      <div class={tw`mt-4`}>
        <span class={tw`text-lg`}>
          <a href={project.link}>{project.title}</a>
        </span>
        {project.github && (
          <a
            href={`https://github.com/${project.github}`}
            class={tw`ml-2 text-gray-500 hover:text-gray-700`}
          >
            <span class={tw`sr-only`}>GitHub</span>
            <Icons.GitHub class="inline float-right" />
          </a>
        )}
      </div>
    </div>
  );
}
