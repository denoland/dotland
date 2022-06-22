// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  htmlEntities,
  type LiteralCallSignatureDef,
  type LiteralIndexSignatureDef,
  type LiteralMethodDef,
  type LiteralPropertyDef,
  type TruePlusMinus,
  type TsTypeDef,
  type TsTypeIntersectionDef,
  type TsTypeMappedDef,
  type TsTypeParamDef,
  type TsTypeTupleDef,
  type TsTypeUnionDef,
} from "./deps.ts";
import { Params } from "./params.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, maybe, take } from "./utils.ts";

function LiteralIndexSignatures(
  { children, ...props }: {
    children: Child<LiteralIndexSignatureDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const { code, inline } = props;
  const items = signatures.map(({ params, readonly, tsType }) => {
    const item = (
      <>
        {maybe(
          readonly,
          <span class={style(code ? "codeKeyword" : "keyword")}>
            readonly{" "}
          </span>,
        )}[<Params {...props}>{params}</Params>]{tsType && (
          <>
            : <TypeDef {...props} inline>{tsType}</TypeDef>
          </>
        )};{" "}
      </>
    );
    return inline ? item : <div>{item}</div>;
  });
  return inline ? <>{items}</> : <div class={style("indent")}>{items}</div>;
}

function LiteralCallSignatures({ children, ...props }: {
  children: Child<LiteralCallSignatureDef[]>;
  url: string;
  namespace?: string;
  code?: boolean;
  inline?: boolean;
}) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const { inline } = props;
  const items = signatures.map(({ typeParams, params, tsType }) => {
    const item = (
      <>
        <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
          {params}
        </Params>){tsType && (
          <>
            : <TypeDef {...props} inline>{tsType}</TypeDef>
          </>
        )};{" "}
      </>
    );
    return inline ? item : <div>{item}</div>;
  });
  return inline ? <>{items}</> : <div class={style("indent")}>{items}</div>;
}

function LiteralProperties(
  { children, ...props }: {
    children: Child<LiteralPropertyDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const properties = take(children, true);
  if (!properties.length) {
    return null;
  }
  const { code, inline } = props;
  const items = properties.map(
    ({ name, readonly, computed, optional, tsType }) => {
      const item = (
        <>
          {maybe(
            readonly,
            <span class={style(code ? "codeKeyword" : "keyword")}>
              readonly{" "}
            </span>,
          )}
          {maybe(computed, `[${name}]`, name)}
          {maybe(optional, "?")}
          {tsType
            ? (
              <>
                : <TypeDef {...props} terminate>{tsType}</TypeDef>
              </>
            )
            : "; "}
        </>
      );
      return inline ? item : <div>{item}</div>;
    },
  );
  return inline ? <>{items}</> : <div class={style("indent")}>{items}</div>;
}

function LiteralMethods({ children, ...props }: {
  children: Child<LiteralMethodDef[]>;
  url: string;
  namespace?: string;
  code?: boolean;
  inline?: boolean;
}) {
  const methods = take(children, true);
  if (!methods.length) {
    return null;
  }
  const { code, inline } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = methods.map(
    ({ name, kind, optional, computed, returnType, typeParams, params }) => {
      const item = (
        <>
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
          {maybe(optional, "?")}
          <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
            {params}
          </Params>){returnType
            ? (
              <>
                : <TypeDef {...props} terminate>{returnType}</TypeDef>
              </>
            )
            : "; "}
        </>
      );
      return inline ? item : <div>{item}</div>;
    },
  );
  return inline ? <>{items}</> : <div class={style("indent")}>{items}</div>;
}

function MappedOptional(
  { children }: { children: Child<TruePlusMinus | undefined> },
) {
  const optional = take(children);
  switch (optional) {
    case true:
      return <>?</>;
    case "+":
      return <>+?</>;
    case "-":
      return <>-?</>;
    default:
      return null;
  }
}

