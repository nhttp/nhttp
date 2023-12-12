import type { RequestEvent, TRet } from "../deps";
import { FC, JSXNode } from "./index";
import { isValidElement } from "./is-valid-element";
export { isValidElement };
export declare const options: TOptionsRender;
export declare const mutateAttr: Record<string, string>;
export declare function writeHtml(body: string, write: (data: string) => void): Promise<void>;
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
     * jsx transform precompile.
     */
    precompile?: boolean;
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
};
export type RenderHTML = ((...args: TRet) => TRet) & {
    check: (elem: TRet) => boolean;
};
export declare function escapeHtml(str: string, force?: boolean): string;
export declare const toStyle: (val: Record<string, string | number>) => string;
/**
 * renderToString.
 * @example
 * const str = await renderToString(<App />);
 */
export declare function renderToString(elem: JSXNode<TRet>): Promise<string>;
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
/**
 * render to ReadableStream in `app.engine`.
 * @example
 * ```tsx
 * const app = nhttp();
 *
 * app.engine(renderToReadableStream);
 *
 * app.get("/", () => {
 *   return <h1>hello</h1>;
 * });
 * ```
 */
export declare const renderToReadableStream: RenderHTML;
