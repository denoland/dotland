// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { apply, css, runtime, tw } from "../deps.ts";

import { Tag } from "doc_components/jsdoc.tsx";
import { MarkdownSummary } from "doc_components/markdown.tsx";
import { ModuleIndex } from "doc_components/module_index.tsx";
import { getIndexStructure } from "../util/doc.ts";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

const indexStructure = await getIndexStructure();

function ComponentTitle(
  { children, module }: { children: string; module: string },
) {
  const href = `https://github.com/denoland/doc_components/blob/main${module}`;
  return (
    <h3 class={tw`text-xl py-4`}>
      <a
        href={href}
        class={tw`text-blue(800 dark:300) hover:underline`}
        target="_blank"
      >
        {children}
      </a>
    </h3>
  );
}

export default function DocPreview() {
  return (
    <div
      className={tw
        `h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 className={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 className={tw`text-2xl py-2`}>Component Showcase</h2>
      <hr />
      <ComponentTitle module="/markdown.tsx">MarkdownSummary</ComponentTitle>
      <MarkdownSummary url="https://deno.land/x/oak@v10.5.1/mod.ts">
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </MarkdownSummary>
      <ComponentTitle module="/module_index.tsx">ModuleIndex</ComponentTitle>
      <ModuleIndex base="https://deno.land/std@0.138.0" path="/">
        {indexStructure}
      </ModuleIndex>
      <ComponentTitle module="/jsdoc.tsx">Tag</ComponentTitle>
      <Tag color="yellow">abstract</Tag>
      <Tag color="gray">deprecated</Tag>
    </div>
  );
}
