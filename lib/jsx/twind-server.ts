import {
  inline,
  type InlineOptions,
  install as installOri,
  type TwindConfig,
  TwindUserConfig,
} from "https://esm.sh/v132/@twind/core@1.1.3";
import presetAutoprefix from "https://esm.sh/v132/@twind/preset-autoprefix@1.0.7";
import presetTailwind from "https://esm.sh/v132/@twind/preset-tailwind@1.1.4";
import { options } from "./render.ts";
import type { Handler } from "../deps.ts";

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
  opts?: InlineOptions,
) => {
  const writeHtml = options.onRenderHtml;
  options.onRenderHtml = (html, rev) => {
    return writeHtml(inline(html, opts), rev);
  };
  return writeHtml;
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
    const last = useTwindServer(opts);
    await next();
    options.onRenderHtml = last;
  };
};

export default useTwindServer;
