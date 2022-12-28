import { RespondWith } from "./request_event.ts";
import { Cookie, TObject, TRet } from "./types.ts";
import { list_status, serializeCookie } from "./utils.ts";

export const JSON_TYPE_CHARSET = "application/json; charset=UTF-8";

export type ResInit = {
  headers?: TObject;
  status?: number;
};

export class HttpResponse {
  constructor(public resp: RespondWith) {}
  /**
   * set header or get header
   * @example
   * // set header
   * response.header("content-type", "text/css");
   * response.header({ "content-type": "text/css" });
   *
   * // get header
   * const type = response.header("content-type");
   */
  header(key: string, value: string | string[]): this;
  header(key: string): string;
  header(key: TObject): this;
  header(): Headers;
  header(
    key?: TObject | string,
    value?: string | string[],
  ): this | string | Headers {
    if (!this.init) this.init = {};
    if (this.init.headers) {
      if (this.init.headers instanceof Headers) {
        this.init.headers = Object.fromEntries(this.init.headers.entries());
      }
    } else this.init.headers = {};
    if (typeof key == "string") {
      key = key.toLowerCase();
      if (!value) {
        return this.init.headers[key];
      }
      this.init.headers[key] = value;
      return this;
    }
    if (typeof key == "object") {
      if (key instanceof Headers) key = Object.fromEntries(key.entries());
      for (const k in key) this.init.headers[k.toLowerCase()] = key[k];
      return this;
    }
    return (this.init.headers = new Headers(this.init.headers));
  }
  /**
   * headers instanceof Headers
   * @example
   * // delete
   * response.headers.delete("key");
   *
   * // append
   * response.headers.append("key", "val");
   */
  get headers() {
    if (!this.init) this.init = {};
    if (this.init.headers instanceof Headers) return this.init.headers;
    return (this.init.headers = new Headers(this.init.headers));
  }
  set headers(val: Headers) {
    if (!this.init) this.init = {};
    this.init.headers = val;
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
    if (!this.init) this.init = {};
    if (code) {
      this.init.status = code;
      return this;
    }
    return (this.init.status || 200);
  }
  /**
   * sendStatus
   * @example
   * response.sendStatus(200);
   */
  sendStatus(code: number) {
    this.status(code);
    return this.resp(new Response(list_status[this.status()], this.init));
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
   * shorthand for content-type headers
   * @example
   * response.type("text/html");
   */
  type(contentType: string) {
    this.header("content-type", contentType);
    return this;
  }
  /**
   * send response body
   * @example
   * return response.send("hello");
   */
  send(body?: BodyInit | TObject | null) {
    if (typeof body == "object") {
      if (body instanceof Response) return body;
      if (
        body instanceof Uint8Array ||
        body instanceof ReadableStream ||
        body instanceof FormData ||
        body instanceof Blob ||
        typeof (body as TRet).read == "function"
      ) {
        return this.resp(new Response(body as BodyInit, this.init));
      }
      return this.json(body);
    }
    return this.resp(new Response(body, this.init));
  }
  /**
   * shorthand for send json body
   * @example
   * return response.json({ name: "john" });
   */
  json(body: TObject | null) {
    if (!this.init) this.init = {};
    if (this.init.headers) this.type(JSON_TYPE_CHARSET);
    else this.init.headers = { "content-type": JSON_TYPE_CHARSET };
    return this.resp(new Response(JSON.stringify(body), this.init));
  }
  /**
   * redirect url
   * @example
   * return response.redirect("/home");
   * return response.redirect("/home", 301);
   */
  redirect(url: string, status?: number) {
    return this.header("Location", url).status(status ?? 302).send();
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
    this.headers.append(
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
    this.headers.append(
      "Set-Cookie",
      serializeCookie(name, "", { ...opts, expires: new Date(0) }),
    );
  }
  [k: string]: TRet;
}

export class JsonResponse extends Response {
  constructor(body: TObject | null, resInit: ResponseInit = {}) {
    if (resInit.headers) {
      if (resInit.headers instanceof Headers) {
        resInit.headers.set("content-type", JSON_TYPE_CHARSET);
      } else (resInit.headers as TObject)["content-type"] = JSON_TYPE_CHARSET;
    } else resInit.headers = { "content-type": JSON_TYPE_CHARSET };
    super(JSON.stringify(body), resInit);
  }
}
