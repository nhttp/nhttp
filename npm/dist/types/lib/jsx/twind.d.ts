import { type InlineOptions, type TwindConfig, TwindUserConfig } from "@twind/core";
/**
 * Core install twind.
 * @example
 * install(config);
 */
export declare const install: (config?: TwindConfig | TwindUserConfig, isProduction?: boolean) => import("@twind/core").Twind<import("@twind/core").BaseTheme & {
    screens: Record<string, import("@twind/core").MaybeArray<import("@twind/core").ScreenValue>>;
    colors: Record<string, import("@twind/core").MaybeColorValue>;
}, unknown>;
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
