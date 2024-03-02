import type { NJSX } from "./types.ts";
import type { Handler } from "../deps.ts";
import { createHookScript } from "./hook.ts";

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
export const htmx = (opts: NJSX.ScriptHTMLAttributes = {}): Handler => {
  opts.src ??= "https://unpkg.com/htmx.org@1.9.10";
  return (rev, next) => {
    rev.hxRequest = rev.headers.has("hx-request");
    createHookScript(opts, rev);
    return next();
  };
};
