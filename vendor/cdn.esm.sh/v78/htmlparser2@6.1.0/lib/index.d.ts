import { Parser, ParserOptions } from "./Parser.d.ts";
export { Parser, ParserOptions };
import { DomHandler, DomHandlerOptions, Node, Element, Document } from "https://cdn.esm.sh/v78/domhandler@4.3.1/lib/index.d.ts";
export { DomHandler, DomHandlerOptions };
declare type Options = ParserOptions & DomHandlerOptions;
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
export declare function parseDocument(data: string, options?: Options): Document;
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */
export declare function parseDOM(data: string, options?: Options): Node[];
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
export declare function createDomStream(cb: (error: Error | null, dom: Node[]) => void, options?: Options, elementCb?: (element: Element) => void): Parser;
export { default as Tokenizer, Callbacks as TokenizerCallbacks, } from "./Tokenizer.d.ts";
import * as ElementType from "https://cdn.esm.sh/v78/domelementtype@2.3.0/lib/index.d.ts";
export { ElementType };
export * from "./FeedHandler.d.ts";
export * as DomUtils from "https://cdn.esm.sh/v78/domutils@2.8.0/lib/index.d.ts";
export { DomHandler as DefaultHandler };
export { FeedHandler as RssHandler } from "./FeedHandler.d.ts";
//# sourceMappingURL=index.d.ts.map
