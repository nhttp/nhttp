import type { NJSX } from "./types.ts";
import type { Handler } from "../deps.ts";
import { createHookScript } from "./hook.ts";
import { internal } from "./render.ts";
/**
 * useTwind.
 * @deprecated
 * use `app.use(twind());` instead.
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
  createHookScript(opts);
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
  opts.src ??= "//cdn.twind.style";
  return (rev, next) => {
    createHookScript(opts, rev);
    return next();
  };
};

export default useTwind;
