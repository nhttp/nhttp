import type { RequestEvent } from "./request_event";
import type { Handler, TBodyParser, TQueryFunc, TRet } from "./types";
export declare const isTypeBody: (a: string, b: string) => boolean;
export declare const getType: (req: TRet) => any;
export declare function writeBody(rev: RequestEvent, type: string, opts?: TBodyParser, parseQuery?: TQueryFunc): Promise<void>;
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc): Handler;
