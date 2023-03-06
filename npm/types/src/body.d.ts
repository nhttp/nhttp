import { Handler, TBodyParser, TQueryFunc, TRet } from "./types";
export declare function memoBody(req: Request, body: TRet): void;
type CType = "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
export declare function acceptContentType(headers: Headers, cType: CType): boolean;
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc, parseMultipart?: TQueryFunc): Handler;
export {};
