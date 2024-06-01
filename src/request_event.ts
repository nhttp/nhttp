// request_event.ts
import {
  s_body,
  s_cookies,
  s_file,
  s_headers,
  s_init,
  s_method,
  s_new_req,
  s_ori_url,
  s_params,
  s_path,
  s_query,
  s_res,
  s_response,
  s_route,
  s_search,
  s_undefined,
  s_url,
} from "./symbol.ts";
import type {
  CreateRequest,
  FetchHandler,
  MatchRoute,
  TObject,
  TRet,
  TSendBody,
} from "./types.ts";
import { getUrl, toPathx } from "./utils.ts";
import { HttpError } from "./error.ts";
import { HttpResponse } from "./http_response.ts";
import { deno_inspect, node_inspect, revInspect } from "./inspect.ts";
import { getReqCookies } from "./cookie.ts";

type TInfo<T> = {
  conn: T;
  context: TObject;
};
/**
 * `interface` RequestEvent.
 */
export interface RequestEvent {
  /**
   * send data to log. `requires logger middlewares`
   */
  log: (data: TRet) => void;
  /**
   * generate token CSRF. requires `csrf` middleware.
   */
  csrfToken: () => string;
  /**
   * verify token CSRF. requires `csrf` middleware.
   */
  csrfVerify: (value?: string) => boolean;
  /**
   * auth. requires `jwt` middleware.
   */
  auth: TObject;
  /**
   * check if `HX-Request`. requires `htmx` middleware.
   */
  hxRequest: boolean;
}
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
    let route = this.__routePath;
    if (route === void 0) {
      route = this.__path ?? this.path;
      if (route !== "/" && route[route.length - 1] === "/") {
        route = route.slice(0, -1);
      }
    }
    return this[s_route] ??= {
      path: route,
      method: this.method,
      pathname: this.path,
      query: this.query,
      params: this.params,
      get pattern() {
        return toPathx(this.path, true).pattern;
      },
      wild: route.includes("*"),
    };
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
    const info = (this.request as TRet)._info;
    return {
      conn: <TRet> info?.conn ?? {},
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
  waitUntil = (promise: Promise<TRet>): void => {
    if (promise instanceof Promise) {
      const ctx = (this.request as TRet)._info?.ctx;
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
  send(body?: TSendBody, lose?: number): void | Promise<void> {
    if (typeof body === "string") {
      this[s_response] = new Response(body, this[s_init]);
    } else if (
      body instanceof Response || body?.constructor?.name === "Response"
    ) {
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
  get search(): string | null {
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
  get params(): TObject {
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
  get url(): string {
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
  get originalUrl(): string {
    return this[s_ori_url] ??= getUrl(this.request.url);
  }
  set originalUrl(val: string) {
    this[s_ori_url] = val;
  }
  /**
   * lookup path
   * @example
   * // get "/hello" in browser.
   * const path = rev.path;
   * console.log(path);
   * // => /hello
   */
  get path(): string {
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
  get query(): TObject {
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
  get body(): TObject {
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
  get headers(): Headers {
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
  get method(): string {
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
  get file(): TObject {
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
  get cookies(): TObject {
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
   * force returning undefined without `408`.
   */
  undefined = (): void => {
    this[s_undefined] = true;
  };
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
  /**
   * custom inspect for Deno.
   */
  [deno_inspect](inspect: TRet, opts: TRet): string {
    const ret = revInspect(this);
    return `${this.constructor.name} ${inspect(ret, opts)}`;
  }
  /**
   * custom inspect for Node.
   */
  [node_inspect](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ): string {
    opts.depth = depth;
    const ret = revInspect(this);
    return `${this.constructor.name} ${
      inspect?.(ret, opts) ?? Deno.inspect(ret)
    }`;
  }
  [k: string | symbol]: TRet;
}
/**
 * Fast return new Response.
 */
export function toRes(body?: TSendBody): TRet {
  if (typeof body === "string") return new Response(body);
  if (
    body instanceof Response || body?.constructor?.name === "Response"
  ) return body;
  if (typeof body === "object") {
    if (
      body === null ||
      body instanceof Uint8Array ||
      body instanceof ReadableStream ||
      body instanceof Blob
    ) return new Response(<TRet> body);
    return Response.json(body);
  }
  if (typeof body === "number") return new Response(body.toString());
  return body === void 0 ? void 0 : new Response(<TRet> body);
}
/**
 * create new Request.
 */
export function createRequest(
  handle: FetchHandler,
  url: string,
  init: RequestInit = {},
): CreateRequest {
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
