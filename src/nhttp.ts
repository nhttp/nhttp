import {
  Handler,
  Handlers,
  NextFunction,
  RetHandler,
  TBodyLimit,
  TObject,
  TQueryFunc,
} from "./types.ts";
import Router from "./router.ts";
import {
  concatRegexp,
  findFns,
  getReqCookies,
  parseQuery as parseQueryOri,
  toPathx,
} from "./utils.ts";
import { withBody } from "./body.ts";
import { getError, HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import { HttpResponse, response } from "./http_response.ts";

type TApp = {
  parseQuery?: TQueryFunc;
  bodyLimit?: TBodyLimit;
  env?: string;
};

// deno-lint-ignore no-explicit-any
type FetchEvent = any;

const defError = (
  // deno-lint-ignore no-explicit-any
  err: any,
  rev: RequestEvent,
  env: string,
): RetHandler => {
  const obj = getError(err, env === "development");
  return rev.response.status(obj.status).json(obj);
};

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  private parseQuery: TQueryFunc;
  private multipartParseQuery?: TQueryFunc;
  private bodyLimit?: TBodyLimit;
  private env: string;
  server: Deno.Listener | undefined;
  constructor({ parseQuery, bodyLimit, env }: TApp = {}) {
    super();
    this.parseQuery = parseQuery || parseQueryOri;
    this.multipartParseQuery = parseQuery;
    this.bodyLimit = bodyLimit;
    this.env = env || "development";
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
      // deno-lint-ignore no-explicit-any
      err: any,
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    this._onError = (err, rev, next) => {
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
  use(...middlewares: Handlers<Rev>): this;
  use(prefix: string, ...middlewares: Handlers<Rev>): this;
  use(prefix: string, router: Router<Rev> | Router<Rev>[]): this;
  use(
    prefix: string,
    middleware: Handler<Rev> | Handler<Rev>[],
    router: Router<Rev> | Router<Rev>[],
  ): this;
  use(prefix: string, middleware: Handler<Rev> | Handler<Rev>[]): this;
  use(router: Router<Rev> | Router<Rev>[]): this;
  use(
    middleware: Handler<Rev> | Handler<Rev>[],
    router: Router<Rev> | Router<Rev>[],
  ): this;
  // deno-lint-ignore no-explicit-any
  use(...args: any) {
    let str = typeof args[0] === "string" ? args[0] : "";
    let last = args[args.length - 1];
    if (str === "/") str = "";
    if (args.length === 1 && typeof args[0] === "function") {
      this.midds = this.midds.concat(args[0]);
    } else if (
      typeof last === "object" && (last.c_routes || last[0].c_routes)
    ) {
      const wares = findFns(args) as Handler[];
      last = Array.isArray(last) ? last : [last];
      let i = 0, j = 0;
      for (; i < last.length; i++) {
        for (; j < last[i].c_routes.length; j++) {
          const { method, path, fns } = last[i].c_routes[j];
          let _path: string | RegExp;
          if (path instanceof RegExp) _path = concatRegexp(str, path);
          else {
            let mPath = path;
            if (mPath === "/" && str !== "") mPath = "";
            _path = str + mPath;
          }
          this.on(method, _path, ...wares.concat(fns));
        }
      }
    } else if (str !== "") {
      this.pmidds = this.pmidds || {};
      this.pmidds[str] = [
        ((rev, next) => {
          rev.url = rev.url.substring(str.length) || "/";
          rev.path = rev.path.substring(str.length) || "/";
          return next();
        }) as Handler,
      ].concat(findFns(args) as Handler[]);
    } else {
      this.midds = this.midds.concat(findFns(args) as Handler[]);
    }
    return this;
  }
  on(method: string, path: string | RegExp, ...handlers: Handlers<Rev>): this {
    const fns = findFns(handlers);
    const { wild, pathx } = toPathx(path, method === "ANY");
    if (pathx) {
      this.route[method] = this.route[method] || [];
      (this.route[method] as TObject[]).push({ wild, pathx, fns });
    } else {
      this.route[method + path] = { fns };
    }
    return this;
  }
  handle(rev: Rev, isRw?: boolean) {
    let i = 0, k = -1, l = 0, j = 0, len;
    const { method, url } = rev.request;
    rev.search = null;
    rev.query = {};
    while ((k = url.indexOf("/", k + 1)) != -1) {
      l += 1;
      if (l === 3) {
        rev.url = rev.path = url.substring(k);
        len = rev.url.length;
        while (j < len) {
          if (rev.url.charCodeAt(j) === 0x3f) {
            rev.path = rev.url.substring(0, j);
            rev.query = this.parseQuery(rev.url.substring(j + 1));
            rev.search = rev.url.substring(j);
            break;
          }
          j++;
        }
        break;
      }
    }
    const { fns, params } = this.find(method, rev.path, this._on404);
    const next: NextFunction = (err?: Error) => {
      let ret;
      try {
        ret = err ? this._onError(err, rev, next) : fns[i++](rev, next);
      } catch (e) {
        return err ? defError(e, rev, this.env) : next(e);
      }
      if (ret) {
        if (typeof (ret as Promise<void>).then === "function") {
          return this.withPromise(
            ret as unknown as Promise<Handler<RequestEvent>>,
            rev,
            next,
          );
        }
        return rev.response.send(ret);
      }
    };
    rev.params = params;
    rev.getCookies = (n) => getReqCookies(rev.request, n);
    if (isRw) rev.respondWith = (r) => r as Response;
    response(
      rev.response = {} as HttpResponse,
      rev.respondWith,
      rev.responseInit = {},
    );
    if (method === "GET") return next();
    if (method === "HEAD") return next();
    return withBody(
      rev,
      next,
      this.parseQuery,
      this.multipartParseQuery,
      this.bodyLimit,
    );
  }
  /**
   * handleEvent
   * @example
   * addEventListener("fetch", (event) => {
   *   event.respondWith(app.handleEvent(event))
   * });
   */
  handleEvent(event: FetchEvent) {
    return this.handle(event, true);
  }
  /**
   * listen the server
   * @example
   * app.listen(3000);
   * app.listen({ port: 3000, hostname: 'localhost' });
   * app.listen({
   *    port: 443,
   *    certFile: "./path/to/localhost.crt",
   *    keyFile: "./path/to/localhost.key",
   *    alpnProtocols: ["h2", "http/1.1"]
   * }, callback);
   */
  async listen(
    opts:
      | number
      | Deno.ListenOptions
      | Deno.ListenTlsOptions
      | TObject,
    callback?: (
      err?: Error,
      opts?:
        | Deno.ListenOptions
        | Deno.ListenTlsOptions
        | TObject,
    ) => void | Promise<void>,
  ) {
    let isTls = false;
    if (typeof opts === "number") {
      opts = { port: opts };
    } else if (typeof opts === "object") {
      isTls = (opts as Deno.ListenTlsOptions).certFile !== void 0;
    }
    this.server = (
      isTls ? Deno.listenTls(opts as Deno.ListenTlsOptions) : Deno.listen(
        opts as Deno.ListenOptions & { transport?: "tcp" | undefined },
      )
    ) as Deno.Listener;
    try {
      if (callback) {
        callback(undefined, {
          ...opts,
          hostname: opts.hostname || "localhost",
          server: this.server,
        });
      }
      while (true) {
        try {
          const conn = await this.server.accept();
          if (conn) {
            this.handleConn(conn);
          } else {
            break;
          }
        } catch (_e) { /* noop */ }
      }
    } catch (error) {
      if (callback) {
        callback(error, {
          ...opts,
          hostname: opts.hostname || "localhost",
          server: this.server,
        });
      }
    }
  }
  private _onError(
    // deno-lint-ignore no-explicit-any
    err: any,
    rev: Rev,
    _: NextFunction,
  ): RetHandler {
    return defError(err, rev, this.env);
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
  private async handleConn(conn: Deno.Conn) {
    try {
      const httpConn = Deno.serveHttp(conn);
      for await (const rev of httpConn) {
        let resp: (res: Response) => void;
        const promise = new Promise<Response>((ok) => (resp = ok));
        const rw = rev.respondWith(promise);
        (rev as Rev).conn = conn;
        rev.respondWith = resp! as (
          r: Response | Promise<Response>,
        ) => Promise<void>;
        this.handle(rev as Rev);
        await rw;
      }
    } catch (_e) { /* noop */ }
  }
  private async withPromise(
    handler: Promise<Handler>,
    rev: Rev,
    next: NextFunction,
    isDepError?: boolean,
  ) {
    try {
      const ret = await handler;
      if (!ret) return;
      return rev.response.send(ret);
    } catch (err) {
      if (isDepError) {
        return this._onError(err, rev, next);
      }
      return next(err);
    }
  }
}
