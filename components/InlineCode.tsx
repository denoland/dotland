/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";

function InlineCode(props: { children: React.ReactNode; showDark?: boolean }) {
  return (
    <code
      className={`py-1 px-2 font-mono bg-gray-100 text-sm break-all ${
        props.showDark ? "dark:bg-grey-700" : undefined
      }`}
    >
      {props.children}
    </code>
  );
}

export default InlineCode;
