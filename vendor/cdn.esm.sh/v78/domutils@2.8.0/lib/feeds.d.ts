import type { Node } from "https://cdn.esm.sh/v78/domhandler@4.3.1/lib/index.d.ts";
export declare type FeedItemMediaMedium = "image" | "audio" | "video" | "document" | "executable";
export declare type FeedItemMediaExpression = "sample" | "full" | "nonstop";
export interface FeedItemMedia {
    medium: FeedItemMediaMedium | undefined;
    isDefault: boolean;
    url?: string;
    fileSize?: number;
    type?: string;
    expression?: FeedItemMediaExpression;
    bitrate?: number;
    framerate?: number;
    samplingrate?: number;
    channels?: number;
    duration?: number;
    height?: number;
    width?: number;
    lang?: string;
}
export interface FeedItem {
    id?: string;
    title?: string;
    link?: string;
    description?: string;
    pubDate?: Date;
    media: FeedItemMedia[];
}
export interface Feed {
    type: string;
    id?: string;
    title?: string;
    link?: string;
    description?: string;
    updated?: Date;
    author?: string;
    items: FeedItem[];
}
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */
export declare function getFeed(doc: Node[]): Feed | null;
//# sourceMappingURL=feeds.d.ts.map
