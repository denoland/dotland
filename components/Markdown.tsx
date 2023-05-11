// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { Marked, render } from "$gfm";
import { mangle } from "$marked-mangle";
import { markedSmartypants } from "$marked-smartypants";

Marked.marked.use(mangle());
Marked.marked.use(markedSmartypants());

export function Markdown(
  { source, baseURL, mediaBaseURL }: {
    source: string;
    baseURL?: string;
    mediaBaseURL?: string;
  },
) {
  const html = render(source, {
    allowIframes: false,
    baseUrl: baseURL,
    mediaBaseUrl: mediaBaseURL,
  });
  return (
    <div
      class="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
