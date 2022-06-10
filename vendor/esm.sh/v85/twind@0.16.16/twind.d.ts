import { PropertiesFallback, PropertiesHyphenFallback, AtRule, SimplePseudos } from 'https://esm.sh/v85/csstype@3.1.0/index.d.ts';

interface CSSCustomProperties {
    '--tw-bg-opacity'?: string;
    '--tw-text-opacity'?: string;
    '--tw-border-opacity'?: string;
    '--tw-divide-opacity'?: string;
    '--tw-placeholder-opacity'?: string;
    '--tw-shadow'?: string;
    '--tw-ring-inset'?: string;
    '--tw-ring-color'?: string;
    '--tw-ring-opacity'?: string;
    '--tw-ring-shadow'?: string;
    '--tw-ring-offset-color'?: string;
    '--tw-ring-offset-shadow'?: string;
    '--tw-ring-offset-width'?: string;
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
    '--tw-divide-y-reverse'?: string;
    '--tw-divide-x-reverse'?: string;
    '--tw-space-y-reverse'?: string;
    '--tw-space-x-reverse'?: string;
    '--tw-translate-x'?: string;
    '--tw-translate-y'?: string;
    '--tw-rotate'?: string;
    '--tw-skew-x'?: string;
    '--tw-skew-y'?: string;
    '--tw-scale-x'?: string;
    '--tw-scale-y'?: string;
    '--tw-ordinal'?: string;
    '--tw-slashed-zero'?: string;
    '--tw-numeric-figure'?: string;
    '--tw-numeric-spacing'?: string;
    '--tw-numeric-fraction'?: string;
}
interface CSSProperties extends PropertiesFallback<string, string>, PropertiesHyphenFallback<string, string>, CSSCustomProperties {
}
interface FontFace extends AtRule.FontFaceFallback<string, string>, AtRule.FontFaceHyphenFallback<string, string> {
}
interface CounterStyle extends AtRule.CounterStyleFallback<string, string>, AtRule.CounterStyleHyphenFallback<string, string> {
}

declare type Falsy = '' | 0 | -0 | false | null | undefined | void;
declare type MaybeArray<T> = T | readonly T[];

