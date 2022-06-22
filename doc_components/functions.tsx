// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeFunction } from "./deps.ts";
import { Params } from "./params.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef, TypeParams } from "./types.tsx";
import { type Child, take } from "./utils.ts";

export function CodeBlockFn({ children, ...props }: {
  children: Child<DocNodeFunction[]>;
  url: string;
  namespace?: string;
}) {
  const fns = take(children, true);
  const items = fns.map(({
    name,
    functionDef: { isAsync, isGenerator, typeParams, params, returnType },
  }) => (
    <div>
      <span class={style("codeKeyword")}>
        {isAsync ? "async " : undefined}function{isGenerator ? "* " : " "}
      </span>
      <span class={style("codeFnName")}>{name}</span>
      <TypeParams code {...props}>{typeParams}</TypeParams>(<Params
        code
        {...props}
      >
        {params}
      </Params>){returnType
        ? (
          <>
            : <TypeDef code terminate {...props}>{returnType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("codeBlock")}>{items}</div>;
}
