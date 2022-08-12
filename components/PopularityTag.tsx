// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";
import type { PopularityModuleTag } from "@/util/registry_utils.ts";

export function PopularityTag(
  props: { children: PopularityModuleTag["value"] },
) {
  let stars: number;
  let color: string;
  let value: string;
  switch (props.children) {
    case "top_10_percent":
      stars = 1;
      color = "gray-400";
      value = "Popular";
      break;
    case "top_5_percent":
      stars = 2;
      color = "tag-blue";
      value = "Very Popular";
      break;
    case "top_1_percent":
      stars = 3;
      color = "[#0CBB3F]";
      value = "Extremely Popular";
      break;
  }

  return (
    <div class={tw`text-${color} flex items-center gap-1.5 whitespace-nowrap`}>
      <div class={tw`flex gap-0.5`}>
        {Array.from({ length: stars }, () => <Icons.HollowStar />)}
      </div>
      <span class={tw`text-sm leading-4 font-medium`}>
        {value}
      </span>
    </div>
  );
}