interface TWCallable {
    (strings: TemplateStringsArray, ...interpolations: Token[]): string;
    (...tokens: Token[]): string;
}
interface TW extends TWCallable {
    theme: ThemeResolver;
}
interface Context {
    /** Allow composition */
    readonly tw: TWCallable;
    /** Access to theme values */
    readonly theme: ThemeResolver;
    /** Create unique identifier (group, custom properties) */
    readonly tag: (key: string) => string;
    readonly css: (rule: Rule[] | string) => CSSRules;
}
interface Instance {
    readonly tw: TW;
    readonly setup: (options?: Configuration) => void;
}
declare type MaybeThunk<T> = T | ((context: Context) => T);
interface Preflight {
    (preflight: CSSRules, context: Context): MaybeThunk<CSSRules | undefined | void>;
}
interface ThemeConfiguration extends Partial<Theme> {
    extend?: Partial<Theme>;
}
interface SheetConfig<T = unknown> {
    /**
     * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
     *
     * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
     */
    nonce?: string;
    /** Target to insert rules into. */
    target?: T;
}
interface Sheet<T = unknown> {
    readonly target: T;
    insert: (rule: string, index: number) => void;
    init?: SheetInit;
}
declare type SheetInitCallback<T = unknown> = (value?: T | undefined) => T;
interface SheetInit {
    /**
     * Register a function that should be called to use a snapshot state or create a new state.
     */
    <T>(callback: SheetInitCallback<T>): T;
}
declare type Prefixer = (property: string, value: string, important?: boolean) => string;
declare type Hasher = (value: string) => string;
declare type DarkMode = 'media' | 'class' | false;
interface Configuration {
    /**
     * Determines the dark mode strategy (default: `"media"`).
     */
    darkMode?: DarkMode;
    theme?: ThemeConfiguration;
    plugins?: Record<string, Plugin | undefined>;
    /**
     * ```js
     * {
     *   ':new-variant': '& .selector',
     * }
     * ```
     */
    variants?: Record<string, string>;
    /**
     * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
     *
     * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
     */
    nonce?: string;
    /** Style insertion methodology to be used. */
    sheet?: Sheet;
    /** Called right before the first rule is injected. */
    preflight?: Preflight | boolean | CSSRules;
    /** Auto-prefixer method for CSS property–value pairs. */
    prefix?: Prefixer | boolean;
    hash?: Hasher | boolean;
    mode?: Mode | 'strict' | 'warn' | 'silent';
    /**
     * Control whether or not utilities should be marked with `!important`
     */
    important?: boolean;
}
declare type ReportInfo = {
    id: 'LATE_SETUP_CALL';
} | {
    id: 'UNKNOWN_DIRECTIVE';
    rule: string;
} | {
    id: 'UNKNOWN_THEME_VALUE';
    key: string | undefined;
} | {
    id: 'INJECT_CSS_ERROR';
    error: Error;
    css: string;
};
interface Mode {
    /** Called for unknown theme values */
    unknown: <Section extends keyof Theme>(section: Section, key: string[] | undefined, optional: boolean, context: Context) => ThemeSectionType<Theme[Section]> | undefined | void;
    /**
     * Notify error (missing plugin, duplicate directives? )
     *
     * Why id?
     * - can generate an url with more info
     * - reduce bundle size by omitting large error messages
     */
    report(info: ReportInfo, context: Context): void;
}
declare type Plugin = string | CSSRules | DirectiveHandler;
interface DirectiveHandler {
    /**
     * Creates CSSRules based on `parameters`
     */
    (parameters: string[], context: Context, id: string): InlineDirective | CSSRules | string | Falsy;
}
interface Rule {
    /**
     * The variants: `[":sm", ":dark", ":hover"]`
     */
    v: string[];
    /**
     * The directive: `"text-sm"`, `"rotate-45"`
     */
    d: string | InlineDirective;
    /** Is this rule negated: `"-rotate-45"` =\> `true` */
    n: boolean | undefined;
    /** Is this rule marked as important: `"!stroke-4"` =\> `true` */
    i: boolean | undefined;
    /**
     * The id is the tailwind rule including variants, negate and directive
     *
     * Initialy this is set to an empty string.
     *
     * This is used to cache the id of static rules (from template literals).
     */
    $: string;
}
interface Directive<T> {
    /** Can be used as a inline directive */
    (context: Context): T;
    /** Can be used as a plugin */
    (params: string[], context: Context): T;
}
interface InlineDirective {
    (context: Context): CSSRules | string | Falsy | TypescriptCompat;
}
interface TokenGrouping extends Record<string, Token> {
}
declare type TypescriptCompat = boolean | number;
declare type Token = string | TokenGrouping | InlineDirective | Token[] | Falsy | TypescriptCompat;
/**
 * Pseudo class
 * watch out for ':root' - that could use '*' instead
 */
declare type CSSSimplePseudos = {
    [K in SimplePseudos as `&${string & K}`]?: CSSRulesThunk | MaybeArray<CSSRules>;
};
interface CSSPseudos extends CSSSimplePseudos {
    '&:nth-child(2n)'?: CSSRules;
    '&:nth-child(odd)'?: CSSRules;
}
declare type CSSAtMedia = Record<string, MaybeArray<CSSRules>>;
declare type CSSAtSupports = Record<string, MaybeArray<CSSRules>>;
declare type CSSAtKeyframes = Record<string, CSSProperties | ((context: Context) => CSSProperties)>;
/**
 * See: https://drafts.csswg.org/css-nesting/#nest-selector
 *
 * ```
 * "& > * + *": {
 *   marginLeft: 16
 * },
 *
 * // In a comma-separated list, each individual selector shall start with "&"
 * "&:focus, &:active": {
 *   outline: "solid"
 * },
 *
 * // Self-references are also supported
 * "& + &": {
 *   color: "green"
 * }
 * ```
 */
