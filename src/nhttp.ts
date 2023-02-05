import {
  CustomHandler,
  EngineOptions,
  FetchEvent,
  Handlers,
  ListenOptions,
  NextFunction,
  RetHandler,
  TApp,
  TBodyParser,
  TObject,
  TQueryFunc,
  TRet,
} from "./types.ts";
import Router, { ANY_METHODS, TRouter } from "./router.ts";
import {
  findFns,
  getUrl,
  parseQuery as parseQueryOri,
  toPathx,
  updateLen,
} from "./utils.ts";
import { bodyParser } from "./body.ts";
import { getError, HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import { HTML_TYPE_CHARSET } from "./http_response.ts";
import { s_response } from "./symbol.ts";
import { ROUTE } from "./constant.ts";

const defError = (
  err: TObject,
  rev: RequestEvent,
  stack: boolean,
): RetHandler => {
  const obj = getError(err, stack);
  return rev.response.status(obj.status).json(obj);
};
const awaiter = (rev: RequestEvent) => {
  return (async (t, d) => {
    while (rev[s_response] === void 0) {
      await new Promise((ok) => setTimeout(ok, t));
      if (t === d) break;
      t++;
    }
    return rev[s_response];
  })(0, 100);
};
const resend = (ret: TRet, rev: RequestEvent, next: NextFunction) => {
  if (ret) {
    if (ret instanceof Promise) {
      return ret.then((val) => {
        if (val) rev.send(val);
        return rev[s_response] ?? awaiter(rev);
      }).catch(next);
    }
    rev.send(ret);
  }
  return rev[s_response] ?? awaiter(rev);
};
export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  private parseQuery: TQueryFunc;
  private env: string;
  private flash?: boolean;
  private stackError!: boolean;
  private bodyParser?: TBodyParser | boolean;
  private parseMultipart?: TQueryFunc;
  server: TRet;
  /**
   * handleEvent
   * @example
   * addEventListener("fetch", (event) => {
   *   event.respondWith(app.handleEvent(event))
   * });
   */
  handleEvent: (event: FetchEvent) => TRet;
  /**
   * handle
   * @example
   * Deno.serve(app.handle);
   * // or
   * Bun.serve({ fetch: app.handle });
   */
  handle: (request: Request, conn?: TRet, ctx?: TRet) => TRet;
  constructor(
    { parseQuery, bodyParser, env, flash, stackError }: TApp = {},
  ) {
    super();
    this.parseQuery = parseQuery || parseQueryOri;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    this.handleEvent = (event) => {
      return this.handleRequest(event.request);
    };
    this.handle = (request, conn, ctx) => {
      return this.handleRequest(request, conn, ctx);
    };
    if (parseQuery) {
      this.use((rev: RequestEvent, next) => {
        rev.__parseMultipart = parseQuery;
        return next();
      });
    }
    this.parseMultipart = parseQuery;
    this.bodyParser = bodyParser;
  }
  /**
   * global error handling.
   * @example
   * app.onError((err, { res }) => {
   *    response.send(err.message);
   * })
   */
  onError(
    fn: (
      err: TObject,
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    this._onError = (err, rev, next) => {
      try {
        let status: number = err.status || err.statusCode || err.code || 500;
        if (typeof status !== "number") status = 500;
        rev.response.status(status);
        return fn(err, rev, next);
      } catch (err) {
        return defError(err, rev, this.stackError);
      }
    };
    return this;
  }
  /**
   * global not found error handling.
   * @example
   * app.on404(({ response, url }) => {
   *    response.send(`route ${url} not found`);
   * })
   */
  on404(
    fn: (
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    this._on404 = (rev, next) => {
      try {
        rev.response.status(404);
        return fn(rev, next);
      } catch (err) {
        return defError(err, rev, this.stackError);
      }
    };
    return this;
  }
  on<T>(
    method: string,
    path: string | RegExp,
    ...handlers: Handlers<Rev & T>
  ): this {
    let fns = findFns<Rev>(handlers);
    if (typeof path === "string") {
      if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      for (const k in this.pmidds) {
        if (
          k === path || toPathx(k).pattern?.test(path)
        ) {
          fns = this.pmidds[k].concat([(rev, next) => {
            if (rev.__url && rev.__path) {
              rev.url = rev.__url;
              rev.path = rev.__path;
            }
            return next();
          }] as Handlers, fns);
        }
      }
    }
    fns = this.midds.concat(fns);
    const { path: oriPath, pattern, wild } = toPathx(path);
    const invoke = (m: string) => {
      if (pattern) {
        const idx = (this.route[m] ??= []).findIndex(({ path }: TObject) =>
          path === oriPath
        );
        if (idx != -1) {
          this.route[m][idx].fns = this.route[m][idx].fns.concat(fns);
        } else {
          this.route[m].push({
            path: oriPath,
            pattern,
            fns,
            wild,
          });
          (ROUTE[m] ??= []).push({ path, pattern, wild });
        }
      } else {
        const key = m + path;
        if (this.route[key]) {
          this.route[key] = this.route[key].concat(fns);
        } else {
          this.route[key] = fns;
          (ROUTE[m] ??= []).push({ path });
        }
      }
    };
    if (method === "ANY") ANY_METHODS.forEach(invoke);
    else invoke(method);
    return this;
  }
  /**
   * engine - add template engine.
   * @example
   * app.engine(ejs.renderFile, { base: "public", ext: "ejs" });
   *
   * app.get("/", async ({ response }) => {
   *   await response.render("index", { title: "hello ejs" });
   * });
   */
  engine(
    renderFile: (...args: TRet) => TRet,
    opts: EngineOptions = {},
  ) {
    this.use(({ response }, next) => {
      response.render = (elem, params, ...args) => {
        if (typeof elem === "string") {
          if (opts.ext) {
            if (!elem.includes(".")) {
              elem += "." + opts.ext;
            }
          }
          if (opts.base) {
            if (!opts.base.endsWith("/")) {
              opts.base += "/";
            }
            if (opts.base[0] === "/") {
              opts.base = opts.base.substring(1);
            }
            elem = opts.base + elem;
          }
        }
        params ??= response.params;
        response.type(HTML_TYPE_CHARSET);
        const ret = renderFile(elem, params, ...args);
        if (ret) {
          if (ret instanceof Promise) {
            return ret.then((val) => response.send(val)).catch(next);
          }
          return response.send(ret);
        }
        return ret;
      };
      return next();
    });
  }
  matchFns(rev: RequestEvent, url: string) {
    return this.find(
      rev.method,
      url,
      (str) => {
        const iof = str.indexOf("?");
        if (iof != -1) {
          rev.path = str.substring(0, iof);
          rev.__parseQuery = this.parseQuery;
          rev.search = str.substring(iof);
          return rev.path;
        }
        return str;
      },
      (p) => {
        rev.__params = p;
      },
      this._on404,
      () => updateLen(rev.request.url),
    );
  }

  private handleRequest(req: Request, conn?: TRet, ctx?: TRet) {
    let i = 0;
    const url = getUrl(req.url);
    const rev = <Rev> new RequestEvent(req, conn, ctx);
    const fns = this.route[rev.method + url] ?? this.matchFns(rev, url);
    const next: NextFunction = (err) => {
      try {
        const ret = err
          ? this._onError(err, rev, next)
          : (fns[i++] ?? this._on404)(rev, next);
        return rev[s_response] ?? resend(ret, rev, next);
      } catch (e) {
        return next(e);
      }
    };
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        const ret = fns[i++](rev, next);
        return rev[s_response] ?? resend(ret, rev, next);
      } catch (e) {
        return next(e);
      }
    }
    return bodyParser(
      this.bodyParser,
      this.parseQuery,
      this.parseMultipart,
    )(rev, next);
  }
  /**
   * listen the server
   * @example
   * app.listen(8000);
   * app.listen({ port: 8000, hostname: 'localhost' });
   * app.listen({
   *    port: 443,
   *    cert: "./path/to/localhost.crt",
   *    key: "./path/to/localhost.key",
   *    alpnProtocols: ["h2", "http/1.1"]
   * }, callback);
   */
  listen(
    opts: number | ListenOptions,
    callback?: (
      err: Error | undefined,
      opts: ListenOptions,
    ) => void | Promise<void>,
  ) {
    return (async () => {
      let isTls = false, handler = this.handle;
      if (typeof opts === "number") {
        opts = { port: opts };
      } else if (typeof opts === "object") {
        isTls = opts.certFile !== void 0 || opts.cert !== void 0 ||
          opts.alpnProtocols !== void 0;
        if (opts.handler) handler = opts.handler;
      }
      const runCallback = (err?: Error) => {
        if (callback) {
          const _opts = opts as ListenOptions;
          callback(err, {
            ..._opts,
            hostname: _opts.hostname ?? "localhost",
          });
          return true;
        }
        return;
      };
      try {
        if (this.flash) {
          if ((Deno as TRet).serve == void 0) {
            console.log("Deno flash is unstable. please add --unstable flag.");
            return;
          }
          if (runCallback()) {
            opts.onListen = () => {};
          }
          opts.handler ??= handler;
          if (opts.test) return;
          await (Deno as TRet).serve(opts);
        } else {
          runCallback();
          if (opts.signal) {
            opts.signal.addEventListener("abort", () => {
              try {
                this.server?.close();
              } catch (_e) { /* noop */ }
            }, { once: true });
          }
          if (opts.test) return;
          this.server = (isTls ? Deno.listenTls : Deno.listen)(opts as TRet);
          while (true) {
            try {
              const conn = await this.server.accept();
              if (conn) {
                this.handleConn(conn, handler);
              } else {
                break;
              }
            } catch (_e) { /* noop */ }
          }
        }
      } catch (error) {
        runCallback(error);
      }
    })();
  }

  private _onError(
    err: TObject,
    rev: Rev,
    _: NextFunction,
  ): RetHandler {
    return defError(err, rev, this.stackError);
  }
  private _on404(rev: Rev, _: NextFunction): RetHandler {
    const obj = getError(
      new HttpError(
        404,
        `Route ${rev.method}${rev.url} not found`,
        "NotFoundError",
      ),
    );
    return rev.response.status(obj.status).json(obj);
  }

  private async handleConn(conn: Deno.Conn, handler: CustomHandler) {
    try {
      const httpConn = Deno.serveHttp(conn);
      while (true) {
        try {
          const rev = await httpConn.nextRequest();
          if (rev) {
            await rev.respondWith(handler(rev.request, conn));
          } else {
            break;
          }
        } catch (_err) {
          break;
        }
      }
    } catch (_e) { /* noop */ }
  }
}

/**
 * inital app.
 * @example
 * const app = nhttp();
 */
export function nhttp<Rev extends RequestEvent = RequestEvent>(
  opts: TApp = {},
) {
  return new NHttp<Rev>(opts);
}

/**
 * Router
 * @example
 * const router = nhttp.Router();
 * const router = nhttp.Router({ base: '/items' });
 */
nhttp.Router = function <Rev extends RequestEvent = RequestEvent>(
  opts: TRouter = {},
) {
  return new Router<Rev>(opts);
};
