import { ROUTE } from "./constant.ts";
import { JSON_TYPE } from "./constant.ts";
import { findParams } from "./router.ts";
import {
  s_body,
  s_body_used,
  s_cookies,
  s_file,
  s_headers,
  s_params,
  s_path,
  s_query,
  s_res,
  s_response,
  s_route,
  s_search,
  s_url,
} from "./symbol.ts";
import { MatchRoute, TObject, TRet, TSendBody } from "./types.ts";
import { getReqCookies, getUrl, toPathx } from "./utils.ts";
import { HttpError } from "./error.ts";
import { HttpResponse } from "./http_response.ts";

export type TResp = (
  r: TRet,
) => Promise<void> | undefined | Response | void;
type TInfo = {
  conn: Partial<Deno.Conn>;
  env: TObject;
  context: TObject;
};
export class RequestEvent {
  constructor(
    /**
     * Original {@linkcode Request}.
     * The request from the client in the form of the web platform {@linkcode Request}.
     */
    public request: Request,
    private _info?: TObject,
    private _ctx?: TObject,
  ) {
    this.method = request.method;
  }
  /**
   * response as HttpResponse
   */
  get response(): HttpResponse {
    if (this._ctx && typeof this._ctx === "function") {
      return this[s_res] ??= (this._ctx as TRet)(
        this._info,
        this.send.bind(this),
      );
    }
    return this[s_res] ??= new HttpResponse(this.send.bind(this));
  }

