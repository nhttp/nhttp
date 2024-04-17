import type { RequestEvent, TObject, TRet } from "../deps";
import { type FC, type HelmetRewind, type JSXNode, type NJSX } from "./index";
import { isValidElement } from "./is-valid-element";
export { isValidElement };
export type TOptionsRender = {
    /**
     * Attach on render element.
     * @example
     * options.onRenderElement = (elem, rev) => {
     *   const str = renderToString(elem);
     *   return str;
     * }
     */
    onRenderElement: (elem: JSX.Element, rev: RequestEvent) => string | Promise<string>;
    /**
     * Attach on render html.
     * @example
     * options.onRenderHtml = (html, rev) => {
     *   // code here
     *   return html;
     * }
     */
    onRenderHtml: (html: string, rev: RequestEvent) => string | Promise<string>;
    /**
     * Attach on render stream.
     * @example
     * options.onRenderStream = (stream, rev) => {
     *   // code here
     *   return stream;
     * }
     */
    onRenderStream: (stream: ReadableStream, rev: RequestEvent) => ReadableStream | Promise<ReadableStream>;
    /**
     * custom error on stream.
     * @example
     * ```tsx
     * options.onErrorStream = (props) => {
     *  return <h1>{props.error.message}</h1>
     * }
     * ```
     */
    onErrorStream?: FC<{
        error: Error;
    }>;
    /**
     * custom doc type.
     */
    docType?: string;
    /**
     * use context requestEvent. default to `true`.
     */
    requestEventContext: boolean;
    initHead?: string;
};
export declare const internal: TObject;
export declare const options: TOptionsRender;
export declare function toInitHead(a: string | undefined, b: string | undefined): string;
export declare const mutateAttr: Record<string, string>;
export declare const toAttr: (props?: TRet) => string;
export declare const toHtml: (body: string, { head, footer, attr }: HelmetRewind, initHead?: string) => Promise<string>;
export type RenderHTML = ((...args: TRet) => TRet) & {
    check: (elem: TRet) => boolean;
};
export declare function escapeHtml(str: string, force?: boolean): string;
export declare function toStyle(obj: NJSX.CSSProperties): string;
/**
 * renderToString.
 * @example
 * const str = await renderToString(<App />);
 */
export declare function renderToString(elem: JSXNode<TRet>): Promise<string>;
export declare function bodyWithHelmet(body: string, { title, footer }: HelmetRewind): Promise<string>;
/**
 * render to html in `app.engine`.
 * @example
 * ```tsx
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.get("/", () => {
 *   return <h1>hello</h1>;
 * });
 * ```
 */
export declare const renderToHtml: RenderHTML;
