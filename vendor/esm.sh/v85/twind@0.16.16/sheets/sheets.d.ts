import { SheetConfig, Sheet, SheetInit } from 'https://esm.sh/v85/twind@0.16.16/twind.d.ts';

/**
 * [[include:src/sheets/README.md]]
 *
 * @packageDocumentation
 * @module twind/sheets
 */

/**
 * Creates an sheet which inserts style rules through the Document Object Model.
 */
declare const domSheet: ({ nonce, target, }?: SheetConfig<HTMLStyleElement>) => Sheet<HTMLStyleElement>;
/**
 * Allows to reset and snaphot the current state of an sheet and
 * in extension the internal mutable state (caches, ...) of `tw`.
 */
interface Storage {
    /**
     * Register a function that should be called to create a new state.
     */
    init: SheetInit;
    /**
     * Creates a snapshot of the current state, invokes all init callbacks to create a fresh state
     * and returns the snaphot.
     */
    reset: (snapshot?: unknown[] | undefined) => unknown[];
}
/**
 * A sheet that collects styles into an array.
 */
interface VirtualSheet extends Sheet<string[]>, Storage {
    init: SheetInit;
}
/**
 * Creates an sheet which collects style rules into an array.
 */
declare const virtualSheet: () => VirtualSheet;
interface StyleTagProperties {
    id: string;
    textContent: string;
}
interface HasTarget {
    readonly target: readonly string[];
}
declare type StyleTagSheet = HasTarget | readonly string[];
/**
 * Transforms css rules into `<style>` tag properties.
 */
declare const getStyleTagProperties: (sheet: StyleTagSheet) => StyleTagProperties;
/**
 * Transforms css rules into a `<style>` tag string.
 */
declare const getStyleTag: (sheet: StyleTagSheet, attributes?: Record<string, string> | undefined) => string;

export { HasTarget, Storage, StyleTagProperties, StyleTagSheet, VirtualSheet, domSheet, getStyleTag, getStyleTagProperties, virtualSheet };
//# sourceMappingURL=sheets.d.ts.map
