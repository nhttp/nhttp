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
var serve_static_exports = {};
__export(serve_static_exports, {
  default: () => serve_static_default,
  sendFile: () => sendFile,
  serveStatic: () => serveStatic
});
var import_deps = require("./deps");
var import_etag = require("./etag");
const sendFile = import_etag.sendFile;
function serveStatic(dir, opts = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  opts.etag ??= false;
  if (dir instanceof URL)
    dir = dir.pathname;
  if (dir.endsWith("/"))
    dir = dir.slice(0, -1);
  const hasFileUrl = dir.startsWith("file://");
  const index = opts.redirect ? opts.index : "";
  let prefix = opts.prefix;
  const hasPrefix = prefix !== void 0 && prefix !== "/";
  if (hasPrefix) {
    if (prefix[0] !== "/")
      prefix = "/" + prefix;
    if (prefix.endsWith("/"))
      prefix = prefix.slice(0, -1);
  }
  if (hasFileUrl)
    dir = new URL(dir).pathname;
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        let path = rev.path;
        if (hasPrefix) {
          if (path.startsWith(prefix) === false)
            return next();
          path = path.substring(prefix.length);
          if (path !== "" && path[0] !== "/")
            return next();
        }
        let pathFile = dir + path;
        if (opts.redirect) {
          const idx = pathFile.lastIndexOf(".");
          if (pathFile.slice((idx - 1 >>> 0) + 2) === "") {
            if (pathFile.endsWith("/"))
              pathFile += index;
            else
              pathFile += "/" + index;
          }
        }
        return await sendFile(rev, (0, import_deps.decURIComponent)(pathFile), opts);
      } catch {
        if (opts.spa && opts.redirect) {
          try {
            return await sendFile(rev, (0, import_deps.decURIComponent)(dir + "/" + index), opts);
          } catch {
          }
        }
      }
    }
    return next();
  };
}
var serve_static_default = serveStatic;
module.exports = __toCommonJS(serve_static_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendFile,
  serveStatic
});
