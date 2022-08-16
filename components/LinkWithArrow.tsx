// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import * as Icons from "@/components/Icons.tsx";

export function LinkWithArrow({
  class: className,
  href,
  target,
  rel,
  children,
}: {
  class?: string;
  href: string;
  target?: string;
  rel?: string;
  children: ComponentChildren;
}) {
  return (
    <a
      class={tw`group inline-flex gap-1.5 items-center ${className ?? ""}`}
      href={href}
      target={target}
      rel={rel}
    >
      {children}{" "}
      <Icons.LongArrowRight
        class={tw`relative left-0 opacity-90 group-hover:opacity-100 group-hover:left-1 transition-all ease-in-out`}
      />
    </a>
  );
}
