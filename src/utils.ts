import { JSON_TYPE } from "./constant.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Cookie,
  Handler,
  NextFunction,
  TObject,
  TRet,
  TSizeList,
} from "./types.ts";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

type EArr = [string, string | TObject];

export const decURIComponent = (str = "") => {
  if (/%/.test(str)) {
    try {
      return decodeURIComponent(str);
    } catch (_e) { /* noop */ }
  }
  return str;
};

// alias decodeUriComponent
const duc = decURIComponent;

export function findFn(fn: TRet) {
  if (fn.length === 3) {
    const newFn: TRet = (rev: RequestEvent, next: NextFunction) => {
      const response = rev.response;
      if (!rev.__wm) {
        rev.__wm = true;
        response.append ??= (a: string, b: string) =>
          response.header().append(a, b);
        response.set ??= response.header;
        response.get ??= (a: string) => response.header(a);
        response.hasHeader ??= (a: string) => response.header(a) !== undefined;
        response.removeHeader ??= (a: string) => response.header().delete(a);
        response.end ??= response.send;
        response.writeHead ??= (a: number, ...b: TRet) => {
          response.status(a);
          for (let i = 0; i < b.length; i++) {
            if (typeof b[i] === "object") response.header(b[i]);
          }
        };
      }
      return fn(rev, response, next);
    };
    return newFn;
  }
  return fn;
}

export function findFns<Rev extends RequestEvent = RequestEvent>(
  arr: TObject[],
): Handler<Rev>[] {
  let ret: Handler<Rev>[] = [], i = 0;
  const len = arr.length;
  for (; i < len; i++) {
    const fn: TRet = arr[i];
    if (Array.isArray(fn)) {
      ret = ret.concat(findFns<Rev>(fn as TObject[]));
    } else if (typeof fn === "function") {
      if (fn.prototype?.use) {
        ret.push(findFn(fn.prototype.use));
      } else {
        ret.push(findFn(fn));
      }
    }
  }
  return ret;
}

export function toBytes(arg: string | number) {
  if (typeof arg === "number") return arg;
  const sizeList: TSizeList = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  };
  const arr = (/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i).exec(arg);
  let val, unt = "b";
  if (!arr) {
    val = parseInt(arg as unknown as string, 10);
    unt = "b";
  } else {
    val = parseFloat(arr[1]);
    unt = arr[4].toLowerCase();
  }
  return Math.floor(sizeList[unt] as number * val);
}

export function toPathx(path: string | RegExp, flag?: boolean) {
  if (path instanceof RegExp) return { pattern: path, wild: true, path };
  if (/\?|\*|\.|:/.test(path) === false && !flag) {
    return {};
  }
  let wild = false;
  const pattern = new RegExp(`^${
    path
      .replace(/\/$/, "")
      .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
      .replace(/(\/?)\*/g, (_, p) => {
        wild = true;
        return `(${p}.*)?`;
      })
      .replace(/\.(?=[\w(])/, "\\.")
  }/*$`);
  return { pattern, path, wild };
}

export function needPatch(
  data: TObject | TObject[],
  keys: number[],
  value: string,
) {
  if (keys.length === 0) {
    return value;
  }
  let key = keys.shift() as number;
  if (!key) {
    data ??= [];
    if (Array.isArray(data)) {
      key = data.length;
    }
  }
  const index = +key;
  if (!isNaN(index)) {
    data ??= [];
    key = index;
  }
  data = (data || {}) as TObject;
  const val = needPatch(data[key], keys, value);
  if (typeof data === "object") data[key] = val;
  return data;
}

export function myParse(arr: EArr[]) {
  const obj = arr.reduce((red: TObject, [field, value]) => {
    if (red[field]) {
      if (Array.isArray(red[field])) {
        red[field] = [...red[field], value];
      } else {
        red[field] = [red[field], value];
      }
    } else {
      const arr = field.match(/^([^[]+)((?:\[[^\]]*\])*)/) ?? [];
      const prefix = arr[1] ?? field;
      let keys: TRet = <TRet> arr[2];
      if (keys) {
        keys = Array.from(
          keys.matchAll(/\[([^\]]*)\]/g),
          (m: Array<number>) => m[1],
        );
        value = needPatch(red[prefix], keys, value as string);
      }
      red[prefix] = value;
    }
    return red;
  }, {});
  return obj;
}

export function parseQueryArray(query: string) {
  const data = [] as EArr[];
  query.split(/&/).forEach((key) => {
    const el = key.split(/=/);
    data.push([el[0], duc(el[1])]);
  });
  return myParse(data);
}

export function parseQuery(query?: null | string | FormData) {
  if (!query) return {};
  if (typeof query === "string") {
    if (query.includes("]=")) return parseQueryArray(query);
    const data: TRet = {};
    const invoke = (key: string) => {
      const el = key.split(/=/);
      if (data[el[0]] !== void 0) {
        if (!Array.isArray(data[el[0]])) data[el[0]] = [data[el[0]]];
        data[el[0]].push(duc(el[1]));
      } else {
        data[el[0]] = duc(el[1]);
      }
    };
    if (query.includes("&")) query.split(/&/).forEach(invoke);
    else invoke(query);
    return data;
  }
  return myParse(Array.from(query.entries()));
}

export function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix === "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

/**
 * Wrapper middleware for framework express like (req, res, next)
 * @deprecated
 * auto added to `NHttp.use`
 * @example
 * ...
 * import cors from "https://esm.sh/cors?no-check";
 * import helmet from "https://esm.sh/helmet?no-check";
 * ...
 * app.use(expressMiddleware([
 *    cors(),
 *    helmet(),
 * ]));
 */
