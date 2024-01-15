import TwindStream from "https://esm.sh/v132/@twind/with-react@1.1.3/readableStream";
import { options } from "./render.ts";
import type { Handler, TRet } from "../deps.ts";
import {
  type InlineOptions,
  install,
  onRenderElement,
} from "./twind-server.ts";

/**
 * Core install twind.
 * @example
 * install(config);
 */
install();
export { install };
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
  { htmx, ...opts }: InlineOptions & { htmx?: boolean } = {},
): void => {
  const writeStream = options.onRenderStream;
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
  const writeElem = onRenderElement({ htmx, ...opts });
  return { writeStream, writeElem } as TRet;
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
  return async (_rev, next) => {
    const { writeStream, writeElem } = useTwindStream(opts) as TRet;
    await next();
    options.onRenderStream = writeStream;
    options.onRenderElement = writeElem;
  };
};

export default useTwindStream;
