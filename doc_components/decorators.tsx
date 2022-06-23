// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DecoratorDef } from "./deps.ts";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, maybe, take } from "./utils.ts";

function Decorator(
  { children, code, url, namespace }: {
    children: Child<DecoratorDef>;
    code?: boolean;
    url: string;
    namespace?: string;
  },
) {
  const { name, args } = take(children);
  const href = services.lookupHref(url, namespace, name);
  const cl = code ? "codeDecorator" : "decorator";
  return (
    <div>
      @<span class={style(cl)}>
        {maybe(href, <a href={href} class={style("linkType")}>{name}</a>, name)}
      </span>
      <DecoratorArgs>{args}</DecoratorArgs>
    </div>
  );
}

function DecoratorArgs(
  { children }: { children: Child<string[] | undefined> },
) {
  const args = take(children, true);
  if (!args) {
    return null;
  }
  return <span>({args.join(", ")})</span>;
}

export function Decorators(
  { children, ...props }: {
    children: Child<DecoratorDef[] | undefined>;
    url: string;
    namespace?: string;
  },
) {
  const decorators = take(children, true);
  if (!decorators || !decorators.length) {
    return null;
  }

  return (
    <div>
      {decorators.map((decorator) => (
        <Decorator code {...props}>{decorator}</Decorator>
      ))}
    </div>
  );
}
