import { type TwindConfig, TwindUserConfig } from "@twind/core";
import { Handler } from "../deps";
/**
 * Core install twind.
 * @example
 * install(config);
 */
export declare const install: (config?: TwindConfig | TwindUserConfig, isProduction?: boolean) => any;
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
export declare const useTwindServer: (opts?: InlineOptions) => void;
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
export declare const twindServer: (opts?: InlineOptions) => Handler;
export default useTwindServer;
