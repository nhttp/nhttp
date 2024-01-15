import type { Handler } from "../deps";
import { type InlineOptions, install } from "./twind-server";
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
export declare const useTwindStream: ({ htmx, ...opts }?: any) => void;
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
export declare const twindStream: (opts?: InlineOptions) => Handler;
export default useTwindStream;
