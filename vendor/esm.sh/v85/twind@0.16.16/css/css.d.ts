import { MaybeThunk, MaybeArray, Falsy, Directive, CSSRules, CSSAtKeyframes, CSSProperties, Context } from 'https://esm.sh/v85/twind@0.16.16/twind.d.ts';
export * from 'https://esm.sh/v85/twind@0.16.16/twind.d.ts';

/**
 * [[include:src/css/README.md]]
 *
 * @packageDocumentation
 * @module twind/css
 */

interface CSSFactory<T, I, R> {
    (strings: TemplateStringsArray, ...interpolations: readonly MaybeThunk<MaybeArray<I | string | number | Falsy>>[]): Directive<R>;
    (tokens: MaybeThunk<MaybeArray<T | Falsy>>): Directive<R>;
    (...tokens: readonly MaybeThunk<T | Falsy>[]): Directive<R>;
}
declare const css: CSSFactory<CSSRules, CSSRules, CSSRules>;
/**
 *
 * ```js
 * const bounce = keyframes({
 *   'from, 20%, 53%, 80%, to': {
 *     transform: 'translate3d(0,0,0)',
 *   },
 *   '40%, 43%': {
 *     transform: 'translate3d(0, -30px, 0)',
 *   },
 *   '70%': {
 *     transform: 'translate3d(0, -15px, 0)',
 *   },
 *   '90%': {
 *     transform: 'translate3d(0, -4px, 0)',
 *   }
 * })
 *
 * css({
 *   animation: `${bounce} 1s ease infinite`,
 * })
 * ```
 * @param waypoints
 */
declare const keyframes: CSSFactory<CSSAtKeyframes, CSSAtKeyframes | CSSProperties, string>;
/**
 *
 * ```js
 * const bounce = animation('1s ease infinite', {
 *   'from, 20%, 53%, 80%, to': {
 *     transform: 'translate3d(0,0,0)',
 *   },
 *   '40%, 43%': {
 *     transform: 'translate3d(0, -30px, 0)',
 *   },
 *   '70%': {
 *     transform: 'translate3d(0, -15px, 0)',
 *   },
 *   '90%': {
 *     transform: 'translate3d(0, -4px, 0)',
 *   }
 * })
 * ```
 */
interface Animation {
    (value: string | CSSRules | ((context: Context) => string)): CSSFactory<CSSAtKeyframes, CSSAtKeyframes | CSSProperties, CSSRules>;
    (value: string | CSSRules | ((context: Context) => string), waypoints: CSSAtKeyframes | Directive<string>): Directive<CSSRules>;
}
declare const animation: Animation;
interface Screen {
    (size: string): Directive<string>;
    (size: string, css: Directive<CSSRules> | MaybeArray<CSSRules | Falsy>): Directive<CSSRules>;
}
declare const screen: Screen;

export { Animation, CSSFactory, Screen, animation, css, keyframes, screen };
//# sourceMappingURL=css.d.ts.map
