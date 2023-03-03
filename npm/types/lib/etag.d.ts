import { Handler, RequestEvent, TRet } from "./deps";
export interface TOptsSendFile {
    weak?: boolean;
    stat?: (...args: TRet) => TRet;
    readFile?: (...args: TRet) => TRet;
    etag?: boolean;
}
export declare function getContentType(path: string): string;
export declare function sendFile(rev: RequestEvent, pathFile: string, opts?: TOptsSendFile): Promise<any>;
export declare const etag: (opts?: {
    weak?: boolean;
}) => Handler;
