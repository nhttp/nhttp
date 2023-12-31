import { internal, options } from "./render.ts";
import { Handler, TRet } from "../deps.ts";
type Options = {
  src?: string;
  [k: string]: TRet;
};
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
  opts: Options = {},
) => {
  if (internal.twind) return;
  internal.twind = true;
  opts.src ??= "//cdn.twind.style";
  options.initHead += `<script src="${opts.src}" crossorigin></script>`;
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
export const twind = (opts: Options = {}): Handler => {
  useTwind(opts);
  return void 0 as TRet;
};

export default useTwind;
