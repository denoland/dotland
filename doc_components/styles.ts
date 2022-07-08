// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { apply, css, type Directive, tw } from "./deps.ts";

const codeStyles = css({
  ":not(pre) > code": apply
    `font-mono text-sm py-1 px-1.5 rounded text-black bg-gray-100 dark:(text-white bg-gray-800)`,
  pre: apply
    `font-mono text-sm p-2.5 rounded-lg text-black bg-gray-100 dark:(text-white bg-gray-800) overflow-x-auto`,
});

const markdownStyles = css({
  a: apply`underline`,
  h1: apply`text-xl md:text-2xl lg:text-3xl`,
  h2: apply`text-lg md:text-xl lg:text-2xl`,
  h3: apply`font-bold md:(text-lg font-normal) lg:(text-xl font-normal)`,
  h4: apply`font-semibold md:(font-bold) lg:(text-lg font-normal)`,
  h5: apply`font-italic md:(font-semibold) lg:(font-bold)`,
  h6: apply`md:(font-italic) lg:(font-semibold)`,
  hr: apply`m-2 border-gray(500 dark:400)`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-1`,
  table: apply`table-auto`,
  td: apply`p-2 border border(solid gray(500 dark:400))`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,
});

const panelStyles = css({
  "& > input:checked ~ .content": apply`hidden`,
  "& > input:checked ~ label > svg": apply`rotate-0`,
});

const none = apply``;

const syntaxHighlightingStyles = css({
  ".code-comment": apply`text-gray(500 dark:400)`,
  ".code-function": apply`text-green(700 dark:300)`,
  ".code-literal": apply`text-cyan(600 dark:400)`,
  ".code-keyword, .code-operator, .code-variable.code-language": apply
    `text-purple(800 dark:300)`,
  ".code-number, .code-doctag": apply`text-indigo(600 dark:400)`,
  ".code-regexp": apply`text-red(700 dark:300)`,
  ".code-string": apply`text-yellow(500 dark:200)`,
  ".code-type, .code-built_in": apply`text-cyan(600 dark:400) italic`,
});

const styles = {
  boolean: none,
  classBody: apply`flex flex-col space-y-4`,
  classMethod: none,
  codeBlock: apply
    `font-mono my-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto`,
  codeBoolean: apply`text-cyan(600 dark:400)`,
  copyButton: apply
    `float-right bg-gray-50 px-2 font-sans focus-visible:ring-2 text-sm text-gray(500 dark:300) border border-gray(300 dark:500) rounded hover:shadow`,
  codeClassMethod: apply`text-green(700 dark:300)`,
  codeDecorator: apply`text-green(600 dark:400) italic`,
  codeFnName: apply`text-green(700 dark:300)`,
  codeKeyword: apply`text-purple(800 dark:300)`,
  codeNumberLiteral: apply`text-indigo(600 dark:400)`,
  codeStringLiteral: apply`text-yellow(500 dark:200)`,
  codeTypeKeyword: apply`text-cyan(600 dark:400) italic`,
  codeTypeLink: apply`underline`,
  codeTypeParam: apply`text-blue(600 dark:400)`,
  decorator: none,
  entryClass: apply`text-green(800 dark:400) mx-2 font-bold truncate`,
  entryEnum: apply`text-green(700 dark:500) mx-2 font-bold truncate`,
  entryFunction: apply`text-cyan(800 dark:400) mx-2 font-bold truncate`,
  entryInterface: apply`text-cyan(900 dark:300) mx-2 font-bold truncate`,
  entryTypeAlias: apply`text-yellow(700 dark:500) mx-2 font-bold truncate`,
  entryVariable: apply`text-blue(700 dark:500) mx-2 font-bold truncate`,
  entryNamespace: apply`text-yellow(800 dark:400) mx-2 font-bold truncate`,
  fnName: none,
  keyword: none,
  indent: apply`ml-4`,
  link: apply`text([#056CF0] dark:blue-300) hover:(underline text-blue-500)`,
  linkPadRight: apply
    `pr-4 text([#056CF0] dark:300) hover:(underline text-blue-500)`,
  linkType: apply`underline`,
  main: apply`md:(col-span-3)`,
  markdown: apply
    `p-4 flex flex-col space-y-4 text-justify ${markdownStyles} ${codeStyles} ${syntaxHighlightingStyles}`,
  usage: apply
    `flex flex-col space-y-4 text-justify ${markdownStyles} ${codeStyles} ${syntaxHighlightingStyles}`,
  markdownSummary: apply`text-gray(600 dark:400) ${
    css({
      "p": apply`inline-block`,
      "a": apply`text-blue(700 dark:400) hover:underline`,
    })
  }`,
  moduleIndexTable: apply`block w-full lg:(table table-fixed)`,
  moduleIndexTableBody: apply`block w-full lg:table-row-group`,
  moduleIndexRow: apply`block lg:table-row`,
  moduleIndexCell: apply`block ml-4 lg:(table-cell ml-0)`,
  moduleIndexModuleCell: apply
    `block pl-2 py-0.5 lg:(table-cell w-48 pl-4 pr-2 py-1.5)`,
  moduleIndexPanelCell: apply`block lg:table-cell ${panelStyles}`,
  modulePathIndex: apply`rounded-lg w-full border border-secondary`,
  modulePathIndexHeader: apply`flex justify-between items-center`,
  modulePathIndexHeaderTitle: apply
    `ml-5 font-semibold text-lg flex items-center`,
  modulePathIndexHeaderTitleSpan: apply`ml-2 leading-none`,
  modulePathIndexSource: apply
    `rounded-md border border-dark-border p-2 my-3.5 mr-5`,
  modulePathIndexTable: apply`block lg:table w-full`,
  modulePathIndexRow: apply`block lg:table-row odd:bg-ultralight`,
  modulePathIndexLinkCell: apply
    `block lg:table-cell pl-5 pr-3 py-2.5 font-semibold`,
  modulePathIndexLinkCellIcon: apply`inline my-1.5 mr-3`,
  modulePathIndexDocCell: apply
    `block lg:(table-cell pl-0 pt-2.5 mt-0) pl-11 pr-5.5 pb-2.5 -mt-2 text-[#9CA0AA]`,
  modulePathIndexSymbolCell: apply`block lg:table-cell pl-5 pr-2 py-1`,
  none,
  numberLiteral: none,
  panel: css({
    "& > input:checked ~ .content": apply`hidden`,
    "& > input:checked ~ label > svg": apply`rotate-0`,
  }),
  panelTitle: apply`block p-2 border(b gray(400 dark:600)) cursor-pointer`,
  section: apply`text-sm font-bold py-1`,
  moduleDoc: apply`space-y-6`,
  stringLiteral: none,
  subSection: apply`text-xl p-2 mx-2.5 mt-1 mb-2.5`,
  symbolClass: apply`text-green(800 dark:400) font-bold hover:underline`,
  symbolEnum: apply`text-green(700 dark:500) font-bold hover:underline`,
  symbolFunction: apply`text-cyan(800 dark:400) font-bold hover:underline`,
  symbolInterface: apply`text-cyan(900 dark:300) font-bold hover:underline`,
  symbolListCellSymbol: apply
    `block lg:table-cell py-1 pr-3 text-[#232323] font-bold children:(w-52 block)`,
  symbolListCellDoc: apply`block lg:table-cell py-1 text-sm text-[#9CA0AA]`,
  symbolListRow: apply`block lg:table-row`,
  symbolListTable: apply`block lg:table`,
  symbolNamespace: apply`text-yellow(800 dark:400) font-bold hover:underline`,
  symbolTypeAlias: apply`text-yellow(700 dark:500) font-bold hover:underline`,
  symbolVariable: apply`text-blue(700 dark:500) font-bold hover:underline`,
  tag: apply
    `px-4 py-2 inline-flex leading-4 font-medium lowercase rounded-full`,
  tagKind: apply`italic`,
  tagName: apply`font-medium`,
  title: apply
    `text-2xl md:text-3xl lg:text-4xl text-gray(900 dark:50) font-bold mb-3`,
  typeKeyword: none,
  typeLink: apply`underline`,
  typeParam: none,
  rightArrow: apply`inline rotate-90 dark:(filter invert) mr-2`,
} as const;

export type StyleKey = keyof typeof styles;

export function style(name: StyleKey): string;
// deno-lint-ignore no-explicit-any
export function style(name: StyleKey, raw: boolean): string | Directive<any>;
// deno-lint-ignore no-explicit-any
export function style(name: StyleKey, raw: true): Directive<any>;
export function style(
  name: StyleKey,
  raw = false,
  // deno-lint-ignore no-explicit-any
): string | Directive<any> {
  if (raw) {
    return styles[name];
  }
  return tw`${styles[name]}`;
}