  /**
   * lookup self route
   */
  get route(): MatchRoute {
    if (this[s_route]) return this[s_route];
    let path = this.path;
    if (path !== "/" && path[path.length - 1] === "/") {
      path = path.slice(0, -1);
    }
    const ret = ROUTE[this.method]?.find((o: TObject) =>
      o.pattern?.test(path) || o.path === path
    );
    if (ret) {
      if (!ret.pattern) {
        Object.assign(ret, toPathx(ret.path, true));
      }
      ret.method = this.method;
      ret.query = this.query;
      ret.params = findParams(ret, path);
    }
    return this[s_route] ??= ret ?? {};
  }
  /**
   * lookup Object info like `conn / env / context`.
   */
  get info(): TInfo {
    const flag = typeof this._ctx === "function";
    const info = flag ? {} : (this._info ?? {});
    const context = flag ? {} : (this._ctx ?? {});
    return { conn: info, env: info, context };
  }
  /**
   * This method tells the event dispatcher that work is ongoing.
   * It can also be used to detect whether that work was successful.
   * @example
   * const cache = await caches.open("my-cache");
   * app.get("/", async (rev) => {
   *   let resp = await cache.match(rev.request);
   *   if (!resp) {
   *     const init = rev.response.init;
   *     resp = new Response("Hello, World", init);
   *     resp.headers.set("Cache-Control", "max-age=86400, public");
   *     rev.waitUntil(cache.put(rev.request, resp.clone()));
   *   }
   *   rev.respondWith(resp);
   * });
   */
  waitUntil(promise: Promise<TRet>) {
    if (promise instanceof Promise) {
      promise.catch(console.error);
      return;
    }
    throw new HttpError(500, `${promise} is not a Promise.`);
  }
  /**
   * The method to be used to respond to the event. The response needs to
   * either be an instance of {@linkcode Response} or a promise that resolves
   * with an instance of `Response`.
   */
  respondWith(r: Response | PromiseLike<Response>): void | Promise<void> {
    this[s_response] = r;
  }
  /**
   * send body
   * @example
   * rev.send("hello");
   * rev.send({ name: "john" });
   * // or
   * rev.response.send("hello");
   * rev.response.send({ name: "john" });
   */
  send(body?: TSendBody): void {
    if (typeof body === "string") {
      this[s_response] = new Response(body, this[s_res]?.init);
    } else if (body instanceof Response) {
      this[s_response] = body;
    } else if (typeof body === "object") {
      if (
        body === null ||
        body instanceof Uint8Array ||
        body instanceof ReadableStream ||
        body instanceof Blob
      ) {
        this[s_response] = new Response(<TRet> body, this[s_res]?.init);
      } else {
        const init = this[s_res]?.init ?? {};
        if (init.headers) {
          const type = "content-type";
          if (init.headers instanceof Headers) {
            init.headers.set(type, init.headers.get(type) ?? JSON_TYPE);
          } else {
            init.headers[type] ??= JSON_TYPE;
          }
        } else {
          init.headers = { "content-type": JSON_TYPE };
        }
        this[s_response] = new Response(JSON.stringify(body), init);
      }
    } else {
      this[s_response] = new Response(<TRet> body, this[s_res]?.init);
    }
  }
  /**
   * Lookup responseInit.
   */
  get responseInit(): ResponseInit {
    return this[s_res]?.init ?? {};
  }
  /**
   * search.
   * @example
   * const search = rev.search;
   * console.log(search);
   */
  get search() {
    return this[s_search] ?? null;
  }
  set search(val: string | null) {
    this[s_search] = val;
  }
  /**
   * bodyUsed.
   * @example
   * const bodyUsed = rev.bodyUsed;
   * console.log(bodyUsed);
   */
  get bodyUsed() {
    return this[s_body_used] ?? this.request?.bodyUsed ?? false;
  }
  set bodyUsed(val: boolean) {
    this[s_body_used] = val;
  }
  /**
   * bodyValid.
   * @example
   * const bodyValid = rev.bodyValid;
   * console.log(bodyValid);
   */
  get bodyValid() {
    if (this.request.url[0] !== "/") {
      if (this.request.body) return true;
      return false;
    }
    return true;
  }
  /**
   * params as json object.
   * @example
   * // get "/hello/john/john"
   * const params = rev.params;
   * console.log(params);
   */
  get params() {
    return this[s_params] ??= this.__params?.() ?? {};
  }
  set params(val: TObject) {
    this[s_params] = val;
  }
  /**
   * url
   * @example
   * // get "/hello?name=john" in browser.
   * const url = rev.url;
   * console.log(url);
   * // => /hello?name=john
   */
  get url() {
    return this[s_url] ??= this.originalUrl;
  }
  set url(val: string) {
    this[s_url] = val;
  }
  /**
   * originalUrl
   * @example
   * // get "/hello?name=john" in browser.
   * const url = rev.originalUrl;
   * console.log(url);
   * // => /hello?name=john
   */
  get originalUrl() {
    if (this.request.url[0] !== "/") {
      return getUrl(this.request.url);
    }
    return this.request.url;
  }
  /**
   * lookup path
   * @example
   * // get "/hello" in browser.
   * const path = rev.path;
   * console.log(path);
   * // => /hello
   */
  get path() {
    return this[s_path] ??= this.url;
  }
  set path(val: string) {
    this[s_path] = val;
  }
  /**
   * lookup query parameter
   * @example
   * // get "/hello?name=john" in browser.
   * const query = rev.query;
   * console.log(query);
   * // => { name: "john" }
   */
  get query() {
    return this[s_query] ??= this.__parseQuery?.(this.search?.substring(1)) ??
      {};
  }
  set query(val: TObject) {
    this[s_query] = val;
  }
  /**
   * body as json object.
   * @example
   * const body = rev.body;
   * console.log(body);
   */
  get body() {
    return this[s_body] ??= {};
  }
  set body(val: TObject) {
    this[s_body] = val;
  }
  /**
   * headers.
   * @example
   * const type = rev.headers.get("content-type");
   * console.log(type);
   */
  get headers() {
    return this[s_headers] ??= this.request.headers;
  }
  set headers(val: Headers) {
    this[s_headers] = val;
  }
  /**
   * Http request method.
   * @example
   * const method = rev.method;
   * console.log(method);
   */
  method: string;
  /**
   * file.
   * @example
   * const file = rev.file;
   * console.log(file);
   */
  get file() {
    return this[s_file] ??= {};
  }
  set file(val: TObject) {
    this[s_file] = val;
  }
  /**
   * get cookies from request.
   * @example
   * const cookie = rev.cookies;
   * console.log(cookie);
   */
  get cookies() {
    return this[s_cookies] ??= getReqCookies(this.request.headers, true);
  }
  set cookies(val: TObject) {
    this[s_cookies] = val;
  }
  /**
   * get cookies from request
   * @deprecated
   * Use `rev.cookies` instead. `rev.cookies`, auto decode if cookie is encode.
   * @example
   * const object = rev.getCookies();
   * const objectWithDecode = rev.getCookies(true);
   */
  getCookies(decode?: boolean) {
    return getReqCookies(this.headers, decode);
  }

  [Symbol.for("Deno.customInspect")](inspect: TRet) {
    const ret = {
      body: this.body,
      bodyUsed: this.bodyUsed,
      bodyValid: this.bodyValid,
      cookies: this.cookies,
      file: this.file,
      headers: this.headers,
      info: this.info,
      method: this.method,
      originalUrl: this.originalUrl,
      params: this.params,
      path: this.path,
      query: this.query,
      request: this.request,
      responseInit: this.responseInit,
      respondWith: this.respondWith,
      response: this.response,
      route: this.route,
      search: this.search,
      send: this.send,
      url: this.url,
      waitUntil: this.waitUntil,
    };
    return `${this.constructor.name} ${inspect(ret)}`;
  }

  [k: string | symbol]: TRet;
}
