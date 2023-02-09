var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// npm/src/src/constant.ts
var STATUS_LIST = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Moved Temporarily",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  419: "Insufficient Space on Resource",
  420: "Method Failure",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  507: "Insufficient Storage",
  511: "Network Authentication Required"
};
var ROUTE = {};
var MIME_LIST = {
  aac: "audio/aac",
  abw: "application/x-abiword",
  ai: "application/postscript",
  arc: "application/octet-stream",
  avi: "video/x-msvideo",
  azw: "application/vnd.amazon.ebook",
  bin: "application/octet-stream",
  bz: "application/x-bzip",
  bz2: "application/x-bzip2",
  csh: "application/x-csh",
  css: "text/css",
  csv: "text/csv",
  doc: "application/msword",
  dll: "application/octet-stream",
  eot: "application/vnd.ms-fontobject",
  epub: "application/epub+zip",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  ics: "text/calendar",
  jar: "application/java-archive",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  mid: "audio/midi",
  midi: "audio/midi",
  mp2: "audio/mpeg",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpa: "video/mpeg",
  mpe: "video/mpeg",
  mpeg: "video/mpeg",
  mpkg: "application/vnd.apple.installer+xml",
  odp: "application/vnd.oasis.opendocument.presentation",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odt: "application/vnd.oasis.opendocument.text",
  oga: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  otf: "font/otf",
  png: "image/png",
  pdf: "application/pdf",
  ppt: "application/vnd.ms-powerpoint",
  rar: "application/x-rar-compressed",
  rtf: "application/rtf",
  sh: "application/x-sh",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tar: "application/x-tar",
  tif: "image/tiff",
  tiff: "image/tiff",
  ts: "application/typescript",
  ttf: "font/ttf",
  txt: "text/plain",
  vsd: "application/vnd.visio",
  wav: "audio/x-wav",
  weba: "audio/webm",
  webm: "video/webm",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xhtml: "application/xhtml+xml",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.ms-excel",
  xlsx_OLD: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xml: "application/xml",
  xul: "application/vnd.mozilla.xul+xml",
  zip: "application/zip",
  "3gp": "video/3gpp",
  "3gp_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp",
  "3gp2": "video/3gpp2",
  "3gp2_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp2",
  "7z": "application/x-7z-compressed"
};

// npm/src/src/utils.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var decURIComponent = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (_e) {
    return str;
  }
};
function findFn(fn) {
  if (fn.length === 3) {
    const newFn = (rev, next) => {
      const response = rev.response;
      if (!rev.__wm) {
        rev.__wm = true;
        response.append ??= (a, b) => response.header().append(a, b);
        response.set ??= response.header;
        response.get ??= (a) => response.header(a);
        response.hasHeader ??= (a) => response.header(a) !== void 0;
        response.removeHeader ??= (a) => response.header().delete(a);
        response.end ??= response.send;
        response.writeHead ??= (a, ...b) => {
          response.status(a);
          for (let i = 0; i < b.length; i++) {
            if (typeof b[i] === "object")
              response.header(b[i]);
          }
        };
      }
      return fn(rev, response, next);
    };
    return newFn;
  }
  return fn;
}
function findFns(arr) {
  var _a;
  let ret = [], i = 0;
  const len = arr.length;
  for (; i < len; i++) {
    const fn = arr[i];
    if (Array.isArray(fn)) {
      ret = ret.concat(findFns(fn));
    } else if (typeof fn === "function") {
      if ((_a = fn.prototype) == null ? void 0 : _a.use) {
        ret.push(findFn(fn.prototype.use));
      } else {
        ret.push(findFn(fn));
      }
    }
  }
  return ret;
}
function toBytes(arg) {
  const sizeList = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5)
  };
  if (typeof arg === "number")
    return arg;
  const arr = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i.exec(arg);
  let val, unt = "b";
  if (!arr) {
    val = parseInt(arg, 10);
    unt = "b";
  } else {
    val = parseFloat(arr[1]);
    unt = arr[4].toLowerCase();
  }
  return Math.floor(sizeList[unt] * val);
}
function toPathx(path, flag) {
  if (path instanceof RegExp)
    return { pattern: path, wild: true, path };
  if (/\?|\*|\.|:/.test(path) === false && !flag) {
    return {};
  }
  let wild = false;
  const pattern = new RegExp(`^${path.replace(/\/$/, "").replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3").replace(/(\/?)\*/g, (_, p) => {
    wild = true;
    return `(${p}.*)?`;
  }).replace(/\.(?=[\w(])/, "\\.")}/*$`);
  return { pattern, path, wild };
}
function needPatch(data, keys, value) {
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
  const index = +key;
  if (!isNaN(index)) {
    data = data || [];
    key = index;
  }
  data = data || {};
  const val = needPatch(data[key], keys, value);
  data[key] = val;
  return data;
}
function myParse(arr) {
  const obj = arr.reduce((red, [field, value]) => {
    if (red[field]) {
      if (Array.isArray(red[field])) {
        red[field] = [...red[field], value];
      } else {
        red[field] = [red[field], value];
      }
    } else {
      const arr2 = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/) ?? [];
      const prefix = arr2[1] ?? field;
      let keys = arr2[2];
      if (keys) {
        keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), (m) => m[1]);
        value = needPatch(red[prefix], keys, value);
      }
      red[prefix] = value;
    }
    return red;
  }, {});
  return obj;
}
function parseQuery(query) {
  if (!query)
    return {};
  if (typeof query === "string") {
    let i = 0;
    const arr = query.split("&");
    const data = [], len = arr.length;
    while (i < len) {
      const el = arr[i].split("=");
      data.push([decURIComponent(el[0]), decURIComponent(el[1] || "")]);
      i++;
    }
    return myParse(data);
  }
  return myParse(Array.from(query.entries()));
}
function concatRegexp(prefix, path) {
  if (prefix === "")
    return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}
