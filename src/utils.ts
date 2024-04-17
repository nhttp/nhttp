import { getError } from "./error.ts";
import type { RequestEvent } from "./request_event.ts";
import type {
  Handler,
  NextFunction,
  RetHandler,
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

class EHeaders {
  constructor(headers: Headers) {
    headers.forEach((v, k) => (this[k.toLowerCase()] = v));
    this.get = (s: string) => headers.get(s);
    this.set = (k: string, v: string) => headers.set(k, v);
    this.append = (k: string, v: string) => headers.append(k, v);
    this.delete = (s: string) => headers.delete(s);
    this.entries = () => headers.entries();
    this.forEach = (a: TRet, b: TRet) => headers.forEach(a, b);
    this.has = (a: TRet) => headers.has(a);
    this.keys = () => headers.keys();
    this.values = () => headers.values();
  }
  [k: string]: TRet;
}

export function findFn(fn: TRet) {
  if (fn.length === 3) {
    const newFn: TRet = (rev: RequestEvent, next: NextFunction) => {
      const response = rev.response;
      if (!rev.__wm) {
        rev.__wm = true;
        rev.headers = <TRet> new EHeaders(rev.headers);
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
    if (el.length > 2) el[1] = el.slice(1).join("=");
    data.push([el[0], duc(el[1])]);
  });
  return myParse(data);
}

export function parseQuery(query: undefined | null | string | FormData) {
  if (typeof query === "string") {
    if (query === "") return {};
    if (query.includes("]=")) return parseQueryArray(query);
    const data: TRet = {};
    const invoke = (key: string) => {
      const el = key.split(/=/);
      if (el.length > 2) el[1] = el.slice(1).join("=");
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
  return (!query) ? {} : myParse(Array.from(query.entries()));
}
export function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix === "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

export function middAssets(str: string) {
  return [
    ((rev, next) => {
      if (str !== "/" && rev.path.startsWith(str)) {
        rev.__prefix = str;
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
        const arr = [] as TRet[];
        pmidds.forEach((el: TObject) => {
          el.path = str + el.path;
          el.pattern = toPathx(el.path, true).pattern;
          arr.push(el);
        });
        base.pmidds = arr;
      }
      base.on(method, _path, [wares, fns]);
    });
  });
}

export const getUrl = (s: string) => s.slice(s.indexOf("/", 8));

export const defError = (
  err: TObject,
  rev: RequestEvent,
  stack: boolean,
): RetHandler => {
  const obj = getError(err, stack);
  rev.response.status(obj.status);
  return obj;
};
