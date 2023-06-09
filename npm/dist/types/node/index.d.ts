import { TRet } from "../index";
import { FetchHandler, ListenOptions } from "../src/types";
export declare function mutateResponse(): void;
export declare function handleNode(handler: FetchHandler, req: TRet, res: TRet): Promise<void>;
export declare function serveNode(handler: FetchHandler, opts?: ListenOptions): Promise<any>;
