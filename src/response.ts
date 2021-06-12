import { HttpResponse } from "./types.ts";

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
  opts: { [k: string]: any },
) {
  res.header = function (key?: { [k: string]: any } | string, value?: any) {
    if (typeof key === "object" && value === void 0) {
      if (key instanceof Headers) {
        opts.headers = key;
      } else {
        if (opts.headers) {
          for (const k in key) {
            opts.headers.set(k, key[k]);
          }
        } else {
          opts.headers = new Headers(key);
        }
      }
      return this;
    }
    if (typeof key === "string" && value === void 0) {
      return (opts.headers ? opts.headers.get(key) : null) as
        & HttpResponse
        & string;
    }
    if (typeof key === "string" && value !== void 0) {
      opts.headers = opts.headers || new Headers();
      opts.headers.set(key as string, value);
      return this;
    }
    return (opts.headers || new Headers()) as HttpResponse & Headers;
  };
  res.status = function (code?: number) {
    if (code) {
      opts.status = code;
      return this;
    }
    return (opts.status || 200) as HttpResponse & number;
  };
  res.type = function (value: string) {
    this.header("Content-Type", value);
    return this;
  };
  res.send = function (body?: BodyInit | { [k: string]: any } | null) {
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
  res.json = function (body: { [k: string]: any } | null) {
    return respondWith(new JsonResponse(body, opts));
  };
  res.redirect = function(url: string, status?: number) {
    opts.status = status || 302;
    opts.headers = { "Location": url };
    return respondWith(new Response(void 0, opts));
  };
}
