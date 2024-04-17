import { HTML_TYPE, JSON_TYPE, MIME_LIST } from "./constant.ts";
import { serializeCookie } from "./cookie.ts";
import { HttpError } from "./error.ts";
import { deno_inspect, node_inspect, resInspect } from "./inspect.ts";
import { s_params } from "./symbol.ts";
import type { Cookie, TObject, TRet, TSendBody } from "./types.ts";
const TYPE = "content-type";
export type ResInit = {
  headers?: TRet;
  status?: number;
  statusText?: string;
};
const isArray = Array.isArray;
export const headerToArr = (obj = {} as TObject) => {
  const arr = [] as string[][];
  for (const k in obj) {
    arr.push([k, obj[k]]);
  }
  return arr;
};
const filterHeaders = (headers: string[][], key: string) => {
  return headers.filter((vals: string[]) => vals[0] !== key);
};
type RetHeaders = {
  append: (key: string, value: string) => HttpResponse;
  delete: (key: string) => void;
  toJSON: () => TObject;
};
const C_KEY = "set-cookie";
/* eslint-disable  @typescript-eslint/no-unsafe-declaration-merging */
export interface HttpResponse extends NHTTP.HttpResponse {
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
export class HttpResponse {
  constructor(
    /**
     * send response body
     * @example
     * response.send("hello");
     * response.send({ name: "john" });
     */
    public send: (body?: TSendBody) => void,
    public init: ResInit,
  ) {}
  /**
   * setHeader
   * @example
   * response.setHeader("key", "value");
   */
  setHeader(key: string, value: string | string[]) {
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
  sendStatus(code: number) {
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
  attachment(filename?: string) {
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
  get statusCode() {
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
  get params() {
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
   * response.type("html", "utf-8").send("<h1>hello, world</h1>");
   */
  type(contentType: string, charset?: string) {
    return this.header(
      "content-type",
      (MIME_LIST[contentType] ?? contentType) +
        (charset ? "; charset=" + charset : ""),
    );
  }

  /**
   * shorthand for send html body
   * @example
   * response.html("<h1>Hello World</h1>");
   */
  html(html: string | Uint8Array) {
    return this.type(HTML_TYPE).send(html);
  }
  /**
   * shorthand for send json body
   * @example
   * response.json({ name: "john" });
   */
  json(body: TObject) {
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
  redirect(url: string, status?: number) {
    return this.header("Location", url).status(status ?? 302).send();
  }
  /**
   * add headers. send multiple headers to response.
   * @example
   * response.addHeader("name", "john");
   * response.addHeader("name", "doe");
   */
  addHeader(key: string, value: string | string[]) {
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
  ) {
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
  clearCookie(name: string, opts: Cookie = {}) {
    opts.httpOnly = opts.httpOnly !== false;
    this.addHeader(
      C_KEY,
      serializeCookie(name, "", { ...opts, expires: new Date(0) }),
    );
  }
  [deno_inspect](inspect: TRet, opts: TRet) {
    const ret = resInspect(this);
    return `${this.constructor.name} ${inspect(ret, opts)}`;
  }
  [node_inspect](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ) {
    opts.depth = depth;
    const ret = resInspect(this);
    return `${this.constructor.name} ${
      inspect?.(ret, opts) ?? Deno.inspect(ret)
    }`;
  }
  [k: string | symbol]: TRet;
}

export function oldSchool() {
  if (BigInt.prototype.toJSON === void 0) {
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
  }
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore: Temporary workaround for oldVersion
  Response.json ??= (
    data: unknown,
    init: ResInit = {},
  ) => new JsonResponse(data, init);
}

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
