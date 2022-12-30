import { RequestEvent } from "./request_event.ts";
import { Handler, Handlers, TObject, TRet } from "./types.ts";

export const decURI = (str: string) => {
  try {
    return decodeURIComponent(str);
  } catch (_e) {
    return str;
  }
};

export function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix == "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

export function wildcard(path: string | undefined, wild: boolean, match: TRet) {
  const params = match?.groups || {};
  if (!wild) return params;
  if (!path) return params;
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
  if (iof !== -1) return url.substring(0, iof);
  return url;
}

type TRouter = { base?: string };
interface TRouteMatch<Rev extends RequestEvent = RequestEvent> {
  fns: Handler<Rev>[];
  params: TObject | undefined;
}
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
  getRoute(method: string, path: string): TRouteMatch | undefined {
    const route = this.route[method + path];
    if (route == void 0) return;
    if (route.m) return route;
    route.fns = this.midds.concat(route.fns);
    route.m = true;
    this.route[method + path] = route;
    return route;
  }
  /**
   * build handlers (app or router)
   * @example
   * app.on("GET", "/", ...handlers);
   */
  on<T>(method: string, path: string | RegExp, ...handlers: Handlers<Rev & T>) {
    let _path: string | RegExp;
    if (path instanceof RegExp) _path = concatRegexp(this.base, path);
    else {
      if (path === "/" && this.base !== "") path = "";
      _path = this.base + path;
    }
    this.c_routes.push({ method, path: _path, fns: handlers });
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
  find(
    method: string,
    path: string,
    getPath: (path: string) => string,
    fn404: Handler<Rev>,
    mutate?: () => undefined | string,
  ): TRouteMatch<Rev> {
    path = getPath(path);
    if (path == "") {
      const url = mutate?.();
      if (url) return this.find(method, url, getPath, fn404, void 0);
    }
    if (this.route[method + path]) {
      return <TRouteMatch<Rev>> this.getRoute(method, path);
    }
    if (path[path.length - 1] == "/") {
      if (path != "/") {
        const _url = path.slice(0, -1);
        if (this.route[method + _url]) {
          return <TRouteMatch<Rev>> this.getRoute(method, _url);
        }
      }
    }
    let fns: Handler<Rev>[] = [], params: TObject | undefined;
    let i = 0, obj: TObject;
    let arr = this.route[method] ?? [];
    if (this.route["ANY"]) arr = this.route["ANY"].concat(arr);
    const len = arr.length;
    while (i < len) {
      obj = arr[i];
      if (obj.pathx?.test(path)) {
        fns = obj.fns;
        params = wildcard(obj.path, obj.wild, obj.pathx.exec(decURI(path)));
        break;
      }
      i++;
    }
    if (!params) {
      const url = mutate?.();
      if (url) return this.find(method, url, getPath, fn404, void 0);
    }
    if (this.pmidds) {
      const p = base(path || "/");
      if (this.pmidds[p]) fns = this.pmidds[p].concat(fns);
    }
    fns = this.midds.concat(fns, [fn404]);
    return { fns, params };
  }
}
