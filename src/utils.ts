import { Cookie, Handler, TSizeList, TWrapMiddleware } from "./types.ts";

const SERIALIZE_COOKIE_REGEXP = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function findFns(arr: any[]): any[] {
  let ret = [] as any, i = 0, len = arr.length;
  for (; i < len; i++) {
    if (Array.isArray(arr[i])) ret = ret.concat(findFns(arr[i]));
    else if (typeof arr[i] === "function") ret.push(arr[i]);
  }
  return ret;
}

export function toBytes(arg: string | number) {
  let sizeList: TSizeList = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  };
  if (typeof arg === "number") return arg;
  let arr = (/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i).exec(arg),
    val: any,
    unt = "b";
  if (!arr) {
    val = parseInt(val, 10);
    unt = "b";
  } else {
    val = parseFloat(arr[1]);
    unt = arr[4].toLowerCase();
  }
  return Math.floor(sizeList[unt] * val);
}

const isObj = (n: any) => n.constructor === Object;
const isArr = (n: any) => Array.isArray(n);
const isBool = (n: any) => n === "true" || n === "false";
const isNum = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);
const mutValue = (n: any, checkFile = false) => {
  if (checkFile && (n instanceof File)) return n;
  if (typeof n === "undefined" || n === "") return null;
  if (isNum(n)) return parseFloat(n);
  if (isBool(n)) return n === "true";
  if (isArr(n)) return mutArr(n, checkFile);
  if (isObj(n)) return mutObj(n);
  return n;
};
const mutArr = (arr: any[], checkFile = false, i = 0) => {
  let ret = [] as any[];
  let len = arr.length;
  while (i < len) {
    ret[i] = mutValue(arr[i], checkFile);
    i++;
  }
  return ret;
};
export const mutObj = (obj: any, checkFile = false) => {
  let ret = {} as any, value;
  for (const k in obj) {
    value = mutValue(obj[k], checkFile);
    if (value !== null) ret[k] = value;
  }
  return ret;
};

export function toPathx(path: string | RegExp, isAny: boolean) {
  if (path instanceof RegExp) return { params: null, pathx: path };
  let trgx = /\?|\*|\./;
  if (!trgx.test(path) && isAny === false) {
    let len = (path.match(/\/:/gi) || []).length;
    if (len === 0) return;
    if (len === 1) {
      let arr = path.split("/:");
      if (arr[arr.length - 1].indexOf("/") === -1) {
        return { params: arr[1], key: arr[0] + "/:p", pathx: null };
      }
    }
  }
  let params: any[] | string | null = [],
    pattern = "",
    strReg = "/([^/]+?)",
    strRegQ = "(?:/([^/]+?))?";
  if (trgx.test(path)) {
    let arr = path.split("/"), obj: string | any[], el: string, i = 0;
    arr[0] || arr.shift();
    for (; i < arr.length; i++) {
      obj = arr[i];
      el = obj[0];
      if (el === "*") {
        params.push("wild");
        pattern += "/(.*)";
      } else if (el === ":") {
        let isQuest = obj.indexOf("?") !== -1, isExt = obj.indexOf(".") !== -1;
        if (isQuest && !isExt) pattern += strRegQ;
        else pattern += strReg;
        if (isExt) {
          let _ext = obj.substring(obj.indexOf("."));
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
  let pathx = new RegExp(`^${pattern}/?$`, "i"),
    matches = path.match(/\:([a-z_-]+)/gi);
  if (!params.length) {
    params = matches && matches.map((e: string) => e.substring(1));
  } else {
    let newArr = matches ? matches.map((e: string) => e.substring(1)) : [];
    params = newArr.concat(params);
  }
  return { params, pathx };
}

function needPatch(data: any, keys: any, value: any) {
  if (keys.length === 0) {
    return value;
  }
  let key = keys.shift();
  if (!key) {
    data = data || [];
    if (Array.isArray(data)) {
      key = data.length;
    }
  }
  let index = +key;
  if (!isNaN(index)) {
    data = data || [];
    key = index;
  }
  data = data || {};
  let val = needPatch(data[key], keys, value);
  data[key] = val;
  return data;
}

export function myParse(arr: any[]) {
  let obj = arr.reduce((red: any, [field, value]: any) => {
    if (red.hasOwnProperty(field)) {
      if (Array.isArray(red[field])) {
        red[field] = [...red[field], value];
      } else {
        red[field] = [red[field], value];
      }
    } else {
      let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);
      if (keys) {
        keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), (m: any) => m[1]);
        value = needPatch(red[prefix], keys, value);
      }
      red[prefix] = value;
    }
    return red;
  }, {});
  return obj;
}

export function parseQuery(query: any) {
  if (query === null) return {};
  if (typeof query === "string") {
    let data = new URLSearchParams("?" + query);
    return myParse(Array.from(data.entries()));
  }
  return myParse(Array.from(query.entries()));
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
  middlewares: any,
  { beforeWrap }: TWrapMiddleware,
): Handler;
function fnWrapMiddleware(
  middlewares: any[],
  { beforeWrap }: TWrapMiddleware,
): Handler;
function fnWrapMiddleware(...middlewares: any): Handler;
function fnWrapMiddleware(...middlewares: any): Handler {
  let midds = middlewares;
  let opts = midds.length && midds[midds.length - 1];
  let beforeWrap = (typeof opts === "object") && opts.beforeWrap;
  let fns = findFns(midds);
  return (rev, next) => {
    let res = rev.response;
    if (rev.__isWrapMiddleware === void 0) {
      rev.headers = rev.request.headers;
      rev.method = rev.request.method;
      res.setHeader = res.set = res.header;
      res.getHeader = res.get = (a: string) => res.header(a);
      res.hasHeader = (a: string) => res.header(a) !== null;
      res.removeHeader = (a: string) => res.header().delete(a);
      res.end = res.send;
      res.writeHead = (a: number, ...b: any) => {
        res.status(a);
        for (let i = 0; i < b.length; i++) {
          if (typeof b[i] === "object") res.header(b[i]);
        }
      };
      rev.respond = ({ body, status, headers }: any) =>
        rev.respondWith(new Response(body, { status, headers }));
      rev.__isWrapMiddleware = true;
    }
    if (beforeWrap) beforeWrap(rev, res);
    let i = 0, len = fns.length;
    if (!len) return next();
    while (i < len) fns[i++](rev, res, next);
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
    let enc = encoder.encode(value);
    value = btoa(enc.toString());
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
    const dec = atob(str);
    const uin = Uint8Array.from(dec.split(",") as any);
    return decoder.decode(uin) || str;
  } catch (error) {
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
    let val = oriVal.join("=");
    ret[key.trim()] = decode ? tryDecode(val) : val;
    i++;
  }
  return ret;
}
