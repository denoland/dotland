// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head, tw } from "../deps.ts";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";

import projects from "../showcase.json" assert { type: "json" };

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
            <svg
              class={tw`h-6 w-6 inline float-right`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
