/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";

function InlineCode(props: { children: React.ReactNode }) {
  return (
    <code className="py-0.5 px-1 font-mono rounded-sm bg-gray-100 deno-inlinecode">
      {props.children}
    </code>
  );
}

export default InlineCode;
