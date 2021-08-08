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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError("Cannot " + msg);
  }
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError("Cannot add the same private member more than once");
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// mod.ts
__export(exports, {
  BadGatewayError: () => BadGatewayError,
  BadRequestError: () => BadRequestError,
  ConflictError: () => ConflictError,
  ExpectationFailedError: () => ExpectationFailedError,
  FailedDependencyError: () => FailedDependencyError,
  ForbiddenError: () => ForbiddenError,
  GatewayTimeoutError: () => GatewayTimeoutError,
  GoneError: () => GoneError,
  HTTPVersionNotSupportedError: () => HTTPVersionNotSupportedError,
  HttpResponse: () => HttpResponse,
  InsufficientStorageError: () => InsufficientStorageError,
  InternalServerError: () => InternalServerError,
  JsonResponse: () => JsonResponse,
  LengthRequiredError: () => LengthRequiredError,
  LockedError: () => LockedError,
  LoopDetectedError: () => LoopDetectedError,
  MethodNotAllowedError: () => MethodNotAllowedError,
  MisdirectedRequestError: () => MisdirectedRequestError,
  NHttp: () => NHttp,
  NHttpError: () => NHttpError,
  NetworkAuthenticationRequiredError: () => NetworkAuthenticationRequiredError,
  NotAcceptableError: () => NotAcceptableError,
  NotExtendedError: () => NotExtendedError,
  NotFoundError: () => NotFoundError,
  NotImplementedError: () => NotImplementedError,
  PaymentRequiredError: () => PaymentRequiredError,
  PreconditionFailedError: () => PreconditionFailedError,
  PreconditionRequiredError: () => PreconditionRequiredError,
  ProxyAuthRequiredError: () => ProxyAuthRequiredError,
  RequestEntityTooLargeError: () => RequestEntityTooLargeError,
  RequestEvent: () => RequestEvent,
  RequestHeaderFieldsTooLargeError: () => RequestHeaderFieldsTooLargeError,
  RequestTimeoutError: () => RequestTimeoutError,
  RequestURITooLongError: () => RequestURITooLongError,
  RequestedRangeNotSatisfiableError: () => RequestedRangeNotSatisfiableError,
  Router: () => Router,
  ServiceUnavailableError: () => ServiceUnavailableError,
  TeapotError: () => TeapotError,
  TooEarlyError: () => TooEarlyError,
  TooManyRequestsError: () => TooManyRequestsError,
  UnauthorizedError: () => UnauthorizedError,
  UnavailableForLegalReasonsError: () => UnavailableForLegalReasonsError,
  UnprocessableEntityError: () => UnprocessableEntityError,
  UnsupportedMediaTypeError: () => UnsupportedMediaTypeError,
  UpgradeRequiredError: () => UpgradeRequiredError,
  VariantAlsoNegotiatesError: () => VariantAlsoNegotiatesError,
  getError: () => getError,
  multipart: () => multipart,
  wrapMiddleware: () => wrapMiddleware,
});

