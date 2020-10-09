/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";

function InlineCode(props: { children: React.ReactNode }): React.ReactElement {
  return (
    <code className="py-1 px-2 font-mono bg-gray-100 text-sm break-all">
      {props.children}
    </code>
  );
}

export default InlineCode;
