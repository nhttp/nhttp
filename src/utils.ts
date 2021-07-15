import { HttpResponse } from "./http_response.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Cookie,
  Handler,
  NextFunction,
  TObject,
  TSizeList,
  TWrapMiddleware,
} from "./types.ts";

// deno-lint-ignore no-control-regex
const SERIALIZE_COOKIE_REGEXP = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function findFns(arr: TObject[]): Array<unknown> {
  let ret: Array<unknown>[] = [], i = 0;
  const len = arr.length;
  for (; i < len; i++) {
    if (Array.isArray(arr[i])) ret = ret.concat(findFns(arr[i] as TObject[]));
    else if (typeof arr[i] === "function") ret.push(arr[i] as Array<unknown>);
  }
  return ret;
}

export function toBytes(arg: string | number) {
  const sizeList: TSizeList = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  };
  if (typeof arg === "number") return arg;
  const arr = (/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i).exec(arg);
  let val, unt = "b";
  if (!arr) {
    val = parseInt(val as unknown as string, 10);
    unt = "b";
  } else {
    val = parseFloat(arr[1]);
    unt = arr[4].toLowerCase();
  }
  return Math.floor(sizeList[unt] as number * val);
}

export function toPathx(path: string | RegExp, isAny: boolean) {
  if (path instanceof RegExp) return { params: null, pathx: path };
  const trgx = /\?|\*|\./;
  if (!trgx.test(path) && isAny === false) {
    const len = (path.match(/\/:/gi) || []).length;
    if (len === 0) return;
  }
  let params: TObject[] | string | string[] | ConcatArray<string> | null = [],
    pattern = "";
  const strReg = "/([^/]+?)", strRegQ = "(?:/([^/]+?))?";
  if (trgx.test(path)) {
    const arr = path.split("/");
    let obj: string | TObject[], el: string, i = 0;
    arr[0] || arr.shift();
    for (; i < arr.length; i++) {
      obj = arr[i];
      el = obj[0];
      if (el === "*") {
        (params as string[]).push("wild");
        pattern += "/(.*)";
      } else if (el === ":") {
        const isQuest = obj.indexOf("?") !== -1,
          isExt = obj.indexOf(".") !== -1;
        if (isQuest && !isExt) pattern += strRegQ;
        else pattern += strReg;
        if (isExt) {
          const _ext = obj.substring(obj.indexOf("."));
          let _pattern = pattern + (isQuest ? "?" : "") + "\\" + _ext;
          _pattern = _pattern.replaceAll(
            strReg + "\\" + _ext,
            "/([\\w-]+" + _ext + ")",
          );
          pattern = _pattern;
        }
      } else pattern += "/" + obj;
    }
  } else pattern = path.replace(/\/:[a-z_-]+/gi, strReg);
  const pathx = new RegExp(`^${pattern}/?$`, "i"),
    matches = path.match(/\:([a-z_-]+)/gi);
  if (!params.length) {
    params = matches && matches.map((e: string) => e.substring(1));
  } else {
    const newArr = matches ? matches.map((e: string) => e.substring(1)) : [];
    params = newArr.concat(params as ConcatArray<string>);
  }
  return { params, pathx };
}

function needPatch(data: TObject | TObject[], keys: number[], value: string) {
  if (keys.length === 0) {
    return value;
  }
  let key = keys.shift() as number;
  if (!key) {
    data = data || [];
    if (Array.isArray(data)) {
      key = data.length;
    }
  }
  const index = +key;
  if (!isNaN(index)) {
    data = data || [];
    key = index;
  }
  data = (data || {}) as TObject;
  const val = needPatch(data[key] as TObject, keys, value);
  data[key] = val;
  return data;
}

// deno-lint-ignore no-explicit-any
export function myParse(arr: any[]) {
  // deno-lint-ignore no-explicit-any
  const obj = arr.reduce((red: any, [field, value]: any) => {
    if (red.hasOwnProperty(field)) {
      if (Array.isArray(red[field])) {
        red[field] = [...red[field], value];
      } else {
        red[field] = [red[field], value];
      }
    } else {
      let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);
      if (keys) {
        keys = Array.from(
          keys.matchAll(/\[([^\]]*)\]/g),
          (m: Array<number>) => m[1],
        );
        value = needPatch(red[prefix], keys, value);
      }
      red[prefix] = value;
    }
    return red;
  }, {});
  return obj;
}

