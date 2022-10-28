// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { render } from "$gfm";

export function Markdown(
  { source, baseURL }: { source: string; baseURL?: string },
) {
  const html = render(source, { allowIframes: false, baseUrl: baseURL });
  return (
    <div
      class="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
