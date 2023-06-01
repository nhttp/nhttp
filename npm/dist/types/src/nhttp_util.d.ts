import { RequestEvent } from "./request_event";
import { FetchHandler, ListenOptions, NextFunction, TRet } from "./types";
export declare const awaiter: (rev: RequestEvent) => Promise<any>;
export declare const onNext: (res: TRet, rev: RequestEvent, next: NextFunction) => any;
export declare function buildListenOptions(this: TRet, opts: number | ListenOptions): {
    opts: ListenOptions;
    isSecure: boolean;
    handler: FetchHandler;
};
export declare class HttpServer {
    listener: TRet;
    handle: FetchHandler;
    private alive;
    private track;
    constructor(listener: TRet, handle: FetchHandler);
    acceptConn(): Promise<void>;
    close(): void;
    handleHttp(httpConn: Deno.HttpConn, conn: Deno.Conn): Promise<void>;
}
