// Copyright 2021 TANIGUCHI Masaya. All rights reserved. git.io/mit-license
// Copyright 2021 the Deno authors. All rights reserved. MIT license
/// <reference path="./test.d.ts" />
import { re_pathname, redirect } from "./mod.ts";
import {
  assertStrictEquals,
  assertNotStrictEquals
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("Regular Expression", () => {
  const xs = ["", "x/"];
  const vs = ["", "v"];
  const ns = ["test", "test_test", "test-test", "test00"];
  const rs = [
    "1.2.3",
    "1.2",
    "1",
    "1.x",
    "1.2.x",
  ];
  const os = [
    ">",
    ">=",
    "<",
    "<=",
    "=",
    "",
  ];
  const ps = [
    "",
    "/mod.ts",
    "/xyz/abc.ts",
    "/_xyz-789/_abc-123",
  ];
  for (const x of xs) {
    for (const n of ns) {
      for (const v of vs) {
        for (const r of rs) {
          for (const p of ps) {
            for (const o of os) {
              // Valid
              //// Single
              let s = `/${x}${n}@${o}${v}${r}${p}`;
              assertNotStrictEquals(re_pathname.exec(s), null);
              //// Range
              s = `/${x}${n}@${v}${r}-${v}${r}${p}`;
              assertNotStrictEquals(re_pathname.exec(s), null);
              //// And
              s = `/${x}${n}@${o}${v}${r} ${o}${v}${r}${p}`;
              assertNotStrictEquals(re_pathname.exec(s), null);
              //// Or
              s = `/${x}${n}@${o}${v}${r} || ${o}${v}${r}${p}`;
              assertNotStrictEquals(re_pathname.exec(s), null);

              // Invalid
              //// Double version specifiers
              s = `/${x}${n}@${o}${v}${r}@${o}${v}${r}${p}`;
              assertStrictEquals(re_pathname.exec(s), null);

              //// No package name
              s = `/${x}@${o}${v}${r}${p}`;
              assertStrictEquals(re_pathname.exec(s), null);

              //// No version specifier
              s = `/${x}${n}@${p}`;
              assertStrictEquals(re_pathname.exec(s), null);
              s = `/${x}${n}${p}`;
              assertStrictEquals(re_pathname.exec(s), null);

              //// No package and no name version specifier
              s = `/${x}${p}`;
              assertStrictEquals(re_pathname.exec(s), null);
            }
          }
        }
      }
    }
  }
});

Deno.test("Redirect", async () => {
  async function fetchTags(_: string): Promise<string[]> {
    return [
      "2.1.1",
      "2",
      "v1.2.3",
      "v1",
      "v0.2.0",
      "v0.2.0-beta.1",
      "v0.2.0-beta.0",
      "v0.2.0-alpha",
      "0.1.0",
      "0.1.0-beta.1",
      "0.1.0-beta.0",
      "0.1.0-alpha",
    ];
  }
  const name = "abc";
  const version = "v1.2.3";
  const path = "/mod.ts";
  let ranges = [
    "1.2.x",
    ">=1 <2",
    "^1.2",
    "^1.2.2",
    ">3 || <= 2.0.x",
  ];
  for (const range of ranges) {
    const encoded = encodeURIComponent(range);
    const input = `https://example.com/x/${name}@${encoded}${path}`;
    const output = await redirect(input, fetchTags);
    const expected = `https://deno.land/x/${name}@${version}${path}`;
    assertStrictEquals(output, expected);
  }
  ranges = [
    "abc",
    ">>1",
    "~0.0.1",
    ">=100",
    "~~",
    ">",
  ];
  for (const range of ranges) {
    const encoded = encodeURIComponent(range);
    const input = `https://example.com/x/${name}@${encoded}${path}`;
    const output = await redirect(input, fetchTags);
    const expected = `https://deno.land/x/${name}@${encoded}${path}`;
    assertStrictEquals(output, expected);
  }
});
