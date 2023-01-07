// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { render } from "$gfm";

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
