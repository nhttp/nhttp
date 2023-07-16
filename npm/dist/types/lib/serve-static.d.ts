import { NextFunction, RequestEvent } from "./deps";
import { sendFile as sendFileEtag, TOptsSendFile } from "./etag";
interface StaticOptions extends TOptsSendFile {
    index?: string;
    redirect?: boolean;
    prefix?: string;
    spa?: boolean;
}
export declare const sendFile: typeof sendFileEtag;
export declare function serveStatic(dir: string | URL, opts?: StaticOptions): (rev: RequestEvent, next: NextFunction) => Promise<any>;
export default serveStatic;
