import { type Handler, type RequestEvent, type TRet } from "./deps";
export interface TOptsSendFile {
    weak?: boolean;
    stat?: (...args: TRet) => TRet;
    readFile?: (...args: TRet) => TRet;
    etag?: boolean;
    setHeaders?: (rev: RequestEvent, pathFile: string, stat: TRet) => void;
}
export declare function getContentType(path: string): string;
export declare function sendFile(rev: RequestEvent, pathFile: string, opts?: TOptsSendFile): Promise<any>;
export type EtagOptions = {
    weak?: boolean;
    clone?: boolean;
};
/**
 * Etag middleware.
 * @example
 * app.use(etag());
 */
export declare const etag: ({ weak, clone }?: EtagOptions) => Handler;
export default etag;
