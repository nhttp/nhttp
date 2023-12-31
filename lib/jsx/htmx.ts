import { type Handler, TRet } from "../deps.ts";
import { internal, options } from "./render.ts";
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
export const useHtmx = (
  opts: Options = {},
) => {
  if (internal.htmx) return;
  internal.htmx = true;
  opts.src ??= "//unpkg.com/htmx.org";
  options.initHead += `<script src="${opts.src}"></script>`;
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
export const htmx = (opts: Options = {}): Handler => {
  useHtmx(opts);
  return void 0 as TRet;
};
