import { EngineOptions, FetchEvent, FetchHandler, Handlers, ListenOptions, NextFunction, RetHandler, TApp, TObject, TRet } from "./types";
import Router, { TRouter } from "./router";
import { RequestEvent } from "./request_event";
export declare class NHttp<Rev extends RequestEvent = RequestEvent> extends Router<Rev> {
    private parseQuery;
    private env;
    private flash?;
    private stackError;
    private bodyParser?;
    private parseMultipart?;
    private alive;
    private track;
    server: TRet;
    constructor({ parseQuery, bodyParser, env, flash, stackError }?: TApp);
    /**
     * global error handling.
     * @example
     * app.onError((err, { response }) => {
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
    on<T extends unknown = unknown>(method: string, path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * engine - add template engine.
     * @example
     * app.engine(ejs.renderFile, { base: "public", ext: "ejs" });
     *
     * app.get("/", async ({ response }) => {
     *   await response.render("index", { title: "hello ejs" });
     * });
     */
    engine(render: ((...args: TRet) => TRet) & {
        directly?: boolean;
    }, opts?: EngineOptions): void;
    matchFns(rev: RequestEvent, path: string): import("./types").Handler<Rev>[];
    /**
     * handle
     * @example
     * Deno.serve(app.handle);
     * // or
     * Bun.serve({ fetch: app.handle });
     */
    handle: FetchHandler;
    /**
     * handleEvent
     * @example
     * addEventListener("fetch", (event) => {
     *   event.respondWith(app.handleEvent(event))
     * });
     */
    handleEvent: (evt: FetchEvent) => Response | Promise<Response>;
    private closeServer;
    private buildListenOptions;
    /**
     * Mock request.
     * @example
     * app.get("/", () => "hello");
     * app.post("/", () => "hello, post");
     *
     * // mock request
     * const hello = await app.req("/").text();
     * assertEquals(hello, "hello");
     *
     * // mock request POST
     * const hello_post = await app.req("/", { method: "POST" }).text();
     * assertEquals(hello_post, "hello, post");
     */
    req(url: string, init?: RequestInit): {
        text: () => Promise<string>;
        json: () => Promise<any>;
        ok: () => Promise<boolean>;
        status: () => Promise<number>;
        res: () => Response | Promise<Response>;
    };
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
    listen(options: number | ListenOptions, callback?: (err: Error | undefined, opts: ListenOptions) => void | Promise<void>): Promise<any>;
    private acceptConn;
    private handleHttp;
    private _onError;
    private _on404;
}
/**
 * inital app.
 * @example
 * const app = nhttp();
 */
export declare function nhttp<Rev extends RequestEvent = RequestEvent>(opts?: TApp): NHttp<Rev>;
export declare namespace nhttp {
    var Router: <Rev extends RequestEvent<TObject> = RequestEvent<TObject>>(opts?: TRouter) => Router<Rev>;
}