export function parseQuery(query: unknown | string) {
  if (query === null) return {};
  if (typeof query === "string") {
    const data = new URLSearchParams("?" + query);
    return myParse(Array.from(data.entries()));
  }
  return myParse(Array.from((query as FormData).entries()));
}

/**
 * Wrapper middleware for framework express like (req, res, next)
 * @example
 * ...
 * import cors from "https://esm.sh/cors?no-check";
 * import helmet from "https://esm.sh/helmet?no-check";
 * ...
 * app.use(wrapMiddleware([
 *    cors(),
 *    helmet(),
 * ]));
 */
function fnWrapMiddleware(
  { beforeWrap }: TWrapMiddleware,
): Handler;
function fnWrapMiddleware(
  // deno-lint-ignore no-explicit-any
  middlewares: any,
  { beforeWrap }: TWrapMiddleware,
): Handler;
function fnWrapMiddleware(
  // deno-lint-ignore no-explicit-any
  middlewares: any,
  { beforeWrap }: TWrapMiddleware,
): Handler;
// deno-lint-ignore no-explicit-any
function fnWrapMiddleware(...middlewares: any): Handler;
// deno-lint-ignore no-explicit-any
function fnWrapMiddleware(...middlewares: any): Handler {
  const midds = middlewares;
  const opts = midds.length && midds[midds.length - 1];
  const beforeWrap = (typeof opts === "object") && opts.beforeWrap;
  const fns = findFns(midds) as ((
    req: RequestEvent,
    res: HttpResponse,
    next: NextFunction,
  ) => Promise<void> | void)[];
  return (rev, next) => {
    const res = rev.response;
    if (rev.__isWrapMiddleware === void 0) {
      rev.headers = rev.request.headers;
      rev.method = rev.request.method;
      res.setHeader = res.set = res.header;
      res.getHeader = res.get = (a: string) => res.header(a);
      res.hasHeader = (a: string) => res.header(a) !== null;
      res.removeHeader = (a: string) => res.header().delete(a);
      res.end = res.send;
      // deno-lint-ignore no-explicit-any
      res.writeHead = (a: number, ...b: any) => {
        res.status(a);
        for (let i = 0; i < b.length; i++) {
          if (typeof b[i] === "object") res.header(b[i]);
        }
      };
      rev.respond = ({ body, status, headers }: TObject) =>
        rev.respondWith(
          new Response(body as BodyInit, { status, headers } as TObject),
        );
      rev.__isWrapMiddleware = true;
    }
    if (beforeWrap) beforeWrap(rev, res);
    if (!fns.length) return next();
    let i = 0;
    fns[i++](rev, res, next);
  };
}

export const wrapMiddleware = fnWrapMiddleware;

export function serializeCookie(
  name: string,
  value: string,
  cookie: Cookie = {},
) {
  if (!SERIALIZE_COOKIE_REGEXP.test(name)) {
    throw new TypeError("name is invalid");
  }
  if (value !== "" && !SERIALIZE_COOKIE_REGEXP.test(value)) {
    throw new TypeError("value is invalid");
  }
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
  if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
    ret += `; Max-Age=${cookie.maxAge}`;
  }
  if (cookie.domain) {
    if (!SERIALIZE_COOKIE_REGEXP.test(cookie.domain)) {
      throw new TypeError("domain is invalid");
    }
    ret += `; Domain=${cookie.domain}`;
  }
  if (cookie.sameSite) {
    ret += `; SameSite=${cookie.sameSite}`;
  }
  if (cookie.path) {
    if (!SERIALIZE_COOKIE_REGEXP.test(cookie.path)) {
      throw new TypeError("path is invalid");
    }
    ret += `; Path=${cookie.path}`;
  }
  if (cookie.expires) {
    if (typeof cookie.expires.toUTCString !== "function") {
      throw new TypeError("expires is invalid");
    }
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
        return JSON.parse(json);
      }
    }
    return ret;
  } catch (_error) {
    return str;
  }
}

export function getReqCookies(req: Request, decode?: boolean, i = 0) {
  const str = req.headers.get("Cookie");
  if (str === null) return {};
  const ret = {} as Record<string, string>;
  const arr = str.split(";");
  const len = arr.length;
  while (i < len) {
    const [key, ...oriVal] = arr[i].split("=");
    const val = oriVal.join("=");
    ret[key.trim()] = decode
      ? (val.startsWith("E:") ? tryDecode(val) : val)
      : val;
    i++;
  }
  return ret;
}
