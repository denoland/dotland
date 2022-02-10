/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h } from "../deps.ts";

export default function LoadingPage() {
  return (
    <div>
      <head>
        <title>Deno</title>
      </head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}
