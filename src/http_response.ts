// http_response.ts
import { HTML_TYPE, JSON_TYPE, MIME_LIST } from "./constant.ts";
import { serializeCookie } from "./cookie.ts";
import { HttpError } from "./error.ts";
import { deno_inspect, node_inspect, resInspect } from "./inspect.ts";
import { s_params } from "./symbol.ts";
import type { Cookie, TObject, TRet, TSendBody } from "./types.ts";
const TYPE = "content-type";
const CHARSET = "; charset=";
/**
 * `type` ResInit.
 */
export type ResInit = {
  /**
   * http Headers.
   */
  headers?: TRet;
  /**
   * status code.
   */
  status?: number;
  /**
   * status text.
   */
  statusText?: string;
};
const isArray = Array.isArray;
/**
 * convert headers to array 2d `string[][]`.
 */
export const headerToArr = (obj = {} as TObject): string[][] => {
  const arr = [] as string[][];
  for (const k in obj) {
    arr.push([k, obj[k]]);
  }
  return arr;
};
const filterHeaders = (headers: string[][], key: string) => {
  return headers.filter((vals: string[]) => vals[0] !== key);
};
/**
 * `type` RetHeaders.
 */
type RetHeaders = {
  /**
   * append headers.
   */
  append: (key: string, value: string) => HttpResponse;
  /**
   * delete headers.
   */
  delete: (key: string) => void;
  /**
   * convert Headers to json.
   */
  toJSON: () => TObject;
};
const C_KEY = "set-cookie";
/**
 * `interface` HttpResponse.
 */
export interface HttpResponse {
  /**
   * render `requires app.engine configs`
   * @example
   * await response.render("index", {
   *   key: "value"
   * });
   * await response.render(<h1>Hello Jsx</h1>);
   */
  render: (
    fileOrElem: TRet,
    params?: TObject,
    ...args: TRet
  ) => Promise<void>;
}
/**
 * HttpResponse.
 */
export class HttpResponse {
  constructor(
    /**
     * send response body
     * @example
     * response.send("hello");
     * response.send({ name: "john" });
     */
    public send: (body?: TSendBody) => void | Promise<void>,
    /**
     * response init.
     */
    public init: ResInit,
  ) {}
  /**
   * setHeader
   * @example
   * response.setHeader("key", "value");
   */
  setHeader(key: string, value: string | string[]): this {
    key = key.toLowerCase();
    if (this.__isHeaders) {
      this.init.headers = filterHeaders(this.init.headers, key);
      this.init.headers.push([key, value]);
    } else {
      (this.init.headers ??= {})[key] = value;
    }
    return this;
  }
  /**
   * getHeader
   * @example
   * const str = response.getHeader("key");
   */
  getHeader(key: string): string | string[] | undefined {
    key = key.toLowerCase();
    if (this.__isHeaders) {
      const res = this.init.headers.filter((vals: string[]) => vals[0] === key)
        .map((
          vals: string[],
        ) => vals[1]);
      return res.length > 1 ? res : res[0];
    }
    return this.init.headers?.[key.toLowerCase()];
  }
  /**
   * set header or get header
   * @example
   * // set header
   * response.header("content-type", "text/css");
   * response.header({ "content-type": "text/css" });
   *
   * // get header
   * const type = response.header("content-type");
   *
   * // delete header
   * response.header().delete("content-type");
   *
   * // append header
   * response.header().append("key", "other-value");
   *
   * // get all header
   * const headers = response.header().toJSON();
   */
  header(key: string, value: string | string[]): this;
  header(key: string): string | string[] | undefined;
  header(key: TObject): this;
  header(): RetHeaders;
  header(
    key?: TObject | string,
    value?: string | string[],
  ): this | string | string[] | RetHeaders | undefined {
    if (typeof key === "string") {
      if (value === void 0) return this.getHeader(key);
      this.setHeader(key, value);
      return this;
    }
    if (typeof key === "object") {
      for (const k in key) this.setHeader(k, key[k]);
      return this;
    }
    return {
      delete: (k) => {
        k = k.toLowerCase();
        if (this.__isHeaders) {
          this.init.headers = filterHeaders(this.init.headers, k);
        } else {
          delete this.init.headers?.[k];
        }
      },
      append: (k, v) => {
        const cur = this.getHeader(k);
        this.setHeader(k, cur ? (cur + ", " + v) : v);
        return this;
      },
      toJSON: () => {
        if (this.__isHeaders) {
          const obj = {} as TObject;
          const arr = this.init.headers;
          for (let i = 0; i < arr.length; i++) {
            const [k, v] = arr[i];
            if (obj[k] !== void 0) obj[k] = [obj[k]].concat(v);
            else obj[k] = v;
          }
          return obj;
        }
        return this.init.headers ?? {};
      },
    };
  }
  /**
   * set status or get status
   * @example
   * // set status
   * response.status(200);
   *
   * // get status
   * const status = response.status();
   */
  status(code: number): this;
  status(): number;
  status(code?: number): this | number {
    if (code) {
      this.init.status = code;
      return this;
    }
    return (this.init.status ?? 200);
  }
  /**
   * sendStatus
   * @example
   * response.sendStatus(204);
   */
  sendStatus(code: number): void | Promise<void> {
    if (code > 511) code = 500;
    try {
      return this.status(code).send(code);
    } catch (_e) {
      return this.status(code).send(null);
    }
  }
  /**
   * attachment. create header content-disposition
   * @example
   * response.attachment("my_file.txt");
   * // or
   * response.attachment();
   */
  attachment(filename?: string): this {
    const c_dis = filename ? `attachment; filename=${filename}` : "attachment;";
    return this.header("content-disposition", c_dis);
  }

