import jwts from "jwt-simple";
import { type Handler, HttpError, type RequestEvent, type TObject, type TRet } from "./deps";
import type { NextFunction } from "../mod";
import { type TDecorator } from "./controller";
declare global {
    namespace NHTTP {
        interface RequestEvent {
            /**
             * auth. result from `jwt` middleware.
             */
            auth: TObject;
        }
    }
}
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
    encode: any;
    decode: any;
};
export declare function Jwt(secretOrOptions: string | TOptions): TDecorator;
export default jwt;
