import { Handler, Handlers, NextFunction, RequestEvent, TMultipartUpload, TObject, TRet } from "./deps";
export type TDecorator = TRet;
declare global {
    var NHttpMetadata: TRet;
}
type TStatus<Rev extends RequestEvent = RequestEvent> = (rev: Rev, next: NextFunction) => number | Promise<number>;
type THeaders<Rev extends RequestEvent = RequestEvent> = (rev: Rev, next: NextFunction) => TObject | Promise<TObject>;
type TString<Rev extends RequestEvent = RequestEvent> = (rev: Rev, next: NextFunction) => string | Promise<string>;
type TMethod = (path?: string | RegExp) => TDecorator;
export declare function addRoute(className: string, prop: string, handler: Handler, opts: {
    path?: string | RegExp;
    method: string;
}): void;
export declare function joinHandlers(className: TRet, prop: string, arr: TRet[]): void;
export declare function addMethod(method: string, path?: string | RegExp): TDecorator;
export declare function View(name: string | TString): TDecorator;
export declare function Jsx(): TDecorator;
export declare function Upload(options: TMultipartUpload): TDecorator;
export declare function Wares<Rev extends RequestEvent = RequestEvent>(...middlewares: Handlers<Rev> | {
    new (...args: TRet[]): TRet;
}[]): TDecorator;
export declare function Status(status: number | TStatus): TDecorator;
export declare function Type(name: string | TString, charset?: string): TDecorator;
export declare function Header(header: TObject | THeaders): TDecorator;
export declare function Inject(value?: TRet, ...args: TRet): TDecorator;
export declare const Get: TMethod;
export declare const Post: TMethod;
export declare const Put: TMethod;
export declare const Delete: TMethod;
export declare const Any: TMethod;
export declare const Options: TMethod;
export declare const Head: TMethod;
export declare const Trace: TMethod;
export declare const Connect: TMethod;
export declare const Patch: TMethod;
export declare function Controller(path?: string, ...middlewares: Handlers | {
    new (...args: TRet[]): TRet;
}[]): TDecorator;
export {};
