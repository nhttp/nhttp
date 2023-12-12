import {
  inline,
  type InlineOptions,
  install as installOri,
  type TwindConfig,
  TwindUserConfig,
} from "https://esm.sh/v132/@twind/core@1.1.3";
import TwindStream from "https://esm.sh/v132/@twind/with-react@1.1.3/readableStream";
import presetAutoprefix from "https://esm.sh/v132/@twind/preset-autoprefix@1.0.7";
import presetTailwind from "https://esm.sh/v132/@twind/preset-tailwind@1.1.4";
import { options } from "./render.ts";

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
  opts?: InlineOptions,
) => {
  const writeHtml = options.onRenderHtml;
  const writeStream = options.onRenderStream;
  options.onRenderHtml = (html, rev) => {
    return writeHtml(inline(html, opts), rev);
  };
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
};

export default useTwind;
