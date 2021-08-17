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
  findFns,
  getReqCookies,
  parseQuery as parseQueryOri,
  toPathx,
} from "./utils.ts";
import { withBody } from "./body.ts";
import { getError, NotFoundError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import { HttpResponse, response } from "./http_response.ts";

type TApp = {
  parseQuery?: TQueryFunc;
  bodyLimit?: TBodyLimit;
  env?: string;
};

// deno-lint-ignore no-explicit-any
type FetchEvent = any;

type TOn404<Rev extends RequestEvent = RequestEvent> = (
  rev: Rev,
  next: NextFunction,
) => RetHandler;

type TOnError<Rev extends RequestEvent = RequestEvent> = (
  // deno-lint-ignore no-explicit-any
  err: any,
  rev: Rev,
  next: NextFunction,
) => RetHandler;

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  #parseQuery: TQueryFunc;
  #multipartParseQuery?: TQueryFunc;
  #bodyLimit?: TBodyLimit;
  #env: string;
  server: Deno.Listener | undefined;
  constructor({ parseQuery, bodyLimit, env }: TApp = {}) {
    super();
    this.#parseQuery = parseQuery || parseQueryOri;
    this.#multipartParseQuery = parseQuery;
    this.#bodyLimit = bodyLimit;
    this.#env = env || "development";
    this.fetchEventHandler = this.fetchEventHandler.bind(this);
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
  onError(fn: TOnError<Rev>): void;
  onError(
    fn: (
      // deno-lint-ignore no-explicit-any
      err: any,
      rev: Rev,
      next: NextFunction,
    ) => Promise<void> | Response,
  ) {
    this.#onError = (err, rev, next) => {
      let status: number = err.status || err.statusCode || err.code || 500;
      if (typeof status !== "number") status = 500;
      rev.response.status(status);
      let ret;
      try {
        ret = fn(err, rev, next);
      } catch (error) {
        return rev.response.status(500).send((error as Error).stack);
      }
      if (ret) {
        if (typeof (ret as Promise<void>).then === "function") {
          return this.#withPromise(
            ret as unknown as Promise<Handler<RequestEvent>>,
            rev,
            next,
            true,
          );
        }
        return rev.response.send(ret);
      }
    };
  }
  /**
  * global not found error handling.
  * @example
  * app.on404((rev) => {
  *     return rev.response.send(`route ${rev.url} not found`);
  * })
  */
  on404(fn: TOn404<Rev>): void;
  on404(
    fn: (
      rev: Rev,
      next: NextFunction,
    ) => Promise<void>,
  ) {
    this.#on404 = (rev, next) => {
      rev.response.status(404);
      return fn(rev, next);
    };
  }
  /**
  * add router or middlware.
  * @example
  * app.use(...middlewares);
  * app.use('/api/v1', routers);
  */
  use(prefix: string, routers: Router<Rev>[]): this;
  use(prefix: string, router: Router<Rev>): this;
  use(router: Router<Rev>): this;
  use(router: Router<Rev>[]): this;
  use(middleware: Handler<Rev>, routers: Router<Rev>[]): this;
  use(middleware: Handler<Rev>, router: Router<Rev>): this;
  use(middleware: Handler<Rev>): this;
  use(...middlewares: Handlers<Rev>): this;
  use(prefix: string, middleware: Handler<Rev>, routers: Router<Rev>[]): this;
  use(prefix: string, middleware: Handler<Rev>, router: Router<Rev>): this;
  use(prefix: string, middleware: Handler<Rev>): this;
  use(prefix: string, ...middlewares: Handlers<Rev>): this;
  // deno-lint-ignore no-explicit-any
  use(...args: any): this;
  // deno-lint-ignore no-explicit-any
  use(...args: any) {
    const arg = args[0];
    const larg = args[args.length - 1];
    const len = args.length;
    if (len === 1 && typeof arg === "function") {
      this.midds.push(arg as Handler<Rev>);
    } else if (typeof arg === "string" && typeof larg === "function") {
      if (arg === "/" || arg === "") {
        this.midds = this.midds.concat(
          findFns(args) as ConcatArray<Handler<Rev>>,
        );
      } else {
        this.pmidds[arg] = ([
          ((rev, next) => {
            rev.url = rev.url.substring(arg.length) || "/";
            rev.path = rev.path ? rev.path.substring(arg.length) || "/" : "/";
            return next();
          }) as Handler,
        ]).concat(findFns(args) as ConcatArray<Handler<RequestEvent>>);
      }
    } else if (typeof larg === "object" && larg.c_routes) {
      this.#addRoutes(arg as string, args, larg.c_routes);
    } else if (Array.isArray(larg)) {
      let i = 0;
      const len = larg.length;
      while (i < len) {
        const el = larg[i];
        if (typeof el === "object" && el.c_routes) {
          this.#addRoutes(arg as string, args, el.c_routes);
        } else if (typeof el === "function") {
          this.midds.push(el);
        }
        i++;
      }
    } else {
      this.midds = this.midds.concat(
        findFns(args) as ConcatArray<Handler<Rev>>,
      );
    }
    return this;
  }
  on(method: string, path: string, ...handlers: Handlers<Rev>): this {
    const fns = findFns(handlers);
    const { wild, pathx } = toPathx(path, method === "ANY");
    if (pathx) {
      this.route[method] = this.route[method] || [];
      (this.route[method] as TObject[]).push({ wild, pathx, handlers: fns });
    } else {
      this.route[method + path] = { handlers: fns };
    }
    return this;
  }
  handle(rev: Rev, isRw?: boolean) {
    let i = 0;
    this.#parseUrl(rev);
    const obj = this.findRoute(
      rev.request.method,
      rev._parsedUrl.pathname,
      this.#on404,
    );
    const next: NextFunction = (err?: Error) => {
      if (err) return this.#onError(err, rev, next);
      let ret;
      try {
        ret = obj.handlers[i++](rev, next);
      } catch (error) {
        return next(error);
      }
      if (ret) {
        if (typeof (ret as Promise<void>).then === "function") {
          return this.#withPromise(
            ret as unknown as Promise<Handler<RequestEvent>>,
            rev,
            next,
          );
        }
        return rev.response.send(ret);
      }
    };
    rev.params = obj.params;
    rev.path = rev._parsedUrl.pathname;
    rev.query = this.#parseQuery(rev._parsedUrl.query);
    rev.search = rev._parsedUrl.search;
    rev.getCookies = (n) => getReqCookies(rev.request, n);
    if (isRw) {
      rev.respondWith = (r: Response | Promise<Response>) => r as Response;
    }
    response(
      rev.response = {} as HttpResponse,
      rev.respondWith,
      rev.responseInit = {},
    );
    return withBody(
      rev,
      next,
      this.#parseQuery,
      this.#multipartParseQuery,
      this.#bodyLimit,
    );
  }
  /**
  * fetchEventHandler idealy for deploy or cf_workers
  * @example
  * addEventListener("fetch", app.fetchEventHandler());
  */
  fetchEventHandler() {
    return async (event: FetchEvent) => {
      let resp: (res: Response) => void;
      const promise = new Promise<Response>((ok) => (resp = ok));
      const rw = (event as Rev).respondWith(promise);
      const _rev = event as Rev;
      _rev.respondWith = resp! as (
        r: Response | Promise<Response>,
      ) => Promise<void>;
      this.handle(_rev);
      await rw;
    };
  }
  /**
  * handleEvent idealy for deploy or cf_workers
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
            this.#handleConn(conn);
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
  #onError = (
    // deno-lint-ignore no-explicit-any
    err: any,
    rev: Rev,
    _: NextFunction,
  ): RetHandler => {
    const obj = getError(err, this.#env === "development");
    return rev.response.status(obj.status).json(obj);
  };
  #on404 = (
    rev: Rev,
    _: NextFunction,
  ): RetHandler => {
    const obj = getError(
      new NotFoundError(`Route ${rev.request.method}${rev.url} not found`),
    );
    return rev.response.status(obj.status).json(obj);
  };
  #addRoutes = (
    arg: string,
    args: TObject[],
    routes: TObject[],
  ) => {
    let prefix = "";
    let i = 0;
    const midds = findFns(args);
    const len = routes.length;
    if (typeof arg === "string" && arg.length > 1 && arg.charAt(0) === "/") {
      prefix = arg;
    }
    while (i < len) {
      const el = routes[i];
      el.handlers = midds.concat(el.handlers);
      this.on(
        el.method as string,
        prefix + el.path,
        ...el.handlers as Handlers,
      );
      i++;
    }
  };
  #handleConn = async (conn: Deno.Conn) => {
    try {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        let resp: (res: Response) => void;
        const promise = new Promise<Response>((ok) => (resp = ok));
        const rw = requestEvent.respondWith(promise);
        const _rev = requestEvent as Rev;
        _rev.respondWith = resp! as (
          r: Response | Promise<Response>,
        ) => Promise<void>;
        this.handle(_rev);
        await rw;
      }
    } catch (_e) { /* noop */ }
  };
  #findUrl = (str: string) => {
    const idx = [];
    let i = -1;
    while ((i = str.indexOf("/", i + 1)) != -1) {
      idx.push(i);
      if (idx.length === 3) break;
    }
    return str.substring(idx[2]);
  };
  #withPromise = async (
    handler: Promise<Handler>,
    rev: Rev,
    next: NextFunction,
    isDepError?: boolean,
  ) => {
    try {
      const ret = await handler;
      if (!ret) return;
      return rev.response.send(ret);
    } catch (err) {
      if (isDepError) {
        return this.#onError(err, rev, next);
      }
      return next(err);
    }
  };
  #parseUrl = (rev: RequestEvent) => {
    const str = rev.url = this.#findUrl(rev.request.url);
    const url = rev._parsedUrl || {};
    if (url._raw === str) return;
    let pathname = str,
      query = null,
      search = null,
      i = 0;
    const len = str.length;
    while (i < len) {
      if (str.charCodeAt(i) === 0x3f) {
        pathname = str.substring(0, i);
        query = str.substring(i + 1);
        search = str.substring(i);
        break;
      }
      i++;
    }
    url.path = url._raw = url.href = str;
    url.pathname = pathname;
    url.query = query;
    url.search = search;
    rev._parsedUrl = url;
  };
}
