import { Cookie, TObject } from "./types.ts";
import { serializeCookie } from "./utils.ts";

const JSON_TYPE_CHARSET = "application/json; charset=utf-8";
const encoder = new TextEncoder();

export class HttpResponse {
  /**
   * set header or get header
   * @example
   * // set headers
   * response.header("content-type", "text/css");
   * response.header({"content-type": "text/css"});
   * // get headers
   * response.header("content-type");
   * // get all headers
   * response.header();
   * // delete headers
   * response.header().delete("content-type");
   */
  header!: (
    key?: TObject | string,
    value?: string,
  ) => HttpResponse | (HttpResponse & Headers) | (HttpResponse & string);
  /**
   * set status or get status
   * @example
   * // set status
   * response.status(200);
   * // get status
   * response.status();
   */
  status!: (code?: number) => HttpResponse | (HttpResponse & number);
  /**
   * shorthand for content-type headers
   * @example
   * response.type("text/html");
   */
  type!: (contentType: string) => HttpResponse;
  /**
   * send response body
   * @example
   * return response.send("hello");
   */
  send!: (body?: BodyInit | TObject | null) => Promise<void> | Response;
  /**
   * shorthand for send json body
   * @example
   * return response.json({ name: "john" });
   */
  json!: (body: TObject | null) => Promise<void> | Response;
  /**
   * redirect url
   * @example
   * return response.redirect("/home");
   * return response.redirect("/home", 301);
   */
  redirect!: (url: string, status?: number) => Response | Promise<void>;
  /**
   * cookie
   * @example
   * response.cookie("key", "value" , {
   *    httpOnly: true
   * });
   */
  cookie!: (
    name: string,
    value: string | string[] | number | number[] | TObject | undefined,
    options?: Cookie,
  ) => HttpResponse;
  /**
   * clear cookie
   * @example
   * response.clearCookie("name");
   */
  clearCookie!: (name: string, options?: Cookie) => void;
  // deno-lint-ignore no-explicit-any
  [k: string]: any
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

export function response(
  res: HttpResponse,
  respondWith: (r: Response | Promise<Response>) => Promise<void> | Response,
  opts: ResponseInit,
) {
  res.header = function (key, value) {
    if (opts.headers) {
      if (opts.headers instanceof Headers) {
        opts.headers = Object.fromEntries(opts.headers.entries());
      }
    }
    opts.headers = opts.headers || {} as TObject;
    if (typeof key === "string") {
      key = key.toLowerCase();
      if (!value) return opts.headers[key] as HttpResponse & string;
      opts.headers[key] = value;
      return this;
    }
    if (typeof key === "object") {
      if (key instanceof Headers) {
        key = Object.fromEntries(key.entries());
      }
      for (const k in key) opts.headers[k.toLowerCase()] = key[k];
      return this;
    }
    return (opts.headers = new Headers(opts.headers)) as HttpResponse & Headers;
  };
  res.status = function (code) {
    if (code) {
      opts.status = code;
      return this;
    }
    return (opts.status || 200) as HttpResponse & number;
  };
  res.type = function (value) {
    this.header("content-type", value);
    return this;
  };
  res.send = function (body) {
    if (typeof body === "string") {
      return respondWith(new Response(encoder.encode(body), opts));
    }
    if (typeof body === "object") {
      if (body instanceof Response) {
        return respondWith(body);
      }
      if (
        body instanceof Uint8Array ||
        body instanceof ReadableStream ||
        body instanceof FormData ||
        body instanceof Blob ||
        typeof (body as unknown as Deno.Reader).read === "function"
      ) {
        return respondWith(new Response(body as BodyInit, opts));
      }
      return respondWith(new JsonResponse(body, opts));
    }
    return respondWith(new Response(body, opts));
  };
  res.json = function (body) {
    return respondWith(new JsonResponse(body, opts));
  };
  res.redirect = function (url, status) {
    return this.header("Location", url).status(status || 302).send();
  };
  res.cookie = function (name, value, _opts = {}) {
    _opts.httpOnly = _opts.httpOnly !== false;
    _opts.path = _opts.path || "/";
    if (_opts.maxAge) {
      _opts.expires = new Date(Date.now() + _opts.maxAge);
      _opts.maxAge /= 1000;
    }
    value = typeof value === "object"
      ? "j:" + JSON.stringify(value)
      : String(value);
    this.header().append(
      "Set-Cookie",
      serializeCookie(name, value, _opts),
    );
    return this;
  };
  res.clearCookie = function (name, _opts = {}) {
    _opts.httpOnly = _opts.httpOnly !== false;
    this.header().append(
      "Set-Cookie",
      serializeCookie(name, "", { ..._opts, expires: new Date(0) }),
    );
  };
}
