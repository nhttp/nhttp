import { type TwindConfig, TwindUserConfig } from "@twind/core";
import { Handler } from "../deps";
/**
 * Core install twind.
 * @example
 * install(config);
 */
export declare const install: (config?: TwindConfig | TwindUserConfig, isProduction?: boolean) => any;
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
export declare const useTwindStream: (opts?: InlineOptions) => void;
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
