import type { NJSX } from "./types";
import type { Handler } from "../deps";
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
export declare const useHtmx: (opts?: NJSX.ScriptHTMLAttributes) => void;
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
export declare const htmx: (opts?: NJSX.ScriptHTMLAttributes) => Handler;
