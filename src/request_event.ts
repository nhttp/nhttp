import { HttpResponse } from "./http_response.ts";
import { TObject, TRet } from "./types.ts";
import { getReqCookies, getUrl, list_status } from "./utils.ts";

export type RespondWith = (
  r: Response | Promise<Response>,
) => Promise<void> | Response;

export class RequestEvent {
  respondWith!: RespondWith;
  constructor(public request: Request) {}

  get response(): HttpResponse {
    return this.res ?? (this.res = new HttpResponse(this.respondWith));
  }

  /**
   * lookup info responseInit.
   * @example
   * const { headers, status, statusText } = rev.responseInit;
   * console.log(headers, status, statusText);
   */
  get responseInit(): ResponseInit {
    const init = this.res?.init ?? {};
    const status = init.status ?? 200;
    const headers = init.headers instanceof Headers
      ? init.headers
      : new Headers(init.headers ?? {});
    const statusText = list_status[status];
    return { headers, status, statusText };
  }

  /**
   * search.
   * @example
   * const search = rev.search;
   * console.log(search);
   */
  get search() {
    return this._search ?? null;
  }
  set search(val: string | null) {
    this._search = val;
  }
  /**
   * file.
   * @example
   * const file = rev.file;
   * console.log(file);
   */
  get file() {
    return this._file ?? (this._file = {});
  }
  set file(val: TObject) {
    this._file = val;
  }
  /**
   * get cookies from request.
   * @example
   * const cookie = rev.cookies;
   * console.log(cookie);
   */
  get cookies() {
    return this._cookies ?? (this._cookies = getReqCookies(this.request, true));
  }
  set cookies(val: TObject) {
    this._cookies = val;
  }
  /**
   * params as json object.
   * @example
   * // get "/hello/:name/:user"
   * const params = rev.params;
   * console.log(params);
   * // => { name: "john", user: "john" }
   */
  get params() {
    return this._params ?? (this._params = this.__params?.() || {});
  }
  set params(val: TObject) {
    this._params = val;
  }
  /**
   * body as json object.
   * @example
   * const body = rev.body;
   * console.log(body);
   */
  get body() {
    return this._body ?? (this._body = {});
  }
  set body(val: TObject) {
    this._body = val;
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
    return this._url ?? (this._url = getUrl(this.request.url));
  }
  set url(val: string) {
    this._url = val;
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
    return this._path ?? this.url;
  }
  set path(val: string) {
    this._path = val;
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
    return this._query ?? (this._query = {});
  }
  set query(val: TObject) {
    this._query = val;
  }
  /**
   * get cookies from request
   * @deprecated
   * Use `rev.cookies` instead. `rev.cookies`, auto decode when cookie is encode.
   * @example
   * const object = rev.getCookies();
   * const objectWithDecode = rev.getCookies(true);
   */
  getCookies!: (decode?: boolean) => TObject;

  [k: string]: TRet;
}
