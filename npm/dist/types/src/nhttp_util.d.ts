import { RequestEvent } from "./request_event";
import { FetchHandler, ListenOptions, NextFunction, TRet } from "./types";
export declare const awaiter: (rev: RequestEvent) => Promise<any>;
export declare const onNext: (ret: TRet, rev: RequestEvent, next: NextFunction) => Promise<any>;
export declare function buildListenOptions(this: TRet, opts: number | ListenOptions): {
    opts: ListenOptions;
    handler: FetchHandler;
};
