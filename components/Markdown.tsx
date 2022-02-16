/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { gfm, h } from "../deps.ts";

export function Markdown(props: { source: string }) {
  const html = gfm(props.source, { allowIframes: true });
  return (
    <div
      class="py-8 px-4 markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
