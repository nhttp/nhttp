import type { RequestEvent } from "./request_event.ts";
import type {
  Handler,
  Handlers,
  NextFunction,
  RouterOrWare,
  TObject,
  TRet,
} from "./types.ts";
import {
  concatRegexp,
  decURIComponent,
  findFns,
  middAssets,
  pushRoutes,
  toPathx,
} from "./utils.ts";
const isArray = Array.isArray;
export function findParams(el: TObject, url: string) {
  const match = el.pattern.exec?.(decURIComponent(url));
  const params = match?.groups ?? {};
  if (el.wild === false || !el.wild || !el.path) return params;
  if (el.path instanceof RegExp) return params;
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

function mutatePath(base: string, str: string) {
  let ori = base + str;
  if (ori !== "/" && ori.endsWith("/")) ori = ori.slice(0, -1);
  let path = ori;
  if (typeof path === "string" && !path.endsWith("*")) {
    if (path === "/") path += "*";
    else path += "/*";
  }
  return { path, ori };
}

export type TRouter = { base?: string };
export const ANY_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
] as const;

type TMethod = typeof ANY_METHODS[number];
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
  midds: TRet[] = [];
  pmidds?: TRet[];
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
  use<T extends unknown = unknown>(
    prefix: string | RouterOrWare<T, Rev> | RouterOrWare<T, Rev>[],
    ...routerOrMiddleware: Array<
      RouterOrWare<T, Rev> | RouterOrWare<T, Rev>[]
    >
  ) {
    let args = routerOrMiddleware, str = "";
    if (typeof prefix === "function" && !args.length) {
      this.midds = this.midds.concat(findFns([prefix]));
      return this;
    }
    if (typeof prefix === "string") str = prefix;
    else args = [prefix].concat(args) as TRet;
    const last = args[args.length - 1] as TObject;
    if (
      typeof last === "object" && (last.c_routes || last[0]?.c_routes)
    ) {
      pushRoutes(str, findFns(args), last, this);
      return this;
    }
    if (str !== "" && str !== "*" && str !== "/*") {
      const { path, ori } = mutatePath(this.base, str);
      const { pattern, wild, path: _path } = toPathx(path, true);
      this.pmidds ??= [];
      const idx = this.pmidds.findIndex((el) => el.path === _path);
      if (idx === -1) {
        this.pmidds.push({
          pattern,
          wild,
          path: _path,
          fns: middAssets(ori).concat(findFns(args)),
        });
      } else {
        this.pmidds[idx].fns = this.pmidds[idx].fns.concat(findFns(args));
      }
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
  on<T extends unknown = unknown>(
    method: string,
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ): this {
    if (path instanceof RegExp) path = concatRegexp(this.base, path);
    else {
      if (path === "/" && this.base != "") path = "";
      path = this.base + path;
    }
    let fns = findFns<Rev>(handlers);
    fns = this.midds.concat(fns);
    this.c_routes.push({ method, path, fns, pmidds: this.pmidds });
    return this;
  }
  /**
   * add method handlers (app or router).
   * @example
   * app.add("GET", "/", ...handlers);
   * app.add(["GET", "POST"], "/", ...handlers);
   */
  add<T extends unknown = unknown>(
    method: TMethod | TMethod[],
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    if (isArray(method)) {
      method.forEach((m) => {
        this.on<T>(m, path, ...handlers);
      });
      return this;
    }
    return this.on<T>(method, path, ...handlers);
  }
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   */
  get<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("GET", path, ...handlers);
  }
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   */
  post<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("POST", path, ...handlers);
  }
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   */
  put<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("PUT", path, ...handlers);
  }
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   */
  patch<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("PATCH", path, ...handlers);
  }
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   */
  delete<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("DELETE", path, ...handlers);
  }
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
   */
  any<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("ANY", path, ...handlers);
  }
  /**
   * method HEAD (app or router)
   * @example
   * app.head("/", ...handlers);
   */
  head<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("HEAD", path, ...handlers);
  }
  /**
   * method OPTIONS (app or router)
   * @example
   * app.options("/", ...handlers);
   */
  options<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("OPTIONS", path, ...handlers);
  }
  /**
   * method TRACE (app or router)
   * @example
   * app.trace("/", ...handlers);
   */
  trace<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("TRACE", path, ...handlers);
  }
  /**
   * method CONNECT (app or router)
   * @example
   * app.connect("/", ...handlers);
   */
  connect<T extends unknown = unknown>(
    path: string | RegExp,
    ...handlers: Handlers<T, Rev>
  ) {
    return this.on<T>("CONNECT", path, ...handlers);
  }
  find(
    method: string,
    path: string,
    setParam: (obj: TObject, route_path: string) => void,
    notFound: (rev: Rev, next: NextFunction) => TRet,
  ): Handler<Rev>[] {
    const fns = this.route[method + path];
    if (fns !== void 0) return isArray(fns) ? fns : [fns];
    const r = this.route[method]?.find((el: TObject) => el.pattern.test(path));
    if (r !== void 0) {
      setParam(findParams(r, path), r.path);
      if (r.wild === false) return r.fns;
      if (r.path !== "*" && r.path !== "/*") return r.fns;
    }
    if (this.pmidds !== void 0) {
      const r = this.pmidds.find((el) => el.pattern.test(path));
      if (r !== void 0) {
        setParam(findParams(r, path), r.path);
        return this.midds.concat(r.fns, [notFound]);
      }
    }
    if (r !== void 0) return r.fns;
    return this.midds.concat([notFound]);
  }
}
