// server.ts
/**
 * @module
 *
 * This module contains twind server.
 */
import {
  type BaseTheme,
  inline,
  type InlineOptions,
  install as installOri,
  type MaybeArray,
  type MaybeColorValue,
  type ScreenValue,
  type Twind,
  type TwindConfig,
  type TwindUserConfig,
} from "npm:@twind/core@1.1.3";
import presetAutoprefix from "npm:@twind/preset-autoprefix@1.0.7";
import presetTailwind from "npm:@twind/preset-tailwind@1.1.4";
import type { Handler, TRet } from "jsr:@nhttp/nhttp@^0.0.8";
import { getOptions, onRenderElement } from "./util.ts";

export type { InlineOptions };

/**
 * Core install twind.
 * @example
 * install(config);
 */
export const install = (
  config: TwindConfig | TwindUserConfig = {},
  isProduction?: boolean,
): Twind<
  BaseTheme & {
    screens: Record<string, MaybeArray<ScreenValue>>;
    colors: Record<string, MaybeColorValue>;
  },
  unknown
> => {
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
  const op = getOptions();
  const hxRequest = htmx ?? true;
  const writeHtml = op.onRenderHtml;
  const writeElem = onRenderElement({ htmx: hxRequest, ...opts });
  op.onRenderHtml = (html, rev) => {
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
    const op = getOptions();
    op.onRenderHtml = writeHtml;
    op.onRenderElement = writeElem;
  };
};

export default useTwindServer;
