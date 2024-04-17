import type { RequestEvent } from "./request_event";
import type { Handler, RetHandler, TObject, TRet } from "./types";
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
export declare function parseQuery(query: undefined | null | string | FormData): any;
export declare function concatRegexp(prefix: string | RegExp, path: RegExp): RegExp;
export declare function middAssets(str: string): Handler[];
export declare function pushRoutes(str: string, wares: Handler[], last: TObject, base: TObject): void;
export declare const getUrl: (s: string) => string;
export declare const defError: (err: TObject, rev: RequestEvent, stack: boolean) => RetHandler;
export {};
