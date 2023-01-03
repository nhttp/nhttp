import { RequestEvent } from "./request_event.ts";
import { Handler, Handlers, RouterOrWare, TObject, TRet } from "./types.ts";
import {
  decURIComponent,
  findFn,
  findFns,
  middAssets,
  pushRoutes,
} from "./utils.ts";

export function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix == "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

export function findParams(el: TObject, url: string) {
  const match = el.pathx.exec?.(decURIComponent(url));
  const params = match?.groups ?? {};
  if (!el.wild || !el.path) return params;
  const path = el.path;
  if (path.indexOf("*") !== -1) {
    match.shift();
    const wild = match.filter((el: TRet) => el !== void 0).filter((
      el: string,
    ) => el.startsWith("/")).join("").split("/");
    wild.shift();
    const ret = { ...params, wild: wild.filter((el: string) => el !== "") };
    if (path === "*" || path.indexOf("/*") !== -1) return ret;
    let wn = path.split("/").find((el: string) =>
      el.startsWith(":") && el.endsWith("*")
    );
    if (!wn) return ret;
    wn = wn.slice(1, -1);
    ret[wn] = [ret[wn]].concat(ret.wild).filter((el) => el !== "");
    delete ret.wild;
    return ret;
  }
  return params;
}

export function base(url: string) {
  const iof = url.indexOf("/", 1);
  if (iof != -1) return url.substring(0, iof);
  return url;
}

type TRouter = { base?: string };
/**
 * Router
 * @example
 * const router = new Router();
 * const router = new Router({ base: '/items' });
 */
export default class Router<
  Rev extends RequestEvent = RequestEvent,
> {
  route: TObject = {};
  c_routes: TObject[] = [];
  midds: Handler<Rev>[] = [];
  pmidds: TObject | undefined;
  private base = "";
  constructor({ base = "" }: TRouter = {}) {
    this.base = base;
    if (this.base == "/") this.base = "";
  }

  /**
   * add middlware or router.
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
    if (typeof prefix == "function" && !args.length) {
      this.midds = this.midds.concat(findFn(prefix));
      return this;
    }
    if (typeof prefix == "string") str = prefix;
    else args = [prefix].concat(args) as TRet;
    const last = args[args.length - 1] as TObject;
    if (typeof last == "object" && (last.c_routes || last[0].c_routes)) {
      pushRoutes(str, findFns(args), last, this);
      return this;
    }
    if (str != "" && str != "*" && str != "/*") {
      const path = this.base + str;
      this.pmidds = this.pmidds ?? {};
      this.pmidds[path] = this.pmidds[path] ?? middAssets(path);
      this.pmidds[path] = this.pmidds[path].concat(findFns<Rev>(args));
      return this;
    }
    this.midds = this.midds.concat(findFns<Rev>(args));
    return this;
  }
  /**
   * build handlers (app or router)
   * @example
   * app.on("GET", "/", ...handlers);
   */
  on<T>(method: string, path: string | RegExp, ...handlers: Handlers<Rev & T>) {
    if (path instanceof RegExp) path = concatRegexp(this.base, path);
    else {
      if (path == "/" && this.base != "") path = "";
      path = this.base + path;
    }
    let fns = findFns<Rev>(handlers);
    if (typeof path == "string" && this.pmidds?.[path as string]) {
      fns = this.pmidds[path as string].concat(fns);
    }
    fns = this.midds.concat(fns);
    this.c_routes.push({ method, path, fns });
    return this;
  }
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   */
  get<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("GET", path, ...handlers);
  }
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   */
  post<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("POST", path, ...handlers);
  }
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   */
  put<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("PUT", path, ...handlers);
  }
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   */
  patch<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("PATCH", path, ...handlers);
  }
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   */
  delete<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("DELETE", path, ...handlers);
  }
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
   */
  any<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("ANY", path, ...handlers);
  }
  /**
   * method HEAD (app or router)
   * @example
   * app.head("/", ...handlers);
   */
  head<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("HEAD", path, ...handlers);
  }
  /**
   * method OPTIONS (app or router)
   * @example
   * app.options("/", ...handlers);
   */
  options<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("OPTIONS", path, ...handlers);
  }
  /**
   * method TRACE (app or router)
   * @example
   * app.trace("/", ...handlers);
   */
  trace<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("TRACE", path, ...handlers);
  }
  /**
   * method CONNECT (app or router)
   * @example
   * app.connect("/", ...handlers);
   */
  connect<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this {
    return this.on("CONNECT", path, ...handlers);
  }
  private extractAsset(path: string) {
    const arr = path.split("/");
    arr.shift();
    return arr.reduce((acc, curr, i, arr) => {
      if (this.pmidds?.[acc + "/" + curr]) {
        arr.splice(i);
      }
      return acc + "/" + curr;
    }, "");
  }
  find(
    method: string,
    path: string,
    getPath: (path: string) => string,
    fn404: Handler<Rev>,
    setParam: (p: () => TObject) => void,
    mutate?: () => undefined | string,
  ): Handler<Rev>[] {
    path = getPath(path);
    if (this.route[method + path] && path != "") {
      return this.route[method + path];
    }
    let arr = this.route[method] ?? [];
    if (this.route["ANY"]) arr = this.route["ANY"].concat(arr);
    const r = arr.find((el: TObject) => el.pathx?.test(path));
    if (r) {
      setParam(() => findParams(r, path));
      return r.fns;
    }
    if (path[path.length - 1] == "/") {
      if (path != "/") {
        const _url = path.slice(0, -1);
        if (this.route[method + _url]) {
          return this.route[method + _url];
        }
      }
    }
    const url = mutate?.();
    if (url) return this.find(method, url, getPath, fn404, setParam, void 0);
    if (this.pmidds) {
      let p = this.pmidds[path] ? path : base(path);
      if (path.startsWith(p) && !this.pmidds[p]) p = this.extractAsset(path);
      if (this.pmidds[p]) {
        return this.midds.concat(this.pmidds[p], [fn404]);
      }
    }
    return this.midds.concat([fn404]);
  }
}
