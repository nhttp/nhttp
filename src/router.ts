import { RequestEvent } from "./request_event.ts";
import { Handler, Handlers, TObject, TRet } from "./types.ts";

const decURI = (str: string) => {
  try {
    return decodeURI(str);
  } catch (_e) {
    return str;
  }
};

function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix === "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

function wildcard(path: string | undefined, wild: boolean, match: TRet) {
  const params = match.groups || {};
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

function base(url: string) {
  const iof = url.indexOf("/", 1);
  if (iof !== -1) return url.substring(0, iof);
  return url;
}

type TRouter = { base?: string };
type MethodHandler<
  Rev extends RequestEvent = RequestEvent,
  T = TObject,
> = (path: string | RegExp, ...handlers: Handlers<Rev>) => T;
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
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   */
  get: MethodHandler<Rev, this>;
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   */
  post: MethodHandler<Rev, this>;
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   */
  put: MethodHandler<Rev, this>;
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   */
  patch: MethodHandler<Rev, this>;
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   */
  delete: MethodHandler<Rev, this>;
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
   */
  any: MethodHandler<Rev, this>;
  head: MethodHandler<Rev, this>;
  options: MethodHandler<Rev, this>;
  trace: MethodHandler<Rev, this>;
  connect: MethodHandler<Rev, this>;
  private base = "";
  constructor({ base = "" }: TRouter = {}) {
    this.base = base;
    if (this.base === "/") this.base = "";
    this.get = this.on.bind(this, "GET");
    this.post = this.on.bind(this, "POST");
    this.put = this.on.bind(this, "PUT");
    this.patch = this.on.bind(this, "PATCH");
    this.delete = this.on.bind(this, "DELETE");
    this.any = this.on.bind(this, "ANY");
    this.head = this.on.bind(this, "HEAD");
    this.options = this.on.bind(this, "OPTIONS");
    this.trace = this.on.bind(this, "TRACE");
    this.connect = this.on.bind(this, "CONNECT");
  }
  private single(mtd: string, url: string) {
    let { fns, m } = this.route[mtd + url];
    if (m) return { params: {}, fns };
    fns = this.midds.concat(fns);
    this.route[mtd + url] = { m: true, fns };
    return { params: {}, fns };
  }
  /**
   * build handlers (app or router)
   * @example
   * app.on("GET", "/", ...handlers);
   */
  on(method: string, path: string | RegExp, ...handlers: Handlers<Rev>) {
    let _path: string | RegExp;
    if (path instanceof RegExp) _path = concatRegexp(this.base, path);
    else {
      if (path === "/" && this.base !== "") path = "";
      _path = this.base + path;
    }
    this.c_routes.push({ method, path: _path, fns: handlers });
    return this;
  }
  find(method: string, url: string, fn404: Handler<Rev>) {
    if (this.route[method + url]) {
      return this.single(method, url);
    }
    if (url !== "/" && url[url.length - 1] === "/") {
      const _url = url.slice(0, -1);
      if (this.route[method + _url]) {
        return this.single(method, _url);
      }
    }
    let fns: Handler<Rev>[] = [], params: TObject = {};
    let i = 0, obj: TObject = {};
    let arr = this.route[method] || [];
    let match: TObject;
    if (this.route["ANY"]) arr = this.route["ANY"].concat(arr);
    const len = arr.length;
    while (i < len) {
      obj = arr[i];
      if (obj.pathx && obj.pathx.test(url)) {
        url = decURI(url);
        match = obj.pathx.exec(url);
        fns = obj.fns;
        if (!match) break;
        params = wildcard(obj.path, obj.wild, match);
        break;
      }
      i++;
    }
    if (this.pmidds) {
      const p = base(url || "/");
      if (this.pmidds[p]) fns = this.pmidds[p].concat(fns);
    }
    fns = this.midds.concat(fns, [fn404]);
    return { params, fns };
  }
}
