import {
  type InlineOptions,
  install as installOri,
  type TwindConfig,
  TwindUserConfig,
} from "https://esm.sh/v132/@twind/core@1.1.3";
import TwindStream from "https://esm.sh/v132/@twind/with-react@1.1.3/readableStream";
import presetAutoprefix from "https://esm.sh/v132/@twind/preset-autoprefix@1.0.7";
import presetTailwind from "https://esm.sh/v132/@twind/preset-tailwind@1.1.4";
import { internal, options } from "./render.ts";
import { Handler, TRet } from "../deps.ts";

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
 * useTwindStream.
 * @example
 *
 * useTwindStream();
 *
 * const app = nhttp();
 *
 * app.engine(renderToReadableStream);
 */
export const useTwindStream = (
  opts?: InlineOptions,
) => {
  if (internal.twindStream) return;
  internal.twindStream = true;
  const writeStream = options.onRenderStream;
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
};

/**
 * twindStream.
 * @example
 *
 * const app = nhttp();
 *
 * app.engine(renderToReadableStream);
 *
 * app.use(twindStream());
 */
export const twindStream = (opts?: InlineOptions): Handler => {
  useTwindStream(opts);
  return void 0 as TRet;
};

export default useTwindStream;
