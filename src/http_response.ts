import { JSON_TYPE, MIME_LIST, STATUS_LIST } from "./constant.ts";
import { TResp } from "./request_event.ts";
import { s_params } from "./symbol.ts";
import { Cookie, TObject, TRet, TSendBody } from "./types.ts";
import { serializeCookie } from "./utils.ts";

export type ResInit = {
  headers?: TObject;
  status?: number;
};

export class HttpResponse {
  constructor(private _send: TResp) {}
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
   */
  header(key: string, value: string | string[]): this;
  header(key: string): string;
  header(key: TObject): this;
  header(): Headers;
  header(
    key?: TObject | string,
    value?: string | string[],
  ): this | string | Headers {
    this.init ??= {};
    this.init.headers ??= {};
    if (this.init.headers instanceof Headers) {
      this.init.headers = Object.fromEntries(this.init.headers.entries());
    }
    if (typeof key === "string") {
      key = key.toLowerCase();
      if (value === void 0) return this.init.headers[key];
      this.init.headers[key] = value;
      return this;
    }
    if (typeof key === "object") {
      if (key instanceof Headers) key = Object.fromEntries(key.entries());
      for (const k in key) this.init.headers[k.toLowerCase()] = key[k];
      return this;
    }
    return (this.init.headers = new Headers(this.init.headers));
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
      this.init ??= {};
      this.init.statusText = STATUS_LIST[code];
      this.init.status = code;
      return this;
    }
    return (this.init?.status || 200);
  }
  /**
   * sendStatus
   * @example
   * response.sendStatus(204);
   */
  sendStatus(code: number) {
    if (code > 511) code = 500;
    const status = STATUS_LIST[code];
    try {
      this.status(code).send(status);
    } catch (_e) {
      this.status(code).send(null);
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
   * setHeader
   * @example
   * response.setHeader("key", "value");
   */
  setHeader(key: string, value: string | string[]) {
    return this.header(key, value);
  }
  /**
   * getHeader
   * @example
   * const str = response.getHeader("key");
   */
  getHeader(key: string) {
    return this.header(key);
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
   */
  type(contentType: string) {
    return this.header("content-type", MIME_LIST[contentType] ?? contentType);
  }
  /**
   * render `requires app.engine configs`
   * @example
   * await response.render("index.html");
   * await response.render("index.ejs", {
   *   key: "value"
   * });
   * await response.render(<h1>Hello Jsx</h1>);
   */
  render!: (
    fileOrElem: TRet,
    params?: TObject,
    ...args: TRet
  ) => Promise<void | Response>;
  /**
   * send response body
   * @example
   * response.send("hello");
   * response.send({ name: "john" });
   */
  send(body?: TSendBody) {
    this._send(body);
  }
  /**
   * shorthand for send json body
   * @example
   * response.json({ name: "john" });
   */
  json(body: TObject) {
    this.send(body);
  }
  /**
   * redirect url
   * @example
   * response.redirect("/home");
   * response.redirect("/home", 301);
   * response.redirect("http://google.com");
   */
  redirect(url: string, status?: number) {
    this.header("Location", url).status(status ?? 302).send();
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
    this.header().append(
      "Set-Cookie",
      serializeCookie(name, value, opts),
    );
    return this;
  }
  /**
   * clear cookie
   * @example
   * response.clearCookie("name");
   */
  clearCookie(name: string, opts: Cookie = {}) {
    opts.httpOnly = opts.httpOnly !== false;
    this.header().append(
      "Set-Cookie",
      serializeCookie(name, "", { ...opts, expires: new Date(0) }),
    );
  }
  [Symbol.for("Deno.customInspect")](inspect: TRet) {
    const ret = {
      clearCookie: this.clearCookie,
      cookie: this.cookie,
      getHeader: this.getHeader,
      header: this.header,
      json: this.json,
      params: this.params,
      statusCode: this.statusCode,
      redirect: this.redirect,
      attachment: this.attachment,
      render: this.render,
      send: this.send,
      sendStatus: this.sendStatus,
      setHeader: this.setHeader,
      status: this.status,
      type: this.type,
    };
    return `${this.constructor.name} ${inspect(ret)}`;
  }
  [k: string | symbol]: TRet;
}

export class JsonResponse extends Response {
  constructor(body: TObject | null, resInit: ResponseInit = {}) {
    if (resInit.headers) {
      if (resInit.headers instanceof Headers) {
        resInit.headers.set("content-type", JSON_TYPE);
      } else (resInit.headers as TObject)["content-type"] = JSON_TYPE;
    } else resInit.headers = { "content-type": JSON_TYPE };
    super(JSON.stringify(body), resInit);
  }
}
