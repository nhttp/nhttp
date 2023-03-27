import jwts from "jwt-simple";
import { Handler, HttpError, RequestEvent, TRet } from "./deps";
import { NextFunction } from "../mod";
declare class UnauthorizedError extends HttpError {
    constructor(message?: string);
}
type TOptions = {
    algorithm?: jwts.TAlgorithm;
    noVerify?: boolean;
    credentials?: boolean;
    getToken?: (rev: RequestEvent) => string | Promise<string>;
    propertyName?: string;
    onExpired?: (err: UnauthorizedError, rev: RequestEvent, next: NextFunction) => TRet;
};
export declare const jwt: {
    (secret: string, opts?: TOptions): Handler;
    encode: typeof jwts.encode;
    decode: typeof jwts.decode;
};
export default jwt;
