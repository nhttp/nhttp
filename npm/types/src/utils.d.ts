import { RequestEvent } from "./request_event";
import { Cookie, Handler, TObject, TRet } from "./types";
export declare const encoder: TextEncoder;
export declare const decoder: TextDecoder;
type EArr = [string, string | TObject];
export declare const decURIComponent: (str?: string) => string;
export declare function findFn(fn: TRet): any;
export declare function findFns<Rev extends RequestEvent = RequestEvent>(arr: TObject[]): Handler<Rev>[];
export declare function toBytes(arg: string | number): number;
export declare function toPathx(path: string | RegExp, flag?: boolean): {
    pattern: RegExp;
    wild: boolean;
    path: RegExp;
} | {
    pattern?: undefined;
    wild?: undefined;
    path?: undefined;
} | {
    pattern: RegExp;
    path: string;
    wild: boolean;
};
export declare function needPatch(data: TObject | TObject[], keys: number[], value: string): string | TObject;
export declare function myParse(arr: EArr[]): TObject;
export declare function parseQueryArray(query: string): TObject;
export declare function parseQuery(query?: null | string | FormData): any;
export declare function concatRegexp(prefix: string | RegExp, path: RegExp): RegExp;
/**
 * Wrapper middleware for framework express like (req, res, next)
 * @deprecated
 * auto added to `NHttp.use`
 * @example
 * ...
 * import cors from "https://esm.sh/cors?no-check";
 * import helmet from "https://esm.sh/helmet?no-check";
 * ...
 * app.use(expressMiddleware([
 *    cors(),
 *    helmet(),
 * ]));
 */
export declare function expressMiddleware(...middlewares: TRet): TRet;
export declare function middAssets(str: string): Handler<RequestEvent>[];
export declare function pushRoutes(str: string, wares: Handler[], last: TObject, base: TObject): void;
export declare const getUrl: (s: string) => string;
export declare function serializeCookie(name: string, value: string, cookie?: Cookie): string;
export declare function getReqCookies(headers: TObject, decode?: boolean, i?: number): Record<string, string>;
export declare function memoBody(req: Request, body: TRet): void;
export declare function arrayBuffer(req: Request): Promise<ArrayBuffer>;
export {};
