import { internal } from "./render.ts";
import type { NJSX } from "./types.ts";
import type { Handler } from "../deps.ts";
import { createHookLib } from "./hook.ts";
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
export const useHtmx = (
  opts: NJSX.ScriptHTMLAttributes = {},
) => {
  if (internal.htmx) return;
  internal.htmx = true;
  opts.src ??= "//unpkg.com/htmx.org";
  createHookLib(opts);
};

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
  internal.htmx = true;
  return (rev, next) => {
    opts.src ??= "//unpkg.com/htmx.org";
    createHookLib(opts, rev);
    return next();
  };
};