  /**
   * set/get statusCode
   * @example
   * // set status
   * response.statusCode = 200;
   *
   * // get status
   * const status = response.statusCode;
   */
  get statusCode(): number {
    return this.status();
  }
  set statusCode(val: number) {
    this.status(val);
  }
  /**
   * params as json object for `response.render`.
   * @example
   * app.get("/", async ({ response } ) => {
   *   response.params = { title: "Home" };
   *   await response.render("index");
   * });
   */
  get params(): TObject {
    return this[s_params] ??= {};
  }
  set params(val: TObject) {
    this[s_params] = val;
  }
  /**
   * shorthand for content-type headers
   * @example
   * response.type("html").send("<h1>hello, world</h1>");
   *
   * // with charset
   * response.type("html", "UTF-8").send("<h1>hello, world</h1>");
   */
  type(contentType: string, charset?: string): this {
    const type = MIME_LIST[contentType] ?? contentType;
    return this.header(
      "content-type",
      type + (charset && !type.includes(CHARSET) ? CHARSET + charset : ""),
    );
  }

  /**
   * shorthand for send html body
   * @example
   * response.html("<h1>Hello World</h1>");
   */
  html(html: string | Uint8Array): void | Promise<void> {
    return this.type(HTML_TYPE).send(html);
  }
  /**
   * shorthand for send json body
   * @example
   * response.json({ name: "john" });
   */
  json(body: TObject): void | Promise<void> {
    if (typeof body !== "object") {
      throw new HttpError(400, "body not json");
    }
    return this.send(body);
  }
  /**
   * redirect url
   * @example
   * response.redirect("/home");
   * response.redirect("/home", 301);
   * response.redirect("http://google.com");
   */
  redirect(url: string, status?: number): void | Promise<void> {
    return this.header("Location", url).status(status ?? 302).send();
  }
  /**
   * add headers. send multiple headers to response.
   * @example
   * response.addHeader("name", "john");
   * response.addHeader("name", "doe");
   */
  addHeader(key: string, value: string | string[]): this {
    this.__isHeaders ??= true;
    if (!isArray(this.init.headers)) {
      this.init.headers = headerToArr(this.init.headers);
    }
    this.init.headers.push([key, value]);
    return this;
  }
  /**
   * cookie
   * @example
   * response.cookie("key", "value" , {
   *    httpOnly: true
   * });
   */
  cookie(
    name: string,
    value: string | string[] | number | number[] | TObject | undefined,
    opts: Cookie = {},
  ): this {
    opts.httpOnly = opts.httpOnly !== false;
    opts.path = opts.path || "/";
    if (opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
      opts.maxAge /= 1000;
    }
    value = typeof value === "object"
      ? "j:" + JSON.stringify(value)
      : String(value);
    this.addHeader(C_KEY, serializeCookie(name, value, opts));
    return this;
  }
  /**
   * clear cookie
   * @example
   * response.clearCookie("name");
   */
  clearCookie(name: string, opts: Cookie = {}): void {
    opts.httpOnly = opts.httpOnly !== false;
    this.addHeader(
      C_KEY,
      serializeCookie(name, "", { ...opts, expires: new Date(0) }),
    );
  }
  /**
   * custom inspect for Deno.
   */
  [deno_inspect](inspect: TRet, opts: TRet): string {
    const ret = resInspect(this);
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
    const ret = resInspect(this);
    return `${this.constructor.name} ${
      inspect?.(ret, opts) ?? Deno.inspect(ret)
    }`;
  }
  /**
   * any.
   */
  [k: string | symbol]: TRet;
}
/**
 * Support for runtime old version.
 */
export function oldSchool(): void {
  if ((BigInt.prototype as TRet).toJSON === void 0) {
    (BigInt.prototype as TRet).toJSON = function () {
      return this.toString();
    };
  }
  Response.json ??= (
    data: unknown,
    init: ResInit = {},
  ) => new JsonResponse(data, init);
}
/**
 * JsonResponse.
 * @example
 * app.get("/", () => new JsonResponse({ name: "foo" }));
 */
export class JsonResponse extends Response {
  constructor(body: unknown, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    headers.set(TYPE, JSON_TYPE);
    init.headers = headers;
    super(
      JSON.stringify(body, (_, v) => typeof v === "bigint" ? v.toString() : v),
      init,
    );
  }
}
