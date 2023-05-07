import { FetchHandler, MatchRoute, TObject, TRet, TSendBody } from "./types";
import { HttpResponse } from "./http_response";
import { deno_inspect, node_inspect } from "./inspect";
type TInfo<T> = {
    conn: T;
    env: TObject;
    context: TObject;
};
export declare class RequestEvent<O extends TObject = TObject> {
    /**
     * Original {@linkcode Request}.
     * The request from the client in the form of the web platform {@linkcode Request}.
     */
    request: Request;
    private _info?;
    private _ctx?;
    constructor(
    /**
     * Original {@linkcode Request}.
     * The request from the client in the form of the web platform {@linkcode Request}.
     */
    request: Request, _info?: TObject, _ctx?: TObject);
    /**
     * response as HttpResponse
     */
    get response(): HttpResponse;
    /**
     * lookup self route
     */
    get route(): MatchRoute;
    /**
     * lookup Object info like `conn / env / context`.
     */
    get info(): TInfo<O>;
    /**
     * This method tells the event dispatcher that work is ongoing.
     * It can also be used to detect whether that work was successful.
     * @example
     * const cache = await caches.open("my-cache");
     * app.get("/", async (rev) => {
     *   let resp = await cache.match(rev.request);
     *   if (!resp) {
     *     const init = rev.responseInit;
     *     resp = new Response("Hello, World", init);
     *     resp.headers.set("Cache-Control", "max-age=86400, public");
     *     rev.waitUntil(cache.put(rev.request, resp.clone()));
     *   }
     *   rev.respondWith(resp);
     * });
     */
    waitUntil(promise: Promise<TRet>): void;
    /**
     * The method to be used to respond to the event. The response needs to
     * either be an instance of {@linkcode Response} or a promise that resolves
     * with an instance of `Response`.
     */
    respondWith(r: Response | PromiseLike<Response>): void | Promise<void>;
    /**
     * send body
     * @example
     * rev.send("hello");
     * rev.send({ name: "john" });
     * // or
     * rev.response.send("hello");
     * rev.response.send({ name: "john" });
     */
    send(body?: TSendBody, lose?: number): void;
    /**
     * Lookup responseInit.
     */
    get responseInit(): ResponseInit;
    /**
     * search.
     * @example
     * const search = rev.search;
     * console.log(search);
     */
    get search(): string | null;
    set search(val: string | null);
    /**
     * params as json object.
     * @example
     * // get "/hello/john/john"
     * const params = rev.params;
     * console.log(params);
     */
    get params(): TObject;
    set params(val: TObject);
    /**
     * url
     * @example
     * // get "/hello?name=john" in browser.
     * const url = rev.url;
     * console.log(url);
     * // => /hello?name=john
     */
    get url(): string;
    set url(val: string);
    /**
     * originalUrl
     * @example
     * // get "/hello?name=john" in browser.
     * const url = rev.originalUrl;
     * console.log(url);
     * // => /hello?name=john
     */
    get originalUrl(): string;
    /**
     * lookup path
     * @example
     * // get "/hello" in browser.
     * const path = rev.path;
     * console.log(path);
     * // => /hello
     */
    get path(): string;
    set path(val: string);
    /**
     * lookup query parameter
     * @example
     * // get "/hello?name=john" in browser.
     * const query = rev.query;
     * console.log(query);
     * // => { name: "john" }
     */
    get query(): TObject;
    set query(val: TObject);
    /**
     * body as json object.
     * @example
     * const body = rev.body;
     * console.log(body);
     */
    get body(): TObject;
    set body(val: TObject);
    /**
     * headers.
     * @example
     * const type = rev.headers.get("content-type");
     * console.log(type);
     */
    get headers(): Headers;
    set headers(val: Headers);
    /**
     * Http request method.
     * @example
     * const method = rev.method;
     * console.log(method);
     */
    get method(): string;
    set method(val: string);
    /**
     * file.
     * @example
     * const file = rev.file;
     * console.log(file);
     */
    get file(): TObject;
    set file(val: TObject);
    /**
     * get cookies from request.
     * @example
     * const cookie = rev.cookies;
     * console.log(cookie);
     */
    get cookies(): TObject;
    set cookies(val: TObject);
    /**
     * get cookies from request
     * @deprecated
     * Use `rev.cookies` instead. `rev.cookies` auto decode if cookie is encode.
     * @example
     * const object = rev.getCookies();
     * const objectWithDecode = rev.getCookies(true);
     */
    getCookies(decode?: boolean): Record<string, string>;
    [deno_inspect](inspect: TRet, opts: TRet): string;
    [node_inspect](depth: number, opts: TRet, inspect: TRet): string;
    [k: string | symbol]: TRet;
}
export declare function toRes(body?: TSendBody): any;
export declare function createRequest(handle: FetchHandler, url: string, init?: RequestInit): {
    text: () => Promise<string>;
    json: () => Promise<any>;
    ok: () => Promise<boolean>;
    status: () => Promise<number>;
    res: () => Response | Promise<Response>;
};
export {};
