// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { Decorators } from "./decorators.tsx";
import {
  type ClassMethodDef,
  type ClassPropertyDef,
  type DocNodeClass,
  type TsTypeDef,
} from "./deps.ts";
import { type MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { TypeArguments, TypeDef, TypeParams } from "./types.tsx";
import { assert, type Child, maybe, take } from "./utils.ts";

type ClassAccessorDef = ClassMethodDef & { kind: "getter" | "setter" };
type ClassGetterDef = ClassMethodDef & { kind: "getter" };
type ClassSetterDef = ClassMethodDef & { kind: "setter" };
type ClassItemType = "prop" | "method" | "static_prop" | "static_method";
type ClassItemDef = ClassMethodDef | ClassPropertyDef;

function compareAccessibility(
  a: ClassPropertyDef | ClassMethodDef,
  b: ClassPropertyDef | ClassMethodDef,
): number {
  if (a.accessibility !== b.accessibility) {
    if (a.accessibility === "private") {
      return -1;
    }
    if (b.accessibility === "private") {
      return 1;
    }
    if (a.accessibility === "protected") {
      return -1;
    }
    if (b.accessibility === "protected") {
      return 1;
    }
  }
  if (a.name === b.name && isClassAccessor(a) && isClassAccessor(b)) {
    return a.kind === "getter" ? -1 : 1;
  }
  if (a.name.startsWith("[") && b.name.startsWith("[")) {
    return a.name.localeCompare(b.name);
  }
  if (a.name.startsWith("[")) {
    return 1;
  }
  if (b.name.startsWith("[")) {
    return -1;
  }
  return a.name.localeCompare(b.name);
}

function getClassItems({ classDef: { properties, methods } }: DocNodeClass) {
  return [...properties, ...methods].sort((a, b) => {
    if (a.isStatic !== b.isStatic) {
      return a.isStatic ? 1 : -1;
    }
    if (
      (isClassProperty(a) && isClassProperty(b)) ||
      (isClassProperty(a) && isClassAccessor(b)) ||
      (isClassAccessor(a) && isClassProperty(b)) ||
      (isClassMethod(a) && isClassMethod(b))
    ) {
      return compareAccessibility(a, b);
    }
    if (isClassAccessor(a) && !isClassAccessor(b)) {
      return -1;
    }
    if (isClassAccessor(b)) {
      return 1;
    }
    return isClassProperty(a) ? -1 : 1;
  });
}

function getClassItemType(
  item: ClassPropertyDef | ClassMethodDef,
): ClassItemType {
  if (item.isStatic) {
    return isClassProperty(item) || isClassAccessor(item)
      ? "static_prop"
      : "static_method";
  } else {
    return isClassProperty(item) || isClassAccessor(item) ? "prop" : "method";
  }
}

function isClassAccessor(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassAccessorDef {
  return "kind" in value &&
    (value.kind === "getter" || value.kind === "setter");
}

function isClassMethod(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassMethodDef & { kind: "method" } {
  return "kind" in value && value.kind === "method";
}

function isClassProperty(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassPropertyDef {
  return "readonly" in value;
}

function ClassItems(
  { children, ...props }: {
    children: Child<ClassItemDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = [];
  let prev: ClassItemType | undefined;
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    const curr = getClassItemType(def);
    if (prev && prev !== curr) {
      items.push(<div>&nbsp;</div>);
    }
    prev = curr;
    if (isClassMethod(def) || isClassAccessor(def)) {
      items.push(<ClassMethod {...props}>{def}</ClassMethod>);
    } else {
      assert(isClassProperty(def));
      items.push(<ClassProperty {...props}>{def}</ClassProperty>);
    }
  }
  return <div class={style("indent")}>{items}</div>;
}

export function CodeBlockClass(
  { children, ...props }: {
    children: Child<DocNodeClass>;
    url: string;
    namespace?: string;
  },
) {
  const node = take(children);
  const items = getClassItems(node);
  const {
    name,
    classDef: {
      constructors,
      decorators,
      extends: ext,
      indexSignatures,
      isAbstract,
      superTypeParams,
      implements: impl,
      typeParams,
    },
  } = node;
  const hasElements =
    !!(constructors.length || indexSignatures.length || items.length);
  return (
    <div class={style("codeBlock")}>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      <span class={style("codeKeyword")}>
        {maybe(isAbstract, "abstract ")}class
      </span>{" "}
      {name}
      <TypeParams code {...props}>{typeParams}</TypeParams>
      <Extends code typeArgs={superTypeParams} {...props}>{ext}</Extends>
      <Implements code {...props}>{impl}</Implements> &#123;
      {maybe(
        hasElements,
        <div class={style("classBody")}>
          {
            /* <Constructors code {...props}>{constructors}</Constructors>
          <IndexSignatures code {...props}>{indexSignatures}</IndexSignatures>*/
          }
          <ClassItems code {...props}>{items}</ClassItems>
        </div>,
        " ",
      )}&#125;
    </div>
  );
}

function ClassMethod(
  { children, ...props }: {
    children: Child<ClassMethodDef>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const {
    accessibility,
    isAbstract,
    isStatic,
    functionDef: {
      decorators,
      isAsync,
      isGenerator,
      typeParams,
      params,
      returnType,
    },
    kind,
    name,
    optional,
  } = take(children);
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const classMethod = style(code ? "codeClassMethod" : "classMethod");
  return (
    <div>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      {maybe(
        isStatic || accessibility || isAbstract,
        <span class={keyword}>
          {maybe(isStatic, "static ")}
          {accessibility && `${accessibility} `}
          {maybe(isAbstract, "abstract")}
        </span>,
      )}
      {maybe(
        isAsync || isGenerator || kind === "getter" || kind === "setter",
        <span class={keyword}>
          {maybe(isAsync, "async ")}
          {kind === "getter" ? "get " : kind === "setter" ? "set " : null}
          {maybe(isGenerator, "*")}
        </span>,
      )}
      {maybe(
        kind === "method" || !name.startsWith("["),
        <span class={classMethod}>{name}</span>,
        name,
      )}
      {maybe(optional, "?")}
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){returnType && (
        <>
          : <TypeDef {...props} inline>{returnType}</TypeDef>
        </>
      )};{maybe(decorators, <div>&nbsp;</div>)}
    </div>
  );
}

function ClassProperty(
  { children, ...props }: {
    children: Child<ClassPropertyDef>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const {
    isStatic,
    accessibility,
    isAbstract,
    readonly,
    name,
    optional,
    decorators,
    tsType,
  } = take(children);
  const { code } = props;
  return (
    <div>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      {maybe(
        isStatic || accessibility || isAbstract || readonly,
        <span class={style(code ? "codeKeyword" : "keyword")}>
          {maybe(isStatic, "static ")}
          {accessibility && `${accessibility}`}
          {maybe(isAbstract, "abstract")}
          {maybe(readonly, "readonly")}
        </span>,
      )}
      {name}
      {maybe(optional, "?")}
      {tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
      {maybe(decorators, <div>&nbsp;</div>)}
    </div>
  );
}

export function DocBlockClass(
  { children, ...markdownContext }:
    & { children: Child<DocNodeClass> }
    & MarkdownContext,
) {
  return null;
}

function Extends(
  { children, typeArgs, ...props }: {
    children: Child<string | undefined>;
    url: string;
    namespace?: string;
    code?: boolean;
    typeArgs: TsTypeDef[];
  },
) {
  const extension = take(children);
  if (!extension) {
    return null;
  }
  const { code, url, namespace } = props;
  const href = services.lookupHref(url, namespace, extension);
  return (
    <>
      <span class={style("codeKeyword")}>{" "}extends{" "}</span>
      {href
        ? (
          <a href={href} class={style(code ? "codeTypeLink" : "typeLink")}>
            {extension}
          </a>
        )
        : extension}
      <TypeArguments {...props}>{typeArgs}</TypeArguments>
    </>
  );
}

function Implements(
  { children, ...props }: {
    children: Child<TsTypeDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const types = take(children, true);
  if (!types.length) {
    return null;
  }
  const { code } = props;
  const items = [];
  for (let i = 0; i < types.length; i++) {
    items.push(<TypeDef {...props}>{types[i]}</TypeDef>);
    if (i < types.length - 1) {
      items.push(", ");
    }
  }
  return (
    <>
      {" "}
      <span class={style(code ? "codeKeyword" : "keyword")}>
        implements{" "}
      </span>
      {items}
    </>
  );
}
