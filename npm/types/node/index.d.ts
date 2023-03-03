import { TRet } from "../index";
type FetchHandler = (req: TRet) => Promise<TRet>;
export declare function serveNode(handler: FetchHandler, createServer: TRet, config?: TRet): any;
export {};