export function expressMiddleware(...middlewares: TRet): TRet {
  return findFns(middlewares);
}

export function middAssets(str: string) {
  return [
    ((rev, next) => {
      if (rev.path.startsWith(str)) {
        rev.__url = rev.url;
        rev.__path = rev.path;
        rev.url = rev.url.substring(str.length) || "/";
        rev.path = rev.path.substring(str.length) || "/";
      }
      return next();
    }) as Handler,
  ];
}

export function pushRoutes(
  str: string,
  wares: Handler[],
  last: TObject,
  base: TObject,
) {
  str = str === "/" ? "" : str;
  last = Array.isArray(last) ? last : [last];
  last.forEach((obj: TObject) => {
    obj.c_routes.forEach((route: TObject) => {
      const { method, path, fns, pmidds } = route;
      let _path: string | RegExp;
      if (path instanceof RegExp) _path = concatRegexp(str, path);
      else _path = str + path;
      if (pmidds) {
        const obj = {} as TObject;
        for (const k in pmidds) obj[str + k] = pmidds[k];
        base.pmidds = obj;
      }
      base.on(method, _path, [wares, fns]);
    });
  });
}

export const getUrl = (s: string) => s.substring(s.indexOf("/", 8));

export function serializeCookie(
  name: string,
  value: string,
  cookie: Cookie = {},
) {
  cookie.encode = !!cookie.encode;
  if (cookie.encode) {
    value = "E:" + btoa(encoder.encode(value).toString());
  }
  let ret = `${name}=${value}`;
  if (name.startsWith("__Secure")) {
    cookie.secure = true;
  }
  if (name.startsWith("__Host")) {
    cookie.path = "/";
    cookie.secure = true;
    delete cookie.domain;
  }
  if (cookie.secure) {
    ret += `; Secure`;
  }
  if (cookie.httpOnly) {
    ret += `; HttpOnly`;
  }
  if (typeof cookie.maxAge === "number") {
    ret += `; Max-Age=${cookie.maxAge}`;
  }
  if (cookie.domain) {
    ret += `; Domain=${cookie.domain}`;
  }
  if (cookie.sameSite) {
    ret += `; SameSite=${cookie.sameSite}`;
  }
  if (cookie.path) {
    ret += `; Path=${cookie.path}`;
  }
  if (cookie.expires) {
    ret += `; Expires=${cookie.expires.toUTCString()}`;
  }
  if (cookie.other) {
    ret += `; ${cookie.other.join("; ")}`;
  }
  return ret;
}

function tryDecode(str: string) {
  try {
    str = str.substring(2);
    const dec = atob(str);
    const uint = Uint8Array.from(dec.split(",") as Iterable<number>);
    const ret = decoder.decode(uint) || str;
    if (ret !== str) {
      if (ret.startsWith("j:{") || ret.startsWith("j:[")) {
        const json = ret.substring(2);
        return JSON.parse(decURIComponent(json));
      }
    }
    return decURIComponent(ret);
  } catch (_e) {
    return decURIComponent(str);
  }
}

export function getReqCookies(headers: TObject, decode?: boolean, i = 0) {
  if (!(headers instanceof Headers)) headers = new Headers(headers);
  const str = headers.get("Cookie");
  if (str === null) return {};
  const ret = {} as Record<string, string>;
  const arr = str.split(";");
  const len = arr.length;
  while (i < len) {
    const [key, ...oriVal] = arr[i].split("=");
    let val = oriVal.join("=");
    if (decode) {
      ret[key.trim()] = val.startsWith("E:")
        ? tryDecode(val)
        : decURIComponent(val);
    } else {
      val = decURIComponent(val);
      if (val.startsWith("j:{") || val.startsWith("j:[")) {
        const json = val.substring(2);
        ret[key.trim()] = JSON.parse(json);
      } else {
        ret[key.trim()] = val;
      }
    }
    i++;
  }
  return ret;
}
function cloneReq(req: Request, body: TRet) {
  return new Request(req.url, {
    method: req.method,
    body,
    headers: req.headers,
  });
}
export function memoBody(req: Request, body: TRet) {
  try {
    req.json = () => Promise.resolve(JSON.parse(decoder.decode(body)));
    req.text = () => Promise.resolve(decoder.decode(body));
    req.arrayBuffer = () => Promise.resolve(body);
    req.formData = () => cloneReq(req, body).formData();
    req.blob = () => cloneReq(req, body).blob();
  } catch (_e) { /* no_^_op */ }
}
export async function arrayBuffer(req: Request): Promise<ArrayBuffer> {
  const body = await req.arrayBuffer();
  memoBody(req, body);
  return body;
}

export function oldSchool() {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore: Temporary workaround for oldVersion
  Response.json ??= (data: unknown, init: ResInit = {}) => {
    const type = "content-type";
    init.headers ??= {};
    if (init.headers instanceof Headers) {
      init.headers.set(type, init.headers.get(type) ?? JSON_TYPE);
    } else {
      init.headers[type] ??= JSON_TYPE;
    }
    return new Response(JSON.stringify(data), init);
  };
}

export function getRequest(handle: TRet, url: string, init: RequestInit = {}) {
  const res: () => Promise<Response> = () => {
    return handle(
      new Request(
        url[0] === "/" ? "http://127.0.0.1:8787" + url : url,
        init,
      ),
    );
  };
  return {
    text: async () => await (await res()).text(),
    json: async () => await (await res()).json(),
    ok: async () => (await res()).ok,
    status: async () => (await res()).status,
    res,
  };
}
