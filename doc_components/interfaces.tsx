// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type ClassIndexSignatureDef,
  type DocNodeInterface,
  type InterfaceCallSignatureDef,
  type InterfaceIndexSignatureDef,
  type InterfaceMethodDef,
  type InterfacePropertyDef,
  type TsTypeDef,
} from "./deps.ts";
import { Params } from "./params.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef, TypeParams } from "./types.tsx";
import { type Child, maybe, take } from "./utils.ts";

type IndexSignatureDef =
  | ClassIndexSignatureDef
  | InterfaceIndexSignatureDef;

function CallSignatures(
  { children, ...props }: {
    children: Child<InterfaceCallSignatureDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ typeParams, params, tsType }) => (
    <div>
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

export function CodeBlockInterface({ children, ...props }: {
  children: Child<DocNodeInterface>;
  url: string;
  namespace?: string;
}) {
  const {
    name,
    interfaceDef: {
      typeParams,
      extends: ext,
      indexSignatures,
      callSignatures,
      properties,
      methods,
    },
  } = take(children);
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>interface</span> {name}{" "}
      <TypeParams code {...props}>{typeParams}</TypeParams>
      <Extends {...props}>{ext}</Extends>{" "}
      &#123;<IndexSignatures code {...props}>{indexSignatures}</IndexSignatures>
      <CallSignatures code {...props}>{callSignatures}</CallSignatures>
      <Properties code {...props}>{properties}</Properties>
      <Methods code {...props}>{methods}</Methods>&#125;
    </div>
  );
}

function Extends(
  { children, ...props }: {
    children: Child<TsTypeDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const extensions = take(children);
  if (!extensions.length) {
    return null;
  }
  const { code } = props;
  const items = [];
  for (let i = 0; i < extensions.length; i++) {
    items.push(<TypeDef inline {...props}>{extensions[i]}</TypeDef>);
    if (i < extensions.length - 1) {
      items.push(", ");
    }
  }
  return (
    <>
      <span class={style(code ? "codeKeyword" : "keyword")}>{" "}extends</span>
      {" "}
      {items}
    </>
  );
}

function IndexSignatures(
  { children, ...props }: {
    children: Child<IndexSignatureDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = signatures.map(({ params, readonly, tsType }) => (
    <div>
      {maybe(readonly, <span class={keyword}>readonly{" "}</span>)}[<Params
        {...props}
      >
        {params}
      </Params>]{tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function Methods(
  { children, ...props }: {
    children: Child<InterfaceMethodDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const methods = take(children, true);
  if (!methods.length) {
    return null;
  }
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = methods.map((
    { name, kind, optional, computed, returnType, typeParams, params },
  ) => (
    <div>
      {kind === "getter"
        ? <span class={keyword}>get{" "}</span>
        : kind === "setter"
        ? <span class={keyword}>set{" "}</span>
        : undefined}
      {name === "new"
        ? <span class={keyword}>{name}{" "}</span>
        : computed
        ? `[${name}]`
        : name}
      {optional ? "?" : undefined}
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){returnType
        ? (
          <>
            : <TypeDef {...props} terminate>{returnType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function Properties({ children, ...props }: {
  children: Child<InterfacePropertyDef[]>;
  url: string;
  namespace?: string;
  code?: boolean;
}) {
  const properties = take(children, true);
  properties.sort((a, b) => a.name.localeCompare(b.name));
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = properties.map((
    { name, readonly, computed, optional, tsType },
  ) => (
    <div>
      {maybe(readonly, <span class={keyword}>readonly{" "}</span>)}
      {maybe(computed, `[${name}]`, name)}
      {maybe(optional, "?")}
      {tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}
