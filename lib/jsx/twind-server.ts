import {
  extract,
  inline,
  type InlineOptions,
  install as installOri,
  type TwindConfig,
  TwindUserConfig,
} from "https://esm.sh/v132/@twind/core@1.1.3";
import presetAutoprefix from "https://esm.sh/v132/@twind/preset-autoprefix@1.0.7";
import presetTailwind from "https://esm.sh/v132/@twind/preset-tailwind@1.1.4";
import { options } from "./render.ts";
import type { Handler, TRet } from "../deps.ts";

export type { InlineOptions };

export function onRenderElement(
  { htmx, ...opts }: InlineOptions & { htmx?: boolean } = {},
) {
  const hxRequest = htmx ?? true;
  const writeElem = options.onRenderElement;
  options.onRenderElement = async (elem, rev) => {
    let str = await writeElem(elem, rev);
    if (hxRequest && rev.hxRequest) {
      const { html, css } = extract(str, opts.tw);
      str = `<style>${css}</style>${html}`;
    }
    return str;
  };
  return writeElem;
}
/**
 * Core install twind.
 * @example
 * install(config);
 */
export const install = (
  config: TwindConfig | TwindUserConfig = {},
  isProduction?: boolean,
) => {
  return installOri({
    presets: [presetAutoprefix(), presetTailwind()],
    ...config,
  } as TwindUserConfig, isProduction);
};
install();

/**
 * useTwindServer.
 * @example
 *
 * useTwindServer();
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export const useTwindServer = (
  { htmx, ...opts }: InlineOptions & { htmx?: boolean } = {},
): void => {
  const hxRequest = htmx ?? true;
  const writeHtml = options.onRenderHtml;
  const writeElem = onRenderElement({ htmx: hxRequest, ...opts });
  options.onRenderHtml = (html, rev) => {
    return writeHtml(
      hxRequest && rev.hxRequest ? html : inline(html, opts),
      rev,
    );
  };
  return { writeHtml, writeElem } as TRet;
};

/**
 * twindServer.
 * @example
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.use(twindServer());
 */
export const twindServer = (opts?: InlineOptions): Handler => {
  return async (_rev, next) => {
    const { writeElem, writeHtml } = useTwindServer(opts) as TRet;
    await next();
    options.onRenderHtml = writeHtml;
    options.onRenderElement = writeElem;
  };
};

export default useTwindServer;
