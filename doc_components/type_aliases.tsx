// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeTypeAlias } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef, TypeParams } from "./types.tsx";
import { type Child, take } from "./utils.ts";

export function CodeBlockTypeAlias({ children, ...props }: {
  children: Child<DocNodeTypeAlias>;
  url: string;
  namespace?: string;
}) {
  const { name, typeAliasDef: { typeParams, tsType } } = take(children);
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>type</span> {name}
      <TypeParams code {...props}>{typeParams}</TypeParams> ={" "}
      <TypeDef code terminate {...props}>{tsType}</TypeDef>
    </div>
  );
}
