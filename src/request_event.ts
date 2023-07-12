import { ROUTE } from "./constant.ts";
import { findParams } from "./router.ts";
import {
  s_body,
  s_cookies,
  s_file,
  s_headers,
  s_init,
  s_method,
  s_new_req,
  s_params,
  s_path,
  s_query,
  s_res,
  s_response,
  s_route,
  s_search,
  s_url,
} from "./symbol.ts";
import { FetchHandler, MatchRoute, TObject, TRet, TSendBody } from "./types.ts";
import { getUrl, toPathx } from "./utils.ts";
import { HttpError } from "./error.ts";
import { HttpResponse } from "./http_response.ts";
import { deno_inspect, node_inspect, revInspect } from "./inspect.ts";
import { getReqCookies } from "./cookie.ts";

type TInfo<T> = {
  conn: T;
  env: TObject;
  context: TObject;
};

export class RequestEvent<O extends TObject = TObject> {
  constructor(
    /**
     * Original {@linkcode Request}.
     * The request from the client in the form of the web platform {@linkcode Request}.
     */
    public request: Request,
  ) {}
  /**
   * response as HttpResponse
   */
  get response(): HttpResponse {
    return this[s_res] ??= new HttpResponse(
      this.send.bind(this),
      this[s_init] = {},
    );
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
      ret.pathname = this.path;
      ret.query = this.query;
      ret.params = findParams(ret, path);
    }
    return this[s_route] ??= ret ?? {};
  }
  /**
   * lookup Object info like `conn / env / context`.
   * requires `showInfo` flags.
   * @example
   * ```ts
   * app.get("/", (rev) => {
   *   console.log(rev.info);
   *   return "foo";
   * });
   *
   * app.listen({ port: 8000, showInfo: true });
   * ```
   */
  get info(): TInfo<O> {
    const info = this.request._info;
    return {
      conn: <TRet> info?.conn ?? {},
      env: info?.conn ?? {},
      context: info?.ctx ?? {},
    };
  }
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
  waitUntil = (promise: Promise<TRet>) => {
    if (promise instanceof Promise) {
      const ctx = this.request._info?.ctx;
      if (typeof ctx?.waitUntil === "function") {
        ctx.waitUntil(promise);
        return;
      }
      promise.catch(console.error);
      return;
    }
    throw new HttpError(500, `${promise} is not a Promise.`);
  };
  /**
   * The method to be used to respond to the event. The response needs to
   * either be an instance of {@linkcode Response} or a promise that resolves
   * with an instance of `Response`.
   */
  respondWith = (r: Response | PromiseLike<Response>): void | Promise<void> => {
    this[s_response] = r;
  };
  /**
   * send body
   * @example
   * rev.send("hello");
   * rev.send({ name: "john" });
   * // or
   * rev.response.send("hello");
   * rev.response.send({ name: "john" });
   */
  send(body?: TSendBody, lose?: number): void {
    if (typeof body === "string") {
      this[s_response] = new Response(body, this[s_init]);
    } else if (body instanceof Response) {
      this[s_response] = body;
    } else if (typeof body === "object") {
      if (
        body === null ||
        body instanceof Uint8Array ||
        body instanceof ReadableStream ||
        body instanceof Blob
      ) {
        this[s_response] = new Response(<TRet> body, this[s_init]);
      } else {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore: Temporary workaround for send json
        this[s_response] = Response.json(body, this[s_init]);
      }
    } else if (typeof body === "number") {
      this[s_response] = new Response(body.toString(), this[s_init]);
    } else if (!lose) {
      this[s_response] ??= new Response(<TRet> body, this[s_init]);
    }
  }
  /**
   * Lookup responseInit.
   */
  get responseInit(): ResponseInit {
    return this[s_init] ?? {};
  }
  /**
   * search.
   * @example
   * const search = rev.search;
   * console.log(search);
   */
  get search() {
    return this[s_search] ??= null;
  }
  set search(val: string | null) {
    this[s_search] = val;
  }
  /**
   * params as json object.
   * @example
   * // get "/hello/john/john"
   * const params = rev.params;
   * console.log(params);
   */
  get params() {
    return this[s_params] ??= {};
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
    return getUrl(this.request.url);
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
    return this[s_query] ??= this.__parseQuery?.(this[s_search].substring(1)) ??
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
  get method() {
    return this[s_method] ??= this.request.method;
  }
  set method(val: string) {
    this[s_method] = val;
  }
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
   * invoke self RequestEvent
   */
  requestEvent = (): RequestEvent => this;
  /**
   * clone new Request.
   * @example
   * const request = rev.newRequest;
   */
  get newRequest(): Request {
    if (this[s_new_req] !== void 0) return this[s_new_req];
    const init: TObject = {};
    init.method = this.method;
    if (["GET", "HEAD"].includes(this.method) === false) {
      init.body = this.__nbody ?? JSON.stringify(this.body);
    }
    init.headers = {};
    this.headers.forEach((v, k) => {
      if (!v.includes("multipart/form-data")) {
        init.headers[k] = v;
      }
    });
    return this[s_new_req] = new Request(this.request.url, init);
  }

  [deno_inspect](inspect: TRet, opts: TRet) {
    const ret = revInspect(this);
    return `${this.constructor.name} ${inspect(ret, opts)}`;
  }
  [node_inspect](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ) {
    opts.depth = depth;
    const ret = revInspect(this);
    return `${this.constructor.name} ${
      inspect?.(ret, opts) ?? Deno.inspect(ret)
    }`;
  }
  [k: string | symbol]: TRet;
}
export function toRes(body?: TSendBody): TRet {
  if (typeof body === "string") return new Response(body);
  if (body instanceof Response) return body;
  if (typeof body === "object") {
    if (
      body === null ||
      body instanceof Uint8Array ||
      body instanceof ReadableStream ||
      body instanceof Blob
    ) return new Response(<TRet> body);
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore: Temporary workaround for send json
    return Response.json(body);
  }
  if (typeof body === "number") return new Response(body.toString());
  return body === void 0 ? void 0 : new Response(<TRet> body);
}
export function createRequest(
  handle: FetchHandler,
  url: string,
  init: RequestInit = {},
) {
  const res = () => {
    return handle(
      new Request(
        url[0] === "/" ? "http://127.0.0.1:8787" + url : url,
        init,
      ),
    );
  };
  return {
    text: async () => await (await res()).text(),
    json: async () => await (await res()).json(),
    ok: async () => (await res()).ok,
    status: async () => (await res()).status,
    res,
  };
}