function MappedReadOnly(
  { children, code }: {
    children: Child<TruePlusMinus | undefined>;
    code?: boolean;
  },
) {
  const readonly = take(children);
  const keyword = style(code ? "codeKeyword" : "keyword");
  switch (readonly) {
    case true:
      return <span class={keyword}>readonly{" "}</span>;
    case "+":
      return <span class={keyword}>+readonly{" "}</span>;
    case "-":
      return <span class={keyword}>-readonly{" "}</span>;
    default:
      return null;
  }
}

export function TypeArguments(
  { children, ...props }: {
    children: Child<TsTypeDef[] | undefined>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return null;
  }
  const items = [];
  for (let i = 0; i < args.length; i++) {
    items.push(<TypeDef {...props} inline>{args[i]}</TypeDef>);
    if (i < args.length - 1) {
      items.push(<>{", "}</>);
    }
  }
  return <>&lt;{items}&gt;</>;
}

export function TypeDef({ children, terminate, ...props }: {
  children: Child<TsTypeDef>;
  url: string;
  namespace?: string;
  code?: boolean;
  inline?: boolean;
  terminate?: boolean;
}) {
  const def = take(children);
  const terminalChar = terminate ? ";" : "";
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  switch (def.kind) {
    case "array":
      return (
        <>
          <TypeDef {...props} inline>{def.array}</TypeDef>[]
          {terminalChar}
        </>
      );
    case "conditional": {
      const {
        conditionalType: { checkType, extendsType, trueType, falseType },
      } = def;
      return (
        <>
          <TypeDef {...props}>{checkType}</TypeDef>{" "}
          <span class={keyword}>extends</span>{" "}
          <TypeDef {...props}>{extendsType}</TypeDef> ?{" "}
          <TypeDef {...props}>{trueType}</TypeDef> :{" "}
          <TypeDef {...props}>{falseType}</TypeDef>
          {terminalChar}
        </>
      );
    }
    case "fnOrConstructor": {
      const {
        fnOrConstructor: { constructor, typeParams, params, tsType },
      } = def;
      return (
        <>
          {maybe(constructor, <span class={keyword}>new{" "}</span>)}
          <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
            {params}
          </Params>) =&gt; <TypeDef {...props}>{tsType}</TypeDef>
          {terminalChar}
        </>
      );
    }
    case "importType": {
      const { importType: { specifier, qualifier, typeParams } } = def;
      return (
        <>
          <span class={keyword}>import</span>("{specifier}"){qualifier && (
            <span>.{qualifier}</span>
          )}
          <TypeArguments {...props}>{typeParams}</TypeArguments>
          {terminalChar}
        </>
      );
    }
    case "indexedAccess": {
      const { indexedAccess: { objType, indexType } } = def;
      return (
        <>
          <TypeDef {...props} inline>{objType}</TypeDef>[<TypeDef
            {...props}
            inline
          >
            {indexType}
          </TypeDef>]{terminalChar}
        </>
      );
    }
    case "infer": {
      const { infer: { typeParam } } = def;
      return (
        <>
          <span class={keyword}>infer{" "}</span>
          <TypeParam {...props}>{typeParam}</TypeParam>
          {terminalChar}
        </>
      );
    }
    case "intersection":
      return (
        <TypeDefIntersection {...props} terminate={terminate}>
          {def}
        </TypeDefIntersection>
      );
    case "keyword": {
      const { keyword } = def;
      return (
        <>
          <span class={style(code ? "codeTypeKeyword" : "typeKeyword")}>
            {keyword}
          </span>
          {terminalChar}
        </>
      );
    }
    case "literal": {
      const { literal: { kind }, repr } = def;
      let item;
      switch (kind) {
        case "bigInt":
          item = (
            <span class={style(code ? "codeNumberLiteral" : "numberLiteral")}>
              {repr}
            </span>
          );
          break;
        case "boolean":
          item = (
            <span class={style(code ? "codeBoolean" : "boolean")}>{repr}</span>
          );
          break;
        case "number":
          item = (
            <span class={style(code ? "codeNumberLiteral" : "numberLiteral")}>
              {repr}
            </span>
          );
          break;
        case "string":
          item = (
            <span class={style(code ? "codeStringLiteral" : "stringLiteral")}>
              {JSON.stringify(repr)}
            </span>
          );
          break;
        case "template":
          // TODO(@kitsonk) do this properly and escape properly
          item = (
            <span class={style(code ? "codeStringLiteral" : "stringLiteral")}>
              `{repr}`
            </span>
          );
          break;
      }
      return <>{item}{terminalChar}</>;
    }
    case "mapped":
      return (
        <TypeDefMapped {...props} terminate={terminate}>{def}</TypeDefMapped>
      );
    case "optional": {
      const { optional } = def;
      return (
        <>
          <TypeDef {...props}>{optional}</TypeDef>
          {terminalChar}
        </>
      );
    }
    case "parenthesized": {
      const { parenthesized } = def;
      return (
        <>
          (<TypeDef {...props}>{parenthesized}</TypeDef>){terminalChar}
        </>
      );
    }
    case "rest": {
      const { rest } = def;
      return (
        <>
          ...<TypeDef {...props}>{rest}</TypeDef>
          {terminalChar}
        </>
      );
    }
    case "this": {
      return (
        <>
          <span class={keyword}>this</span>
          {terminalChar}
        </>
      );
    }
    case "tuple": {
      return (
        <TypeDefTuple {...props} terminate={terminate}>
          {def}
        </TypeDefTuple>
      );
    }
    case "typeLiteral": {
      const {
        typeLiteral: { indexSignatures, callSignatures, properties, methods },
      } = def;
      return (
        <>
          &#123;<LiteralIndexSignatures {...props}>
            {indexSignatures}
          </LiteralIndexSignatures>
          <LiteralCallSignatures {...props}>
            {callSignatures}
          </LiteralCallSignatures>
          <LiteralProperties {...props}>{properties}</LiteralProperties>
          <LiteralMethods {...props}>{methods}
          </LiteralMethods>&#125;{terminalChar}
        </>
      );
    }
    case "typeOperator": {
      const { typeOperator: { operator, tsType } } = def;
      return (
        <>
          <span class={keyword}>{operator}</span>{" "}
          <TypeDef {...props}>{tsType}</TypeDef>
          {terminalChar}
        </>
      );
    }
    case "typePredicate": {
      const {
        typePredicate: { asserts, param: { type: paramType, name }, type },
      } = def;
      return (
        <>
          {maybe(asserts, <span class={keyword}>asserts{" "}</span>)}
          {maybe(paramType === "this", <span class={keyword}>this</span>, name)}
          {type && (
            <>
              {" is "}
              <TypeDef {...props}>{type}</TypeDef>
            </>
          )}
          {terminalChar}
        </>
      );
    }
    case "typeQuery": {
      const { typeQuery } = def;
      return <>{typeQuery}{terminalChar}</>;
    }
    case "typeRef": {
      const { typeRef: { typeName, typeParams } } = def;
      const href = services.lookupHref(props.url, props.namespace, typeName);
      return (
        <>
          {href
            ? (
              <a href={href} class={style(code ? "codeTypeLink" : "typeLink")}>
                {typeName}
              </a>
            )
            : typeName}
          <TypeArguments {...props}>{typeParams}</TypeArguments>
          {terminalChar}
        </>
      );
    }
    case "union":
      return (
        <TypeDefUnion {...props} terminate={terminate}>
          {def}
        </TypeDefUnion>
      );
    default:
      return (
        <>
          {htmlEntities.encode((def as TsTypeDef).repr)}
          {terminalChar}
        </>
      );
  }
}

