import {
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
  TSendBody,
} from "./types.ts";
import Router, { ANY_METHODS, TRouter } from "./router.ts";
import {
  findFns,
  getRequest,
  getUrl,
  oldSchool,
  parseQuery as parseQueryOri,
  toPathx,
} from "./utils.ts";
import { bodyParser } from "./body.ts";
import { getError, HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import { HTML_TYPE } from "./constant.ts";
import { s_response } from "./symbol.ts";
import { ROUTE } from "./constant.ts";

const defError = (
  err: TObject,
  rev: RequestEvent,
  stack: boolean,
): RetHandler => {
  const obj = getError(err, stack);
  rev.response.status(obj.status);
  return obj;
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
const respond = async (
  ret: TSendBody | Promise<TSendBody>,
  rev: RequestEvent,
  next: NextFunction,
) => {
  try {
    rev.send(await ret, 1);
    return rev[s_response] ?? awaiter(rev);
  } catch (e) {
    return next(e);
  }
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
  private alive = true;
  private track = new Set<Deno.HttpConn>();
  server!: TRet;
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
    oldSchool();
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
   * app.onError((err, { response }) => {
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
    this._onError = (err, rev) => {
      try {
        let status: number = err.status || err.statusCode || err.code || 500;
        if (typeof status !== "number") status = 500;
        rev.response.status(status);
        return fn(err, rev, (e: TRet) => {
          if (e) {
            return rev.response.status(e.status ?? 500).send(String(e));
          }
          return this._on404(rev);
        });
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
    const def = this._on404.bind(this);
    this._on404 = (rev) => {
      try {
        rev.response.status(404);
        return fn(rev, (e) => {
          if (e) {
            return this._onError(e, rev);
          }
          return def(rev);
        });
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
        response.type(HTML_TYPE);
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
  matchFns(rev: RequestEvent, path: string) {
    const iof = path.indexOf("?");
    if (iof !== -1) {
      rev.path = path.substring(0, iof);
      rev.__parseQuery = this.parseQuery;
      rev.search = path.substring(iof);
      path = rev.path;
    }
    return this.find(
      rev.method,
      path,
      (obj) => (rev.params = obj),
      this._on404,
    );
  }

  private handleRequest(req: Request, conn?: TRet, ctx?: TRet) {
    let i = 0;
    const url = getUrl(req.url);
    const rev = <Rev> new RequestEvent(req, conn, ctx);
    const fns = this.route[rev.method + url] ?? this.matchFns(rev, url);
    const next: NextFunction = (err) => {
      try {
        return respond(
          err ? this._onError(err, rev) : (fns[i++] ?? this._on404)(rev, next),
          rev,
          next,
        );
      } catch (e) {
        return next(e);
      }
    };
    // GET/HEAD cannot have body.
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        return respond(fns[i++](rev, next), rev, next);
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
  private closeServer() {
    try {
      if (!this.alive) {
        throw new Error("Server Closed");
      }
      this.alive = false;
      this.server.close();
      for (const httpConn of this.track) {
        httpConn.close();
      }
      this.track.clear();
    } catch { /* noop */ }
  }
  private buildListenOptions(opts: number | ListenOptions) {
    let isSecure = false;
    if (typeof opts === "number") {
      opts = { port: opts };
    } else if (typeof opts === "object") {
      isSecure = opts.certFile !== void 0 ||
        opts.cert !== void 0 ||
        opts.alpnProtocols !== void 0;
      if (opts.handler) this.handle = opts.handler;
    }
    return { opts, isSecure };
  }
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
  req(url: string, init: RequestInit = {}) {
    return getRequest(this.handle, url, init);
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
  async listen(
    options: number | ListenOptions,
    callback?: (
      err: Error | undefined,
      opts: ListenOptions,
    ) => void | Promise<void>,
  ) {
    const { opts, isSecure } = this.buildListenOptions(options);
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
        if (runCallback()) opts.onListen = () => {};
        const handler = opts.handler ?? this.handle;
        if (opts.handler) delete opts.handler;
        return await (<TObject> Deno).serve(handler, opts);
      }
      runCallback();
      if (opts.signal) {
        opts.signal.addEventListener("abort", () => this.closeServer(), {
          once: true,
        });
      }
      this.server = (isSecure ? Deno.listenTls : Deno.listen)(opts);
      return await this.acceptConn();
    } catch (error) {
      runCallback(error);
      this.closeServer();
    }
  }

  private async acceptConn() {
    while (this.alive) {
      let conn: Deno.Conn;
      try {
        conn = await this.server.accept();
      } catch {
        break;
      }
      let httpConn: Deno.HttpConn;
      try {
        httpConn = Deno.serveHttp(conn);
      } catch {
        continue;
      }
      this.track.add(httpConn);
      this.handleHttp(httpConn, conn);
    }
  }

  private async handleHttp(httpConn: Deno.HttpConn, conn: Deno.Conn) {
    for (;;) {
      try {
        const rev = await httpConn.nextRequest();
        if (rev) {
          await rev.respondWith(this.handle(rev.request, conn));
        } else {
          break;
        }
      } catch {
        break;
      }
    }
  }
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
        `Route ${rev.method}${rev.url} not found`,
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