interface CSSRules {
    '@import'?: CSSRulesThunk<MaybeArray<string>> | MaybeArray<string>;
    '@font-face'?: CSSRulesThunk<MaybeArray<FontFace>> | MaybeArray<FontFace>;
    '@keyframes'?: CSSRulesThunk<CSSAtKeyframes> | CSSAtKeyframes;
    '@apply'?: MaybeArray<string | Falsy | TypescriptCompat>;
    '@global'?: CSSRulesThunk<MaybeArray<CSSRules>> | MaybeArray<CSSRules>;
    ':global'?: CSSRulesThunk<MaybeArray<CSSRules>> | MaybeArray<CSSRules>;
    /** Global defaults */
    [key: string]: CSSRuleValue;
}
declare type CSSRuleValue = CSSAtMedia | CSSAtSupports | CSSAtKeyframes | CSSRulesThunk | MaybeArray<CSSProperties | CSSRules | FontFace | string | Falsy | TypescriptCompat>;
interface CSSRulesThunk<Value = CSSRuleValue> {
    (context: Context): Value;
}

interface ThemeResolver {
    <Section extends keyof Theme>(section: Section): Record<string, ThemeSectionType<Theme[Section]>>;
    <Section extends keyof Theme>(keypath: `${Section}.${string}`): ThemeSectionType<Theme[Section]> | undefined;
    <Section extends keyof Theme>(keypath: `${Section}.${string}`, defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>): NonNullable<ThemeSectionType<Theme[Section]>>;
    <Section extends keyof Theme>(section: Section, key: string | string[]): ThemeSectionType<Theme[Section]> | undefined;
    <Section extends keyof Theme>(section: Section, key: string | string[], defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>): NonNullable<ThemeSectionType<Theme[Section]>>;
}
interface ThemeHelper {
    <Section extends keyof Theme>(section: Section): (context: Context) => Record<string, ThemeSectionType<Theme[Section]>>;
    <Section extends keyof Theme>(keypath: `${Section}.${string}`): (context: Context) => ThemeSectionType<Theme[Section]> | undefined;
    <Section extends keyof Theme>(keypath: `${Section}.${string}`, defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>): (context: Context) => NonNullable<ThemeSectionType<Theme[Section]>>;
    <Section extends keyof Theme>(section: Section, key: string | string[]): (context: Context) => ThemeSectionType<Theme[Section]> | undefined;
    <Section extends keyof Theme>(section: Section, key: string | string[], defaultValue: NonNullable<ThemeSectionType<Theme[Section]>>): (context: Context) => NonNullable<ThemeSectionType<Theme[Section]>>;
}
declare type Unwrap<T> = T extends string[] ? string : T extends Record<string, infer R> ? R : T;
declare type ThemeSectionType<T> = T extends ThemeSection<infer R> ? Unwrap<R> : Exclude<T, ThemeSectionResolver<T>>;
interface ThemeSectionResolverContext {
    /**
     * No-op function as negated values are automatically infered and do _not_ not to be in the theme.
     */
    readonly negative: (records: Record<string, string | undefined>) => Record<string, string | undefined>;
    readonly breakpoints: (records: Record<string, ThemeScreen | undefined>) => Record<string, string | undefined>;
}
declare type ThemeSectionRecord<T = string> = Record<string, T | undefined>;
declare type ThemeSectionResolver<T = string> = (theme: ThemeResolver, context: ThemeSectionResolverContext) => ThemeSectionRecord<T>;
declare type ThemeSection<T = string> = ThemeSectionRecord<T> | ThemeSectionResolver<T>;
interface ThemeContainer {
    screens?: Record<string, string | undefined>;
    center?: boolean;
    padding?: string | Record<string, string | undefined>;
}
declare type ThemeScreenValue = string | {
    raw: string;
} | {
    min: string;
    max?: string;
} | {
    min?: string;
    max: string;
};
declare type ThemeScreen = MaybeArray<ThemeScreenValue>;
interface ThemeColorObject extends Record<string, ThemeColor> {
}
declare type ThemeColor = string | ThemeColorObject;
declare type ThemeFontSize = string | [size: string, lineHeight: string] | [size: string, options: {
    lineHeight?: string;
    letterSpacing?: string;
}];
declare type ThemeOutline = [outline: string, offset: string] | string[];
interface Theme {
    colors: ThemeSection<ThemeColor>;
    spacing: ThemeSection;
    durations: ThemeSection<string | string[]>;
    screens: ThemeSection<ThemeScreen>;
    animation: ThemeSection<string | string[]>;
    backdropBlur: ThemeSection;
    backdropBrightness: ThemeSection;
    backdropContrast: ThemeSection;
    backdropGrayscale: ThemeSection;
    backdropHueRotate: ThemeSection;
    backdropInvert: ThemeSection;
    backdropOpacity: ThemeSection;
    backdropSaturate: ThemeSection;
    backdropSepia: ThemeSection;
    backgroundColor: ThemeSection<ThemeColor>;
    backgroundImage: ThemeSection<string | string[]>;
    backgroundOpacity: ThemeSection;
    backgroundPosition: ThemeSection;
    backgroundSize: ThemeSection;
    blur: ThemeSection;
    borderColor: ThemeSection<ThemeColor>;
    borderOpacity: ThemeSection;
    borderRadius: ThemeSection;
    borderWidth: ThemeSection;
    boxShadow: ThemeSection<string | string[]>;
    brightness: ThemeSection;
    container: ThemeContainer | ThemeSectionResolver<ThemeContainer>;
    contrast: ThemeSection;
    cursor: ThemeSection;
    divideColor: ThemeSection<ThemeColor>;
    divideOpacity: ThemeSection;
    divideWidth: ThemeSection;
    dropShadow: ThemeSection<string | string[]>;
    fill: ThemeSection<ThemeColor>;
    flex: ThemeSection;
    flexGrow: ThemeSection<number>;
    flexShrink: ThemeSection<number>;
    fontFamily: ThemeSection<string | string[]>;
    fontSize: ThemeSection<ThemeFontSize>;
    fontWeight: ThemeSection;
    gap: ThemeSection;
    gradientColorStops: ThemeSection<ThemeColor>;
    grayscale: ThemeSection;
    gridAutoColumns: ThemeSection;
    gridAutoRows: ThemeSection;
    gridColumn: ThemeSection;
    gridColumnEnd: ThemeSection;
    gridColumnStart: ThemeSection;
    gridRow: ThemeSection;
    gridRowEnd: ThemeSection;
    gridRowStart: ThemeSection;
    gridTemplateColumns: ThemeSection;
    gridTemplateRows: ThemeSection;
    height: ThemeSection;
    hueRotate: ThemeSection;
    inset: ThemeSection;
    invert: ThemeSection;
    keyframes: ThemeSection<Record<string, CSSProperties>>;
    letterSpacing: ThemeSection;
    lineHeight: ThemeSection;
    listStyleType: ThemeSection;
    margin: ThemeSection;
    maxHeight: ThemeSection;
    maxWidth: ThemeSection;
    minHeight: ThemeSection;
    minWidth: ThemeSection;
    objectPosition: ThemeSection;
    opacity: ThemeSection;
    order: ThemeSection;
    outline: ThemeSection<ThemeOutline>;
    padding: ThemeSection;
    placeholderColor: ThemeSection<ThemeColor>;
    placeholderOpacity: ThemeSection;
    ringColor: ThemeSection<ThemeColor>;
    ringOffsetColor: ThemeSection<ThemeColor>;
    ringOffsetWidth: ThemeSection;
    ringOpacity: ThemeSection;
    ringWidth: ThemeSection;
    rotate: ThemeSection;
    saturate: ThemeSection;
    scale: ThemeSection;
    sepia: ThemeSection;
    skew: ThemeSection;
    space: ThemeSection;
    stroke: ThemeSection<ThemeColor>;
    strokeWidth: ThemeSection;
    textColor: ThemeSection<ThemeColor>;
    textOpacity: ThemeSection;
    transformOrigin: ThemeSection;
    transitionDelay: ThemeSection<string | string[]>;
    transitionDuration: ThemeSection<string | string[]>;
    transitionProperty: ThemeSection<string | string[]>;
    transitionTimingFunction: ThemeSection<string | string[]>;
    translate: ThemeSection;
    width: ThemeSection;
    zIndex: ThemeSection;
}

