import type { NJSX } from "./types";
import type { Handler } from "../deps";
declare global {
    namespace NHTTP {
        interface RequestEvent {
            /**
             * hxRequest. check if `HX-Request`.
             */
            hxRequest: boolean;
        }
    }
}
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
