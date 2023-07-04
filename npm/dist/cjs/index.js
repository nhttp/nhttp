var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// npm/src/index.ts
var src_exports = {};
__export(src_exports, {
  HttpError: () => HttpError,
  HttpResponse: () => HttpResponse,
  JsonResponse: () => JsonResponse,
  MIME_LIST: () => MIME_LIST,
  NHttp: () => NHttp2,
  RequestEvent: () => RequestEvent,
  Router: () => Router,
  bodyParser: () => bodyParser,
  decURIComponent: () => decURIComponent,
  decoder: () => decoder,
  default: () => src_default,
  expressMiddleware: () => expressMiddleware,
  findFns: () => findFns,
  getError: () => getError,
  multipart: () => multipart2,
  nhttp: () => nhttp2,
  parseQuery: () => parseQuery,
  s_response: () => s_response,
  serveNode: () => serveNode,
  toBytes: () => toBytes
});

// npm/src/src/constant.ts
var JSON_TYPE = "application/json";
var HTML_TYPE = "text/html; charset=utf-8";
var C_TYPE = "content-type";
var STATUS_ERROR_LIST = {
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
  "3gp2": "video/3gpp2",
  "7z": "application/x-7z-compressed"
};
var cc;
var revMimeList = (name) => {
  if (name.includes(";"))
    name = name.split(/;/)[0];
  if (cc)
    return cc[name] ?? name;
  cc = {};
  for (const k in MIME_LIST)
    cc[MIME_LIST[k]] = k;
  return cc[name] ?? name;
};

// npm/src/src/error.ts
var HttpError = class extends Error {
  constructor(status, message, name) {
    super(message);
    this.status = status ?? 500;
    this.message = message ?? STATUS_ERROR_LIST[this.status] ?? "Http Error";
    this.name = name ?? (STATUS_ERROR_LIST[this.status] ?? "Http").replace(/\s/g, "");
    if (!name && !this.name.endsWith("Error")) {
      this.name += "Error";
    }
  }
};
function getError(err, isStack) {
  if (typeof err === "string") {
    return {
      status: 500,
      message: err,
      name: "HttpError",
      stack: []
    };
  }
  let status = err.status ?? err.statusCode ?? err.code ?? 500;
  if (typeof status !== "number")
    status = 500;
  let stack;
  if (isStack) {
    const arr = err.stack?.split("\n") ?? [""];
    arr.shift();
    stack = arr.filter((l) => l.includes("file://")).map((l) => l.trim());
  }
  return {
    status,
    message: err.message ?? "Something went wrong",
    name: err.name ?? "HttpError",
    stack
  };
}

