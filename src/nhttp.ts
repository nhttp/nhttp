import {
  CustomHandler,
  FetchEvent,
  Handler,
  Handlers,
  HttpRequest,
  ListenOptions,
  NextFunction,
  RetHandler,
  RouterOrWare,
  TApp,
  TBodyParser,
  TObject,
  TQueryFunc,
  TRet,
} from "./types.ts";
import Router from "./router.ts";
import {
  concatRegexp,
  findFn,
  findFns,
  getPos,
  getReqCookies,
  getUrl,
  middAssets,
  parseQuery as parseQueryOri,
  sendBody,
  toPathx,
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
export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  private parseQuery: TQueryFunc;
  private multipartParseQuery?: TQueryFunc;
  private bodyParser: TBodyParser | boolean | undefined;
  private env: string;
  private flash?: boolean;
  private stackError!: boolean;
  private strictUrl?: boolean;
  private lenn: number | undefined;
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
   * await Deno.serve(app.handle, { port: 3000 });
   * // or
   * Bun.serve({ fetch: app.handle });
   */
  handle: (request: HttpRequest) => TRet;
  constructor(
    { parseQuery, bodyParser, env, flash, stackError, strictUrl }: TApp = {},
  ) {
    super();
    this.parseQuery = parseQuery || parseQueryOri;
    this.multipartParseQuery = parseQuery;
    this.bodyParser = bodyParser;
    this.strictUrl = strictUrl;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    this.handleEvent = (event: FetchEvent) => {
      return this.handleRequest(event.request);
    };
    this.handle = (request: TRet) => {
      return this.handleRequest(request);
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
  /**
   * add router or middlware.
   * @example
   * app.use(...middlewares);
   * app.use('/api/v1', routers);
   */
  use<T>(
    prefix: string | RouterOrWare<Rev & T> | RouterOrWare<Rev & T>[],
    ...routerOrMiddleware: Array<
      RouterOrWare<Rev & T> | RouterOrWare<Rev & T>[]
    >
  ) {
    let args = routerOrMiddleware, str = "";
    if (typeof prefix === "function" && args.length === 0) {
      this.midds = this.midds.concat(findFn(prefix));
      return this;
    }
    if (typeof prefix === "string") str = prefix === "/" ? "" : prefix;
    else args = [prefix].concat(args);
    const last = args[args.length - 1] as TObject;
    if (
      typeof last === "object" && (last.c_routes || last[0].c_routes)
    ) {
      this.pushRoutes(str, findFns(args) as Handler[], last);
    } else if (str !== "") {
      this.pmidds = this.pmidds ?? {};
      this.pmidds[str] = middAssets(str).concat(findFns(args) as Handler[]);
    } else {
      this.midds = this.midds.concat(findFns(args) as Handler[]);
    }
    return this;
  }
  on<T>(
    method: string,
    path: string | RegExp,
    ...handlers: Handlers<Rev & T>
  ): this {
    const fns = findFns(handlers);
    const { path: oriPath, pathx, wild } = toPathx(path, method === "ANY");
    if (pathx) {
      this.route[method] = this.route[method] || [];
      (this.route[method] as TObject[]).push({
        path: oriPath,
        pathx,
        fns,
        wild,
      });
    } else {
      this.route[method + path] = { fns };
    }
    return this;
  }
  private handleRequest(req: HttpRequest) {
    let i = 0, res: TRet;
    const rev = new RequestEvent(req);
    const method = req.method;
    const { fns, param } = <{
      fns: Handler<Rev>[];
      param?: () => TObject;
    }> this.find(
      method,
      getUrl(req.url, this.lenn ?? (this.lenn = getPos(req.url))),
      this._on404,
      (url) => {
        const iof = url.indexOf("?");
        if (iof != -1) {
          rev.path = url.substring(0, iof);
          rev.query = this.parseQuery(url.substring(iof + 1));
          rev.search = url.substring(iof);
          return rev.path;
        }
        return url;
      },
      () => {
        const pos = getPos(req.url);
        if (this.lenn != void 0 && this.lenn != pos) {
          return getUrl(req.url, this.lenn = pos);
        }
        return void 0;
      },
      this.strictUrl,
    );
    if (param) rev.__params = param;
    rev.respondWith = (r) => {
      if (!rev.__wm) return r as Response;
      res = () => r;
      return r as Response;
    };
    rev.getCookies = (d) => getReqCookies(req, d);
    const next: NextFunction = (err) => {
      try {
        const ret = err
          ? this._onError(err, <Rev> rev, next)
          : fns[i++](<Rev> rev, next);
        if (typeof ret == "string") {
          if (!rev.res) return new Response(ret);
          return rev.respondWith(new Response(ret, rev.res?.init));
        }
        if (ret instanceof Response) return ret;
        return (async () => {
          try {
            const val = await ret;
            if (val) return sendBody(rev.respondWith, rev.res?.init, val);
            if (res) return res();
            await delay();
            return res?.();
          } catch (e) {
            return err ? defError(e, rev, this.stackError) : next(e);
          }
        })();
      } catch (e) {
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
  async listen(
    opts: number | ListenOptions,
    callback?: (
      err?: Error,
      opts?: ListenOptions,
    ) => void | Promise<void>,
  ) {
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
  }

  private pushRoutes(str: string, wares: Handler[], last: TRet) {
    last = Array.isArray(last) ? last : [last];
    last.forEach((obj: TObject) => {
      obj.c_routes.forEach((route: TObject) => {
        const { method, path, fns } = route;
        let _path: string | RegExp;
        if (path instanceof RegExp) _path = concatRegexp(str, path);
        else {
          let mPath = path;
          if (mPath === "/" && str !== "") mPath = "";
          _path = str + mPath;
        }
        this.on(method, _path, [wares, fns]);
      });
    });
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
            await rev.respondWith(handler(rev.request));
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