// src/router.ts
function findBase(pathname) {
  const iof = pathname.indexOf("/", 1);
  if (iof !== -1) {
    return pathname.substring(0, iof);
  }
  return pathname;
}
var _addMidd;
var Router = class {
  constructor() {
    this.route = {};
    this.c_routes = [];
    this.midds = [];
    this.pmidds = {};
    __privateAdd(this, _addMidd, (midds, notFound, fns, url, midAsset) => {
      if (midAsset !== void 0) {
        const pfx = findBase(url || "/");
        if (midAsset[pfx]) {
          fns = midAsset[pfx].concat(fns);
        }
      }
      if (midds.length) {
        fns = midds.concat(fns);
      }
      return fns = fns.concat([notFound]);
    });
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
  on(method, path, ...handlers) {
    this.c_routes.push({ method, path, handlers });
    return this;
  }
  findRoute(method, url, notFound) {
    let handlers = [];
    const params = {};
    if (this.route[method + url]) {
      const obj2 = this.route[method + url];
      if (obj2.m) {
        handlers = obj2.handlers;
      } else {
        handlers = __privateGet(this, _addMidd).call(
          this,
          this.midds,
          notFound,
          obj2.handlers,
        );
        this.route[method + url] = {
          m: true,
          handlers,
        };
      }
      return { params, handlers };
    }
    if (url !== "/" && url[url.length - 1] === "/") {
      const _url = url.slice(0, -1);
      if (this.route[method + _url]) {
        const obj2 = this.route[method + _url];
        if (obj2.m) {
          handlers = obj2.handlers;
        } else {
          handlers = __privateGet(this, _addMidd).call(
            this,
            this.midds,
            notFound,
            obj2.handlers,
          );
          this.route[method + _url] = {
            m: true,
            handlers,
          };
        }
        return { params, handlers };
      }
    }
    let i = 0;
    let j = 0;
    let obj = {};
    let routes = this.route[method] || [];
    let matches = [];
    let _404 = true;
    if (this.route["ANY"]) {
      routes = routes.concat(this.route["ANY"]);
    }
    const len = routes.length;
    while (i < len) {
      obj = routes[i];
      if (obj.pathx && obj.pathx.test(url)) {
        _404 = false;
        if (obj.params) {
          matches = obj.pathx.exec(url);
          matches.shift();
          while (j < obj.params.length) {
            const str = matches[j];
            params[obj.params[j]] = str ? unescape(str) : null;
            j++;
          }
          if (params["wild"]) {
            params["wild"] = params["wild"].split("/");
          }
        }
        break;
      }
      i++;
    }
    handlers = __privateGet(this, _addMidd).call(
      this,
      this.midds,
      notFound,
      _404 ? [] : obj.handlers || [],
      url,
      this.pmidds,
    );
    return { params, handlers };
  }
};
_addMidd = new WeakMap();

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
  if (path instanceof RegExp) {
    return { params: null, pathx: path };
  }
  const trgx = /\?|\*|\./;
  if (!trgx.test(path) && isAny === false) {
    const len = (path.match(/\/:/gi) || []).length;
    if (len === 0) {
      return;
    }
  }
  let params = [], pattern = "";
  const strReg = "/([^/]+?)", strRegQ = "(?:/([^/]+?))?";
  if (trgx.test(path)) {
    const arr = path.split("/");
    let obj, el, i = 0;
    arr[0] || arr.shift();
    for (; i < arr.length; i++) {
      obj = arr[i];
      el = obj[0];
      if (el === "*") {
        params.push("wild");
        pattern += "/(.*)";
      } else if (el === ":") {
        const isQuest = obj.indexOf("?") !== -1,
          isExt = obj.indexOf(".") !== -1;
        if (isQuest && !isExt) {
          pattern += strRegQ;
        } else {
          pattern += strReg;
        }
        if (isExt) {
          const _ext = obj.substring(obj.indexOf("."));
          let _pattern = pattern + (isQuest ? "?" : "") + "\\" + _ext;
          _pattern = _pattern.replaceAll(
            strReg + "\\" + _ext,
            "/([\\w-]+" + _ext + ")",
          );
          pattern = _pattern;
        }
      } else {
        pattern += "/" + obj;
      }
    }
  } else {
    pattern = path.replace(/\/:[a-z_-]+/gi, strReg);
  }
  const pathx = new RegExp(`^${pattern}/?$`, "i"),
    matches = path.match(/\:([a-z_-]+)/gi);
  if (!params.length) {
    params = matches && matches.map((e) => e.substring(1));
  } else {
    const newArr = matches ? matches.map((e) => e.substring(1)) : [];
    params = newArr.concat(params);
  }
  return { params, pathx };
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
function fnWrapMiddleware(...middlewares) {
  const midds = middlewares;
  const opts = midds.length && midds[midds.length - 1];
  const beforeWrap = typeof opts === "object" && opts.beforeWrap;
  const fns = findFns(midds);
  return (rev, next) => {
    const res = rev.response;
    if (rev.__isWrapMiddleware === void 0) {
      rev.headers = rev.request.headers;
      rev.method = rev.request.method;
      res.setHeader = res.set = res.header;
      res.getHeader = res.get = (a) => res.header(a);
      res.hasHeader = (a) => res.header(a) !== null;
      res.removeHeader = (a) => res.header().delete(a);
      res.end = res.send;
      res.writeHead = (a, ...b) => {
        res.status(a);
        for (let i2 = 0; i2 < b.length; i2++) {
          if (typeof b[i2] === "object") {
            res.header(b[i2]);
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
    if (!fns.length) {
      return next();
    }
    let i = 0;
    fns[i++](rev, res, next);
  };
}
var wrapMiddleware = fnWrapMiddleware;
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

// error.ts
var NHttpError = class extends Error {
  constructor(message, status = 500, name) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = name || "HttpError";
  }
};
var BadRequestError = class extends NHttpError {
  constructor(message) {
    super(message, 400, "BadRequestError");
  }
};
var UnauthorizedError = class extends NHttpError {
  constructor(message) {
    super(message, 401, "UnauthorizedError");
  }
};
var PaymentRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 402, "PaymentRequiredError");
  }
};
var ForbiddenError = class extends NHttpError {
  constructor(message) {
    super(message, 403, "ForbiddenError");
  }
};
var NotFoundError = class extends NHttpError {
  constructor(message) {
    super(message, 404, "NotFoundError");
  }
};
var MethodNotAllowedError = class extends NHttpError {
  constructor(message) {
    super(message, 405, "MethodNotAllowedError");
  }
};
var NotAcceptableError = class extends NHttpError {
  constructor(message) {
    super(message, 406, "NotAcceptableError");
  }
};
var ProxyAuthRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 407, "ProxyAuthRequiredError");
  }
};
var RequestTimeoutError = class extends NHttpError {
  constructor(message) {
    super(message, 408, "RequestTimeoutError");
  }
};
var ConflictError = class extends NHttpError {
  constructor(message) {
    super(message, 409, "ConflictError");
  }
};
var GoneError = class extends NHttpError {
  constructor(message) {
    super(message, 410, "GoneError");
  }
};
var LengthRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 411, "LengthRequiredError");
  }
};
var PreconditionFailedError = class extends NHttpError {
  constructor(message) {
    super(message, 412, "PreconditionFailedError");
  }
};
var RequestEntityTooLargeError = class extends NHttpError {
  constructor(message) {
    super(message, 413, "RequestEntityTooLargeError");
  }
};
var RequestURITooLongError = class extends NHttpError {
  constructor(message) {
    super(message, 414, "RequestURITooLongError");
  }
};
var UnsupportedMediaTypeError = class extends NHttpError {
  constructor(message) {
    super(message, 415, "UnsupportedMediaTypeError");
  }
};
var RequestedRangeNotSatisfiableError = class extends NHttpError {
  constructor(message) {
    super(message, 416, "RequestedRangeNotSatisfiableError");
  }
};
var ExpectationFailedError = class extends NHttpError {
  constructor(message) {
    super(message, 417, "ExpectationFailedError");
  }
};
var TeapotError = class extends NHttpError {
  constructor(message) {
    super(message, 418, "TeapotError");
  }
};
var MisdirectedRequestError = class extends NHttpError {
  constructor(message) {
    super(message, 421, "MisdirectedRequestError");
  }
};
var UnprocessableEntityError = class extends NHttpError {
  constructor(message) {
    super(message, 422, "UnprocessableEntityError");
  }
};
var LockedError = class extends NHttpError {
  constructor(message) {
    super(message, 423, "LockedError");
  }
};
var FailedDependencyError = class extends NHttpError {
  constructor(message) {
    super(message, 424, "FailedDependencyError");
  }
};
var TooEarlyError = class extends NHttpError {
  constructor(message) {
    super(message, 425, "TooEarlyError");
  }
};
var UpgradeRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 426, "UpgradeRequiredError");
  }
};
var PreconditionRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 428, "PreconditionRequiredError");
  }
};
var TooManyRequestsError = class extends NHttpError {
  constructor(message) {
    super(message, 429, "TooManyRequestsError");
  }
};
var RequestHeaderFieldsTooLargeError = class extends NHttpError {
  constructor(message) {
    super(message, 431, "RequestHeaderFieldsTooLargeError");
  }
};
var UnavailableForLegalReasonsError = class extends NHttpError {
  constructor(message) {
    super(message, 451, "UnavailableForLegalReasonsError");
  }
};
var InternalServerError = class extends NHttpError {
  constructor(message) {
    super(message, 500, "InternalServerError");
  }
};
var NotImplementedError = class extends NHttpError {
  constructor(message) {
    super(message, 501, "NotImplementedError");
  }
};
var BadGatewayError = class extends NHttpError {
  constructor(message) {
    super(message, 502, "BadGatewayError");
  }
};
var ServiceUnavailableError = class extends NHttpError {
  constructor(message) {
    super(message, 503, "ServiceUnavailableError");
  }
};
var GatewayTimeoutError = class extends NHttpError {
  constructor(message) {
    super(message, 504, "GatewayTimeoutError");
  }
};
var HTTPVersionNotSupportedError = class extends NHttpError {
  constructor(message) {
    super(message, 505, "HTTPVersionNotSupportedError");
  }
};
var VariantAlsoNegotiatesError = class extends NHttpError {
  constructor(message) {
    super(message, 506, "VariantAlsoNegotiatesError");
  }
};
var InsufficientStorageError = class extends NHttpError {
  constructor(message) {
    super(message, 507, "InsufficientStorageError");
  }
};
var LoopDetectedError = class extends NHttpError {
  constructor(message) {
    super(message, 508, "LoopDetectedError");
  }
};
var NotExtendedError = class extends NHttpError {
  constructor(message) {
    super(message, 510, "NotExtendedError");
  }
};
var NetworkAuthenticationRequiredError = class extends NHttpError {
  constructor(message) {
    super(message, 511, "NetworkAuthenticationRequiredError");
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
var _cleanUp, _validate, _upload;
var Multipart = class {
  constructor() {
    this.createBody = (formData, { parse } = {}) => {
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
    };
    __privateAdd(this, _cleanUp, (body) => {
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
    });
    __privateAdd(this, _validate, (files, opts) => {
      let j = 0;
      const len = files.length;
      if (opts == null ? void 0 : opts.maxCount) {
        if (len > opts.maxCount) {
          throw new BadRequestError(
            `${opts.name} no more than ${opts.maxCount} file`,
          );
        }
      }
      while (j < len) {
        const file = files[j];
        const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
        if (opts == null ? void 0 : opts.accept) {
          if (!opts.accept.includes(ext)) {
            throw new BadRequestError(
              `${opts.name} only accept ${opts.accept}`,
            );
          }
        }
        if (opts == null ? void 0 : opts.maxSize) {
          if (file.size > toBytes(opts.maxSize)) {
            throw new BadRequestError(
              `${opts.name} to large, maxSize = ${opts.maxSize}`,
            );
          }
        }
        j++;
      }
    });
    __privateAdd(this, _upload, async (files, opts) => {
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
    });
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
              throw new BadRequestError(`Field ${obj.name} is required`);
            }
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              __privateGet(this, _validate).call(this, files, obj);
            }
            j++;
          }
          while (i < len) {
            const obj = options[i];
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              await __privateGet(this, _upload).call(this, files, obj);
              delete rev.body[obj.name];
            }
            i++;
          }
          __privateGet(this, _cleanUp).call(this, rev.body);
        } else if (typeof options === "object") {
          const obj = options;
          if (obj.required && rev.body[obj.name] === void 0) {
            throw new BadRequestError(`Field ${obj.name} is required`);
          }
          if (rev.body[obj.name]) {
            rev.file[obj.name] = rev.body[obj.name];
            const objFile = rev.file[obj.name];
            const files = Array.isArray(objFile) ? objFile : [objFile];
            __privateGet(this, _validate).call(this, files, obj);
            await __privateGet(this, _upload).call(this, files, obj);
            delete rev.body[obj.name];
          }
          __privateGet(this, _cleanUp).call(this, rev.body);
        }
      }
      next();
    };
  }
};
_cleanUp = new WeakMap();
_validate = new WeakMap();
_upload = new WeakMap();
async function verifyBody(request, limit) {
  const arrBuff = await request.arrayBuffer();
  if (limit && arrBuff.byteLength > toBytes(limit)) {
    throw new BadRequestError(`Body is too large. max limit ${limit}`);
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
        const formData = await rev.request.formData();
        rev.body = await multipart.createBody(formData, {
          parse: parseMultipart,
        });
      }
    }
  }
  next();
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
var _parseQuery,
  _multipartParseQuery,
  _bodyLimit,
  _env,
  _onError,
  _on404,
  _addRoutes,
  _handleConn,
  _findUrl,
  _withPromise,
  _parseUrl;
