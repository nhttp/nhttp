import {
  EngineOptions,
  FetchEvent,
  FetchHandler,
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
  defError,
  findFns,
  getUrl,
  parseQuery as parseQueryOri,
  toPathx,
} from "./utils.ts";
import { bodyParser as bodyParserOri } from "./body.ts";
import { getError, HttpError } from "./error.ts";
import { createRequest, RequestEvent, toRes } from "./request_event.ts";
import { HTML_TYPE } from "./constant.ts";
import { s_init, s_response } from "./symbol.ts";
import { ROUTE } from "./constant.ts";
import { oldSchool } from "./http_response.ts";
import { buildListenOptions, HttpServer, onNext } from "./nhttp_util.ts";

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends Router<Rev> {
  private parseQuery: TQueryFunc;
  private env: string;
  private flash?: boolean;
  private stackError!: boolean;
  private bodyParser?: TBodyParser | boolean;
  server!: TRet;

  constructor(
    { parseQuery, bodyParser, env, flash, stackError }: TApp = {},
  ) {
    super();
    oldSchool();
    this.parseQuery = parseQuery || parseQueryOri;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    this.bodyParser = bodyParser;
  }
  /**
   * global error handling.
   * @example
   * app.onError((err, rev) => {
   *    return err.message;
   * })
   */
  onError(
    fn: (
      err: TObject,
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    this._onError = (err, rev) => {
      try {
        let status: number = err.status || err.statusCode || err.code || 500;
        if (typeof status !== "number") status = 500;
        rev.response.status(status);
        return fn(
          err,
          rev,
          ((e: TRet) => {
            if (e) {
              return rev.response.status(e.status ?? 500).send(String(e));
            }
            return this._on404(rev);
          }) as TRet,
        );
      } catch (err) {
        return defError(err, rev, this.stackError);
      }
    };
    return this;
  }
  /**
   * global not found error handling.
   * @example
   * app.on404((rev) => {
   *    return `route ${rev.url} not found`;
   * })
   */
  on404(
    fn: (
      rev: Rev,
      next: NextFunction,
    ) => RetHandler,
  ) {
    const def = this._on404.bind(this);
    this._on404 = (rev) => {
      try {
        rev.response.status(404);
        return fn(
          rev,
          ((e: TRet) => {
            if (e) {
              return this._onError(e, rev);
            }
            return def(rev);
          }) as TRet,
        );
      } catch (err) {
        return defError(err, rev, this.stackError);
      }
    };
    return this;
  }
  on<T extends unknown = unknown>(
    method: string,
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ): this {
    let fns = findFns<Rev>(handlers);
    if (typeof path === "string") {
      if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
      if (this.pmidds) {
        const arr = [] as TRet[];
        this.pmidds.forEach((el) => {
          if (el.pattern.test(path)) arr.push(...el.fns);
        });
        fns = arr.concat([(rev, next) => {
          if (rev.__url && rev.__path) {
            rev.url = rev.__url;
            rev.path = rev.__path;
          }
          return next();
        }] as Handlers, fns);
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
          this.route[key] = fns[0].length ? fns : fns[0];
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
    render: ((...args: TRet) => TRet) & {
      check?: (elem: TRet) => boolean;
    },
    opts: EngineOptions = {},
  ) {
    const check = render.check;
    this.use((rev: RequestEvent, next) => {
      if (check !== undefined) {
        const send = rev.send.bind(rev);
        rev.send = (body, lose) => {
          if (check(body)) {
            rev[s_init] ??= {};
            rev[s_init].headers ??= {};
            rev[s_init].headers["content-type"] ??= HTML_TYPE;
            const res = render(body, rev);
            if (res instanceof Promise) {
              res.then((res) => {
                rev[s_response] = new Response(res, rev[s_init]);
              }).catch(next);
            } else {
              rev[s_response] = new Response(res, rev[s_init]);
            }
          } else {
            send(body, lose);
          }
        };
      }
      rev.response.render = (elem, params, ...args) => {
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
        params ??= rev.response.params;
        rev.response.type(HTML_TYPE);
        const ret = render(elem, params, ...args);
        if (ret) {
          if (ret instanceof Promise) {
            return ret.then((val) => rev.response.send(val)).catch(next);
          }
          return rev.response.send(ret);
        }
        return ret;
      };
      return next();
    });
  }
  matchFns = (rev: RequestEvent, method: string, url: string) => {
    const iof = url.indexOf("?");
    if (iof !== -1) {
      rev.path = url.substring(0, iof);
      rev.__parseQuery = this.parseQuery;
      rev.search = url.substring(iof);
      url = rev.path;
    }
    return this.find(
      method,
      url,
      (obj) => (rev.params = obj),
      this._on404,
    );
  };
  /**
   * handleRequest
   * @example
   * Deno.serve(app.handleRequest);
   * // or
   * Bun.serve({ fetch: app.handleRequest });
   */
  handleRequest: FetchHandler = async (req) => {
    const method = req.method, url = getUrl(req.url);
    let fns = this.route[method + url], noop: Error | undefined;
    // just skip no middleware
    if (typeof fns === "function") {
      try {
        const ret = fns();
        return toRes(ret) ?? toRes(await ret);
      } catch (err) {
        noop = err;
      }
    }
    let i = 0;
    const rev = <Rev> new RequestEvent(req);
    fns ??= this.matchFns(rev, method, url);
    const next: NextFunction = (err) => {
      try {
        return onNext(
          err ? this._onError(err, rev) : (fns[i++] ?? this._on404)(rev, next),
          rev,
          next,
        );
      } catch (e) {
        return next(e);
      }
    };
    if (method === "GET" || noop) return next(noop);
    return bodyParserOri(this.bodyParser, this.parseQuery)(rev, next);
  };
  /**
   * handle
   * @example
   * Deno.serve(app.handle);
   * // or
   * Bun.serve({ fetch: app.handle });
   */
  handle: FetchHandler = (req: Request, conn?: TRet, ctx?: TRet) => {
    if (conn) req._info = { conn, ctx };
    return this.handleRequest(req);
  };

  /**
   * handleEvent
   * @example
   * addEventListener("fetch", (event) => {
   *   event.respondWith(app.handleEvent(event))
   * });
   */
  handleEvent = (evt: FetchEvent) => this.handle(evt.request);
  /**
   * Mock request.
   * @example
   * app.get("/", () => "hello");
   * app.post("/", () => "hello, post");
   *
   * // mock request
   * const hello = await app.req("/").text();
   * assertEquals(hello, "hello");
   *
   * // mock request POST
   * const hello_post = await app.req("/", { method: "POST" }).text();
   * assertEquals(hello_post, "hello, post");
   */
  req = (url: string, init: RequestInit = {}) => {
    return createRequest(this.handle, url, init);
  };
  /**
   * listen the server
   * @example
   * app.listen(8000);
   * app.listen({ port: 8000, hostname: 'localhost' });
   * app.listen({
   *    port: 443,
   *    certFile: "./path/to/my.crt",
   *    keyFile: "./path/to/my.key",
   *    alpnProtocols: ["h2", "http/1.1"]
   * }, callback);
   */
  listen = async (
    options: number | ListenOptions,
    callback?: (
      err: Error | undefined,
      opts: ListenOptions,
    ) => void | Promise<void>,
  ) => {
    const { opts, isSecure, handler } = buildListenOptions.bind(this)(options);
    const runCallback = (err?: Error) => {
      if (callback) {
        callback(err, {
          ...opts,
          hostname: opts.hostname ?? "localhost",
        });
        return true;
      }
      return;
    };
    try {
      if (this.flash) {
        if ("serve" in Deno) {
          if (runCallback()) opts.onListen = () => {};
          return (<TObject> Deno).serve(opts, handler);
        }
        console.error("requires --unstable flags");
        return;
      }
      runCallback();
      this.server = (isSecure ? Deno.listenTls : Deno.listen)(opts);
      const server = new HttpServer(this.server, handler);
      if (opts.signal) {
        opts.signal.addEventListener("abort", () => server.close(), {
          once: true,
        });
      }
      return await server.acceptConn();
    } catch (error) {
      runCallback(error);
    }
  };
  private _onError(
    err: TObject,
    rev: Rev,
  ): RetHandler {
    return defError(err, rev, this.stackError);
  }
  private _on404(rev: Rev): RetHandler {
    const obj = getError(
      new HttpError(
        404,
        `Route ${rev.method}${rev.originalUrl} not found`,
        "NotFoundError",
      ),
    );
    rev.response.status(obj.status);
    return obj;
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
