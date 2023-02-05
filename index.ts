// deno-lint-ignore-file
import { NHttp as BaseApp } from "./src/nhttp.ts";
import {
  bodyParser,
  NextFunction,
  RequestEvent,
  TApp,
  TObject,
  TRet,
} from "./src/index.ts";
import { HttpResponse, JSON_TYPE_CHARSET } from "./src/http_response.ts";
import { TResp } from "./src/request_event.ts";
import Router, { TRouter } from "./src/router.ts";

function buildRes(response: TObject, send: TResp) {
  const _res = new HttpResponse(send);
  _res.header = function header(
    key?: TObject | string,
    value?: string | string[],
  ) {
    if (typeof key === "string") {
      key = key.toLowerCase();
      if (!value) return response.getHeader(key);
      response.setHeader(key, value);
      return this;
    }
    if (typeof key === "object") {
      for (const k in key) response.setHeader(k.toLowerCase(), key[k]);
      return this;
    }
    return <TRet> {
      has: response.hasHeader,
      delete: response.removeHeader,
      set: response.setHeader,
      get: response.getHeader,
      append: function (key: string, value: TRet) {
        const cur = response.getHeader(key);
        response.setHeader(key, cur ? (cur + ", " + value) : value);
      },
    };
  };
  _res.status = function status(code?: number) {
    if (code) {
      response.statusCode = code;
      return this;
    }
    return response.statusCode;
  };
  response.header = _res.header.bind(_res);
  response.status = _res.status.bind(_res);
  response.clearCookie = _res.clearCookie.bind(_res);
  response.cookie = _res.cookie.bind(_res);
  response.json = _res.json.bind(_res);
  response.params = _res.params;
  response.redirect = _res.redirect.bind(_res);
  response.attachment = _res.attachment.bind(_res);
  response.render = _res.render?.bind(_res);
  response.send = _res.send.bind(_res);
  response.sendStatus = _res.sendStatus.bind(_res);
  response.type = _res.type.bind(_res);
  return response;
}

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends BaseApp<Rev> {
  private handleWorkers: (req: Request, conn?: TRet, ctx?: TRet) => TRet;
  private handleNode: (req: TRet, res: TRet) => TRet;
  constructor(opts: TApp = {}) {
    super(opts);
    this.handleWorkers = this.handle;
    this.handle = (req, conn, ctx) => {
      if (typeof (<TObject> req).on === "function") {
        return this.handleRequestNode(req, conn);
      }
      return this["handleRequest"](req, conn, ctx);
    };
    this.handleNode = (req, res) => {
      return this.handleRequestNode(req, res);
    };
    const oriListen = this.listen.bind(this);
    this.listen = async (opts, callback) => {
      if (typeof Deno !== "undefined") {
        this.handle = this.handleWorkers;
        return oriListen(opts, callback);
      }
      let isTls = false, handler = this.handleWorkers;
      if (typeof opts === "number") {
        opts = { port: opts };
      } else if (typeof opts === "object") {
        isTls = opts.certFile !== void 0 || opts.cert !== void 0;
        if (opts.handler) handler = opts.handler;
      }
      const runCallback = (err?: Error) => {
        if (callback) {
          const _opts = opts as TRet;
          callback(err, {
            ..._opts,
            hostname: _opts.hostname || "localhost",
          });
        }
      };
      try {
        if (opts.signal) {
          opts.signal.addEventListener("abort", () => {
            try {
              this.server?.close?.();
              this.server?.stop?.();
            } catch (_e) { /* noop */ }
          }, { once: true });
        }
        if (typeof Bun !== "undefined") {
          opts.fetch = handler;
          this.server = Bun.serve(opts);
          runCallback();
          return;
        }
        if (!opts.handler) handler = this.handleNode;
        if (isTls) {
          const h = await import("https");
          this.server = h.createServer(opts, handler);
          this.server.listen(opts.port);
          runCallback();
          return;
        }
        const h = await import("http");
        this.server = h.createServer(handler);
        this.server.listen(opts.port);
        runCallback();
        return;
      } catch (error) {
        runCallback(error);
      }
    };
  }

  private handleRequestNode(request: TObject, response: TObject) {
    let i = 0;
    const rev = new RequestEvent(request as Request, response, buildRes);
    rev.send = (body?: TRet) => {
      if (typeof body === "string") {
        response.end(body);
      } else if (typeof body === "object") {
        if (typeof body.pipe === "function") {
          body.pipe(response);
        } else if (body === null || body instanceof Uint8Array) {
          response.end(body);
        } else {
          response.setHeader("content-type", JSON_TYPE_CHARSET);
          response.end(JSON.stringify(body));
        }
      } else if (typeof body === "number") {
        response.end(body.toString());
      } else {
        try {
          response.end(body);
        } catch (_e) { /* noop */ }
      }
    };
    const fns = this.route[rev.method + request.url] ??
      this.matchFns(rev, request.url);
    const send = (ret: TRet) => {
      if (ret) {
        if (response.writableEnded) return;
        if (ret instanceof Promise) {
          ret.then((val) => val && rev.send(val)).catch(next);
        } else {
          rev.send(ret);
        }
      }
    };
    const next: NextFunction = (err) => {
      try {
        return send(
          err
            ? this["_onError"](err, <Rev> rev, next)
            : (fns[i++] ?? this["_on404"])(rev, next),
        );
      } catch (e) {
        return next(e);
      }
    };
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        return send(fns[i++](rev, next));
      } catch (e) {
        return next(e);
      }
    }
    return bodyParser(
      this["bodyParser"],
      this["parseQuery"],
      this["parseMultipart"],
    )(rev, next);
  }
}

export function nhttp<Rev extends RequestEvent = RequestEvent>(
  opts: TApp = {},
) {
  return new NHttp<Rev>(opts);
}

nhttp.Router = function <Rev extends RequestEvent = RequestEvent>(
  opts: TRouter = {},
) {
  return new Router<Rev>(opts);
};
export * from "./src/index.ts";
