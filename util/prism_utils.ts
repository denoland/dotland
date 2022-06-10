// Copyright 2022 the Deno authors. All rights reserved. MIT license.

export { default as Prism } from "$prism";
import "$prism/components/prism-bash?no-check";
import "$prism/components/prism-batch?no-check";
import "$prism/components/prism-css?no-check";
import "$prism/components/prism-css-extras?no-check";
import "$prism/components/prism-editorconfig?no-check";
import "$prism/components/prism-diff?no-check";
import "$prism/components/prism-docker?no-check";
import "$prism/components/prism-git?no-check";
import "$prism/components/prism-ignore?no-check";
import "$prism/components/prism-javascript?no-check";
import "$prism/components/prism-js-extras?no-check";
import "$prism/components/prism-js-templates?no-check";
import "$prism/components/prism-json?no-check";
import "$prism/components/prism-jsx?no-check";
import "$prism/components/prism-markdown?no-check";
import "$prism/components/prism-rust?no-check";
import "$prism/components/prism-toml?no-check";
import "$prism/components/prism-tsx?no-check";
import "$prism/components/prism-typescript?no-check";
import "$prism/components/prism-yaml?no-check";

// Taken from https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/utils/normalizeTokens.js

/** Empty lines need to contain a single empty token, denoted with { empty: true } */
// deno-lint-ignore no-explicit-any
function normalizeEmptyLines(line: any[]) {
  if (line.length === 0) {
    line.push({
      types: ["plain"],
      content: "\n",
      empty: true,
    });
  } else if (line.length === 1 && line[0].content === "") {
    line[0].content = "\n";
    line[0].empty = true;
  }
}

function appendTypes(types: string[], add: string[] | string): string[] {
  const typesSize = types.length;
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types;
  }

  return types.concat(add);
}

const newlineRe = /\r\n|\r|\n/;

/**
 * Takes an array of Prism's tokens and groups them by line, turning plain
 * strings into tokens as well. Tokens can become recursive in some cases,
 * which means that their types are concatenated. Plain-string tokens however
 * are always of type "plain".
 * This is not recursive to avoid exceeding the call-stack limit, since it's unclear
 * how nested Prism's tokens can become
 */
// deno-lint-ignore no-explicit-any
export function normalizeTokens(tokens: Array<any | string>): any[][] {
  const typeArrStack: string[][] = [[]];
  const tokenArrStack = [tokens];
  const tokenArrIndexStack = [0];
  const tokenArrSizeStack = [tokens.length];

  let i = 0;
  let stackIndex = 0;
  // deno-lint-ignore no-explicit-any
  let currentLine: any[] = [];

  const acc = [currentLine];

  while (stackIndex > -1) {
    while (
      (i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]
    ) {
      let content;
      let types = typeArrStack[stackIndex];

      const tokenArr = tokenArrStack[stackIndex];
      const token = tokenArr[i];

      // Determine content and append type to types if necessary
      if (typeof token === "string") {
        types = stackIndex > 0 ? types : ["plain"];
        content = token;
      } else {
        types = appendTypes(types, token.type);
        if (token.alias) {
          types = appendTypes(types, token.alias);
        }

        content = token.content;
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== "string") {
        stackIndex++;
        typeArrStack.push(types);
        tokenArrStack.push(content);
        tokenArrIndexStack.push(0);
        tokenArrSizeStack.push(content.length);
        continue;
      }

      // Split by newlines
      const splitByNewlines = content.split(newlineRe);
      const newlineCount = splitByNewlines.length;

      currentLine.push({ types, content: splitByNewlines[0] });

      // Create a new line for each string on a new line
      for (let i = 1; i < newlineCount; i++) {
        normalizeEmptyLines(currentLine);
        acc.push(currentLine = []);
        currentLine.push({ types, content: splitByNewlines[i] });
      }
    }

    // Decrease the stack depth
    stackIndex--;
    typeArrStack.pop();
    tokenArrStack.pop();
    tokenArrIndexStack.pop();
    tokenArrSizeStack.pop();
  }

  normalizeEmptyLines(currentLine);
  return acc;
}
