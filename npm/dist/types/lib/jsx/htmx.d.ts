import { type Handler } from "../deps";
type Options = {
    src?: string;
};
/**
 * useHtmx.
 * @example
 *
 * useHtmx();
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export declare const useHtmx: (opts?: Options) => void;
/**
 * htmx.
 * @example
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.use(htmx());
 */
export declare const htmx: (opts?: Options) => Handler;
export {};
