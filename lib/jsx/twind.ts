// twind.ts
/**
 * @module
 *
 * This module contains twind.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import { renderToHtml } from "@nhttp/nhttp/jsx";
 * import { twind } from "@nhttp/nhttp/jsx/twind";
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml).use(twind());
 *
 * app.get("/me", () => {
 *    return <span className="mt-10">It's Me</span>;
 * });
 *
 * app.listen(8000);
 * ```
 */
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
  opts.src ??= "https://cdn.twind.style";
  opts.crossOrigin ??= "";
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
