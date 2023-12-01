import type { RequestEvent, TRet } from "../deps";
import { JSXNode } from "./index";
import { isValidElement } from "./is-valid-element";
export { isValidElement };
type TOptionsRender = {
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
};
/**
 * renderToString.
 * @example
 * const str = renderToString(<App />);
 */
export declare const renderToString: (elem: JSXNode<any>) => string;
export declare const options: TOptionsRender;
export type RenderHTML = ((...args: TRet) => TRet) & {
    check: (elem: TRet) => boolean;
};
/**
 * render to html in `app.engine`.
 * @example
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export declare const renderToHtml: RenderHTML;
