import jwts from "jwt-simple";
import { Handler, HttpError, RequestEvent, TRet } from "./deps";
import { NextFunction } from "../mod";
import { TDecorator } from "./controller";
declare class UnauthorizedError extends HttpError {
    constructor(message?: string);
}
type TOptions = {
    secret: string;
    algorithm?: jwts.TAlgorithm;
    noVerify?: boolean;
    credentials?: boolean;
    getToken?: (rev: RequestEvent) => string | Promise<string>;
    propertyName?: string;
    onExpired?: (err: UnauthorizedError, rev: RequestEvent, next: NextFunction) => TRet;
    onAuth?: Handler;
};
/**
 * jwt middleware.
 * @example
 * app.get("/admin", jwt({ secret: "my_secret" }), ...handlers);
 */
export declare const jwt: {
    (secretOrOptions: string | TOptions): Handler | Handler[];
    encode: typeof jwts.encode;
    decode: typeof jwts.decode;
};
export declare function Jwt(secretOrOptions: string | TOptions): TDecorator;
export default jwt;
