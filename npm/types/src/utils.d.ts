import { RequestEvent } from "./request_event";
import { Cookie, Handler, TObject, TRet } from "./types";
export declare const encoder: TextEncoder;
export declare const decoder: TextDecoder;
type EArr = [string, string | TObject];
export declare const decURI: (str: string) => string;
export declare const decURIComponent: (str: string) => string;
export declare function findFn(fn: TRet): any;
export declare function findFns(arr: TObject[]): Handler[];
export declare function toBytes(arg: string | number): number;
export declare function toPathx(path: string | RegExp, isAny: boolean): {
    pathx: RegExp;
    wild: boolean;
    path?: undefined;
} | {
    pathx?: undefined;
    wild?: undefined;
    path?: undefined;
} | {
    pathx: RegExp;
    path: string;
    wild: boolean;
};
export declare function needPatch(data: TObject | TObject[], keys: number[], value: string): string | TObject;
export declare function myParse(arr: EArr[]): TObject;
export declare function parseQuery(query: unknown | string): TObject;
export declare function concatRegexp(prefix: string | RegExp, path: RegExp): RegExp;
/**
 * Wrapper middleware for framework express like (req, res, next)
 * @deprecated
 * auto added to Nhttp.use
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
export declare function getPos(url: string): number;
export declare function getUrl(url: string, pos?: number): string;
export declare function serializeCookie(name: string, value: string, cookie?: Cookie): string;
export declare function getReqCookies(req: Request, decode?: boolean, i?: number): Record<string, string>;
export declare const list_status: Record<number, string>;
export {};
