import { HttpRequest, NextFunction, RespondWith } from "./types.ts";

export function parsequery(query: string) {
  return query ? Object.fromEntries(new URLSearchParams(query)) : {};
}

export function modPath(prefix: string) {
  return function (
    request: HttpRequest,
    respondWith: RespondWith,
    next: NextFunction,
  ) {
    request.originalUrl = request.originalUrl.substring(prefix.length) || "/";
    request.path = request.path
      ? request.path.substring(prefix.length) || "/"
      : "/";
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

export function parseurl(request: HttpRequest) {
  let arr = /^(?:\w+\:\/\/)?([^\/]+)(.*)$/.exec(request.url) as any[];
  let str = arr[2] as string,
    url = request._parsedUrl;
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
  return (request._parsedUrl = url);
}
