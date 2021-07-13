import { Cookie } from "./types.ts";
import { serializeCookie } from "./utils.ts";

const JSON_TYPE_CHARSET = "application/json; charset=utf-8";

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
    key?: { [k: string]: any } | string,
    value?: any,
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
  * // send text
  * response.send("hello");
  * response.status(201).send("Created");
  * // send json
  * response.send({ name: "john" });
  * // simple send file
  * response.type("text/css").send(await Deno.readFile("./path/file"));
  */
  send!: (body?: BodyInit | { [k: string]: any } | null) => Promise<void>;
  /**
  * shorthand for send json body
  * @example
  * response.json({ name: "john" });
  */
  json!: (body: { [k: string]: any } | null) => Promise<void>;
  /**
  * redirect url
  * @example
  * response.redirect("/home");
  * response.redirect("/home", 301);
  */
  redirect!: (url: string, status?: number) => Promise<void>;
  /**
  * cookie
  * @example
  * response.cookie("key", "value" , {
  *    httpOnly: true
  * });
  */
  cookie!: (name: string, value: any, options?: Cookie) => HttpResponse;
  /**
  * clear cookie
  * @example
  * response.clearCookie("name");
  */
  clearCookie!: (name: string, options?: Cookie) => void;
  [k: string]: any
}

export class JsonResponse extends Response {
  constructor(json: { [k: string]: any } | null, opts: ResponseInit = {}) {
    opts.headers = (opts.headers || new Headers()) as Headers;
    opts.headers.set("content-type", JSON_TYPE_CHARSET);
    super(JSON.stringify(json), opts);
  }
}

export function response(
  res: HttpResponse,
  respondWith: (r: Response | Promise<Response>) => Promise<void>,
  opts: ResponseInit,
) {
  res.header = function (key, value) {
    opts.headers = (opts.headers || new Headers()) as Headers;
    if (typeof key === "string" && typeof value === "string") {
      opts.headers.set(key as string, value);
      return this;
    }
    if (typeof key === "object") {
      if (key instanceof Headers) {
        opts.headers = key;
      } else {
        for (const k in key) {
          opts.headers.set(k, key[k]);
        }
      }
      return this;
    }
    if (typeof key === "string") {
      return opts.headers.get(key) as HttpResponse & string;
    }
    return opts.headers as HttpResponse & Headers;
  };
  res.status = function (code) {
    if (code) {
      opts.status = code;
      return this;
    }
    return (opts.status || 200) as HttpResponse & number;
  };
  res.type = function (value) {
    this.header("Content-Type", value);
    return this;
  };
  res.send = function (body) {
    if (typeof body === "object") {
      if (
        body instanceof Uint8Array ||
        body instanceof ReadableStream ||
        body instanceof FormData ||
        body instanceof Blob ||
        typeof (body as Deno.Reader).read === "function"
      ) {
        return respondWith(new Response(body as BodyInit, opts));
      }
      body = JSON.stringify(body);
      opts.headers = (opts.headers || new Headers()) as Headers;
      opts.headers.set("Content-Type", JSON_TYPE_CHARSET);
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
