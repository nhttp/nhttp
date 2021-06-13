import { Handler, RequestEvent } from "./types.ts";

export function modPath(prefix: string): Handler {
  return (rev, next) => {
    rev.url = rev.url.substring(prefix.length) || "/";
    rev.path = rev.path ? rev.path.substring(prefix.length) || "/" : "/";
    rev.headers = rev.request.headers;
    rev.method = rev.request.method;
    rev.respond = ({ body, status, headers }: any) =>
      rev.respondWith(new Response(body, { status, headers }));
    next();
  };
}

export function findFns(arr: any[]): any[] {
  let ret = [] as any, i = 0, len = arr.length;
  for (; i < len; i++) {
    if (Array.isArray(arr[i])) ret = ret.concat(findFns(arr[i]));
    else if (typeof arr[i] === "function") ret.push(arr[i]);
  }
  return ret;
}

export function findUrl(str: string) {
  let idx = [], i = -1;
  while ((i = str.indexOf("/", i + 1)) != -1) {
    idx.push(i);
    if (idx.length === 3) break;
  }
  return str.substring(idx[2]);
}

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

export function parseurl(rev: RequestEvent) {
  let str = rev.url,
    url = rev._parsedUrl;
  if (url !== void 0 && url._raw === str) return url;
  let pathname = str,
    query = null,
    search = null,
    i = 0,
    len = str.length;
  while (i < len) {
    if (str.charCodeAt(i) === 0x3f) {
      pathname = str.substring(0, i);
      query = str.substring(i + 1);
      search = str.substring(i);
      break;
    }
    i++;
  }
  url = {};
  url.path = url._raw = url.href = str;
  url.pathname = pathname;
  url.query = query;
  url.search = search;
  return (rev._parsedUrl = url);
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

function fnWithMiddleware(
  { serializeHeaders }: { serializeHeaders: boolean },
  ...middlewares: any
): Handler;
function fnWithMiddleware(...middlewares: any): Handler;
function fnWithMiddleware(...middlewares: any): Handler {
  let midds = middlewares;
  let serialize = true;
  let larg = midds[0];
  if (typeof larg === "object") {
    serialize = larg.serializeHeaders !== void 0 ? larg.serializeHeaders : true;
  }
  let fns = findFns(midds);
  return (rev, next) => {
    let res = rev.response;
    // misc
    rev.headers = serialize ? Object.fromEntries(rev.request.headers.entries()) : rev.request.headers;
    rev.method = rev.request.method;
    res.setHeader = res.set = res.header;
    res.getHeader = res.get = (a: string) => res.header(a);
    res.hasHeader = (a: string) => res.header(a) !== null;
    res.removeHeader = (a: string) => res.header().delete(a);
    res.end = res.send;
    res.writeHead = (a: number, ...b: any) => {
      res.status(a);
      for (let i = 0; i < b.length; i++) {
        const el = b[i];
        if (typeof el === "object") res.header(el);
      }
    };
    let i = 0, len = fns.length;
    if (len === 0) return next();
    while (i < len) fns[i++](rev, res, next);
  };
}

export const wrapMiddleware = fnWithMiddleware;