var NHttp = class extends Router {
  constructor({ parseQuery: parseQuery2, bodyLimit, env } = {}) {
    super();
    __privateAdd(this, _parseQuery, void 0);
    __privateAdd(this, _multipartParseQuery, void 0);
    __privateAdd(this, _bodyLimit, void 0);
    __privateAdd(this, _env, void 0);
    __privateAdd(this, _onError, (err, rev, _) => {
      const obj = getError(err, __privateGet(this, _env) === "development");
      return rev.response.status(obj.status).json(obj);
    });
    __privateAdd(this, _on404, (rev, _) => {
      const obj = getError(
        new NotFoundError(`Route ${rev.request.method}${rev.url} not found`),
      );
      return rev.response.status(obj.status).json(obj);
    });
    __privateAdd(this, _addRoutes, (arg, args, routes) => {
      let prefix = "";
      let i = 0;
      const midds = findFns(args);
      const len = routes.length;
      if (typeof arg === "string" && arg.length > 1 && arg.charAt(0) === "/") {
        prefix = arg;
      }
      while (i < len) {
        const el = routes[i];
        el.handlers = midds.concat(el.handlers);
        this.on(el.method, prefix + el.path, ...el.handlers);
        i++;
      }
    });
    __privateAdd(this, _handleConn, async (conn) => {
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
    });
    __privateAdd(this, _findUrl, (str) => {
      const idx = [];
      let i = -1;
      while ((i = str.indexOf("/", i + 1)) != -1) {
        idx.push(i);
        if (idx.length === 3) {
          break;
        }
      }
      return str.substring(idx[2]);
    });
    __privateAdd(this, _withPromise, async (handler, rev, next, isDepError) => {
      try {
        const ret = await handler;
        if (!ret) {
          return;
        }
        rev.response.send(ret);
      } catch (err) {
        if (isDepError) {
          return __privateGet(this, _onError).call(this, err, rev, next);
        }
        next(err);
      }
    });
    __privateAdd(this, _parseUrl, (rev) => {
      const str = rev.url = __privateGet(this, _findUrl).call(
        this,
        rev.request.url,
      );
      const url = rev._parsedUrl || {};
      if (url._raw === str) {
        return;
      }
      let pathname = str, query = null, search = null, i = 0;
      const len = str.length;
      while (i < len) {
        if (str.charCodeAt(i) === 63) {
          pathname = str.substring(0, i);
          query = str.substring(i + 1);
          search = str.substring(i);
          break;
        }
        i++;
      }
      url.path = url._raw = url.href = str;
      url.pathname = pathname;
      url.query = query;
      url.search = search;
      rev._parsedUrl = url;
    });
    __privateSet(this, _parseQuery, parseQuery2 || parseQuery);
    __privateSet(this, _multipartParseQuery, parseQuery2);
    __privateSet(this, _bodyLimit, bodyLimit);
    __privateSet(this, _env, env || "development");
    this.fetchEventHandler = this.fetchEventHandler.bind(this);
    if (parseQuery2) {
      this.use((rev, next) => {
        rev.__parseQuery = parseQuery2;
        next();
      });
    }
  }
  onError(fn) {
    __privateSet(this, _onError, (err, rev, next) => {
      let status = err.status || err.statusCode || err.code || 500;
      if (typeof status !== "number") {
        status = 500;
      }
      rev.response.status(status);
      let ret;
      try {
        ret = fn(err, rev, next);
      } catch (error) {
        return __privateGet(this, _onError).call(this, error, rev, next);
      }
      if (ret) {
        if (typeof ret.then === "function") {
          return __privateGet(this, _withPromise).call(
            this,
            ret,
            rev,
            next,
            true,
          );
        }
        return rev.response.send(ret);
      }
    });
  }
  on404(fn) {
    __privateSet(this, _on404, (rev, next) => {
      rev.response.status(404);
      return fn(rev, next);
    });
  }
  use(...args) {
    const arg = args[0];
    const larg = args[args.length - 1];
    const len = args.length;
    if (len === 1 && typeof arg === "function") {
      this.midds.push(arg);
    } else if (typeof arg === "string" && typeof larg === "function") {
      if (arg === "/" || arg === "") {
        this.midds = this.midds.concat(findFns(args));
      } else {
        this.pmidds[arg] = [
          (rev, next) => {
            rev.url = rev.url.substring(arg.length) || "/";
            rev.path = rev.path ? rev.path.substring(arg.length) || "/" : "/";
            next();
          },
        ].concat(findFns(args));
      }
    } else if (typeof larg === "object" && larg.c_routes) {
      __privateGet(this, _addRoutes).call(this, arg, args, larg.c_routes);
    } else if (Array.isArray(larg)) {
      let i = 0;
      const len2 = larg.length;
      while (i < len2) {
        const el = larg[i];
        if (typeof el === "object" && el.c_routes) {
          __privateGet(this, _addRoutes).call(this, arg, args, el.c_routes);
        } else if (typeof el === "function") {
          this.midds.push(el);
        }
        i++;
      }
    } else {
      this.midds = this.midds.concat(findFns(args));
    }
    return this;
  }
  on(method, path, ...handlers) {
    const fns = findFns(handlers);
    const obj = toPathx(path, method === "ANY");
    if (obj !== void 0) {
      this.route[method] = this.route[method] || [];
      this.route[method].push(
        __spreadProps(__spreadValues({}, obj), { handlers: fns }),
      );
    } else {
      this.route[method + path] = { handlers: fns };
    }
    return this;
  }
  handle(rev, i = 0) {
    __privateGet(this, _parseUrl).call(this, rev);
    const obj = this.findRoute(
      rev.request.method,
      rev._parsedUrl.pathname,
      __privateGet(this, _on404),
    );
    const next = (err) => {
      if (err) {
        return __privateGet(this, _onError).call(this, err, rev, next);
      }
      let ret;
      try {
        ret = obj.handlers[i++](rev, next);
      } catch (error) {
        return next(error);
      }
      if (ret) {
        if (typeof ret.then === "function") {
          return __privateGet(this, _withPromise).call(this, ret, rev, next);
        }
        return rev.response.send(ret);
      }
    };
    rev.params = obj.params;
    rev.path = rev._parsedUrl.pathname;
    rev.query = __privateGet(this, _parseQuery).call(
      this,
      rev._parsedUrl.query,
    );
    rev.search = rev._parsedUrl.search;
    rev.getCookies = (n) => getReqCookies(rev.request, n);
    response(rev.response = {}, rev.respondWith, rev.responseInit = {});
    withBody(
      rev,
      next,
      __privateGet(this, _parseQuery),
      __privateGet(this, _multipartParseQuery),
      __privateGet(this, _bodyLimit),
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
            __privateGet(this, _handleConn).call(this, conn);
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
};
_parseQuery = new WeakMap();
_multipartParseQuery = new WeakMap();
_bodyLimit = new WeakMap();
_env = new WeakMap();
_onError = new WeakMap();
_on404 = new WeakMap();
_addRoutes = new WeakMap();
_handleConn = new WeakMap();
_findUrl = new WeakMap();
_withPromise = new WeakMap();
_parseUrl = new WeakMap();

// src/request_event.ts
var RequestEvent = class {
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadGatewayError,
  BadRequestError,
  ConflictError,
  ExpectationFailedError,
  FailedDependencyError,
  ForbiddenError,
  GatewayTimeoutError,
  GoneError,
  HTTPVersionNotSupportedError,
  HttpResponse,
  InsufficientStorageError,
  InternalServerError,
  JsonResponse,
  LengthRequiredError,
  LockedError,
  LoopDetectedError,
  MethodNotAllowedError,
  MisdirectedRequestError,
  NHttp,
  NHttpError,
  NetworkAuthenticationRequiredError,
  NotAcceptableError,
  NotExtendedError,
  NotFoundError,
  NotImplementedError,
  PaymentRequiredError,
  PreconditionFailedError,
  PreconditionRequiredError,
  ProxyAuthRequiredError,
  RequestEntityTooLargeError,
  RequestEvent,
  RequestHeaderFieldsTooLargeError,
  RequestTimeoutError,
  RequestURITooLongError,
  RequestedRangeNotSatisfiableError,
  Router,
  ServiceUnavailableError,
  TeapotError,
  TooEarlyError,
  TooManyRequestsError,
  UnauthorizedError,
  UnavailableForLegalReasonsError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
  UpgradeRequiredError,
  VariantAlsoNegotiatesError,
  getError,
  multipart,
  wrapMiddleware,
});
