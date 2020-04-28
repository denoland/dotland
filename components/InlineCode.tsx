/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";

function InlineCode(props: { children: React.ReactNode }) {
  return (
    <code className="py-px px-1 font-mono bg-gray-100 rounded-sm">
      {props.children}
    </code>
  );
}

export default InlineCode;
