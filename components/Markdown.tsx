// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { gfm, h } from "../deps.ts";

export function Markdown(
  { source, baseUrl }: { source: string; baseUrl: string },
) {
  const html = gfm(source, { allowIframes: true, baseUrl });
  return (
    <div
      class="py-8 px-4 markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