function expressMiddleware(...middlewares) {
  return findFns(middlewares);
}
function middAssets(str) {
  return [
    (rev, next) => {
      if (rev.path.startsWith(str)) {
        rev.__url = rev.url;
        rev.__path = rev.path;
        rev.url = rev.url.substring(str.length) || "/";
        rev.path = rev.path.substring(str.length) || "/";
      }
      return next();
    }
  ];
}
function pushRoutes(str, wares, last, base2) {
  str = str === "/" ? "" : str;
  last = Array.isArray(last) ? last : [last];
  last.forEach((obj) => {
    obj.c_routes.forEach((route) => {
      const { method, path, fns, pmidds } = route;
      let _path;
      if (path instanceof RegExp)
        _path = concatRegexp(str, path);
      else
        _path = str + path;
      if (pmidds) {
        const obj2 = {};
        for (const k in pmidds)
          obj2[str + k] = pmidds[k];
        base2.pmidds = obj2;
      }
      base2.on(method, _path, [wares, fns]);
    });
  });
}
function getPos(url, k = -1, l = 0) {
  while ((k = url.indexOf("/", k + 1)) != -1) {
    l++;
    if (l == 3)
      break;
  }
  return k;
}
var c_len;
function getUrl(url) {
  return url.substring(c_len ??= getPos(url));
}
function updateLen(url) {
  if (url[0] === "/")
    return;
  const pos = getPos(url);
  if (c_len && c_len != pos) {
    c_len = pos;
    return getUrl(url);
  }
  return;
}
function serializeCookie(name, value, cookie = {}) {
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
function tryDecode(str) {
  try {
    str = str.substring(2);
    const dec = atob(str);
    const uint = Uint8Array.from(dec.split(","));
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
function getReqCookies(headers, decode, i = 0) {
  if (!(headers instanceof Headers))
    headers = new Headers(headers);
  const str = headers.get("Cookie");
  if (str === null)
    return {};
  const ret = {};
  const arr = str.split(";");
  const len = arr.length;
  while (i < len) {
    const [key, ...oriVal] = arr[i].split("=");
    let val = oriVal.join("=");
    if (decode) {
      ret[key.trim()] = val.startsWith("E:") ? tryDecode(val) : decURIComponent(val);
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
var concatUint8Array = (arr) => {
  if (arr.length === 1)
    return arr[0];
  let len = 0;
  arr.forEach((el) => len += el.length);
  const merged = new Uint8Array(len);
  let i = 0;
  arr.forEach((el) => {
    merged.set(el, i);
    i += el.length;
  });
  return merged;
};
function arrayBuffer(request) {
  if (typeof request.arrayBuffer === "function") {
    return request.arrayBuffer();
  }
  if (typeof request.on === "function") {
    return new Promise((ok, no) => {
      const body = [];
      request.on("data", (buf) => body.push(buf)).on("end", () => ok(concatUint8Array(body))).on("error", (err) => no(err));
    });
  }
  return Promise.resolve(new ArrayBuffer(0));
}

// npm/src/src/router.ts
function findParams(el, url) {
  var _a, _b;
  const match = (_b = (_a = el.pattern).exec) == null ? void 0 : _b.call(_a, decURIComponent(url));
  const params = (match == null ? void 0 : match.groups) ?? {};
  if (!el.wild || !el.path)
    return params;
  const path = el.path;
  if (path.indexOf("*") !== -1) {
    match.shift();
    const wild = match.filter((el2) => el2 !== void 0).filter((el2) => el2.startsWith("/")).join("").split("/");
    wild.shift();
    const ret = __spreadProps(__spreadValues({}, params), { wild: wild.filter((el2) => el2 !== "") });
    if (path === "*" || path.indexOf("/*") !== -1)
      return ret;
    let wn = path.split("/").find((el2) => el2.startsWith(":") && el2.endsWith("*"));
    if (!wn)
      return ret;
    wn = wn.slice(1, -1);
    ret[wn] = [ret[wn]].concat(ret.wild).filter((el2) => el2 !== "");
    delete ret.wild;
    return ret;
  }
  return params;
}
function base(url) {
  const iof = url.indexOf("/", 1);
  if (iof != -1)
    return url.substring(0, iof);
  return url;
}
var ANY_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD"
];
var Router = class {
  constructor({ base: base2 = "" } = {}) {
    this.route = {};
    this.c_routes = [];
    this.midds = [];
    this.base = "";
    this.base = base2;
    if (this.base == "/")
      this.base = "";
  }
  use(prefix, ...routerOrMiddleware) {
    var _a;
    let args = routerOrMiddleware, str = "";
    if (typeof prefix === "function" && !args.length) {
      this.midds = this.midds.concat(findFns([prefix]));
      return this;
    }
    if (typeof prefix === "string")
      str = prefix;
    else
      args = [prefix].concat(args);
    const last = args[args.length - 1];
    if (typeof last === "object" && (last.c_routes || ((_a = last[0]) == null ? void 0 : _a.c_routes))) {
      pushRoutes(str, findFns(args), last, this);
      return this;
    }
    if (str !== "" && str !== "*" && str !== "/*") {
      const path = this.base + str;
      this.pmidds ??= {};
      if (!this.pmidds[path]) {
        this.pmidds[path] = middAssets(path);
        if (this["handle"]) {
          ANY_METHODS.forEach((method) => {
            const { pattern, wild } = toPathx(path, true);
            (ROUTE[method] ??= []).push({ path, pattern, wild });
          });
        }
      }
      this.pmidds[path] = this.pmidds[path].concat(findFns(args));
      return this;
    }
    this.midds = this.midds.concat(findFns(args));
    return this;
  }
  on(method, path, ...handlers) {
    if (path instanceof RegExp)
      path = concatRegexp(this.base, path);
    else {
      if (path === "/" && this.base != "")
        path = "";
      path = this.base + path;
    }
    let fns = findFns(handlers);
    fns = this.midds.concat(fns);
    this.c_routes.push({ method, path, fns, pmidds: this.pmidds });
    return this;
  }
  get(path, ...handlers) {
    return this.on("GET", path, ...handlers);
  }
  post(path, ...handlers) {
    return this.on("POST", path, ...handlers);
  }
  put(path, ...handlers) {
    return this.on("PUT", path, ...handlers);
  }
  patch(path, ...handlers) {
    return this.on("PATCH", path, ...handlers);
  }
  delete(path, ...handlers) {
    return this.on("DELETE", path, ...handlers);
  }
  any(path, ...handlers) {
    return this.on("ANY", path, ...handlers);
  }
  head(path, ...handlers) {
    return this.on("HEAD", path, ...handlers);
  }
  options(path, ...handlers) {
    return this.on("OPTIONS", path, ...handlers);
  }
  trace(path, ...handlers) {
    return this.on("TRACE", path, ...handlers);
  }
  connect(path, ...handlers) {
    return this.on("CONNECT", path, ...handlers);
  }
  findPathAssets(path) {
    const paths = path.split("/");
    paths.shift();
    return paths.reduce((acc, curr, i, arr) => {
      var _a;
      if ((_a = this.pmidds) == null ? void 0 : _a[acc + "/" + curr]) {
        arr.splice(i);
      }
      return acc + "/" + curr;
    }, "");
  }
  find(method, url, getPath, setParam, notFound, mutate) {
    var _a;
    const path = getPath(url);
    if (this.route[method + path])
      return this.route[method + path];
    const r = (_a = this.route[method]) == null ? void 0 : _a.find((el) => {
      var _a2;
      return (_a2 = el.pattern) == null ? void 0 : _a2.test(path);
    });
    if (r) {
      setParam(() => findParams(r, path));
      return r.fns;
    }
    if (path !== "/" && path[path.length - 1] === "/") {
      const k = method + path.slice(0, -1);
      if (this.route[k])
        return this.route[k];
    }
    const mut = mutate == null ? void 0 : mutate();
    if (mut)
      return this.find(method, mut, getPath, setParam, notFound, void 0);
    if (this.pmidds) {
      let p = this.pmidds[path] ? path : base(path);
      if (!this.pmidds[p] && path.startsWith(p))
        p = this.findPathAssets(path);
      if (this.pmidds[p]) {
        return this.midds.concat(this.pmidds[p], [notFound]);
      }
    }
    return this.midds.concat([notFound]);
  }
};

// npm/src/src/error.ts
var HttpError = class extends Error {
  constructor(status, message, name) {
    super(message);
    this.status = status ?? 500;
    this.message = message ?? STATUS_LIST[this.status] ?? "Http Error";
    this.name = name ?? (STATUS_LIST[this.status] ?? "Http").replace(/\s/g, "");
    if (!name && !this.name.endsWith("Error")) {
      this.name += "Error";
    }
  }
};
function getError(err, isStack) {
  let status = err.status || err.statusCode || err.code || 500;
  if (typeof status !== "number")
    status = 500;
  let stack = void 0;
  if (isStack) {
    const arr = err.stack ? err.stack.split("\n") : [""];
    arr.shift();
    stack = arr.filter((line) => line.indexOf("file://") !== -1).map((line) => line.trim());
  }
  return {
    status,
    message: err.message || "Something went wrong",
    name: err.name || "HttpError",
    stack
  };
}

// npm/src/src/multipart_parser.ts
var encode = {
  contentType: encoder.encode("Content-Type"),
  filename: encoder.encode("filename"),
  name: encoder.encode(`name="`),
  dashdash: encoder.encode("--"),
  boundaryEqual: encoder.encode("boundary="),
  returnNewline2: encoder.encode("\r\n\r\n"),
  carriageReturn: encoder.encode("\r")
};
function getType(headers) {
  var _a;
  return ((_a = headers.get) == null ? void 0 : _a.call(headers, "content-type")) ?? headers["content-type"];
}
async function multiParser(request) {
  const arrayBuf = await arrayBuffer(request);
  const buf = arrayBuf instanceof Uint8Array ? arrayBuf : new Uint8Array(arrayBuf);
  const boundaryByte = getBoundary(getType(request.headers));
  if (!boundaryByte) {
    return void 0;
  }
  const pieces = getFieldPieces(buf, boundaryByte);
  const form = getForm(pieces);
  return form;
}
function getForm(pieces) {
  const form = { files: {} };
  const arr = [];
  for (const piece of pieces) {
    const { headerByte, contentByte } = splitPiece(piece);
    const headers = getHeaders(headerByte);
    if (typeof headers === "string") {
      if (contentByte.byteLength === 1 && contentByte[0] === 13) {
        continue;
      } else {
        arr.push(`${headers}=${decoder.decode(contentByte)}`);
      }
    } else {
      const file = {
        name: headers.filename,
        type: headers.contentType,
        size: contentByte.byteLength,
        arrayBuffer: () => Promise.resolve(contentByte.buffer)
      };
      if (form.files[headers.name] instanceof Array) {
        form.files[headers.name].push(file);
      } else if (form.files[headers.name]) {
        form.files[headers.name] = [form.files[headers.name], file];
      } else {
        form.files[headers.name] = file;
      }
    }
  }
  return __spreadValues(__spreadValues({}, parseQuery(arr.join("&"))), form.files);
}
function getHeaders(headerByte) {
  const contentTypeIndex = byteIndexOf(headerByte, encode.contentType);
  if (contentTypeIndex < 0) {
    return getNameOnly(headerByte);
  } else {
    return getHeaderNContentType(headerByte, contentTypeIndex);
  }
}
function getHeaderNContentType(headerByte, contentTypeIndex) {
  let headers = {};
  const contentDispositionByte = headerByte.slice(0, contentTypeIndex - 2);
  headers = getHeaderOnly(contentDispositionByte);
  const contentTypeByte = headerByte.slice(contentTypeIndex + encode.contentType.byteLength + 2);
  headers.contentType = decoder.decode(contentTypeByte);
  return headers;
}
function getHeaderOnly(headerLineByte) {
  let headers = {};
  const filenameIndex = byteIndexOf(headerLineByte, encode.filename);
  if (filenameIndex < 0) {
    headers.name = getNameOnly(headerLineByte);
  } else {
    headers = getNameNFilename(headerLineByte, filenameIndex);
  }
  return headers;
}
function getNameNFilename(headerLineByte, filenameIndex) {
  const nameByte = headerLineByte.slice(0, filenameIndex - 2);
  const filenameByte = headerLineByte.slice(filenameIndex + encode.filename.byteLength + 2, headerLineByte.byteLength - 1);
  const name = getNameOnly(nameByte);
  const filename = decoder.decode(filenameByte);
  return { name, filename };
}
function getNameOnly(headerLineByte) {
  const nameIndex = byteIndexOf(headerLineByte, encode.name);
  const nameByte = headerLineByte.slice(nameIndex + encode.name.byteLength, headerLineByte.byteLength - 1);
  return decoder.decode(nameByte);
}
function splitPiece(piece) {
  const contentIndex = byteIndexOf(piece, encode.returnNewline2);
  const headerByte = piece.slice(0, contentIndex);
  const contentByte = piece.slice(contentIndex + 4);
  return { headerByte, contentByte };
}
function getFieldPieces(buf, boundaryByte) {
  const startBoundaryByte = concat(encode.dashdash, boundaryByte);
  const endBoundaryByte = concat(startBoundaryByte, encode.dashdash);
  const pieces = [];
  while (!startsWith(buf, endBoundaryByte)) {
    buf = buf.slice(startBoundaryByte.byteLength + 2);
    const boundaryIndex = byteIndexOf(buf, startBoundaryByte);
    pieces.push(buf.slice(0, boundaryIndex - 2));
    buf = buf.slice(boundaryIndex);
  }
  return pieces;
}
function getBoundary(contentType) {
  const contentTypeByte = encoder.encode(contentType);
  const boundaryIndex = byteIndexOf(contentTypeByte, encode.boundaryEqual);
  if (boundaryIndex >= 0) {
    const boundary = contentTypeByte.slice(boundaryIndex + encode.boundaryEqual.byteLength);
    return boundary;
  } else {
    return void 0;
  }
}
function byteIndexOf(source, pattern, fromIndex = 0) {
  if (fromIndex >= source.length) {
    return -1;
  }
  const s = pattern[0];
  for (let i = fromIndex; i < source.length; i++) {
    if (source[i] !== s)
      continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while (matched < pattern.length) {
      j++;
      if (source[j] !== pattern[j - pin]) {
        break;
      }
      matched++;
    }
    if (matched === pattern.length) {
      return pin;
    }
  }
  return -1;
}
function startsWith(source, prefix) {
  for (let i = 0, max = prefix.length; i < max; i++) {
    if (source[i] !== prefix[i])
      return false;
  }
  return true;
}
function concat(...buf) {
  let length = 0;
  for (const b of buf) {
    length += b.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const b1 of buf) {
    output.set(b1, index);
    index += b1.length;
  }
  return output;
}

// npm/src/src/multipart.ts
var uid = () => `${performance.now().toString(36)}${Math.random().toString(36).slice(5)}`.replace(".", "");
var Multipart = class {
  createBody(formData, { parse } = {}) {
    return parse ? parse(Object.fromEntries(Array.from(formData.keys()).map((key) => [
      key,
      formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
    ]))) : parseQuery(formData);
  }
  isFile(file) {
    return typeof file === "object" && typeof file.arrayBuffer === "function";
  }
  cleanUp(body) {
    for (const key in body) {
      if (Array.isArray(body[key])) {
        const arr = body[key];
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          if (this.isFile(el)) {
            delete body[key];
            break;
          }
        }
      } else if (this.isFile(body[key])) {
        delete body[key];
      }
    }
  }
  validate(files, opts) {
    let j = 0;
    const len = files.length;
    if (opts == null ? void 0 : opts.maxCount) {
      if (len > opts.maxCount) {
        throw new HttpError(400, `${opts.name} no more than ${opts.maxCount} file`, "BadRequestError");
      }
    }
    while (j < len) {
      const file = files[j];
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts == null ? void 0 : opts.accept) {
        if (!opts.accept.includes(ext)) {
          throw new HttpError(400, `${opts.name} only accept ${opts.accept}`, "BadRequestError");
        }
      }
      if (opts == null ? void 0 : opts.maxSize) {
        if (file.size > toBytes(opts.maxSize)) {
          throw new HttpError(400, `${opts.name} to large, maxSize = ${opts.maxSize}`, "BadRequestError");
        }
      }
      j++;
    }
  }
  async privUpload(files, opts) {
    let i = 0;
    const len = files.length;
    while (i < len) {
      const file = files[i];
      if (opts.callback) {
        await opts.callback(file);
      }
      opts.dest ??= "";
      if (opts.dest) {
        if (opts.dest.lastIndexOf("/") === -1)
          opts.dest += "/";
        if (opts.dest[0] === "/")
          opts.dest = opts.dest.substring(1);
      }
      file.filename ??= uid() + "_" + file.name;
      file.path ??= opts.dest + file.filename;
      opts.writeFile ??= Deno.writeFile;
      const arrBuff = await file.arrayBuffer();
      await opts.writeFile(file.path, new Uint8Array(arrBuff));
      i++;
    }
  }
  upload(options) {
    return async (rev, next) => {
      const headers = rev.headers;
      if (rev.bodyValid) {
        const isMultipart = acceptContentType(headers, "multipart/form-data");
        if (rev.bodyUsed === false && isMultipart) {
          if (typeof rev.request.formData === "function") {
            const formData = await rev.request.formData();
            rev.body = await this.createBody(formData, {
              parse: rev.__parseMultipart
            });
          } else {
            rev.body = await multiParser(rev.request) || {};
          }
        }
        if (Array.isArray(options)) {
          let j = 0, i = 0;
          const len = options.length;
          while (j < len) {
            const obj = options[j];
            if (obj.required && rev.body[obj.name] === void 0) {
              throw new HttpError(400, `Field ${obj.name} is required`, "BadRequestError");
            }
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              this.validate(files, obj);
            }
            j++;
          }
          while (i < len) {
            const obj = options[i];
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              await this.privUpload(files, obj);
              delete rev.body[obj.name];
            }
            i++;
          }
          this.cleanUp(rev.body);
        } else if (typeof options === "object") {
          const obj = options;
          if (obj.required && rev.body[obj.name] === void 0) {
            throw new HttpError(400, `Field ${obj.name} is required`, "BadRequestError");
          }
          if (rev.body[obj.name]) {
            rev.file[obj.name] = rev.body[obj.name];
            const objFile = rev.file[obj.name];
            const files = Array.isArray(objFile) ? objFile : [objFile];
            this.validate(files, obj);
            await this.privUpload(files, obj);
            delete rev.body[obj.name];
          }
          this.cleanUp(rev.body);
        }
      }
      return next();
    };
  }
};
var multipart = new Multipart();

// npm/src/src/body.ts
var defautl_size = "3mb";
async function verifyBody(req, limit) {
  const arrBuff = await arrayBuffer(req);
  if (limit && arrBuff.byteLength > toBytes(limit)) {
    throw new HttpError(400, `Body is too large. max limit ${limit}`, "BadRequestError");
  }
  const body = decURIComponent(decoder.decode(arrBuff));
  return body;
}
function acceptContentType(headers, cType) {
  var _a;
  const type = ((_a = headers.get) == null ? void 0 : _a.call(headers, "content-type")) ?? headers["content-type"];
  return type === cType || (type == null ? void 0 : type.includes(cType));
}
function isValidBody(validate) {
  if (validate === false || validate === 0)
    return false;
  if (validate === void 0 || validate === true) {
    validate = defautl_size;
  }
  return true;
}
async function jsonBody(validate, rev, next) {
  if (!isValidBody(validate))
    return next();
  try {
    const body = await verifyBody(rev.request, validate);
    rev.body = JSON.parse(body);
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}
async function urlencodedBody(validate, parseQuery2, rev, next) {
  if (!isValidBody(validate))
    return next();
  try {
    const body = await verifyBody(rev.request, validate);
    const parse = parseQuery2 || parseQuery;
    rev.body = parse(body);
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}
async function rawBody(validate, rev, next) {
  if (!isValidBody(validate))
    return next();
  try {
    const body = await verifyBody(rev.request, validate);
    try {
      rev.body = JSON.parse(body);
    } catch (_err) {
      rev.body = { _raw: body };
    }
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}
async function multipartBody(validate, parseMultipart, rev, next) {
  if (validate === false || validate === 0)
    return next();
  try {
    if (typeof rev.request.formData === "function") {
      const formData = await rev.request.formData();
      rev.body = await multipart.createBody(formData, {
        parse: parseMultipart
      });
    } else {
      rev.body = await multiParser(rev.request) || {};
    }
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}
function bodyParser(opts, parseQuery2, parseMultipart) {
  const ret = (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD" || opts === false || !rev.bodyValid || rev.bodyUsed)
      return next();
    if (opts === void 0 || opts === true)
      opts = {};
    const headers = rev.headers;
    if (acceptContentType(headers, "application/json")) {
      return jsonBody(opts.json, rev, next);
    }
    if (acceptContentType(headers, "application/x-www-form-urlencoded")) {
      return urlencodedBody(opts.urlencoded, parseQuery2, rev, next);
    }
    if (acceptContentType(headers, "text/plain")) {
      return rawBody(opts.raw, rev, next);
    }
    if (acceptContentType(headers, "multipart/form-data")) {
      return multipartBody(opts.multipart, parseMultipart, rev, next);
    }
    return next();
  };
  return ret;
}

// npm/src/src/symbol.ts
var s_url = Symbol("url");
var s_path = Symbol("path");
var s_f_route = Symbol("find_route");
var s_query = Symbol("query");
var s_route = Symbol("route");
var s_params = Symbol("params");
var s_file = Symbol("file");
var s_body = Symbol("body");
var s_search = Symbol("search");
var s_headers = Symbol("headers");
var s_method = Symbol("method");
var s_cookies = Symbol("cookies");
var s_res = Symbol("http_res");
var s_body_used = Symbol("req_body_used");
var s_response = Symbol("res");
var s_promise_response = Symbol("promise_res");

// npm/src/src/http_response.ts
var JSON_TYPE_CHARSET = "application/json; charset=UTF-8";
var HTML_TYPE_CHARSET = "text/html; charset=UTF-8";
var HttpResponse = class {
  constructor(_send) {
    this._send = _send;
  }
  header(key, value) {
    if (!this.init)
      this.init = {};
    if (this.init.headers) {
      if (this.init.headers instanceof Headers) {
        this.init.headers = Object.fromEntries(this.init.headers.entries());
      }
    } else
      this.init.headers = {};
    if (typeof key === "string") {
      key = key.toLowerCase();
      if (!value) {
        return this.init.headers[key];
      }
      this.init.headers[key] = value;
      return this;
    }
    if (typeof key === "object") {
      if (key instanceof Headers)
        key = Object.fromEntries(key.entries());
      for (const k in key)
        this.init.headers[k.toLowerCase()] = key[k];
      return this;
    }
    return this.init.headers = new Headers(this.init.headers);
  }
  status(code) {
    var _a;
    if (code) {
      this.init ??= {};
      this.init.statusText = STATUS_LIST[code];
      this.init.status = code;
      return this;
    }
    return ((_a = this.init) == null ? void 0 : _a.status) || 200;
  }
  sendStatus(code) {
    if (code > 511)
      code = 500;
    const status = STATUS_LIST[code];
    try {
      this.status(code).send(status);
    } catch (_e) {
      this.status(code).send(null);
    }
  }
  attachment(filename) {
    const c_dis = filename ? `attachment; filename=${filename}` : "attachment;";
    return this.header("content-disposition", c_dis);
  }
  setHeader(key, value) {
    return this.header(key, value);
  }
  getHeader(key) {
    return this.header(key);
  }
  get statusCode() {
    return this.status();
  }
  set statusCode(val) {
    this.status(val);
  }
  get params() {
    return this[s_params] ??= {};
  }
  set params(val) {
    this[s_params] = val;
  }
  type(contentType) {
    return this.header("content-type", MIME_LIST[contentType] ?? contentType);
  }
  send(body) {
    this._send(body);
  }
  json(body) {
    this.send(body);
  }
  redirect(url, status) {
    this.header("Location", url).status(status ?? 302).send();
  }
  cookie(name, value, opts = {}) {
    opts.httpOnly = opts.httpOnly !== false;
    opts.path = opts.path || "/";
    if (opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
      opts.maxAge /= 1e3;
    }
    value = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);
    this.header().append("Set-Cookie", serializeCookie(name, value, opts));
    return this;
  }
  clearCookie(name, opts = {}) {
    opts.httpOnly = opts.httpOnly !== false;
    this.header().append("Set-Cookie", serializeCookie(name, "", __spreadProps(__spreadValues({}, opts), { expires: new Date(0) })));
  }
  [Symbol.for("Deno.customInspect")](inspect) {
    const ret = {
      clearCookie: this.clearCookie,
      cookie: this.cookie,
      getHeader: this.getHeader,
      header: this.header,
      json: this.json,
      params: this.params,
      statusCode: this.statusCode,
      redirect: this.redirect,
      attachment: this.attachment,
      render: this.render,
      send: this.send,
      sendStatus: this.sendStatus,
      setHeader: this.setHeader,
      status: this.status,
      type: this.type
    };
    return `${this.constructor.name} ${inspect(ret)}`;
  }
};
var JsonResponse = class extends Response {
  constructor(body, resInit = {}) {
    if (resInit.headers) {
      if (resInit.headers instanceof Headers) {
        resInit.headers.set("content-type", JSON_TYPE_CHARSET);
      } else
        resInit.headers["content-type"] = JSON_TYPE_CHARSET;
    } else
      resInit.headers = { "content-type": JSON_TYPE_CHARSET };
    super(JSON.stringify(body), resInit);
  }
};

// npm/src/src/request_event.ts
var RequestEvent = class {
  constructor(request, _info, _ctx) {
    this.request = request;
    this._info = _info;
    this._ctx = _ctx;
    this.method = request.method;
  }
  get response() {
    if (this._ctx && typeof this._ctx === "function") {
      return this[s_res] ??= this._ctx(this._info, this.send.bind(this));
    }
    return this[s_res] ??= new HttpResponse(this.send.bind(this));
  }
  get route() {
    var _a;
    if (this[s_route])
      return this[s_route];
    let path = this.path;
    if (path !== "/" && path[path.length - 1] === "/") {
      path = path.slice(0, -1);
    }
    const ret = (_a = ROUTE[this.method]) == null ? void 0 : _a.find((o) => {
      var _a2;
      return ((_a2 = o.pattern) == null ? void 0 : _a2.test(path)) || o.path === path;
    });
    if (ret) {
      if (!ret.pattern) {
        Object.assign(ret, toPathx(ret.path, true));
      }
      ret.method = this.method;
      ret.query = this.query;
      ret.params = findParams(ret, path);
    }
    return this[s_route] ??= ret ?? {};
  }
  get info() {
    const flag = typeof this._ctx === "function";
    const info = flag ? {} : this._info ?? {};
    const context = flag ? {} : this._ctx ?? {};
    return { conn: info, env: info, context };
  }
  waitUntil(promise) {
    if (promise instanceof Promise) {
      promise.catch(console.error);
      return;
    }
    throw new HttpError(500, `${promise} is not a Promise.`);
  }
  respondWith(r) {
    this[s_response] = r;
  }
  send(body) {
    var _a, _b, _c, _d;
    if (typeof body === "string") {
      this[s_response] = new Response(body, (_a = this[s_res]) == null ? void 0 : _a.init);
    } else if (body instanceof Response) {
      this[s_response] = body;
    } else if (typeof body === "object") {
      if (body === null || body instanceof Uint8Array || body instanceof ReadableStream || body instanceof Blob) {
        this[s_response] = new Response(body, (_b = this[s_res]) == null ? void 0 : _b.init);
      } else {
        const init = ((_c = this[s_res]) == null ? void 0 : _c.init) ?? {};
        if (init.headers) {
          if (init.headers instanceof Headers) {
            init.headers.set("content-type", JSON_TYPE_CHARSET);
          } else {
            init.headers["content-type"] = JSON_TYPE_CHARSET;
          }
        } else {
          init.headers = { "content-type": JSON_TYPE_CHARSET };
        }
        this[s_response] = new Response(JSON.stringify(body), init);
      }
    } else {
      this[s_response] = new Response(body, (_d = this[s_res]) == null ? void 0 : _d.init);
    }
  }
  get responseInit() {
    var _a;
    return ((_a = this[s_res]) == null ? void 0 : _a.init) ?? {};
  }
  get search() {
    return this[s_search] ?? null;
  }
  set search(val) {
    this[s_search] = val;
  }
  get bodyUsed() {
    var _a;
    return this[s_body_used] ?? ((_a = this.request) == null ? void 0 : _a.bodyUsed) ?? false;
  }
  set bodyUsed(val) {
    this[s_body_used] = val;
  }
  get bodyValid() {
    if (this.request.url[0] !== "/") {
      if (this.request.body)
        return true;
      return false;
    }
    return true;
  }
  get params() {
    var _a;
    return this[s_params] ??= ((_a = this.__params) == null ? void 0 : _a.call(this)) ?? {};
  }
  set params(val) {
    this[s_params] = val;
  }
  get url() {
    return this[s_url] ??= this.originalUrl;
  }
  set url(val) {
    this[s_url] = val;
  }
  get originalUrl() {
    if (this.request.url[0] !== "/") {
      return getUrl(this.request.url);
    }
    return this.request.url;
  }
  get path() {
    return this[s_path] ??= this.url;
  }
  set path(val) {
    this[s_path] = val;
  }
  get query() {
    var _a, _b;
    return this[s_query] ??= ((_b = this.__parseQuery) == null ? void 0 : _b.call(this, (_a = this.search) == null ? void 0 : _a.substring(1))) ?? {};
  }
  set query(val) {
    this[s_query] = val;
  }
  get body() {
    return this[s_body] ??= {};
  }
  set body(val) {
    this[s_body] = val;
  }
  get headers() {
    return this[s_headers] ??= this.request.headers;
  }
  set headers(val) {
    this[s_headers] = val;
  }
  get file() {
    return this[s_file] ??= {};
  }
  set file(val) {
    this[s_file] = val;
  }
  get cookies() {
    return this[s_cookies] ??= getReqCookies(this.request.headers, true);
  }
  set cookies(val) {
    this[s_cookies] = val;
  }
  getCookies(decode) {
    return getReqCookies(this.headers, decode);
  }
  [Symbol.for("Deno.customInspect")](inspect) {
    const ret = {
      body: this.body,
      bodyUsed: this.bodyUsed,
      bodyValid: this.bodyValid,
      cookies: this.cookies,
      file: this.file,
      headers: this.headers,
      info: this.info,
      method: this.method,
      originalUrl: this.originalUrl,
      params: this.params,
      path: this.path,
      query: this.query,
      request: this.request,
      responseInit: this.responseInit,
      respondWith: this.respondWith,
      response: this.response,
      route: this.route,
      search: this.search,
      send: this.send,
      url: this.url,
      waitUntil: this.waitUntil
    };
    return `${this.constructor.name} ${inspect(ret)}`;
  }
};

// npm/src/src/nhttp.ts
var defError = (err, rev, stack) => {
  const obj = getError(err, stack);
  return rev.response.status(obj.status).json(obj);
};
var awaiter = (rev) => {
  return (async (t, d) => {
    while (rev[s_response] === void 0) {
      await new Promise((ok) => setTimeout(ok, t));
      if (t === d)
        break;
      t++;
    }
    return rev[s_response];
  })(0, 100);
};
var resend = (ret, rev, next) => {
  if (ret) {
    if (ret instanceof Promise) {
      return ret.then((val) => {
        if (val)
          rev.send(val);
        return rev[s_response] ?? awaiter(rev);
      }).catch(next);
    }
    rev.send(ret);
  }
  return rev[s_response] ?? awaiter(rev);
};
var NHttp = class extends Router {
  constructor({ parseQuery: parseQuery2, bodyParser: bodyParser2, env, flash, stackError } = {}) {
    super();
    this.parseQuery = parseQuery2 || parseQuery;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    this.handleEvent = (event) => {
      return this.handleRequest(event.request);
    };
    this.handle = (request, conn, ctx) => {
      return this.handleRequest(request, conn, ctx);
    };
    if (parseQuery2) {
      this.use((rev, next) => {
        rev.__parseMultipart = parseQuery2;
        return next();
      });
    }
    this.parseMultipart = parseQuery2;
    this.bodyParser = bodyParser2;
  }
  onError(fn) {
    this._onError = (err, rev) => {
      try {
        let status = err.status || err.statusCode || err.code || 500;
        if (typeof status !== "number")
          status = 500;
        rev.response.status(status);
        return fn(err, rev, (e) => {
          if (e) {
            return rev.response.status(e.status ?? 500).send(String(e));
          }
          return this._on404(rev);
        });
      } catch (err2) {
        return defError(err2, rev, this.stackError);
      }
    };
    return this;
  }
  on404(fn) {
    const def = this._on404.bind(this);
    this._on404 = (rev) => {
      try {
        rev.response.status(404);
        return fn(rev, (e) => {
          if (e) {
            return this._onError(e, rev);
          }
          return def(rev);
        });
      } catch (err) {
        return defError(err, rev, this.stackError);
      }
    };
    return this;
  }
  on(method, path, ...handlers) {
    var _a;
    let fns = findFns(handlers);
    if (typeof path === "string") {
      if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      for (const k in this.pmidds) {
        if (k === path || ((_a = toPathx(k).pattern) == null ? void 0 : _a.test(path))) {
          fns = this.pmidds[k].concat([(rev, next) => {
            if (rev.__url && rev.__path) {
              rev.url = rev.__url;
              rev.path = rev.__path;
            }
            return next();
          }], fns);
        }
      }
    }
    fns = this.midds.concat(fns);
    const { path: oriPath, pattern, wild } = toPathx(path);
    const invoke = (m) => {
      if (pattern) {
        const idx = (this.route[m] ??= []).findIndex(({ path: path2 }) => path2 === oriPath);
        if (idx != -1) {
          this.route[m][idx].fns = this.route[m][idx].fns.concat(fns);
        } else {
          this.route[m].push({
            path: oriPath,
            pattern,
            fns,
            wild
          });
          (ROUTE[m] ??= []).push({ path, pattern, wild });
        }
      } else {
        const key = m + path;
        if (this.route[key]) {
          this.route[key] = this.route[key].concat(fns);
        } else {
          this.route[key] = fns;
          (ROUTE[m] ??= []).push({ path });
        }
      }
    };
    if (method === "ANY")
      ANY_METHODS.forEach(invoke);
    else
      invoke(method);
    return this;
  }
  engine(renderFile, opts = {}) {
    this.use(({ response }, next) => {
      response.render = (elem, params, ...args) => {
        if (typeof elem === "string") {
          if (opts.ext) {
            if (!elem.includes(".")) {
              elem += "." + opts.ext;
            }
          }
          if (opts.base) {
            if (!opts.base.endsWith("/")) {
              opts.base += "/";
            }
            if (opts.base[0] === "/") {
              opts.base = opts.base.substring(1);
            }
            elem = opts.base + elem;
          }
        }
        params ??= response.params;
        response.type(HTML_TYPE_CHARSET);
        const ret = renderFile(elem, params, ...args);
        if (ret) {
          if (ret instanceof Promise) {
            return ret.then((val) => response.send(val)).catch(next);
          }
          return response.send(ret);
        }
        return ret;
      };
      return next();
    });
  }
  matchFns(rev, url) {
    return this.find(rev.method, url, (str) => {
      const iof = str.indexOf("?");
      if (iof != -1) {
        rev.path = str.substring(0, iof);
        rev.__parseQuery = this.parseQuery;
        rev.search = str.substring(iof);
        return rev.path;
      }
      return str;
    }, (p) => {
      rev.__params = p;
    }, this._on404, () => updateLen(rev.request.url));
  }
  handleRequest(req, conn, ctx) {
    let i = 0;
    const url = getUrl(req.url);
    const rev = new RequestEvent(req, conn, ctx);
    const fns = this.route[rev.method + url] ?? this.matchFns(rev, url);
    const next = (err) => {
      try {
        const ret = err ? this._onError(err, rev) : (fns[i++] ?? this._on404)(rev, next);
        return rev[s_response] ?? resend(ret, rev, next);
      } catch (e) {
        return next(e);
      }
    };
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        const ret = fns[i++](rev, next);
        return rev[s_response] ?? resend(ret, rev, next);
      } catch (e) {
        return next(e);
      }
    }
    return bodyParser(this.bodyParser, this.parseQuery, this.parseMultipart)(rev, next);
  }
  listen(opts, callback) {
    return (async () => {
      let isTls = false, handler = this.handle;
      if (typeof opts === "number") {
        opts = { port: opts };
      } else if (typeof opts === "object") {
        isTls = opts.certFile !== void 0 || opts.cert !== void 0 || opts.alpnProtocols !== void 0;
        if (opts.handler)
          handler = opts.handler;
      }
      const runCallback = (err) => {
        if (callback) {
          const _opts = opts;
          callback(err, __spreadProps(__spreadValues({}, _opts), {
            hostname: _opts.hostname ?? "localhost"
          }));
          return true;
        }
        return;
      };
      try {
        if (this.flash) {
          if (Deno.serve == void 0) {
            console.log("Deno flash is unstable. please add --unstable flag.");
            return;
          }
          if (runCallback()) {
            opts.onListen = () => {
            };
          }
          opts.handler ??= handler;
          if (opts.test)
            return;
          await Deno.serve(opts);
        } else {
          runCallback();
          if (opts.signal) {
            opts.signal.addEventListener("abort", () => {
              var _a;
              try {
                (_a = this.server) == null ? void 0 : _a.close();
              } catch (_e) {
              }
            }, { once: true });
          }
          if (opts.test)
            return;
          this.server = (isTls ? Deno.listenTls : Deno.listen)(opts);
          while (true) {
            try {
              const conn = await this.server.accept();
              if (conn) {
                this.handleConn(conn, handler);
              } else {
                break;
              }
            } catch (_e) {
            }
          }
        }
      } catch (error) {
        runCallback(error);
      }
    })();
  }
  _onError(err, rev) {
    return defError(err, rev, this.stackError);
  }
  _on404(rev) {
    const obj = getError(new HttpError(404, `Route ${rev.method}${rev.url} not found`, "NotFoundError"));
    return rev.response.status(obj.status).json(obj);
  }
  async handleConn(conn, handler) {
    try {
      const httpConn = Deno.serveHttp(conn);
      while (true) {
        try {
          const rev = await httpConn.nextRequest();
          if (rev) {
            await rev.respondWith(handler(rev.request, conn));
          } else {
            break;
          }
        } catch (_err) {
          break;
        }
      }
    } catch (_e) {
    }
  }
};
function nhttp(opts = {}) {
  return new NHttp(opts);
}
nhttp.Router = function(opts = {}) {
  return new Router(opts);
};

// npm/src/index.ts
function buildRes(response, send) {
  var _a;
  const _res = new HttpResponse(send);
  _res.header = function header(key, value) {
    if (typeof key === "string") {
      key = key.toLowerCase();
      if (!value)
        return response.getHeader(key);
      response.setHeader(key, value);
      return this;
    }
    if (typeof key === "object") {
      for (const k in key)
        response.setHeader(k.toLowerCase(), key[k]);
      return this;
    }
    return {
      has: response.hasHeader,
      delete: response.removeHeader,
      set: response.setHeader,
      get: response.getHeader,
      append: function(key2, value2) {
        const cur = response.getHeader(key2);
        response.setHeader(key2, cur ? cur + ", " + value2 : value2);
      }
    };
  };
  _res.status = function status(code) {
    if (code) {
      response.statusCode = code;
      return this;
    }
    return response.statusCode;
  };
  response.header = _res.header.bind(_res);
  response.status = _res.status.bind(_res);
  response.clearCookie = _res.clearCookie.bind(_res);
  response.cookie = _res.cookie.bind(_res);
  response.json = _res.json.bind(_res);
  response.params = _res.params;
  response.redirect = _res.redirect.bind(_res);
  response.attachment = _res.attachment.bind(_res);
  response.render = (_a = _res.render) == null ? void 0 : _a.bind(_res);
  response.send = _res.send.bind(_res);
  response.sendStatus = _res.sendStatus.bind(_res);
  response.type = _res.type.bind(_res);
  return response;
}
var NHttp2 = class extends NHttp {
  constructor(opts = {}) {
    super(opts);
    this.handleWorkers = this.handle;
    this.handle = (req, conn, ctx) => {
      if (typeof req.on === "function") {
        return this.handleRequestNode(req, conn);
      }
      return this["handleRequest"](req, conn, ctx);
    };
    this.handleNode = (req, res) => {
      return this.handleRequestNode(req, res);
    };
    const oriListen = this.listen.bind(this);
    this.listen = async (opts2, callback) => {
      if (typeof Deno !== "undefined") {
        this.handle = this.handleWorkers;
        return oriListen(opts2, callback);
      }
      let isTls = false, handler = this.handleWorkers;
      if (typeof opts2 === "number") {
        opts2 = { port: opts2 };
      } else if (typeof opts2 === "object") {
        isTls = opts2.certFile !== void 0 || opts2.cert !== void 0;
        if (opts2.handler)
          handler = opts2.handler;
      }
      const runCallback = (err) => {
        if (callback) {
          const _opts = opts2;
          callback(err, __spreadProps(__spreadValues({}, _opts), {
            hostname: _opts.hostname || "localhost"
          }));
        }
      };
      try {
        if (opts2.signal) {
          opts2.signal.addEventListener("abort", () => {
            var _a, _b, _c, _d;
            try {
              (_b = (_a = this.server) == null ? void 0 : _a.close) == null ? void 0 : _b.call(_a);
              (_d = (_c = this.server) == null ? void 0 : _c.stop) == null ? void 0 : _d.call(_c);
            } catch (_e) {
            }
          }, { once: true });
        }
        if (typeof Bun !== "undefined") {
          opts2.fetch = handler;
          this.server = Bun.serve(opts2);
          runCallback();
          return;
        }
        if (!opts2.handler)
          handler = this.handleNode;
        if (isTls) {
          const h2 = await import("https");
          this.server = h2.createServer(opts2, handler);
          this.server.listen(opts2.port);
          runCallback();
          return;
        }
        const h = await import("http");
        this.server = h.createServer(handler);
        this.server.listen(opts2.port);
        runCallback();
        return;
      } catch (error) {
        runCallback(error);
      }
    };
  }
  handleRequestNode(request, response) {
    let i = 0;
    const rev = new RequestEvent(request, response, buildRes);
    rev.send = (body) => {
      if (typeof body === "string") {
        response.end(body);
      } else if (typeof body === "object") {
        if (typeof body.pipe === "function") {
          body.pipe(response);
        } else if (body === null || body instanceof Uint8Array) {
          response.end(body);
        } else {
          response.setHeader("content-type", JSON_TYPE_CHARSET);
          response.end(JSON.stringify(body));
        }
      } else if (typeof body === "number") {
        response.end(body.toString());
      } else {
        try {
          response.end(body);
        } catch (_e) {
        }
      }
    };
    const fns = this.route[rev.method + request.url] ?? this.matchFns(rev, request.url);
    const send = (ret) => {
      if (ret) {
        if (response.writableEnded)
          return;
        if (ret instanceof Promise) {
          ret.then((val) => val && rev.send(val)).catch(next);
        } else {
          rev.send(ret);
        }
      }
    };
    const next = (err) => {
      try {
        return send(err ? this["_onError"](err, rev) : (fns[i++] ?? this["_on404"])(rev, next));
      } catch (e) {
        return next(e);
      }
    };
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        return send(fns[i++](rev, next));
      } catch (e) {
        return next(e);
      }
    }
    return bodyParser(this["bodyParser"], this["parseQuery"], this["parseMultipart"])(rev, next);
  }
};
function nhttp2(opts = {}) {
  return new NHttp2(opts);
}
nhttp2.Router = function(opts = {}) {
  return new Router(opts);
};
export {
  HttpError,
  HttpResponse,
  JsonResponse,
  MIME_LIST,
  NHttp2 as NHttp,
  RequestEvent,
  Router,
  bodyParser,
  decURIComponent,
  decoder,
  expressMiddleware,
  findFns,
  getError,
  multipart,
  nhttp2 as nhttp,
  parseQuery,
  s_response,
  toBytes
};
