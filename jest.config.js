/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

module.exports = {
  roots: ["<rootDir>/util"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testTimeout: 10000,
};
