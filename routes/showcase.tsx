// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Footer } from "$doc_components/footer.tsx";
import { Header } from "@/components/Header.tsx";
import * as Icons from "@/components/Icons.tsx";

import projects from "@/data/showcase.json" assert { type: "json" };
import { StatusOK } from "../components/Icons.tsx";

const PROJECTS: Project[] = projects;

interface Project {
  image: string;
  title: string;
  link: string;
  github?: string;
}

interface Data {
  userToken: string;
}

export default function ShowcasePage() {
  return (
    <>
      <ContentMeta
        title="Showcase"
        description="Check out some websites, apps, and other products built with Deno."
        keywords={["deno", "showcase", "javascript", "typescript"]}
      />
      <Header />
      <div class="section-x-inset-xl mt-8 mb-24">
        <div class="max-w-screen-lg mx-auto">
          <h4 class="text-4xl font-bold tracking-tight">Showcase</h4>
          <p class="mt-4 text-lg">
            Check out some websites, apps, and other products built with Deno.
          </p>
          <div class="my-16 flex flex-row flex-wrap gap-16 justify-evenly items-end">
            {PROJECTS.map((project, i) => <Item key={i} project={project} />)}
          </div>
          <p class="mt-4 text-lg">
            Do you have a project using Deno?{" "}
            <a
              href="https://github.com/denoland/dotland/blob/main/data/showcase.json"
              class="link"
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
          class="object-contain shadow-lg rounded-lg w-72"
        />
      </a>
      <div class="mt-4">
        <span class="text-lg">
          <a href={project.link}>{project.title}</a>
        </span>
        {project.github && (
          <a
            href={`https://github.com/${project.github}`}
            class="ml-2 text-gray-500 hover:text-gray-700"
          >
            <span class="sr-only">GitHub</span>
            <Icons.GitHub class="h-5 w-auto inline float-right" />
          </a>
        )}
      </div>
    </div>
  );
}
