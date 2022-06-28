// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { camelize, maybe, parseURL } from "./utils.ts";

interface ParsedUsage {
  /** The symbol that the item should be imported as. If `usageSymbol` and
   * `localVar` is defined, then the item is a named import, otherwise it is
   * a namespace import. */
  importSymbol: string;
  /** The undecorated code of the generated import statement to import and use
   * the item. */
  importStatement: string;
  /** The local variable that the `usageSymbol` should be destructured out of.
   */
  localVar?: string;
  /** The symbol that should be destructured from the `localVar` which will be
   * bound to the item's value. */
  usageSymbol?: string;
}

/** Given the URL and optional item and is type flag, provide back a parsed
 * version of the usage of an item for rendering. */
export function parseUsage(
  url: string,
  item?: string,
  isType?: boolean,
): ParsedUsage {
  const parsed = parseURL(url);
  const itemParts = item?.split(".");
  // when the imported symbol is a namespace import, we try to guess at an
  // intelligent camelized name for the import based on the package name.  If
  // it is a named import, we simply import the symbol itself.
  const importSymbol = itemParts
    ? itemParts[0]
    : camelize(parsed?.package ?? "mod");
  // when using a symbol from an imported namespace exported from a module, we
  // need to create the local symbol, which we identify here.
  const usageSymbol = itemParts && itemParts.length > 1
    ? itemParts.pop()
    : undefined;
  // if it is namespaces within namespaces, we simply re-join them together
  // instead of trying to figure out some sort of nested restructuring
  const localVar = itemParts?.join(".");
  // we create an import statement which is used to populate the copy paste
  // snippet of code.
  let importStatement = item
    ? `import { ${isType ? "type " : ""}${importSymbol} } from "${url}";\n`
    : `import * as ${importSymbol} from "${url}";\n`;
  // if we are using a symbol off a imported namespace, we need to destructure
  // it to a local variable.
  if (usageSymbol) {
    importStatement += `\nconst { ${usageSymbol} } = ${localVar};\n`;
  }
  return { importSymbol, usageSymbol, localVar, importStatement };
}

let guid = 1;

export function Usage(
  { url, name, isType }: { url: string; name?: string; isType?: boolean },
) {
  const {
    importSymbol,
    importStatement,
    usageSymbol,
    localVar,
  } = parseUsage(url, name, isType);
  const fnName = `cis${guid++}`;
  return (
    <div class={style("usage")}>
      <pre>
        <span
          dangerouslySetInnerHTML={{
            __html: `<button id="${fnName}" class="${
              style("copyButton")
            }" type="button" onclick="${fnName}()">Copy</button>`,
          }}
        />
        <code>
          <span class="code-keyword">import</span>
          {name
            ? (
              <span>
                {" "}&#123;{" "}
                {isType
                  ? <span class="code-keyword">type{" "}</span>
                  : undefined}
                {importSymbol} &#125;{" "}
              </span>
            )
            : (
              <span>
                {" "}* <span class="code-keyword">as</span> {importSymbol}
                {" "}
              </span>
            )}
          <span class="code-keyword">from</span>{" "}
          <span class="code-string">"{url}"</span>;{maybe(
            usageSymbol,
            <div>
              <br />
              <span class="code-keyword">const</span> &#123; {usageSymbol}{" "}
              &#125; = {localVar};
            </div>,
          )}
        </code>
      </pre>
      <script
        dangerouslySetInnerHTML={{
          __html: `function ${fnName}() { 
              navigator?.clipboard?.writeText(\`${importStatement}\`); 
              document.querySelector(\'#${fnName}\').innerHTML = "✅ Copied"; 
              setTimeout(() => {
                document.querySelector(\'#${fnName}\').innerHTML = "Copy";
              }, 5000);
            }`,
        }}
      />
    </div>
  );
}
