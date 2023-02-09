import { Handler, RequestEvent, TRet } from "./deps";
type TOptsSendFile = {
    weak?: boolean;
    stat?: (...args: TRet) => TRet;
    readFile?: (...args: TRet) => TRet;
};
export declare function sendFile(rev: RequestEvent, pathFile: string, opts?: TOptsSendFile): Promise<void>;
export declare const etag: (opts?: {
    weak?: boolean;
}) => Handler;
export {};
