import { RequestEvent } from "./request_event";
import { FetchHandler, ListenOptions, TRet } from "./types";
export declare const awaiter: (rev: RequestEvent) => Promise<any>;
export declare function buildListenOptions(this: TRet, opts: number | ListenOptions): {
    opts: ListenOptions;
    handler: FetchHandler;
};
