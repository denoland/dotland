// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeEnum } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, maybe, take } from "./utils.ts";

export function CodeBlockEnum(
  { children, ...props }: {
    children: Child<DocNodeEnum>;
    url: string;
    namespace?: string;
  },
) {
  const { name, enumDef: { members } } = take(children);
  const items = members.map(({ name, init }) => (
    <div>
      {name}
      {init && (
        <>
          {" "}= <TypeDef code inline {...props}>{init}</TypeDef>
        </>
      )},
    </div>
  ));
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>enum</span> {name} &#123;{" "}
      {maybe(items.length, <div class={style("indent")}>{items}</div>)} &#125;
    </div>
  );
}
