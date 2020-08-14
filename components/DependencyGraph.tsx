/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
// import Link from "next/link";
import { DependencyGraph as DependencyGraphType } from "../util/registry_utils";

function DependencyGraph({
  graph,
  entrypoint,
  currentModule,
}: {
  graph: DependencyGraphType;
  entrypoint: string;
  currentModule: string;
}) {
  const tree = useMemo(() => {
    const tree = graphToTree(graph, entrypoint);
    return tree;
  }, [graph, entrypoint]);

  if (tree === undefined) return null;

  return (
    <div>
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
  return (
    <li>
      <a href={node.name} className="link">
        {name}
      </a>
      <ul className="tree">
        {node.children.map((node) => (
          <Node key={node.name} node={node} currentModule={currentModule} />
        ))}
      </ul>
    </li>
  );
}

type Dep = { name: string; children: Dep[] };

function graphToTree(
  graph: DependencyGraphType,
  name: string,
  visited: string[] = []
): Dep | undefined {
  const dep = graph.nodes[name];
  if (dep === undefined) return undefined;
  visited.push(name);
  return {
    name,
    children: dep.imports
      .filter((n) => !visited.includes(n))
      .map((n) => graphToTree(graph, n, visited)!),
  };
}

export default DependencyGraph;
