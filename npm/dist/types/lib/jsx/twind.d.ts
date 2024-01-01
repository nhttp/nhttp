import type { NJSX } from "./types";
import type { Handler } from "../deps";
/**
 * useTwind.
 * @example
 *
 * useTwind();
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export declare const useTwind: (opts?: NJSX.ScriptHTMLAttributes) => void;
/**
 * twind.
 * @example
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.use(twind());
 */
export declare const twind: (opts?: NJSX.ScriptHTMLAttributes) => Handler;
export default useTwind;
