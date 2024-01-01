import type { NJSX } from "./types.ts";
import type { Handler } from "../deps.ts";
import { createHookLib } from "./hook.ts";
import { internal } from "./render.ts";
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
export const useTwind = (
  opts: NJSX.ScriptHTMLAttributes = {},
) => {
  if (internal.twind) return;
  internal.twind = true;
  opts.src ??= "//cdn.twind.style";
  createHookLib(opts);
};
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
export const twind = (opts: NJSX.ScriptHTMLAttributes = {}): Handler => {
  return (rev, next) => {
    opts.src ??= "//cdn.twind.style";
    createHookLib(opts, rev);
    return next();
  };
};

export default useTwind;
