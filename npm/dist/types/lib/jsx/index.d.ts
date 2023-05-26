type TRet = any;
declare global {
    namespace JSX {
        type Element = TRet;
        interface IntrinsicElements {
            [k: string]: TRet;
        }
    }
}
type JsxProps = {
    children?: TRet;
};
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => JSX.Element;
/**
 * Helmet
 * @deprecated
 * Move to `lib/jsx/helmet`.
 * ```ts
 * // Deno
 * import { Helmet } from "https://deno.land/x/nhttp@1.2.17/lib/jsx/helmet";
 *
 * // Node
 * import { Helmet } from "nhttp-land/jsx/helmet";
 * ```
 */
export declare const Helmet: ((props: any) => any) & {
    rewind: () => import("./helmet").HelmetRewind;
    render?: (elem: any) => string;
    writeHead?: () => string[];
    writeBody?: () => string[];
    htmlAttr?: () => string;
    bodyAttr?: () => string;
    setHead?: () => void;
};
/**
 * renderToHtml
 * @deprecated
 * Move to `lib/jsx/render`.
 * ```ts
 * // Deno
 * import { renderToHtml } from "https://deno.land/x/nhttp@1.2.17/lib/jsx/render";
 *
 * // Node
 * import { renderToHtml } from "nhttp-land/jsx/render";
 * ```
 */
export declare const renderToHtml: import("./render").RenderHTML;
/**
 * renderToString
 * @deprecated
 * Move to `lib/jsx/render`.
 * ```ts
 * // Deno
 * import { renderToString } from "https://deno.land/x/nhttp@1.2.17/lib/jsx/render";
 *
 * // Node
 * import { renderToString } from "nhttp-land/jsx/render";
 * ```
 */
export declare const renderToString: (elem: any) => string;
export declare const isValidElement: (elem: any) => boolean;
export declare function n(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace n {
    var Fragment: FC<unknown>;
}
export declare function h(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace h {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
export {};