function TypeDefIntersection(
  { children, terminate, ...props }: {
    children: Child<TsTypeIntersectionDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
    terminate?: boolean;
  },
) {
  const { intersection } = take(children);
  const keyword = style(props.code ? "codeKeyword" : "keyword");
  const lastIndex = intersection.length - 1;
  if (props.inline || intersection.length <= 3) {
    const items = [];
    for (let i = 0; i < intersection.length; i++) {
      items.push(<TypeDef {...props}>{intersection[i]}</TypeDef>);
      if (i < lastIndex) {
        items.push(<span class={keyword}>{" & "}</span>);
      }
    }
    if (terminate) {
      items.push(";");
    }
    return <>{items}</>;
  }
  const items = intersection.map((def, i) => (
    <div>
      <span class={keyword}>{" & "}</span>
      <TypeDef {...props}>{def}</TypeDef>
      {maybe(terminate && i === lastIndex, ";")}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeDefMapped(
  { children, terminate, ...props }: {
    children: Child<TsTypeMappedDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
    terminate?: boolean;
  },
) {
  const {
    mappedType: { readonly, typeParam, nameType, optional, tsType },
  } = take(children);
  return (
    <>
      <MappedReadOnly {...props}>{readonly}</MappedReadOnly>[<TypeParam
        constraintKind="in"
        {...props}
      >
        {typeParam}
      </TypeParam>
      {nameType && (
        <>
          <span class={style(props.code ? "codeKeyword" : "keyword")}>
            in keyof{" "}
          </span>
          <TypeDef {...props}>{nameType}</TypeDef>
        </>
      )}]<MappedOptional>{optional}</MappedOptional>
      {tsType && (
        <>
          : <TypeDef {...props}>{tsType}</TypeDef>
        </>
      )}
      {maybe(terminate, ";")}
    </>
  );
}

function TypeDefTuple(
  { children, ...props }: {
    children: Child<TsTypeTupleDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
    terminate?: boolean;
  },
) {
  const { tuple } = take(children);
  const { inline } = props;
  if (inline || tuple.length <= 3) {
    const items = [];
    for (let i = 0; i < tuple.length; i++) {
      items.push(<TypeDef {...props}>{tuple[i]}</TypeDef>);
      if (i < tuple.length - 1) {
        items.push(", ");
      }
    }
    return <span>[{items}]</span>;
  }
  const items = tuple.map((def) => (
    <div>
      <TypeDef {...props}>{def}</TypeDef>,{" "}
    </div>
  ));
  return <div class={style("indent")}>[{items}]</div>;
}

function TypeDefUnion(
  { children, terminate, ...props }: {
    children: Child<TsTypeUnionDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
    terminate?: boolean;
  },
) {
  const { union } = take(children);
  const keyword = style(props.code ? "codeKeyword" : "keyword");
  const lastIndex = union.length - 1;
  if (props.inline || union.length <= 3) {
    const items = [];
    for (let i = 0; i < union.length; i++) {
      items.push(<TypeDef {...props}>{union[i]}</TypeDef>);
      if (i < lastIndex) {
        items.push(<span class={keyword}>{" | "}</span>);
      }
    }
    if (terminate) {
      items.push(";");
    }
    return <span>{items}</span>;
  }
  const items = union.map((def, i) => (
    <div>
      <span class={keyword}>{" | "}</span>
      <TypeDef {...props}>{def}</TypeDef>
      {maybe(terminate && i === lastIndex, ";")}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

export function TypeParam(
  { children, constraintKind = "extends", ...props }: {
    children: Child<TsTypeParamDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    constraintKind?: string;
  },
) {
  const { name, constraint, default: def } = take(children);
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  return (
    <>
      <span class={style(code ? "codeTypeParam" : "typeParam")}>{name}</span>
      {constraint && (
        <>
          <span class={keyword}>{` ${constraintKind} `}</span>
          <TypeDef {...props} inline>{constraint}</TypeDef>
        </>
      )}
      {def && (
        <>
          <span class={keyword}>{` = `}</span>
          <TypeDef {...props} inline>{def}</TypeDef>
        </>
      )}
    </>
  );
}

export function TypeParams(
  { children, ...props }: {
    children: Child<TsTypeParamDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return null;
  }
  const items = [];
  for (let i = 0; i < params.length; i++) {
    items.push(<TypeParam {...props}>{params[i]}</TypeParam>);
    if (i < params.length - 1) {
      items.push(<>,{" "}</>);
    }
  }
  return <>&lt;{items}&gt;</>;
}
