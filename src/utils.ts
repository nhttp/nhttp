import { Handler, RequestEvent } from "./types.ts";

export function parsequery(query: string) {
  if (!query) return {};
  const qparams = new URLSearchParams(query);
  return Object.fromEntries(
    Array.from(qparams.keys()).map((key) => [
      key,
      qparams.getAll(key).length > 1 ? qparams.getAll(key) : qparams.get(key),
    ]),
  );
}

export function modPath(prefix: string): Handler {
  return (rev, next) => {
    rev.url = rev.url.substring(prefix.length) || "/";
    rev.path = rev.path ? rev.path.substring(prefix.length) || "/" : "/";
    rev.headers = rev.request.headers;
    rev.method = rev.request.method;
    rev.respond = ({ body, status, headers }: any) => rev.respondWith(new Response(body, { status, headers }));
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
  if (url && url._raw === str) return url;
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
