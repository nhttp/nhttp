// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value,
    })
    : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) {
    if (__hasOwnProp.call(b, prop)) {
      __defNormalProp(a, prop, b[prop]);
    }
  }
  if (__getOwnPropSymbols) {
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) {
        __defNormalProp(a, prop, b[prop]);
      }
    }
  }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) =>
  __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all) {
    __defProp(target, name, { get: all[name], enumerable: true });
  }
};

// mod.ts
__export(exports, {
  HttpError: () => HttpError,
  HttpResponse: () => HttpResponse,
  JsonResponse: () => JsonResponse,
  NHttp: () => NHttp,
  RequestEvent: () => RequestEvent,
  Router: () => Router,
  getError: () => getError,
  multipart: () => multipart,
  wrapMiddleware: () => wrapMiddleware,
});

// src/router.ts
function base(url) {
  const iof = url.indexOf("/", 1);
  if (iof !== -1) {
    return url.substring(0, iof);
  }
  return url;
}
var Router = class {
  constructor({ base: base2 = "" } = {}) {
    this.route = {};
    this.c_routes = [];
    this.midds = [];
    this.base = "";
    this.base = base2;
    if (this.base === "/") {
      this.base = "";
    }
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
  single(mtd, url) {
    let { fns, m } = this.route[mtd + url];
    if (m) {
      return { params: {}, fns };
    }
    fns = this.midds.concat(fns);
    this.route[mtd + url] = { m: true, fns };
    return { params: {}, fns };
  }
  on(method, path, ...handlers) {
    if (path === "/" && this.base !== "") {
      path = "";
    }
    this.c_routes.push({ method, path: this.base + path, fns: handlers });
    return this;
  }
  find(method, url, fn404) {
    if (this.route[method + url]) {
      return this.single(method, url);
    }
    if (url !== "/" && url[url.length - 1] === "/") {
      const _url = url.slice(0, -1);
      if (this.route[method + _url]) {
        return this.single(method, _url);
      }
    }
    let fns = [], params = {};
    let i = 0, obj = {};
    let arr = this.route[method] || [];
    let match;
    if (this.route["ANY"]) {
      arr = arr.concat(this.route["ANY"]);
    }
    const len = arr.length;
    while (i < len) {
      obj = arr[i];
      if (obj.pathx && obj.pathx.test(url)) {
        url = unescape(url);
        match = obj.pathx.exec(url);
        fns = obj.fns;
        if (match.groups) {
          params = match.groups || {};
        }
        if (obj.wild && typeof match[1] === "string") {
          params["wild"] = match[1].split("/");
          params["wild"].shift();
        }
        break;
      }
      i++;
    }
    if (this.pmidds) {
      const p = base(url || "/");
      if (this.pmidds[p]) {
        fns = this.pmidds[p].concat(fns);
      }
    }
    fns = this.midds.concat(fns, [fn404]);
    return { params, fns };
  }
};

// src/utils.ts
var SERIALIZE_COOKIE_REGEXP = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function findFns(arr) {
  let ret = [], i = 0;
  const len = arr.length;
  for (; i < len; i++) {
    if (Array.isArray(arr[i])) {
      ret = ret.concat(findFns(arr[i]));
    } else if (typeof arr[i] === "function") {
      ret.push(arr[i]);
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
    pb: Math.pow(1024, 5),
  };
  if (typeof arg === "number") {
    return arg;
  }
  const arr = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i.exec(arg);
  let val, unt = "b";
  if (!arr) {
    val = parseInt(val, 10);
    unt = "b";
  } else {
    val = parseFloat(arr[1]);
    unt = arr[4].toLowerCase();
  }
  return Math.floor(sizeList[unt] * val);
}
function toPathx(path, isAny) {
  if (/\?|\*|\.|\:/.test(path) === false && isAny === false) {
    return {};
  }
  let wild = false;
  path = path.replace(/\/$/, "").replace(
    /:(\w+)(\?)?(\.)?/g,
    "$2(?<$1>[^/]+)$2$3",
  ).replace(/(\/?)\*/g, (_, p) => {
    wild = true;
    return `(${p}.*)?`;
  }).replace(/\.(?=[\w(])/, "\\.");
  const pathx = new RegExp(`^${path}/*$`);
  return { pathx, wild };
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
    if (red.hasOwnProperty(field)) {
      if (Array.isArray(red[field])) {
        red[field] = [...red[field], value];
      } else {
        red[field] = [red[field], value];
      }
    } else {
      let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);
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
  if (query === null) {
    return {};
  }
  if (typeof query === "string") {
    const data = new URLSearchParams("?" + query);
    return myParse(Array.from(data.entries()));
  }
  return myParse(Array.from(query.entries()));
}
function wrapMiddleware(...middlewares) {
  const midds = middlewares;
  const opts = midds.length && midds[midds.length - 1];
  const beforeWrap = typeof opts === "object" && opts.beforeWrap;
  const fns = findFns(midds);
  let handlers = [];
  let j = 0;
  const len = fns.length;
  while (j < len) {
    const fn = fns[j];
    handlers = handlers.concat((rev, next) => {
      const res = rev.response;
      if (!rev.__isWrapMiddleware) {
        rev.headers = rev.request.headers;
        rev.method = rev.request.method;
        res.setHeader = res.set = res.header;
        res.getHeader = res.get = (a) => res.header(a);
        res.hasHeader = (a) => res.header(a) !== null;
        res.removeHeader = (a) => res.header().delete(a);
        res.end = res.send;
        res.writeHead = (a, ...b) => {
          res.status(a);
          for (let i = 0; i < b.length; i++) {
            if (typeof b[i] === "object") {
              res.header(b[i]);
            }
          }
        };
        rev.respond = ({ body, status, headers }) =>
          rev.respondWith(new Response(body, { status, headers }));
        rev.__isWrapMiddleware = true;
      }
      if (beforeWrap) {
        beforeWrap(rev, res);
      }
      return fn(rev, res, next);
    });
    j++;
  }
  return handlers;
}
function serializeCookie(name, value, cookie = {}) {
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
function tryDecode(str) {
  try {
    str = str.substring(2);
    const dec = atob(str);
    const uint = Uint8Array.from(dec.split(","));
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
function getReqCookies(req, decode, i = 0) {
  const str = req.headers.get("Cookie");
  if (str === null) {
    return {};
  }
  const ret = {};
  const arr = str.split(";");
  const len = arr.length;
  while (i < len) {
    const [key, ...oriVal] = arr[i].split("=");
    const val = oriVal.join("=");
    ret[key.trim()] = decode
      ? val.startsWith("E:") ? tryDecode(val) : val
      : val;
    i++;
  }
  return ret;
}

// src/error.ts
var HttpError = class extends Error {
  constructor(status, message, name) {
    super(message);
    this.message = message || "Http Error";
    this.status = status || 500;
    this.name = name || "HttpError";
  }
};
function getError(err, isStack) {
  let status = err.status || err.statusCode || err.code || 500;
  if (typeof status !== "number") {
    status = 500;
  }
  let stack = void 0;
  if (isStack) {
    const arr = err.stack ? err.stack.split("\n") : [""];
    arr.shift();
    stack = arr.filter((line) => line.indexOf("file://") !== -1).map((line) =>
      line.trim()
    );
  }
  return {
    status,
    message: err.message || "Something went wrong",
    name: err.name || "HttpError",
    stack,
  };
}

// src/body.ts
var decoder2 = new TextDecoder();
var Multipart = class {
  createBody(formData, { parse } = {}) {
    return parse
      ? parse(Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          formData.getAll(key).length > 1
            ? formData.getAll(key)
            : formData.get(key),
        ]),
      ))
      : parseQuery(formData);
  }
  cleanUp(body) {
    for (const key in body) {
      if (Array.isArray(body[key])) {
        const arr = body[key];
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          if (el instanceof File) {
            delete body[key];
            break;
          }
        }
      } else if (body[key] instanceof File) {
        delete body[key];
      }
    }
  }
  validate(files, opts) {
    let j = 0;
    const len = files.length;
    if (opts == null ? void 0 : opts.maxCount) {
      if (len > opts.maxCount) {
        throw new HttpError(
          400,
          `${opts.name} no more than ${opts.maxCount} file`,
          "BadRequestError",
        );
      }
    }
    while (j < len) {
      const file = files[j];
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts == null ? void 0 : opts.accept) {
        if (!opts.accept.includes(ext)) {
          throw new HttpError(
            400,
            `${opts.name} only accept ${opts.accept}`,
            "BadRequestError",
          );
        }
      }
      if (opts == null ? void 0 : opts.maxSize) {
        if (file.size > toBytes(opts.maxSize)) {
          throw new HttpError(
            400,
            `${opts.name} to large, maxSize = ${opts.maxSize}`,
            "BadRequestError",
          );
        }
      }
      j++;
    }
  }
  async privUpload(files, opts) {
    const cwd = Deno.cwd();
    let i = 0;
    const len = files.length;
    while (i < len) {
      const file = files[i];
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts == null ? void 0 : opts.callback) {
        opts.callback(file);
      }
      let dest = opts.dest || "";
      if (dest.lastIndexOf("/") === -1) {
        dest += "/";
      }
      file.filename = file.filename ||
        Date.now() + file.lastModified.toString() + "_" +
          file.name.substring(0, 16).replace(/\./g, "") + "." + ext;
      file.path = file.path || (dest !== "/" ? dest : "") + file.filename;
      const arrBuff = await file.arrayBuffer();
      await Deno.writeFile(
        cwd + "/" + dest + file.filename,
        new Uint8Array(arrBuff),
      );
      i++;
    }
  }
  upload(options) {
    return async (rev, next) => {
      var _a;
      if (rev.body === void 0) {
        rev.body = {};
      }
      if (rev.file === void 0) {
        rev.file = {};
      }
      if (
        rev.request.body &&
        ((_a = rev.request.headers.get("content-type")) == null
          ? void 0
          : _a.includes("multipart/form-data"))
      ) {
        if (rev.request.bodyUsed === false) {
          const formData = await rev.request.formData();
          rev.body = await this.createBody(formData, {
            parse: rev.__parseQuery,
          });
        }
        if (Array.isArray(options)) {
          let j = 0, i = 0;
          const len = options.length;
          while (j < len) {
            const obj = options[j];
            if (obj.required && rev.body[obj.name] === void 0) {
              throw new HttpError(
                400,
                `Field ${obj.name} is required`,
                "BadRequestError",
              );
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
            throw new HttpError(
              400,
              `Field ${obj.name} is required`,
              "BadRequestError",
            );
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
async function verifyBody(request, limit) {
  const arrBuff = await request.arrayBuffer();
  if (limit && arrBuff.byteLength > toBytes(limit)) {
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  const body = decoder2.decode(arrBuff);
  return body;
}
var multipart = new Multipart();
function acceptContentType(headers, cType) {
  const type = headers.get("content-type");
  return type === cType || (type == null ? void 0 : type.startsWith(cType));
}
var withBody = async (rev, next, parse, parseMultipart, opts) => {
  rev.body = {};
  if (rev.request.body && rev.request.bodyUsed === false) {
    const headers = rev.request.headers;
    if (acceptContentType(headers, "application/json")) {
      if ((opts == null ? void 0 : opts.json) !== 0) {
        try {
          const body = await verifyBody(
            rev.request,
            (opts == null ? void 0 : opts.json) || "3mb",
          );
          rev.body = JSON.parse(body);
        } catch (error) {
          return next(error);
        }
      }
    } else if (
      acceptContentType(headers, "application/x-www-form-urlencoded")
    ) {
      if ((opts == null ? void 0 : opts.urlencoded) !== 0) {
        try {
          const body = await verifyBody(
            rev.request,
            (opts == null ? void 0 : opts.urlencoded) || "3mb",
          );
          rev.body = parse(body);
        } catch (error) {
          return next(error);
        }
      }
    } else if (acceptContentType(headers, "text/plain")) {
      if ((opts == null ? void 0 : opts.raw) !== 0) {
        try {
          const body = await verifyBody(
            rev.request,
            (opts == null ? void 0 : opts.raw) || "3mb",
          );
          try {
            rev.body = JSON.parse(body);
          } catch (_err) {
            rev.body = { _raw: body };
          }
        } catch (error) {
          return next(error);
        }
      }
    } else if (acceptContentType(headers, "multipart/form-data")) {
      if ((opts == null ? void 0 : opts.multipart) !== 0) {
        try {
          const formData = await rev.request.formData();
          rev.body = await multipart.createBody(formData, {
            parse: parseMultipart,
          });
        } catch (error) {
          return next(error);
        }
      }
    }
  }
  return next();
};

// src/http_response.ts
var JSON_TYPE_CHARSET = "application/json; charset=utf-8";
var HttpResponse = class {
};
var JsonResponse = class extends Response {
  constructor(json, opts = {}) {
    opts.headers = opts.headers || new Headers();
    opts.headers.set("content-type", JSON_TYPE_CHARSET);
    super(JSON.stringify(json), opts);
  }
};
function response(res, respondWith, opts) {
  res.header = function (key, value) {
    opts.headers = opts.headers || new Headers();
    if (typeof key === "string" && typeof value === "string") {
      opts.headers.set(key, value);
      return this;
    }
    if (typeof key === "object") {
      if (key instanceof Headers) {
        opts.headers = key;
      } else {
        for (const k in key) {
          opts.headers.set(k, key[k]);
        }
      }
      return this;
    }
    if (typeof key === "string") {
      return opts.headers.get(key);
    }
    return opts.headers;
  };
  res.status = function (code) {
    if (code) {
      opts.status = code;
      return this;
    }
    return opts.status || 200;
  };
  res.type = function (value) {
    this.header("Content-Type", value);
    return this;
  };
  res.send = function (body) {
    if (typeof body === "string") {
      return respondWith(new Response(body, opts));
    }
    if (typeof body === "object") {
      if (body instanceof Response) {
        return respondWith(body);
      }
      if (
        body instanceof Uint8Array || body instanceof ReadableStream ||
        body instanceof FormData || body instanceof Blob ||
        typeof body.read === "function"
      ) {
        return respondWith(new Response(body, opts));
      }
      body = JSON.stringify(body);
      opts.headers = opts.headers || new Headers();
      opts.headers.set("Content-Type", JSON_TYPE_CHARSET);
    }
    return respondWith(new Response(body, opts));
  };
  res.json = function (body) {
    return respondWith(new JsonResponse(body, opts));
  };
  res.redirect = function (url, status) {
    return this.header("Location", url).status(status || 302).send();
  };
  res.cookie = function (name, value, _opts = {}) {
    _opts.httpOnly = _opts.httpOnly !== false;
    _opts.path = _opts.path || "/";
    if (_opts.maxAge) {
      _opts.expires = new Date(Date.now() + _opts.maxAge);
      _opts.maxAge /= 1e3;
    }
    value = typeof value === "object"
      ? "j:" + JSON.stringify(value)
      : String(value);
    this.header().append("Set-Cookie", serializeCookie(name, value, _opts));
    return this;
  };
  res.clearCookie = function (name, _opts = {}) {
    _opts.httpOnly = _opts.httpOnly !== false;
    this.header().append(
      "Set-Cookie",
      serializeCookie(
        name,
        "",
        __spreadProps(__spreadValues({}, _opts), { expires: new Date(0) }),
      ),
    );
  };
}

// src/nhttp.ts
var defError = (err, rev, env) => {
  const obj = getError(err, env === "development");
  return rev.response.status(obj.status).json(obj);
};
var NHttp = class extends Router {
  constructor({ parseQuery: parseQuery2, bodyLimit, env } = {}) {
    super();
    this.parseQuery = parseQuery2 || parseQuery;
    this.multipartParseQuery = parseQuery2;
    this.bodyLimit = bodyLimit;
    this.env = env || "development";
    this.fetchEventHandler = this.fetchEventHandler.bind(this);
    if (parseQuery2) {
      this.use((rev, next) => {
        rev.__parseQuery = parseQuery2;
        return next();
      });
    }
  }
  onError(fn) {
    this._onError = (err, rev, next) => {
      let status = err.status || err.statusCode || err.code || 500;
      if (typeof status !== "number") {
        status = 500;
      }
      rev.response.status(status);
      return fn(err, rev, next);
    };
    return this;
  }
  on404(fn) {
    this._on404 = (rev, next) => {
      rev.response.status(404);
      return fn(rev, next);
    };
    return this;
  }
  use(...args) {
    let str = typeof args[0] === "string" ? args[0] : "";
    let last = args[args.length - 1];
    if (str === "/") {
      str = "";
    }
    if (args.length === 1 && typeof args[0] === "function") {
      this.midds = this.midds.concat(args[0]);
    } else if (
      typeof last === "object" && (last.c_routes || last[0].c_routes)
    ) {
      const wares = findFns(args);
      last = Array.isArray(last) ? last : [last];
      let i = 0, j = 0;
      for (; i < last.length; i++) {
        for (; j < last[i].c_routes.length; j++) {
          const { method, path, fns } = last[i].c_routes[j];
          this.on(method, str + path, ...wares.concat(fns));
        }
      }
    } else if (str !== "") {
      this.pmidds = this.pmidds || {};
      this.pmidds[str] = [
        (rev, next) => {
          rev.url = rev.url.substring(str.length) || "/";
          rev.path = rev.path.substring(str.length) || "/";
          return next();
        },
      ].concat(findFns(args));
    } else {
      this.midds = this.midds.concat(findFns(args));
    }
    return this;
  }
  on(method, path, ...handlers) {
    const fns = findFns(handlers);
    const { wild, pathx } = toPathx(path, method === "ANY");
    if (pathx) {
      this.route[method] = this.route[method] || [];
      this.route[method].push({ wild, pathx, fns });
    } else {
      this.route[method + path] = { fns };
    }
    return this;
  }
  handle(rev, isRw) {
    let i = 0, j = 0, k = -1, l = 0;
    const { method, url } = rev.request;
    let path = "", query = null, search = null, len;
    while ((k = url.indexOf("/", k + 1)) != -1) {
      l += 1;
      if (l === 3) {
        path = rev.url = url.substring(k);
        len = rev.url.length;
        while (j < len) {
          if (rev.url.charCodeAt(j) === 63) {
            path = rev.url.substring(0, j);
            query = rev.url.substring(j + 1);
            search = rev.url.substring(j);
            break;
          }
          j++;
        }
        break;
      }
    }
    const { fns, params } = this.find(method, path, this._on404);
    const next = (err) => {
      let ret;
      try {
        ret = err ? this._onError(err, rev, next) : fns[i++](rev, next);
      } catch (e) {
        return err ? defError(e, rev, this.env) : next(e);
      }
      if (ret) {
        if (typeof ret.then === "function") {
          return this.withPromise(ret, rev, next);
        }
        return rev.response.send(ret);
      }
    };
    rev.params = params;
    rev.path = path;
    rev.query = this.parseQuery(query);
    rev.search = search;
    rev.getCookies = (n) => getReqCookies(rev.request, n);
    if (isRw) {
      rev.respondWith = (r) => r;
    }
    response(rev.response = {}, rev.respondWith, rev.responseInit = {});
    if (method == "GET" || method == "HEAD") {
      return next();
    }
    return withBody(
      rev,
      next,
      this.parseQuery,
      this.multipartParseQuery,
      this.bodyLimit,
    );
  }
  fetchEventHandler() {
    return async (event) => {
      let resp;
      const promise = new Promise((ok) => resp = ok);
      const rw = event.respondWith(promise);
      const _rev = event;
      _rev.respondWith = resp;
      this.handle(_rev);
      await rw;
    };
  }
  handleEvent(event) {
    return this.handle(event, true);
  }
  async listen(opts, callback) {
    let isTls = false;
    if (typeof opts === "number") {
      opts = { port: opts };
    } else if (typeof opts === "object") {
      isTls = opts.certFile !== void 0;
    }
    this.server = isTls ? Deno.listenTls(opts) : Deno.listen(opts);
    try {
      if (callback) {
        callback(
          void 0,
          __spreadProps(__spreadValues({}, opts), {
            hostname: opts.hostname || "localhost",
            server: this.server,
          }),
        );
      }
      while (true) {
        try {
          const conn = await this.server.accept();
          if (conn) {
            this.handleConn(conn);
          } else {
            break;
          }
        } catch (_e) {
        }
      }
    } catch (error) {
      if (callback) {
        callback(
          error,
          __spreadProps(__spreadValues({}, opts), {
            hostname: opts.hostname || "localhost",
            server: this.server,
          }),
        );
      }
    }
  }
  _onError(err, rev, _) {
    return defError(err, rev, this.env);
  }
  _on404(rev, _) {
    const obj = getError(
      new HttpError(
        404,
        `Route ${rev.request.method}${rev.url} not found`,
        "NotFoundError",
      ),
    );
    return rev.response.status(obj.status).json(obj);
  }
  async handleConn(conn) {
    try {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        let resp;
        const promise = new Promise((ok) => resp = ok);
        const rw = requestEvent.respondWith(promise);
        const _rev = requestEvent;
        _rev.respondWith = resp;
        this.handle(_rev);
        await rw;
      }
    } catch (_e) {
    }
  }
  async withPromise(handler, rev, next, isDepError) {
    try {
      const ret = await handler;
      if (!ret) {
        return;
      }
      return rev.response.send(ret);
    } catch (err) {
      if (isDepError) {
        return this._onError(err, rev, next);
      }
      return next(err);
    }
  }
};

// src/request_event.ts
var RequestEvent = class {
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpError,
  HttpResponse,
  JsonResponse,
  NHttp,
  RequestEvent,
  Router,
  getError,
  multipart,
  wrapMiddleware,
});
