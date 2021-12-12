/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import React from "react";

export function DeprecationWarning(
  { message }: { message: string },
): React.ReactElement {
  return (
    <div className="bg-warning text-white rounded-md p-4">
      <div className="flex items-center mb-2">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
          </path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12" y2="17"></line>
        </svg>
        <p className="text-sm ml-1 font-medium">
          This module has been deprecated.
        </p>
      </div>
      <p className="text-lg">
        {message}
      </p>
    </div>
  );
}
