/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h, useMemo } from "../deps.ts";
import {
  Dep,
  DependencyGraph as DependencyGraphType,
  graphToTree,
} from "../util/registry_utils.ts";

export function DependencyGraph({
  graph,
  entrypoint,
  currentModule,
}: {
  graph: DependencyGraphType;
  entrypoint: string;
  currentModule: string;
}): any | null {
  const tree = useMemo(() => {
    const tree = graphToTree(graph, entrypoint);
    return tree;
  }, [graph, entrypoint]);

  if (tree === undefined) return null;

  return (
    <div className="whitespace-no-wrap overflow-x-auto">
      <ul>
        <Node node={tree} currentModule={currentModule} />
      </ul>
    </div>
  );
}

function Node({ node, currentModule }: { node: Dep; currentModule: string }) {
  const name = node.name.startsWith(currentModule)
    ? "~/" + node.name.substring(currentModule.length)
    : node.name;
  const url = node.name.startsWith("https://deno.land/x/std")
    ? node.name.replace("https://deno.land/x/std", "https://deno.land/std")
    : node.name;
  return (
    <li>
      <p className="overflow-hidden inline">
        {url.startsWith("https://deno.land/")
          ? (
            <a href={url.replace("https://deno.land", "")} className="link text-sm truncate">{name}</a>
          )
          : (
            <a href={url} className="link text-sm truncate">
              {name}
            </a>
          )}
      </p>
      <ul className="tree">
        {node.children.map((
          node,
        ) => (
          <Node key={node.name} node={node} currentModule={currentModule} />
        ))}
      </ul>
    </li>
  );
}
