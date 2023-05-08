import { TRet } from "../index";
import { FetchHandler, ListenOptions } from "../src/types";
export declare function handleNode(handler: FetchHandler, req: TRet, res: TRet): void;
export declare function serveNode(handler: FetchHandler, opts?: ListenOptions): Promise<any>;
