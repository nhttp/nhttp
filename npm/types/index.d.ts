declare global {
    export namespace Deno {
        interface Conn {
        }
        interface HttpConn {
        }
    }
}
declare global {
    var bunServer: {
        reload: (...args: TRet) => TRet;
    };
    var NativeResponse: TRet;
    var NativeRequest: TRet;
}
import { NHttp as BaseApp } from "./src/nhttp";
import { RequestEvent, TApp, TRet } from "./src/index";
import Router, { TRouter } from "./src/router";
import { TMultipartUpload } from "./src/multipart";
export declare function shimNodeRequest(): void;
export declare class NHttp<Rev extends RequestEvent = RequestEvent> extends BaseApp<Rev> {
    constructor(opts?: TApp);
}
export declare const multipart: {
    createBody: (formData: FormData, { parse }?: {
        parse?: any;
    }) => any;
    upload: (opts: TMultipartUpload | TMultipartUpload[]) => import("./src/types").Handler<RequestEvent>;
};
export declare function nhttp<Rev extends RequestEvent = RequestEvent>(opts?: TApp): NHttp<Rev>;
export declare namespace nhttp {
    var Router: <Rev extends RequestEvent = RequestEvent>(opts?: TRouter) => Router<Rev>;
}
export * from "./src/index";
