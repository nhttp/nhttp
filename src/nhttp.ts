import {
  CustomHandler,
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
import Router from "./router.ts";
import {
  findFns,
  parseQuery as parseQueryOri,
  sendBody,
  toPathx,
  updateLen,
} from "./utils.ts";
import { bodyParser } from "./body.ts";
import { getError, HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";

const defError = (
  err: TObject,
  rev: RequestEvent,
  stack: boolean,
): RetHandler => {
  const obj = getError(err, stack);
  return rev.response.status(obj.status).json(obj);
};

const delay = () => new Promise((ok) => setTimeout(ok));
const noop = "++)] is not a function";
export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  private parseQuery: TQueryFunc;
  private multipartParseQuery?: TQueryFunc;
  private bodyParser: TBodyParser | boolean | undefined;
  private env: string;
  private flash?: boolean;
  private stackError!: boolean;
  server: TRet;
  /**
   * handleEvent
   * @example
   * addEventListener("fetch", (event) => {
   *   event.respondWith(app.handleEvent(event))
   * });
   */
  handleEvent: (event: FetchEvent, info?: TRet, ctx?: TRet) => TRet;
  /**
   * handle
   * @example
   * await Deno.serve(app.handle, { port: 3000 });
   * // or
   * Bun.serve({ fetch: app.handle });
   */
  handle: (request: Request, info?: TRet, ctx?: TRet) => TRet;
  constructor(
    { parseQuery, bodyParser, env, flash, stackError }: TApp = {},
  ) {
    super();
    this.parseQuery = parseQuery || parseQueryOri;
    this.multipartParseQuery = parseQuery;
    this.bodyParser = bodyParser;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    this.handleEvent = (event, info, ctx) => {
      return this.handleRequest(event.request, info, ctx);
    };
    this.handle = (request, info, ctx) => {
      return this.handleRequest(request, info, ctx);
    };
    if (parseQuery) {
      this.use((rev: RequestEvent, next) => {
        rev.__parseQuery = parseQuery;
        return next();
      });
    }
  }
  /**
   * global error handling.
   * @example
   * app.onError((error, rev) => {
   *     return rev.response.send(error.message);
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
      (rev as TRet).__onErr = true;
      let status: number = err.status || err.statusCode || err.code || 500;
      if (typeof status !== "number") status = 500;
      rev.response.status(status);
      return fn(err, rev, next);
    };
    return this;
  }
  /**
   * global not found error handling.
   * @example
   * app.on404((rev) => {
   *     return rev.response.send(`route ${rev.url} not found`);
   * })
   */
  on404(
    fn: (
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    this._on404 = (rev, next) => {
      rev.response.status(404);
      return fn(rev, next);
    };
    return this;
  }
  on<T>(
    method: string,
    path: string | RegExp,
    ...handlers: Handlers<Rev & T>
  ): this {
    let fns = findFns<Rev>(handlers);
    if (typeof path == "string" && this.pmidds?.[path as string]) {
      fns = this.pmidds[path as string].concat([
        (rev: Rev, next: NextFunction) => {
          rev.url = rev.__url;
          rev.path = rev.__path;
          return next();
        },
      ], fns);
    }
    fns = this.midds.concat(fns);
    const { path: oriPath, pathx, wild } = toPathx(path, method === "ANY") ??
      {};
    if (pathx) {
      this.route[method] = this.route[method] ?? [];
      this.route[method].push({
        path: oriPath,
        pathx,
        fns,
        wild,
      });
    } else {
      this.route[method + path] = fns;
    }
    return this;
  }
  private is404(e: Error) {
    return typeof e.message == "string" && e.name == "TypeError" &&
      e.message.includes(noop);
  }
  private handleRequest(req: Request, info?: TRet, ctx?: TRet) {
    let i = 0;
    const rev = new RequestEvent(req, info, ctx);
    const method = req.method;
    const fns = this.route[method + rev.path] ??
      this.find(
        method,
        rev.path,
        (path) => {
          const iof = rev.path.indexOf("?");
          if (iof != -1) {
            rev.url = rev.path;
            rev.path = rev.url.substring(0, iof);
            rev.query = this.parseQuery(rev.url.substring(iof + 1));
            rev.search = rev.url.substring(iof);
            return rev.path;
          }
          return path;
        },
        this._on404,
        (p) => {
          rev.__params = p;
        },
        () => updateLen(req.url),
      );
    const next: NextFunction = (err?: TRet) => {
      try {
        const ret = err
          ? (err._$ ? err.v : this._onError(err, <Rev> rev, next))
          : fns[i++](<Rev> rev, next);
        if (typeof ret == "string") {
          return rev.resp(ret, rev.res?.init);
        }
        if (ret) {
          if (ret.then) {
            return (async () => {
              try {
                const v = await ret;
                return next({ _$: true, v } as TRet);
              } catch (e) {
                if (this.is404(e)) return this._on404(<Rev> rev, next);
                return err ? defError(e, rev, this.stackError) : next(e);
              }
            })();
          }
          return sendBody(rev.resp.bind(rev), rev.res?.init, ret);
        }
        return rev.c_res ?? delay().finally(() => rev.c_res);
      } catch (e) {
        if (this.is404(e)) return this._on404(<Rev> rev, next);
        return err ? defError(e, rev, this.stackError) : next(e);
      }
    };
    if (method == "GET") return next();
    if (method == "HEAD") return next();
    return bodyParser(
      this.bodyParser,
      this.parseQuery,
      this.multipartParseQuery,
    )(rev, next);
  }
  /**
   * listen the server
   * @example
   * app.listen(3000);
   * app.listen({ port: 3000, hostname: 'localhost' });
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
      err?: Error,
      opts?: ListenOptions,
    ) => void | Promise<void>,
  ) {
    return (async () => {
      let isTls = false, handler = this.handle;
      if (typeof opts === "number") {
        opts = { port: opts };
      } else if (typeof opts === "object") {
        isTls = opts.certFile !== void 0 || opts.cert !== void 0 ||
          opts.alpnProtocols !== void 0;
        handler = opts.handler ?? this.handle;
      }
      const runCallback = (err?: Error) => {
        if (callback) {
          const _opts = opts as ListenOptions;
          callback(err, {
            ..._opts,
            hostname: _opts.hostname || "localhost",
          });
        }
      };
      try {
        if (this.flash) {
          if ((Deno as TRet).serve == void 0) {
            console.log("Deno flash is unstable. please add --unstable flag.");
            return;
          }
          opts.onListen = opts.onListen ?? (() => {});
          runCallback();
          if (opts.test) return;
          await (Deno as TRet).serve(opts as TRet, handler);
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
        `Route ${rev.request.method}${rev.url} not found`,
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
