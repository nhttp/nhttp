declare global {
    export namespace Deno {
        interface Conn {
        }
        interface HttpConn {
        }
    }
}
import { NHttp as BaseApp } from "./src/nhttp";
import { RequestEvent, TApp } from "./src/index";
import Router, { TRouter } from "./src/router";
export declare class NHttp<Rev extends RequestEvent = RequestEvent> extends BaseApp<Rev> {
    private handleWorkers;
    private handleNode;
    constructor(opts?: TApp);
    private handleRequestNode;
}
export declare function nhttp<Rev extends RequestEvent = RequestEvent>(opts?: TApp): NHttp<Rev>;
export declare namespace nhttp {
    var Router: <Rev extends RequestEvent = RequestEvent>(opts?: TRouter) => Router<Rev>;
}
export * from "./src/index";
