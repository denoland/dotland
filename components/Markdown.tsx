/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { gfm, h } from "../deps.ts";
import { MarkupProps } from "./Markup.tsx";

export function Markdown(props: MarkupProps) {
  const html = gfm(props.source, { allowIframes: true });
  return (
    <div
      class="mt-1 py-8 px-4 markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
