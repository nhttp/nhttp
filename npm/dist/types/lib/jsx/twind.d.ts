import { type TwindConfig, TwindUserConfig } from "@twind/core";
/**
 * Core install twind.
 * @example
 * install(config);
 */
export declare const install: (config?: TwindConfig | TwindUserConfig, isProduction?: boolean) => any;
/**
 * useTwind.
 * @example
 * useTwind();
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export declare const useTwind: (opts?: InlineOptions) => void;
export default useTwind;