// npm/src/src/utils.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var decURIComponent = (str = "") => {
  if (/%/.test(str)) {
    try {
      return decodeURIComponent(str);
    } catch (_e) {
    }
  }
  return str;
};
var duc = decURIComponent;
var EHeaders = class {
  constructor(headers) {
    headers.forEach((v, k) => this[k.toLowerCase()] = v);
    this.get = (s) => headers.get(s);
    this.set = (k, v) => headers.set(k, v);
    this.append = (k, v) => headers.append(k, v);
    this.delete = (s) => headers.delete(s);
    this.entries = () => headers.entries();
    this.forEach = (a, b) => headers.forEach(a, b);
    this.has = (a) => headers.has(a);
    this.keys = () => headers.keys();
    this.values = () => headers.values();
  }
};
function findFn(fn) {
  if (fn.length === 3) {
    const newFn = (rev, next) => {
      const response = rev.response;
      if (!rev.__wm) {
        rev.__wm = true;
        rev.headers = new EHeaders(rev.headers);
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
  let ret = [], i = 0;
  const len = arr.length;
  for (; i < len; i++) {
    const fn = arr[i];
    if (Array.isArray(fn)) {
      ret = ret.concat(findFns(fn));
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
function toBytes(arg) {
  if (typeof arg === "number")
    return arg;
  const sizeList = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5)
  };
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
  data = data || {};
  const val = needPatch(data[key], keys, value);
  if (typeof data === "object")
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
      const arr2 = field.match(/^([^[]+)((?:\[[^\]]*\])*)/) ?? [];
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
function parseQueryArray(query) {
  const data = [];
  query.split(/&/).forEach((key) => {
    const el = key.split(/=/);
    data.push([el[0], duc(el[1])]);
  });
  return myParse(data);
}
function parseQuery(query) {
  if (typeof query === "string") {
    if (query === "")
      return {};
    if (query.includes("]="))
      return parseQueryArray(query);
    const data = {};
    const invoke = (key) => {
      const el = key.split(/=/);
      if (data[el[0]] !== void 0) {
        if (!Array.isArray(data[el[0]]))
          data[el[0]] = [data[el[0]]];
        data[el[0]].push(duc(el[1]));
      } else {
        data[el[0]] = duc(el[1]);
      }
    };
    if (query.includes("&"))
      query.split(/&/).forEach(invoke);
    else
      invoke(query);
    return data;
  }
  return !query ? {} : myParse(Array.from(query.entries()));
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
      if (str !== "/" && rev.path.startsWith(str)) {
        rev.__prefix = str;
        rev.__url = rev.url;
        rev.__path = rev.path;
        rev.url = rev.url.substring(str.length) || "/";
        rev.path = rev.path.substring(str.length) || "/";
      }
      return next();
    }
  ];
}
function pushRoutes(str, wares, last, base) {
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
        const arr = [];
        pmidds.forEach((el) => {
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
var getUrl = (s) => s.substring(s.indexOf("/", 8));
var defError = (err, rev, stack) => {
  const obj = getError(err, stack);
  rev.response.status(obj.status);
  return obj;
};

// npm/src/src/router.ts
function findParams(el, url) {
  const match = el.pattern.exec?.(decURIComponent(url));
  const params = match?.groups ?? {};
  if (el.wild === false || !el.wild || !el.path)
    return params;
  if (el.path instanceof RegExp)
    return params;
  const path = el.path;
  if (path.indexOf("*") !== -1) {
    match.shift();
    const wild = match.filter((el2) => el2 !== void 0).filter((el2) => el2.startsWith("/")).join("").split("/");
    wild.shift();
    const ret = { ...params, wild: wild.filter((el2) => el2 !== "") };
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
function mutatePath(base, str) {
  let ori = base + str;
  if (ori !== "/" && ori.endsWith("/"))
    ori = ori.slice(0, -1);
  let path = ori;
  if (typeof path === "string" && !path.endsWith("*")) {
    if (path === "/")
      path += "*";
    else
      path += "/*";
  }
  return { path, ori };
}
function addGlobRoute(ori, obj) {
  ANY_METHODS.forEach((method) => {
    ROUTE[method] ??= [];
    const not = !ROUTE[method].find(({ path }) => path === ori);
    if (not)
      ROUTE[method].push(obj);
  });
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
  constructor({ base = "" } = {}) {
    this.route = {};
    this.c_routes = [];
    this.midds = [];
    this.base = "";
    this.base = base;
    if (this.base == "/")
      this.base = "";
  }
  use(prefix, ...routerOrMiddleware) {
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
    if (typeof last === "object" && (last.c_routes || last[0]?.c_routes)) {
      pushRoutes(str, findFns(args), last, this);
      return this;
    }
    if (str !== "" && str !== "*" && str !== "/*") {
      const { path, ori } = mutatePath(this.base, str);
      const { pattern, wild, path: _path } = toPathx(path, true);
      (this.pmidds ??= []).push({
        pattern,
        wild,
        path: _path,
        fns: middAssets(ori).concat(findFns(args))
      });
      if (this["handle"]) {
        addGlobRoute(_path, { path, pattern, wild });
      }
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
  find(method, path, setParam, notFound) {
    const fns = this.route[method + path];
    if (fns)
      return fns.pop ? fns : [fns];
    const r = this.route[method]?.find((el) => el.pattern.test(path));
    if (r !== void 0) {
      setParam(findParams(r, path));
      if (r.wild === false)
        return r.fns;
      if (r.path !== "*" && r.path !== "/*")
        return r.fns;
    }
    if (this.pmidds !== void 0) {
      const a = this.pmidds.find((el) => el.pattern.test(path));
      if (a !== void 0) {
        setParam(findParams(a, path));
        return this.midds.concat(a.fns, [notFound]);
      }
    }
    if (r !== void 0)
      return r.fns;
    return this.midds.concat([notFound]);
  }
};

// npm/src/src/multipart.ts
var uid = () => `${performance.now().toString(36)}${Math.random().toString(36).slice(5)}`.replace(".", "");
var Multipart = class {
  createBody(formData) {
    return parseQuery(formData);
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
    if (opts?.maxCount) {
      if (len > opts.maxCount) {
        throw new HttpError(400, `${opts.name} no more than ${opts.maxCount} file`, "BadRequestError");
      }
    }
    while (j < len) {
      const file = files[j];
      if (opts?.accept) {
        const type = revMimeList(file.type);
        if (!opts.accept.includes(type)) {
          throw new HttpError(400, `${opts.name} only accept ${opts.accept.toString()}`, "BadRequestError");
        }
      }
      if (opts?.maxSize) {
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
        if (opts.dest[opts.dest.length - 1] !== "/")
          opts.dest += "/";
        if (opts.dest[0] === "/")
          opts.dest = opts.dest.substring(1);
      }
      file.filename ??= uid() + `.${revMimeList(file.type)}`;
      file.path ??= opts.dest + file.filename;
      file.pathfile = file.path;
      if (opts.storage) {
        await opts.storage(file);
      } else if (opts.writeFile !== false) {
        if (opts.writeFile === true)
          opts.writeFile = void 0;
        opts.writeFile ??= Deno.writeFile;
        const arrBuff = await file.arrayBuffer();
        await opts.writeFile(file.path, new Uint8Array(arrBuff));
      }
      i++;
    }
  }
  async mutateBody(rev) {
    const type = rev.headers.get("content-type");
    if (rev.request.bodyUsed === false && type?.includes("multipart/form-data")) {
      const formData = await rev.request.formData();
      rev.body = await this.createBody(formData);
      rev.__nbody = formData;
    }
  }
  async handleArrayUpload(rev, opts) {
    let j = 0, i = 0;
    const len = opts.length;
    while (j < len) {
      const obj = opts[j];
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
      const obj = opts[i];
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
  }
  async handleSingleUpload(rev, obj) {
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
  upload(options) {
    return async (rev, next) => {
      if (rev.request.body !== null) {
        await this.mutateBody(rev);
        if (Array.isArray(options)) {
          await this.handleArrayUpload(rev, options);
        } else if (typeof options === "object") {
          await this.handleSingleUpload(rev, options);
        }
      }
      return next();
    };
  }
};
var multipart = new Multipart();

// npm/src/src/body.ts
var c_types = [
  "application/json",
  "application/x-www-form-urlencoded",
  "text/plain",
  "multipart/form-data"
];
var isTypeBody = (a, b) => a === b || a?.includes(b);
function verify(rev, limit, len) {
  if (len === void 0) {
    len = encoder.encode(JSON.stringify(rev.body)).byteLength;
  }
  if (limit && len > toBytes(limit)) {
    rev.body = {};
    throw new HttpError(400, `Body is too large. max limit ${limit}`);
  }
}
async function verifyBody(rev, limit) {
  const arrBuff = await rev.request.arrayBuffer();
  rev.__nbody = arrBuff;
  const len = arrBuff.byteLength;
  verify(rev, limit, len);
  if (len === 0)
    return;
  return decURIComponent(decoder.decode(arrBuff));
}
var isNotValid = (v) => v === false || v === 0;
async function handleBody(validate, rev, cb) {
  if (isNotValid(validate)) {
    rev.body = {};
  } else {
    const body = await verifyBody(rev, validate);
    if (body)
      cb(body);
  }
}
async function multipartBody(validate, rev) {
  if (isNotValid(validate)) {
    rev.body = {};
  } else {
    const formData = await rev.request.formData();
    rev.body = await multipart.createBody(formData);
    rev.__nbody = formData;
  }
}
var getType = (req) => {
  return req.raw ? req.raw.req.headers[C_TYPE] : req.headers.get(C_TYPE);
};
async function writeBody(rev, type, opts, parseQuery2) {
  if (isTypeBody(type, c_types[0])) {
    await handleBody(opts?.json, rev, (body) => {
      rev.body = JSON.parse(body);
    });
  } else if (isTypeBody(type, c_types[1])) {
    await handleBody(opts?.urlencoded, rev, (body) => {
      const parse = parseQuery2 ?? parseQuery;
      rev.body = parse(body);
    });
  } else if (isTypeBody(type, c_types[2])) {
    await handleBody(opts?.raw, rev, (body) => {
      try {
        rev.body = JSON.parse(body);
      } catch {
        rev.body = { _raw: body };
      }
    });
  } else if (isTypeBody(type, c_types[3])) {
    await multipartBody(opts?.multipart, rev);
  }
}
function bodyParser(opts, parseQuery2) {
  return async (rev, next) => {
    if (typeof opts === "boolean") {
      if (opts === false) {
        rev.body = {};
        return next();
      }
      opts = void 0;
    }
    const type = getType(rev.request);
    if (type) {
      if (rev.request.bodyUsed) {
        if (opts !== void 0) {
          if (isTypeBody(type, c_types[0]))
            verify(rev, opts.json);
          else if (isTypeBody(type, c_types[1]))
            verify(rev, opts.urlencoded);
          else if (isTypeBody(type, c_types[2]))
            verify(rev, opts.raw);
        }
        return next();
      }
      try {
        await writeBody(rev, type, opts, parseQuery2);
      } catch (e) {
        return next(e);
      }
    }
    return next();
  };
}

// npm/src/src/symbol.ts
var s_url = Symbol("url");
var s_path = Symbol("path");
var s_query = Symbol("query");
var s_route = Symbol("route");
var s_params = Symbol("params");
var s_file = Symbol("file");
var s_body = Symbol("body");
var s_search = Symbol("search");
var s_headers = Symbol("headers");
var s_cookies = Symbol("cookies");
var s_res = Symbol("http_res");
var s_response = Symbol("res");
var s_init = Symbol("res_init");
var s_method = Symbol("method");
var s_new_req = Symbol("new_req");

// npm/src/src/cookie.ts
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

// npm/src/src/inspect.ts
function inspect(target, obj) {
  const ret = obj;
  for (const key in target) {
    if (ret[key] === void 0) {
      ret[key] = target[key];
    }
  }
  return ret;
}
function revInspect(rev) {
  return inspect(rev, {
    body: rev.body,
    newRequest: rev.newRequest,
    cookies: rev.cookies,
    file: rev.file,
    headers: rev.headers,
    info: rev.info,
    method: rev.method,
    originalUrl: rev.originalUrl,
    params: rev.params,
    path: rev.path,
    query: rev.query,
    request: rev.request,
    responseInit: rev.responseInit,
    respondWith: rev.respondWith,
    requestEvent: rev.requestEvent,
    response: rev.response,
    route: rev.route,
    search: rev.search,
    send: rev.send,
    url: rev.url,
    waitUntil: rev.waitUntil
  });
}
function resInspect(res) {
  return inspect(res, {
    clearCookie: res.clearCookie,
    cookie: res.cookie,
    getHeader: res.getHeader,
    header: res.header,
    json: res.json,
    params: res.params,
    statusCode: res.statusCode,
    redirect: res.redirect,
    attachment: res.attachment,
    render: res.render,
    send: res.send,
    sendStatus: res.sendStatus,
    setHeader: res.setHeader,
    status: res.status,
    type: res.type
  });
}
var deno_inspect = Symbol.for("Deno.customInspect");
var node_inspect = Symbol.for("nodejs.util.inspect.custom");

// npm/src/src/http_response.ts
var TYPE = "content-type";
var HttpResponse = class {
  constructor(send, init) {
    this.send = send;
    this.init = init;
  }
  setHeader(key, value) {
    (this.init.headers ??= {})[key.toLowerCase()] = value;
    return this;
  }
  getHeader(key) {
    return this.init.headers?.[key.toLowerCase()];
  }
  header(key, value) {
    if (typeof key === "string") {
      if (value === void 0)
        return this.getHeader(key);
      this.setHeader(key, value);
      return this;
    }
    if (typeof key === "object") {
      for (const k in key)
        this.setHeader(k, key[k]);
      return this;
    }
    return {
      delete: (k) => {
        delete this.init.headers?.[k.toLowerCase()];
      },
      append: (k, v) => {
        const cur = this.getHeader(k);
        this.setHeader(k, cur ? cur + ", " + v : v);
        return this;
      },
      toJSON: () => this.init.headers ?? {}
    };
  }
  status(code) {
    if (code) {
      this.init.status = code;
      return this;
    }
    return this.init.status ?? 200;
  }
  sendStatus(code) {
    if (code > 511)
      code = 500;
    try {
      this.status(code).send(code);
    } catch (_e) {
      this.status(code).send(null);
    }
  }
  attachment(filename) {
    const c_dis = filename ? `attachment; filename=${filename}` : "attachment;";
    return this.header("content-disposition", c_dis);
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
  html(html) {
    this.type(HTML_TYPE).send(html);
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
    this.header().append("Set-Cookie", serializeCookie(name, "", { ...opts, expires: new Date(0) }));
  }
  [deno_inspect](inspect2, opts) {
    const ret = resInspect(this);
    return `${this.constructor.name} ${inspect2(ret, opts)}`;
  }
  [node_inspect](depth, opts, inspect2) {
    opts.depth = depth;
    const ret = resInspect(this);
    return `${this.constructor.name} ${inspect2?.(ret, opts) ?? Deno.inspect(ret)}`;
  }
};
function oldSchool() {
  Response.json ??= (data, init = {}) => new JsonResponse(data, init);
  if (BigInt.prototype.toJSON === void 0) {
    BigInt.prototype.toJSON = function() {
      return this.toString();
    };
  }
}
var JsonResponse = class extends Response {
  constructor(body, init = {}) {
    if (init.headers) {
      if (init.headers instanceof Headers)
        init.headers.set(TYPE, JSON_TYPE);
      else
        init.headers[TYPE] = JSON_TYPE;
    } else
      init.headers = { [TYPE]: JSON_TYPE };
    super(JSON.stringify(body, (_, v) => typeof v === "bigint" ? v.toString() : v), init);
  }
};

// npm/src/src/request_event.ts
var RequestEvent = class {
  constructor(request) {
    this.request = request;
    this.waitUntil = (promise) => {
      if (promise instanceof Promise) {
        const ctx = this.request._info?.ctx;
        if (typeof ctx?.waitUntil === "function") {
          ctx.waitUntil(promise);
          return;
        }
        promise.catch(console.error);
        return;
      }
      throw new HttpError(500, `${promise} is not a Promise.`);
    };
    this.respondWith = (r) => {
      this[s_response] = r;
    };
    this.requestEvent = () => this;
  }
  get response() {
    return this[s_res] ??= new HttpResponse(this.send.bind(this), this[s_init] = {});
  }
  get route() {
    if (this[s_route])
      return this[s_route];
    let path = this.path;
    if (path !== "/" && path[path.length - 1] === "/") {
      path = path.slice(0, -1);
    }
    const ret = ROUTE[this.method]?.find((o) => o.pattern?.test(path) || o.path === path);
    if (ret) {
      if (!ret.pattern) {
        Object.assign(ret, toPathx(ret.path, true));
      }
      ret.method = this.method;
      ret.pathname = this.path;
      ret.query = this.query;
      ret.params = findParams(ret, path);
    }
    return this[s_route] ??= ret ?? {};
  }
  get info() {
    const info = this.request._info;
    return {
      conn: info?.conn ?? {},
      env: info?.conn ?? {},
      context: info?.ctx ?? {}
    };
  }
  send(body, lose) {
    if (typeof body === "string") {
      this[s_response] = new Response(body, this[s_init]);
    } else if (body instanceof Response) {
      this[s_response] = body;
    } else if (typeof body === "object") {
      if (body === null || body instanceof Uint8Array || body instanceof ReadableStream || body instanceof Blob) {
        this[s_response] = new Response(body, this[s_init]);
      } else {
        this[s_response] = Response.json(body, this[s_init]);
      }
    } else if (typeof body === "number") {
      this[s_response] = new Response(body.toString(), this[s_init]);
    } else if (!lose) {
      this[s_response] ??= new Response(body, this[s_init]);
    }
  }
  get responseInit() {
    return this[s_init] ?? {};
  }
  get search() {
    return this[s_search] ??= null;
  }
  set search(val) {
    this[s_search] = val;
  }
  get params() {
    return this[s_params] ??= {};
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
    return getUrl(this.request.url);
  }
  get path() {
    return this[s_path] ??= this.url;
  }
  set path(val) {
    this[s_path] = val;
  }
  get query() {
    return this[s_query] ??= this.__parseQuery?.(this[s_search].substring(1)) ?? {};
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
  get method() {
    return this[s_method] ??= this.request.method;
  }
  set method(val) {
    this[s_method] = val;
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
  get newRequest() {
    if (this[s_new_req] !== void 0)
      return this[s_new_req];
    const init = {};
    init.method = this.method;
    if (["GET", "HEAD"].includes(this.method) === false) {
      init.body = this.__nbody ?? JSON.stringify(this.body);
    }
    init.headers = {};
    this.headers.forEach((v, k) => {
      if (!v.includes("multipart/form-data")) {
        init.headers[k] = v;
      }
    });
    return this[s_new_req] = new Request(this.request.url, init);
  }
  [deno_inspect](inspect2, opts) {
    const ret = revInspect(this);
    return `${this.constructor.name} ${inspect2(ret, opts)}`;
  }
  [node_inspect](depth, opts, inspect2) {
    opts.depth = depth;
    const ret = revInspect(this);
    return `${this.constructor.name} ${inspect2?.(ret, opts) ?? Deno.inspect(ret)}`;
  }
};
function toRes(body) {
  if (typeof body === "string")
    return new Response(body);
  if (body instanceof Response)
    return body;
  if (typeof body === "object") {
    if (body === null || body instanceof Uint8Array || body instanceof ReadableStream || body instanceof Blob)
      return new Response(body);
    return Response.json(body);
  }
  if (typeof body === "number")
    return new Response(body.toString());
  return body === void 0 ? void 0 : new Response(body);
}
function createRequest(handle, url, init = {}) {
  const res = () => {
    return handle(new Request(url[0] === "/" ? "http://127.0.0.1:8787" + url : url, init));
  };
  return {
    text: async () => await (await res()).text(),
    json: async () => await (await res()).json(),
    ok: async () => (await res()).ok,
    status: async () => (await res()).status,
    res
  };
}

// npm/src/src/nhttp_util.ts
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
function buildListenOptions(opts) {
  let isSecure = false;
  let handler = this.handleRequest;
  if (typeof opts === "number") {
    opts = { port: opts };
  } else if (typeof opts === "object") {
    isSecure = opts.certFile !== void 0 || opts.cert !== void 0 || opts.alpnProtocols !== void 0;
    handler = opts.handler ?? opts.fetch ?? (opts.showInfo ? this.handle : this.handleRequest);
    if (opts.handler)
      delete opts.handler;
    if (opts.fetch)
      delete opts.fetch;
  }
  return { opts, isSecure, handler };
}
var HttpServer = class {
  constructor(listener, handle) {
    this.listener = listener;
    this.handle = handle;
    this.alive = true;
    this.track = /* @__PURE__ */ new Set();
  }
  async acceptConn() {
    while (this.alive) {
      let conn;
      try {
        conn = await this.listener.accept();
      } catch {
        break;
      }
      let httpConn;
      try {
        httpConn = Deno.serveHttp(conn);
      } catch {
        continue;
      }
      this.track.add(httpConn);
      this.handleHttp(httpConn, conn);
    }
  }
  close() {
    try {
      if (this.alive === false) {
        throw new Error("Server Closed");
      }
      this.alive = false;
      this.listener.close();
      for (const t of this.track)
        t.close();
      this.track.clear();
    } catch {
    }
  }
  async handleHttp(httpConn, conn) {
    for (; ; ) {
      try {
        const rev = await httpConn.nextRequest();
        if (rev) {
          await rev.respondWith(this.handle(rev.request, conn));
        } else {
          break;
        }
      } catch {
        break;
      }
    }
  }
};

// npm/src/src/nhttp.ts
var NHttp = class extends Router {
  constructor({ parseQuery: parseQuery2, bodyParser: bodyParser2, env, flash, stackError } = {}) {
    super();
    this.matchFns = (rev, method, url) => {
      const iof = url.indexOf("?");
      if (iof !== -1) {
        rev.path = url.substring(0, iof);
        rev.__parseQuery = this.parseQuery;
        rev.search = url.substring(iof);
        url = rev.path;
      }
      return this.find(method, url, (obj) => rev.params = obj, this._on404);
    };
    this.handleRequest = async (req) => {
      const method = req.method, url = getUrl(req.url);
      let fns = this.route[method + url], noop;
      if (typeof fns === "function") {
        try {
          return toRes(await fns());
        } catch (err) {
          noop = err;
        }
      }
      let i = 0;
      const rev = new RequestEvent(req);
      fns ??= this.matchFns(rev, method, url);
      const next = async (err) => {
        try {
          rev.send(await (err ? this._onError(err, rev) : (fns[i++] ?? this._on404)(rev, next)), 1);
        } catch (e) {
          return next(e);
        }
        return rev[s_response] ?? awaiter(rev);
      };
      if (noop)
        return next(noop);
      try {
        if (method !== "GET") {
          const opts = this.bodyParser;
          if (opts === void 0 || opts !== false) {
            const type = getType(req);
            if (isTypeBody(type, "application/json") && opts?.json === void 0) {
              rev.body = JSON.parse(await req.text() || "{}");
            } else if (type) {
              await writeBody(rev, type, opts, this.parseQuery);
            }
          }
        }
        rev.send(await fns[i++](rev, next), 1);
      } catch (e) {
        return next(e);
      }
      return rev[s_response] ?? awaiter(rev);
    };
    this.handle = (req, conn, ctx) => {
      if (conn)
        req._info = { conn, ctx };
      return this.handleRequest(req);
    };
    this.handleEvent = (evt) => this.handle(evt.request);
    this.req = (url, init = {}) => {
      return createRequest(this.handle, url, init);
    };
    this.listen = (options, callback) => {
      const { opts, isSecure, handler } = buildListenOptions.bind(this)(options);
      const runCallback = (err) => {
        if (callback) {
          callback(err, {
            ...opts,
            hostname: opts.hostname ?? "localhost"
          });
          return 1;
        }
        return;
      };
      try {
        if (this.flash) {
          if ("serve" in Deno) {
            if (runCallback())
              opts.onListen = () => {
              };
            return this.server = Deno.serve(opts, handler);
          }
          console.error("requires --unstable flags");
          return;
        }
        runCallback();
        this.server = (isSecure ? Deno.listenTls : Deno.listen)(opts);
        const http = new HttpServer(this.server, handler);
        if (opts.signal) {
          opts.signal.addEventListener("abort", () => http.close(), {
            once: true
          });
        }
        http.acceptConn().catch(runCallback);
        return this.server;
      } catch (error) {
        runCallback(error);
      }
    };
    oldSchool();
    this.parseQuery = parseQuery2 || parseQuery;
    this.stackError = stackError !== false;
    this.env = env ?? "development";
    if (this.env !== "development") {
      this.stackError = false;
    }
    this.flash = flash;
    if (bodyParser2 === true)
      bodyParser2 = void 0;
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
    let fns = findFns(handlers);
    if (typeof path === "string") {
      if (path !== "/" && path.endsWith("/"))
        path = path.slice(0, -1);
      if (this.pmidds) {
        const arr = [];
        this.pmidds.forEach((el) => {
          if (el.pattern.test(path)) {
            arr.push(...el.fns);
          }
        });
        fns = arr.concat([(rev, next) => {
          if (rev.__url && rev.__path) {
            rev.url = rev.__url;
            rev.path = rev.__path;
          }
          return next();
        }], fns);
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
          this.route[key] = fns.length && fns[0].length ? fns : fns[0];
          (ROUTE[m] ??= []).push({ path });
        }
        if (path !== "/")
          this.route[key + "/"] = this.route[key];
      }
    };
    if (method === "ANY")
      ANY_METHODS.forEach(invoke);
    else
      invoke(method);
    return this;
  }
  engine(render, opts = {}) {
    const check = render.check;
    return this.use((rev, next) => {
      if (check !== void 0) {
        const send = rev.send.bind(rev);
        rev.send = (body, lose) => {
          if (check(body)) {
            rev[s_init] ??= {};
            rev[s_init].headers ??= {};
            rev[s_init].headers["content-type"] ??= HTML_TYPE;
            const res = render(body, rev);
            if (res instanceof Promise) {
              res.then((res2) => {
                rev[s_response] = new Response(res2, rev[s_init]);
              }).catch(next);
            } else {
              rev[s_response] = new Response(res, rev[s_init]);
            }
          } else {
            send(body, lose);
          }
        };
      }
      rev.response.render = (elem, params, ...args) => {
        if (typeof elem === "string") {
          if (opts.ext) {
            if (elem.includes(".") === false) {
              elem += "." + opts.ext;
            }
          }
          if (opts.base) {
            if (opts.base.endsWith("/") === false) {
              opts.base += "/";
            }
            if (opts.base[0] === "/") {
              opts.base = opts.base.substring(1);
            }
            elem = opts.base + elem;
          }
        }
        params ??= rev.response.params;
        rev.response.type(HTML_TYPE);
        const ret = render(elem, params, ...args);
        if (ret) {
          if (ret instanceof Promise) {
            return ret.then((val) => rev.response.send(val)).catch(next);
          }
          return rev.response.send(ret);
        }
        return ret;
      };
      return next();
    });
  }
  _onError(err, rev) {
    return defError(err, rev, this.stackError);
  }
  _on404(rev) {
    const obj = getError(new HttpError(404, `Route ${rev.method}${rev.originalUrl} not found`, "NotFoundError"));
    rev.response.status(obj.status);
    return obj;
  }
};
function nhttp(opts = {}) {
  return new NHttp(opts);
}
nhttp.Router = function(opts = {}) {
  return new Router(opts);
};

// npm/src/node/symbol.ts
var s_body2 = Symbol("input_body");
var s_init2 = Symbol("init");
var s_def = Symbol("default");
var s_body_used = Symbol("req_body_used");
var s_headers2 = Symbol("s_headers");
var s_inspect = Symbol.for("nodejs.util.inspect.custom");

// npm/src/node/request.ts
var typeError = (m) => Promise.reject(new TypeError(m));
var consumed = "body already consumed";
var misstype = "missing content-type";
var mnotbody = "GET/HEAD cannot have body";
var notBody = (raw) => raw.method === "GET" || raw.method === "HEAD";
function reqBody(url, body, raw) {
  return new globalThis.NativeRequest(url, {
    method: raw.method,
    headers: raw.headers,
    body: notBody(raw) ? void 0 : body
  });
}
var NodeRequest = class {
  constructor(input, init, raw) {
    this.raw = raw;
    this[s_body2] = input;
    this[s_init2] = init;
  }
  get rawBody() {
    if (this[s_body_used])
      return typeError(consumed);
    this[s_body_used] = true;
    if (!this.raw.req.headers["content-type"])
      return typeError(misstype);
    if (notBody(this.raw.req))
      return typeError(mnotbody);
    return new Promise((resolve, reject) => {
      const chunks = [];
      this.raw.req.on("data", (buf) => chunks.push(buf)).on("end", () => resolve(Buffer.concat(chunks))).on("error", (err) => reject(err));
    });
  }
  get req() {
    return this[s_def] ??= new globalThis.NativeRequest(this[s_body2], this[s_init2]);
  }
  get cache() {
    return this.req.cache;
  }
  get credentials() {
    return this.req.credentials;
  }
  get destination() {
    return this.req.destination;
  }
  get headers() {
    return this.raw ? new Headers(this.raw.req.headers) : this.req.headers;
  }
  get integrity() {
    return this.req.integrity;
  }
  get keepalive() {
    return this.req.keepalive;
  }
  get method() {
    return this.raw ? this.raw.req.method : this.req.method;
  }
  get mode() {
    return this.req.mode;
  }
  get redirect() {
    return this.req.redirect;
  }
  get referrer() {
    return this.req.referrer;
  }
  get referrerPolicy() {
    return this.req.referrerPolicy;
  }
  get signal() {
    return this.req.signal;
  }
  get url() {
    if (typeof this[s_body2] === "string") {
      return this[s_body2];
    }
    return this.req.url;
  }
  clone() {
    const req = new NodeRequest(this[s_body2], this[s_init2], this.raw);
    return req;
  }
  get body() {
    if (this.raw) {
      if (notBody(this.raw.req))
        return null;
      if (!this.raw.req.headers["content-type"])
        return null;
      return new ReadableStream({
        start: async (ctrl) => {
          try {
            const body = await this.rawBody;
            ctrl.enqueue(body);
            ctrl.close();
          } catch (e) {
            ctrl.close();
            throw e;
          }
        }
      });
    }
    return this.req.body;
  }
  get bodyUsed() {
    if (this.raw) {
      return this[s_body_used] ?? false;
    }
    return this.req.bodyUsed;
  }
  arrayBuffer() {
    return (async () => {
      if (this.raw) {
        return await this.rawBody;
      }
      return await this.req.arrayBuffer();
    })();
  }
  blob() {
    return (async () => {
      if (this.raw) {
        const req = reqBody(this[s_body2], await this.rawBody, this.raw.req);
        return await req.blob();
      }
      return await this.req.blob();
    })();
  }
  formData() {
    return (async () => {
      if (this.raw) {
        const req = reqBody(this[s_body2], await this.rawBody, this.raw.req);
        return await req.formData();
      }
      return await this.req.formData();
    })();
  }
  json() {
    return (async () => {
      if (this.raw) {
        return JSON.parse((await this.rawBody).toString());
      }
      return await this.req.json();
    })();
  }
  text() {
    return (async () => {
      if (this.raw) {
        return (await this.rawBody).toString();
      }
      return await this.req.text();
    })();
  }
  get [Symbol.hasInstance]() {
    return "Request";
  }
  [s_inspect](depth, opts, inspect2) {
    opts.depth = depth;
    const ret = {
      bodyUsed: this.bodyUsed,
      headers: this.headers,
      method: this.method,
      redirect: this.redirect,
      url: this.url
    };
    return `Request ${inspect2(ret, opts)}`;
  }
};

// npm/src/node/response.ts
var C_TYPE2 = "Content-Type";
var JSON_TYPE2 = "application/json";
var NodeResponse = class {
  constructor(body, init) {
    this[s_body2] = body;
    this[s_init2] = init;
  }
  static error() {
    return globalThis.NativeResponse.error();
  }
  static redirect(url, status) {
    return globalThis.NativeResponse.redirect(url, status);
  }
  static json(data, init = {}) {
    if (init.headers) {
      if (init.headers.get && typeof init.headers.get === "function") {
        init.headers.set(C_TYPE2, init.headers.get(C_TYPE2) ?? JSON_TYPE2);
      } else {
        init.headers[C_TYPE2] ??= JSON_TYPE2;
      }
    } else {
      init.headers = { [C_TYPE2]: JSON_TYPE2 };
    }
    return new NodeResponse(JSON.stringify(data), init);
  }
  get res() {
    return this[s_def] ??= new globalThis.NativeResponse(this[s_body2], this[s_init2]);
  }
  get headers() {
    return this[s_headers2] ??= new Headers(this[s_init2]?.headers);
  }
  get ok() {
    return this.res.ok;
  }
  get redirected() {
    return this.res.redirected;
  }
  get status() {
    return this[s_init2]?.status ?? 200;
  }
  get statusText() {
    return this.res.statusText;
  }
  get type() {
    return this.res.type;
  }
  get url() {
    return this.res.url;
  }
  get body() {
    return this.res.body;
  }
  get bodyUsed() {
    return this.res.bodyUsed;
  }
  clone() {
    return new NodeResponse(this[s_body2], this[s_init2]);
  }
  arrayBuffer() {
    return this.res.arrayBuffer();
  }
  blob() {
    return this.res.blob();
  }
  formData() {
    return this.res.formData();
  }
  json() {
    return this.res.json();
  }
  text() {
    return this.res.text();
  }
  get [Symbol.hasInstance]() {
    return "Response";
  }
  [s_inspect](depth, opts, inspect2) {
    opts.depth = depth;
    const ret = {
      body: this.body,
      bodyUsed: this.bodyUsed,
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      redirected: this.redirected,
      ok: this.ok,
      url: this.url
    };
    return `Response ${inspect2(ret, opts)}`;
  }
};

// npm/src/node/index.ts
function mutateResponse() {
  if (globalThis.NativeResponse === void 0) {
    globalThis.NativeResponse = Response;
    globalThis.NativeRequest = Request;
    globalThis.Response = NodeResponse;
    globalThis.Request = NodeRequest;
  }
}
async function handleNode(handler, req, res) {
  let resWeb = await handler(new NodeRequest(`http://${req.headers.host}${req.url}`, void 0, { req, res }));
  if (res.writableEnded)
    return;
  if (resWeb[s_init2]) {
    if (resWeb[s_init2].headers) {
      if (resWeb[s_init2].headers.get && typeof resWeb[s_init2].headers.get === "function") {
        resWeb[s_init2].headers.forEach((val, key) => {
          res.setHeader(key, val);
        });
      } else {
        for (const k in resWeb[s_init2].headers) {
          res.setHeader(k, resWeb[s_init2].headers[k]);
        }
      }
    }
    if (resWeb[s_init2].status)
      res.statusCode = resWeb[s_init2].status;
  }
  if (resWeb[s_headers2]) {
    resWeb[s_headers2].forEach((val, key) => {
      res.setHeader(key, val);
    });
  }
  if (typeof resWeb[s_body2] === "string" || resWeb[s_body2] === void 0 || resWeb[s_body2] === null || resWeb[s_body2] instanceof Uint8Array) {
    res.end(resWeb[s_body2]);
  } else {
    if (resWeb[s_body2] instanceof ReadableStream) {
      for await (const chunk of resWeb[s_body2])
        res.write(chunk);
      res.end();
      return;
    }
    const chunks = [];
    for await (const chunk of resWeb.body)
      chunks.push(chunk);
    const data = Buffer.concat(chunks);
    if (resWeb[s_body2] instanceof FormData && !res.getHeader("Content-Type")) {
      const type = `multipart/form-data;boundary=${data.toString().split("\r")[0]}`;
      res.setHeader("Content-Type", type);
    }
    res.end(data);
  }
}
async function serveNode(handler, opts = {
  port: 3e3
}) {
  mutateResponse();
  const port = opts.port;
  const isSecure = opts.certFile !== void 0 || opts.cert !== void 0;
  let createServer = opts.createServer;
  if (createServer === void 0) {
    let server;
    if (isSecure)
      server = await import("node:https");
    else
      server = await import("node:http");
    createServer = server.createServer;
  }
  return createServer(opts, (req, res) => {
    setImmediate(() => handleNode(handler, req, res));
  }).listen(port);
}

// npm/src/index.ts
var NHttp2 = class extends NHttp {
  constructor(opts = {}) {
    super(opts);
    const oriHandle = this.handle.bind(this);
    this.handle = (req, conn, ctx) => {
      if (req.on === void 0)
        return oriHandle(req, conn, ctx);
      mutateResponse();
      setImmediate(() => handleNode(this.handleRequest, req, conn));
    };
    if (typeof Deno === "undefined") {
      this.listen = (options, callback) => {
        const { opts: opts2, handler } = buildListenOptions.bind(this)(options);
        const runCallback = (err) => {
          if (callback) {
            const _opts = opts2;
            callback(err, {
              ..._opts,
              hostname: _opts.hostname || "localhost"
            });
          }
        };
        try {
          if (opts2.signal) {
            opts2.signal.addEventListener("abort", () => {
              try {
                this.server?.close?.();
                this.server?.stop?.();
              } catch {
              }
            }, { once: true });
          }
          if (typeof Bun !== "undefined") {
            opts2.fetch = handler;
            if (!globalThis.bunServer) {
              globalThis.bunServer = this.server = Bun.serve(opts2);
              runCallback();
            } else {
              globalThis.bunServer.reload(opts2);
            }
            return this.server;
          }
          return (async () => {
            try {
              this.server = await serveNode(handler, opts2);
              runCallback();
              return this.server;
            } catch (error) {
              runCallback(error);
            }
          })();
        } catch (error) {
          runCallback(error);
        }
      };
    }
  }
  module(opts = {}) {
    opts.fetch ??= this.handle;
    return opts;
  }
};
var fs_glob;
var writeFile = async (...args) => {
  try {
    if (fs_glob)
      return fs_glob?.writeFileSync(...args);
    fs_glob = await import("node:fs");
    return fs_glob.writeFileSync(...args);
  } catch (_e) {
  }
  fs_glob = {};
  return void 0;
};
var multipart2 = {
  createBody: multipart.createBody,
  upload: (opts) => {
    if (typeof Deno !== "undefined")
      return multipart.upload(opts);
    if (Array.isArray(opts)) {
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].writeFile !== false) {
          if (opts[i].writeFile === true)
            opts[i].writeFile = void 0;
          opts[i].writeFile ??= writeFile;
        }
      }
    } else if (typeof opts === "object") {
      if (opts.writeFile !== false) {
        if (opts.writeFile === true)
          opts.writeFile = void 0;
        opts.writeFile ??= writeFile;
      }
    }
    return multipart.upload(opts);
  }
};
function nhttp2(opts = {}) {
  return new NHttp2(opts);
}
nhttp2.Router = function(opts = {}) {
  return new Router(opts);
};
var src_default = nhttp2;
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpError,
  HttpResponse,
  JsonResponse,
  MIME_LIST,
  NHttp,
  RequestEvent,
  Router,
  bodyParser,
  decURIComponent,
  decoder,
  expressMiddleware,
  findFns,
  getError,
  multipart,
  nhttp,
  parseQuery,
  s_response,
  serveNode,
  toBytes
});
