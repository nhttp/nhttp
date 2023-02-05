var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var controller_exports = {};
__export(controller_exports, {
  Any: () => Any,
  Connect: () => Connect,
  Controller: () => Controller,
  Delete: () => Delete,
  Get: () => Get,
  Head: () => Head,
  Header: () => Header,
  Inject: () => Inject,
  Jsx: () => Jsx,
  Options: () => Options,
  Patch: () => Patch,
  Post: () => Post,
  Put: () => Put,
  Status: () => Status,
  Trace: () => Trace,
  Type: () => Type,
  Upload: () => Upload,
  View: () => View,
  Wares: () => Wares,
  addMethod: () => addMethod,
  addRoute: () => addRoute,
  joinHandlers: () => joinHandlers
});
var import_deps = require("./deps");
function concatRegexp(prefix, path) {
  if (prefix === "")
    return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}
function addRoute(className, prop, handler, opts) {
  globalThis.NHttpMetadata = globalThis.NHttpMetadata || {};
  const metadata = globalThis.NHttpMetadata;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  const fns = (obj[prop].fns || []).concat([handler]);
  obj[prop] = { path: opts.path, method: opts.method, fns };
  metadata[className]["route"] = obj;
}
function joinHandlers(className, prop, arr) {
  globalThis.NHttpMetadata = globalThis.NHttpMetadata || {};
  const metadata = globalThis.NHttpMetadata;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop].fns = arr.concat(obj[prop].fns || []);
  metadata[className]["route"] = obj;
}
function addMethod(method, path) {
  return (target, prop, des) => {
    const ori = des.value;
    des.value = function(...args) {
      const result = ori.apply(target, args);
      return result;
    };
    const className = target.constructor.name;
    addRoute(className, prop, des.value, { path, method });
    return des;
  };
}
function View(name) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    const viewFn = (rev, next) => {
      const index = typeof name === "function" ? name(rev, next) : name;
      const fns = globalThis.NHttpMetadata[className]["route"][prop]["fns"];
      const body = fns[fns.length - 1](rev, next);
      return rev.response.render(index, typeof body === "object" ? body : {});
    };
    joinHandlers(className, prop, [viewFn]);
    return des;
  };
}
function Jsx() {
  return (target, prop, des) => {
    const className = target.constructor.name;
    const jsxFn = (rev, next) => {
      const fns = globalThis.NHttpMetadata[className]["route"][prop]["fns"];
      const body = fns[fns.length - 1](rev, next);
      return rev.response.render(body);
    };
    joinHandlers(className, prop, [jsxFn]);
    return des;
  };
}
function Upload(options) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [import_deps.multipart.upload(options)]);
    return des;
  };
}
function Wares(...middlewares) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, middlewares);
    return des;
  };
}
function Status(status) {
  return (target, prop, des) => {
    const statusFn = (rev, next) => {
      rev.response.status(typeof status === "function" ? status(rev, next) : status);
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [statusFn]);
    return des;
  };
}
function Type(name) {
  return (target, prop, des) => {
    const typeFn = (rev, next) => {
      const value = typeof name === "function" ? name(rev, next) : name;
      rev.response.type(value);
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [typeFn]);
    return des;
  };
}
function Header(header) {
  return (target, prop, des) => {
    const headerFn = (rev, next) => {
      rev.response.header(typeof header === "function" ? header(rev, next) : header);
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [headerFn]);
    return des;
  };
}
function Inject(value, ...args) {
  return function(target, prop) {
    target[prop] = typeof value === "function" ? new value(...args) : value;
    if (value === void 0 && target.__val === void 0) {
      target.__val = true;
    }
  };
}
const Get = (path) => addMethod("GET", path);
const Post = (path) => addMethod("POST", path);
const Put = (path) => addMethod("PUT", path);
const Delete = (path) => addMethod("DELETE", path);
const Any = (path) => addMethod("ANY", path);
const Options = (path) => addMethod("OPTIONS", path);
const Head = (path) => addMethod("HEAD", path);
const Trace = (path) => addMethod("TRACE", path);
const Connect = (path) => addMethod("CONNECT", path);
const Patch = (path) => addMethod("PATCH", path);
function Controller(path, ...middlewares) {
  return (target) => {
    const cRoutes = [];
    const className = target.name;
    const obj = globalThis.NHttpMetadata[className]["route"];
    const midds = (0, import_deps.findFns)(middlewares);
    for (const k in obj) {
      if (obj[k].path instanceof RegExp) {
        obj[k].path = concatRegexp(path || "", obj[k].path);
      } else {
        if (path)
          obj[k].path = path + obj[k].path;
        if (obj[k].path.startsWith("//")) {
          obj[k].path = obj[k].path.substring(1);
        }
        if (obj[k].path !== "/" && obj[k].path.endsWith("/")) {
          obj[k].path = obj[k].path.slice(0, -1);
        }
      }
      cRoutes.push(obj[k]);
    }
    if (midds.length) {
      for (let i = 0; i < cRoutes.length; i++) {
        cRoutes[i].fns = midds.concat(cRoutes[i].fns);
      }
    }
    const ori = target;
    const fn = Object.defineProperty(function(...args) {
      const t = new ori(...args);
      Object.assign(t, target.prototype);
      Object.assign(ori.prototype, t);
      t.c_routes = cRoutes;
      return t;
    }, "name", { value: className });
    return fn;
  };
}
module.exports = __toCommonJS(controller_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Any,
  Connect,
  Controller,
  Delete,
  Get,
  Head,
  Header,
  Inject,
  Jsx,
  Options,
  Patch,
  Post,
  Put,
  Status,
  Trace,
  Type,
  Upload,
  View,
  Wares,
  addMethod,
  addRoute,
  joinHandlers
});
