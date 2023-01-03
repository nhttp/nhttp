import { FetchEvent, Handlers, ListenOptions, NextFunction, RetHandler, TApp, TObject, TRet } from "./types";
import Router from "./router";
import { RequestEvent } from "./request_event";
export declare class NHttp<Rev extends RequestEvent = RequestEvent> extends Router<Rev> {
    private parseQuery;
    private multipartParseQuery?;
    private bodyParser;
    private env;
    private flash?;
    private stackError;
    server: TRet;
    /**
     * handleEvent
     * @example
     * addEventListener("fetch", (event) => {
     *   event.respondWith(app.handleEvent(event))
     * });
     */
    handleEvent: (event: FetchEvent, info?: TRet, ctx?: TRet) => TRet;
    /**
     * handle
     * @example
     * await Deno.serve(app.handle, { port: 3000 });
     * // or
     * Bun.serve({ fetch: app.handle });
     */
    handle: (request: Request, info?: TRet, ctx?: TRet) => TRet;
    constructor({ parseQuery, bodyParser, env, flash, stackError }?: TApp);
    /**
     * global error handling.
     * @example
     * app.onError((error, rev) => {
     *     return rev.response.send(error.message);
     * })
     */
    onError(fn: (err: TObject, rev: Rev, next: NextFunction) => RetHandler): this;
    /**
     * global not found error handling.
     * @example
     * app.on404((rev) => {
     *     return rev.response.send(`route ${rev.url} not found`);
     * })
     */
    on404(fn: (rev: Rev, next: NextFunction) => RetHandler): this;
    on<T>(method: string, path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    private is404;
    private handleRequest;
    /**
     * listen the server
     * @example
     * app.listen(3000);
     * app.listen({ port: 3000, hostname: 'localhost' });
     * app.listen({
     *    port: 443,
     *    cert: "./path/to/localhost.crt",
     *    key: "./path/to/localhost.key",
     *    alpnProtocols: ["h2", "http/1.1"]
     * }, callback);
     */
    listen(opts: number | ListenOptions, callback?: (err?: Error, opts?: ListenOptions) => void | Promise<void>): Promise<void>;
    private _onError;
    private _on404;
    private handleConn;
}
/**
 * inital app.
 * @example
 * const app = nhttp();
 */
export declare function nhttp<Rev extends RequestEvent = RequestEvent>(opts?: TApp): NHttp<Rev>;
