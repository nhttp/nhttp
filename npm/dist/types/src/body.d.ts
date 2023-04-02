import { Handler, TBodyParser, TQueryFunc, TRet } from "./types";
export declare const isTypeBody: (a: string, b: string) => boolean;
export declare function memoBody(req: Request, body: TRet, n?: number): void;
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc, parseMultipart?: TQueryFunc): Handler;
