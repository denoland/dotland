// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "../deps.ts";
import { gfm } from "../server_deps.ts";

export function Markdown(
  { source, baseUrl }: { source: string; baseUrl?: string },
) {
  const html = gfm(source, { allowIframes: false, baseUrl });
  return (
    <div
      class="py-8 px-4 markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
