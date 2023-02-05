import { EngineOptions, FetchEvent, Handlers, ListenOptions, NextFunction, RetHandler, TApp, TObject, TRet } from "./types";
import Router, { TRouter } from "./router";
import { RequestEvent } from "./request_event";
export declare class NHttp<Rev extends RequestEvent = RequestEvent> extends Router<Rev> {
    private parseQuery;
    private env;
    private flash?;
    private stackError;
    private bodyParser?;
    private parseMultipart?;
    server: TRet;
    /**
     * handleEvent
     * @example
     * addEventListener("fetch", (event) => {
     *   event.respondWith(app.handleEvent(event))
     * });
     */
    handleEvent: (event: FetchEvent) => TRet;
    /**
     * handle
     * @example
     * Deno.serve(app.handle);
     * // or
     * Bun.serve({ fetch: app.handle });
     */
    handle: (request: Request, conn?: TRet, ctx?: TRet) => TRet;
    constructor({ parseQuery, bodyParser, env, flash, stackError }?: TApp);
    /**
     * global error handling.
     * @example
     * app.onError((err, { res }) => {
     *    response.send(err.message);
     * })
     */
    onError(fn: (err: TObject, rev: Rev, next: NextFunction) => RetHandler): this;
    /**
     * global not found error handling.
     * @example
     * app.on404(({ response, url }) => {
     *    response.send(`route ${url} not found`);
     * })
     */
    on404(fn: (rev: Rev, next: NextFunction) => RetHandler): this;
    on<T>(method: string, path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * engine - add template engine.
     * @example
     * app.engine(ejs.renderFile, { base: "public", ext: "ejs" });
     *
     * app.get("/", async ({ response }) => {
     *   await response.render("index", { title: "hello ejs" });
     * });
     */
    engine(renderFile: (...args: TRet) => TRet, opts?: EngineOptions): void;
    matchFns(rev: RequestEvent, url: string): import("./types").Handler<Rev>[];
    private handleRequest;
    /**
     * listen the server
     * @example
     * app.listen(8000);
     * app.listen({ port: 8000, hostname: 'localhost' });
     * app.listen({
     *    port: 443,
     *    cert: "./path/to/localhost.crt",
     *    key: "./path/to/localhost.key",
     *    alpnProtocols: ["h2", "http/1.1"]
     * }, callback);
     */
    listen(opts: number | ListenOptions, callback?: (err: Error | undefined, opts: ListenOptions) => void | Promise<void>): Promise<void>;
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
export declare namespace nhttp {
    var Router: <Rev extends RequestEvent = RequestEvent>(opts?: TRouter) => Router<Rev>;
}
