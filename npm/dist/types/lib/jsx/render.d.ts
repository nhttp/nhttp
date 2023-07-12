import { type RequestEvent, TRet } from "../deps";
type TOptionsRender = {
    onRenderElement: (elem: TRet, rev: RequestEvent) => string | Promise<string>;
    onRenderHtml: (html: string, rev: RequestEvent) => string | Promise<string>;
};
export declare const renderToString: (elem: JSX.Element) => string;
export declare const options: TOptionsRender;
export type RenderHTML = ((...args: TRet) => TRet) & {
    check: (elem: TRet) => boolean;
};
export declare const renderToHtml: RenderHTML;
export {};