declare type InterpolateKind = `theme(${keyof Theme})` | `range(${number},${number},${number})` | `string` | `number` | `nonzero`;
declare type Interpolate<Kind extends InterpolateKind> = `{{${Kind}}}`;
declare type FromTheme<Section extends keyof Theme> = Interpolate<`theme(${Section})`>;
declare type NonEmptyString = Interpolate<'string'>;
declare type Range<From extends number, To extends number, Step extends number = 1> = Interpolate<`range(${From},${To},${Step})`>;
declare type Negatable<Value extends string> = Value | `-${Value}`;
declare type SimplePseudoClasses = 'active' | 'any-link' | 'autofill' | 'checked' | 'default' | 'disabled' | 'empty' | 'enabled' | 'first-child' | 'first-of-type' | 'focus' | 'focus-visible' | 'focus-within' | 'future' | 'hover' | 'in-range' | 'indeterminate' | 'invalid' | 'last-child' | 'last-of-type' | 'link' | 'local-link' | 'only-child' | 'only-of-type' | 'optional' | 'out-of-range' | 'past' | 'paused' | 'placeholder-shown' | 'playing' | 'read-only' | 'read-write' | 'required' | 'target' | 'target-within' | 'user-invalid' | 'valid' | 'visited';
declare type SimplePseudoElements = 'after' | 'before' | 'cue' | 'cue-region' | 'file-selector-button' | 'first-letter' | 'first-line' | 'marker' | 'placeholder' | 'selection' | 'target-text';
declare type CoreVariants = 'dark' | 'sticky' | 'motion-reduce' | 'motion-safe' | 'first' | 'last' | 'even' | 'odd' | 'children' | 'siblings' | 'sibling' | 'override';
declare type Empty = never | '' | 'DEFAULT';
declare type Join<Prefix extends string | never, Suffix extends string | never, Separator extends string = '-'> = Suffix extends Empty ? Prefix extends Empty ? never : Prefix : Prefix extends Empty ? Suffix : Prefix extends Suffix ? never : Suffix extends `-${infer S}` ? `-${Prefix}${Separator}${S}` : `${Prefix}${Separator}${Suffix}`;
declare type Corners = 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'bl' | 'br';
declare type Edges = 'x' | 'y' | 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'tb' | 'bl' | 'br' | 'lr';
declare type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
declare type GlobalValue = 'inherit' | 'initial' | 'unset';
declare type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
interface CorePlugins {
    group: '' | NonEmptyString;
    container: '';
    decoration: 'slice' | 'clone' | GlobalValue;
    box: 'border' | 'content';
    block: '';
    inline: '' | 'block' | 'flex' | 'grid' | 'table';
    flow: 'root';
    contents: '';
    hidden: '';
    float: 'right' | 'left' | 'none';
    clear: 'right' | 'left' | 'both' | 'none';
    isolate: '';
    isolation: 'auto' | 'isolate' | GlobalValue;
    object: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | Join<'' | 'left' | 'right' | 'center', '' | 'bottom' | 'top' | 'center'> | FromTheme<'objectPosition'>;
    overflow: Join<'' | 'x' | 'y', 'auto' | 'hidden' | 'visible' | 'scroll'> | 'ellipsis' | 'clip';
    overscroll: Join<'' | 'x' | 'y', 'auto' | 'contain' | 'none'>;
    static: '';
    fixed: '';
    absolute: '';
    relative: '';
    sticky: '';
    inset: Negatable<Join<'' | 'x' | 'y', FromTheme<'inset'>>>;
    top: Negatable<FromTheme<'inset'>>;
    right: Negatable<FromTheme<'inset'>>;
    bottom: Negatable<FromTheme<'inset'>>;
    left: Negatable<FromTheme<'inset'>>;
    visible: '';
    invisible: '';
    z: Negatable<FromTheme<'zIndex'>>;
    flex: '' | 'nowrap' | Join<'row' | 'col' | 'wrap', '' | 'reverse'> | Join<'grow', '' | '0' | FromTheme<'flexGrow'> | Interpolate<'number'>> | Join<'shrink', '' | '0' | FromTheme<'flexShrink'> | Interpolate<'number'>> | FromTheme<'flex'>;
    order: FromTheme<'order'>;
    grid: '' | Join<'cols', 'none' | Range<1, 12> | Interpolate<'nonzero'> | FromTheme<'gridTemplateColumns'>> | Join<'rows', 'none' | Range<1, 6> | Interpolate<'nonzero'> | FromTheme<'gridTemplateRows'>> | Join<'flow', Join<'row' | 'col', '' | 'dense'> | 'dense'>;
    col: Join<'span', Range<1, 12> | Interpolate<'nonzero'>> | Join<'start', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridColumnStart'>> | Join<'end', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridColumnEnd'>> | FromTheme<'gridColumn'>;
    row: Join<'span', Range<1, 12> | Interpolate<'nonzero'>> | Join<'start', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridRowStart'>> | Join<'end', 'auto' | Range<1, 13> | Interpolate<'nonzero'> | FromTheme<'gridRowEnd'>> | FromTheme<'gridRow'>;
    auto: Join<'cols', 'auto' | FromTheme<'gridAutoColumns'>> | Join<'rows', 'auto' | FromTheme<'gridAutoRows'>>;
    gap: Join<'' | 'x' | 'y', FromTheme<'gap'>>;
    justify: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | Join<'items' | 'self', 'auto' | 'start' | 'end' | 'center' | 'stretch'>;
    content: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    items: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    self: 'auto' | 'start' | 'end' | 'center' | 'stretch';
    place: Join<'content', 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'> | Join<'items' | 'self', 'auto' | 'start' | 'end' | 'center' | 'stretch'>;
    p: FromTheme<'padding'>;
    py: FromTheme<'padding'>;
    px: FromTheme<'padding'>;
    pt: FromTheme<'padding'>;
    pr: FromTheme<'padding'>;
    pb: FromTheme<'padding'>;
    pl: FromTheme<'padding'>;
    m: Negatable<FromTheme<'margin'>>;
    my: Negatable<FromTheme<'margin'>>;
    mx: Negatable<FromTheme<'margin'>>;
    mt: Negatable<FromTheme<'margin'>>;
    mr: Negatable<FromTheme<'margin'>>;
    mb: Negatable<FromTheme<'margin'>>;
    ml: Negatable<FromTheme<'margin'>>;
    space: Negatable<Join<'x' | 'y', FromTheme<'space'>>> | Join<'x' | 'y', 'reverse'>;
    w: FromTheme<'width'>;
    min: Join<'w', FromTheme<'minWidth'>> | Join<'h', FromTheme<'minHeight'>>;
    max: Join<'w', FromTheme<'maxWidth'>> | Join<'h', FromTheme<'maxHeight'>>;
    h: FromTheme<'height'>;
    font: FromTheme<'fontFamily'> | FromTheme<'fontWeight'> | 'italic' | 'not-italic';
    text: FromTheme<'fontSize'> | 'left' | 'right' | 'center' | 'justify' | FromTheme<'textColor'> | Join<'opacity', FromTheme<'textOpacity'>> | 'underline' | 'no-underline' | 'line-through' | 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
    antialiased: '';
    'subpixel-antialiased': '';
    italic: '';
    'not-italic': '';
    'normal-nums': '';
    ordinal: '';
    'slashed-zero': '';
    'lining-nums': '';
    'oldstyle-nums': '';
    'proportional-nums': '';
    'tabular-nums': '';
    'diagonal-fractions': '';
    'stacked-fractions': '';
    tracking: FromTheme<'letterSpacing'>;
    leading: FromTheme<'lineHeight'>;
    list: 'item' | 'inside' | 'outside' | 'none' | 'disc' | 'circle' | 'sqaure' | 'decimal' | 'decimal-leading-zero' | Join<'lower' | 'upper', 'roman' | 'greek' | 'alpha' | 'latin'> | FromTheme<'listStyleType'>;
    placeholder: FromTheme<'placeholderColor'> | Join<'opacity', FromTheme<'placeholderOpacity'>>;
    underline: '';
    'no-underline': '';
    'line-through': '';
    uppercase: '';
    lowercase: '';
    capitalize: '';
    'normal-case': '';
    truncate: '';
    align: 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super';
    whitespace: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
    break: 'normal' | 'words' | 'all';
    bg: 'fixed' | 'local' | 'scroll' | Join<'clip', 'border' | 'padding' | 'content' | 'text'> | FromTheme<'backgroundColor'> | Join<'opacity', FromTheme<'backgroundOpacity'>> | Join<'' | 'left' | 'right' | 'center', '' | 'bottom' | 'top' | 'center'> | FromTheme<'backgroundPosition'> | 'no-repeat' | Join<'repeat', '' | 'x' | 'y' | 'round' | 'space'> | Join<'gradient-to', Corners> | FromTheme<'backgroundImage'> | FromTheme<'backgroundSize'>;
    from: FromTheme<'gradientColorStops'>;
    via: FromTheme<'gradientColorStops'>;
    to: FromTheme<'gradientColorStops'>;
    rounded: Join<'' | Corners, FromTheme<'borderRadius'>>;
    border: Join<'' | Edges, FromTheme<'borderWidth'>> | FromTheme<'borderColor'> | Join<'opacity', FromTheme<'borderOpacity'>> | BorderStyle | 'collapse' | 'separate';
    divide: Join<'x' | 'y', 'reverse' | FromTheme<'divideWidth'>> | FromTheme<'divideColor'> | Join<'opacity', FromTheme<'divideOpacity'>> | BorderStyle;
    ring: 'inset' | FromTheme<'ringWidth'> | FromTheme<'ringColor'> | Join<'opacity', FromTheme<'ringOpacity'>> | Join<'offset', FromTheme<'ringOffsetWidth'> | FromTheme<'ringOffsetColor'>>;
    shadow: FromTheme<'boxShadow'>;
    opacity: FromTheme<'opacity'>;
    table: '' | 'caption' | 'cell' | 'column' | Join<'column' | 'footer' | 'header' | 'row', 'group'> | 'row' | 'auto' | 'fixed';
    transition: FromTheme<'transitionProperty'>;
    duration: FromTheme<'durations'>;
    ease: FromTheme<'transitionTimingFunction'>;
    delay: FromTheme<'transitionDelay'>;
    animate: FromTheme<'animation'>;
    transform: '' | 'gpu' | 'none';
    origin: 'center' | Join<'' | 'top' | 'bottom', '' | 'right' | 'left'>;
    rotate: Negatable<FromTheme<'rotate'>>;
    scale: Join<'' | 'x' | 'y', FromTheme<'scale'>>;
    skew: Negatable<Join<'' | 'x' | 'y', FromTheme<'skew'>>>;
    translate: Negatable<Join<'' | 'x' | 'y', FromTheme<'translate'>>>;
    appearance: 'none' | 'auto' | 'menulist-button' | 'textfield';
    cursor: FromTheme<'cursor'> | 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'help' | 'not-allowed' | 'none' | 'context-menu' | 'progress' | 'cell' | 'crosshair' | 'vertical-text' | 'alias' | 'copy' | 'no-drop' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
    outline: FromTheme<'outline'>;
    'pointer-events': 'auto' | 'none';
    resize: 'none' | 'x' | 'y' | '';
    select: 'none' | 'auto' | 'text' | 'contain' | 'all';
    fill: FromTheme<'fill'>;
    stroke: FromTheme<'stroke'> | FromTheme<'strokeWidth'>;
    'sr-only': '';
    'not-sr-only': '';
    filter: '' | 'none';
    blur: FromTheme<'blur'>;
    brightness: FromTheme<'brightness'>;
    contrast: FromTheme<'contrast'>;
    grayscale: FromTheme<'grayscale'>;
    'hue-rotate': Negatable<FromTheme<'hueRotate'>>;
    invert: FromTheme<'invert'>;
    saturate: FromTheme<'saturate'>;
    sepia: FromTheme<'sepia'>;
    'drop-shadow': FromTheme<'dropShadow'>;
    backdrop: Join<'filter', '' | 'none'> | Join<'blur', FromTheme<'backdropBlur'>> | Join<'brightness', FromTheme<'backdropBrightness'>> | Join<'contrast', FromTheme<'backdropContrast'>> | Join<'grayscale', FromTheme<'backdropGrayscale'>> | Join<'hue-rotate', Negatable<FromTheme<'backdropHueRotate'>>> | Join<'invert', FromTheme<'backdropInvert'>> | Join<'opacity', FromTheme<'backdropOpacity'>> | Join<'saturate', FromTheme<'backdropSaturate'>> | Join<'sepia', FromTheme<'backdropSepia'>>;
    'mix-blend': BlendMode;
    'bg-blend': BlendMode;
}
declare type ToString<T> = T extends string ? T : T extends number ? `${T}` : never;
declare type JoinFromObject<T, Separator extends string = '-'> = {
    [P in keyof T]: Join<ToString<P>, ToString<T[P]>, Separator>;
}[keyof T];
/** For adding additional variants */
interface Variants {
}
/** For adding additional plugins */
interface Plugins {
}
declare type CoreCompletionTokens = `${FromTheme<'screens'>}:` | `${'' | 'not-'}${SimplePseudoClasses}:` | `${Join<'group', '' | Interpolate<'string'>>}-${SimplePseudoClasses}:` | `${SimplePseudoElements}::` | `${CoreVariants}:` | JoinFromObject<CorePlugins>;
declare type UserCompletionTokens = {
    [K in keyof Variants]: `${ToString<K>}:`;
}[keyof Variants] | JoinFromObject<Plugins>;
declare type CompletionTokens = CoreCompletionTokens | UserCompletionTokens;

