// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "$fresh/runtime.ts";
import { tw } from "_twind";
import { render } from "$gfm";

export function Markdown(
  { source, baseUrl }: { source: string; baseUrl?: string },
) {
  const html = render(source, { allowIframes: false, baseUrl });
  return (
    <div
      class={tw`py-8 px-4 markdown-body`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
