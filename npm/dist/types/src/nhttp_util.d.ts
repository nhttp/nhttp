import { RequestEvent } from "./request_event";
import { ListenOptions, NextFunction, TRet } from "./types";
export declare const awaiter: (rev: RequestEvent) => Promise<any>;
export declare const onNext: (ret: TRet, rev: RequestEvent, next: NextFunction) => any;
export declare function buildListenOptions(this: TRet, opts: number | ListenOptions): {
    opts: ListenOptions;
    isSecure: boolean;
};
export declare function closeServer(this: TRet): void;