interface Apply {
    (strings: TemplateStringsArray, ...interpolations: Token[]): Directive<CSSRules>;
    (...tokens: Token[]): Directive<CSSRules>;
}
declare const apply: Apply;

declare const tw: TW;
declare const setup: (options?: Configuration | undefined) => void;

/**
 * Returns an optimized and cached function for use with `tw`.
 *
 * `tw` caches rules based on the function identity. This helper caches
 * the function based on the data.
 *
 * @param factory to use when the directive is invoked
 * @param data to use
 */
declare const directive: <Data, T>(factory: (data: Data, context: Context) => MaybeThunk<T>, data: Data) => Directive<T>;

declare const create: (config?: Configuration | undefined) => Instance;

declare const mode: (report: (message: string) => void) => Mode;
declare const warn: Mode;
declare const strict: Mode;
declare const silent: Mode;

declare const noprefix: Prefixer;
declare const autoprefix: Prefixer;

/**
 * Creates an sheet which inserts style rules through the CSS Object Model.
 */
declare const cssomSheet: ({ nonce, target, }?: SheetConfig<CSSStyleSheet>) => Sheet<CSSStyleSheet>;
/**
 * An sheet placeholder which performs no operations. Useful for avoiding errors in a non-browser environment.
 */
declare const voidSheet: () => Sheet<null>;

