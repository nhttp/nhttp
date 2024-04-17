import { type InlineOptions, type TwindConfig, type TwindUserConfig } from "@twind/core";
import type { Handler } from "../deps";
export type { InlineOptions };
export declare function onRenderElement({ htmx, ...opts }?: InlineOptions & {
    htmx?: boolean;
}): (elem: JSX.Element, rev: import("../deps").RequestEvent<import("../deps").TObject>) => string | Promise<string>;
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
export declare const useTwindServer: ({ htmx, ...opts }?: any) => void;
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
