import { type NextFunction, type RequestEvent, type TRet } from "./deps";
import { sendFile as sendFileEtag, type TOptsSendFile } from "./etag";
export interface ServeStaticOptions extends TOptsSendFile {
    index?: string;
    redirect?: boolean;
    prefix?: string;
    spa?: boolean;
    readFile?: (...args: TRet) => TRet;
}
export declare const sendFile: typeof sendFileEtag;
/**
 * serve-static middleware.
 * @example
 * app.use(serveStatic("./my_dir", options));
 *
 * // prefix
 * app.use(serveStatic("./my_dir", { prefix: "/assets" }));
 * // or
 * // app.use("/assets", serveStatic("./my_dir"));
 */
export declare function serveStatic(dir: string | URL, opts?: ServeStaticOptions): (rev: RequestEvent, next: NextFunction) => Promise<any>;
export default serveStatic;