declare const theme: ThemeHelper;

declare const cyrb32: Hasher;

export { Apply, BlendMode, BorderStyle, CSSAtKeyframes, CSSAtMedia, CSSAtSupports, CSSCustomProperties, CSSProperties, CSSPseudos, CSSRuleValue, CSSRules, CSSRulesThunk, CSSSimplePseudos, CompletionTokens, Configuration, Context, CoreCompletionTokens, CorePlugins, CoreVariants, Corners, CounterStyle, DarkMode, Directive, DirectiveHandler, Edges, Empty, Falsy, FontFace, FromTheme, GlobalValue, Hasher, InlineDirective, Instance, Interpolate, InterpolateKind, Join, JoinFromObject, MaybeArray, MaybeThunk, Mode, Negatable, NonEmptyString, Plugin, Plugins, Prefixer, Preflight, Range, ReportInfo, Rule, Sheet, SheetConfig, SheetInit, SheetInitCallback, SimplePseudoClasses, SimplePseudoElements, TW, TWCallable, Theme, ThemeColor, ThemeColorObject, ThemeConfiguration, ThemeContainer, ThemeFontSize, ThemeHelper, ThemeOutline, ThemeResolver, ThemeScreen, ThemeScreenValue, ThemeSection, ThemeSectionRecord, ThemeSectionResolver, ThemeSectionResolverContext, ThemeSectionType, ToString, Token, TokenGrouping, TypescriptCompat, Unwrap, UserCompletionTokens, Variants, apply, autoprefix, create, cssomSheet, directive, cyrb32 as hash, mode, noprefix, setup, silent, strict, theme, tw, voidSheet, warn };
//# sourceMappingURL=twind.d.ts.map
