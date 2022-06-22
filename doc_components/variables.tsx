// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeVariable } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";

export function CodeBlockVariable({ children, ...props }: {
  children: Child<DocNodeVariable>;
  url: string;
  namespace?: string;
}) {
  const { name, variableDef: { kind, tsType } } = take(children);
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>{kind}</span> {name}
      {tsType
        ? (
          <>
            : <TypeDef terminate code {...props}>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  );
}
