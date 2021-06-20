import { HttpResponse } from "./types.ts";
import { serializeCookie } from "./utils.ts";

const JSON_TYPE_CHARSET = "application/json; charset=utf-8";

export class JsonResponse extends Response {
  constructor(json: { [k: string]: any } | null, opts: ResponseInit = {}) {
    opts.headers = (opts.headers || new Headers()) as Headers;
    opts.headers.set("content-type", JSON_TYPE_CHARSET);
    super(JSON.stringify(json), opts);
  }
}

export function buildResponse(
  res: HttpResponse,
  respondWith: (r: Response | Promise<Response>) => Promise<void>,
  opts: { [k: string]: any }
) {
  res.header = function (key, value) {
    opts.headers = opts.headers || new Headers();
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
      return opts.headers.get(key) as & HttpResponse & string;
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
        typeof (body as Deno.Reader).read === "function"
      ) {
        return respondWith(new Response(body as BodyInit, opts));
      }
      body = JSON.stringify(body);
      opts.headers = opts.headers || new Headers();
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
    _opts.httpOnly = _opts.httpOnly || true;
    _opts.path = _opts.path || "/";
    if (_opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
      opts.maxAge /= 1000;
    }
    value = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);
    this.header().append(
      "Set-Cookie", 
      serializeCookie(name, value, _opts)
    );
    return this;
  };
  res.clearCookie = function (name, _opts = {}) {
    _opts.httpOnly = _opts.httpOnly || true;
    this.header().append(
      "Set-Cookie",
      serializeCookie(name, "", {..._opts, expires: new Date(0)}),
    );
  };
}
