// stream.ts
/**
 * @module
 *
 * This module contains twind stream using ReadableStream.
 */
import TwindStream from "npm:@twind/with-react@1.1.3/readableStream";
import type { Handler, TRet } from "@nhttp/nhttp";
import { type InlineOptions, install } from "./server.ts";
import { getOptions, onRenderElement } from "./util.ts";

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
  const opt = getOptions();
  const writeStream = opt.onRenderStream;
  opt.onRenderStream = (stream, rev) => {
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
    const opt = getOptions();
    opt.onRenderStream = writeStream;
    opt.onRenderElement = writeElem;
  };
};

export default useTwindStream;
