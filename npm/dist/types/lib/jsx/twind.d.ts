import { Handler, TRet } from "../deps";
type Options = {
    src?: string;
    [k: string]: TRet;
};
/**
 * useTwind.
 * @example
 *
 * useTwind();
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export declare const useTwind: (opts?: Options) => void;
/**
 * twind.
 * @example
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.use(twind());
 */
export declare const twind: (opts?: Options) => Handler;
export default useTwind;
