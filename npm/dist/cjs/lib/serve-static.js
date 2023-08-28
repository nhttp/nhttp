var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var serve_static_exports = {};
__export(serve_static_exports, {
  default: () => serve_static_default,
  sendFile: () => sendFile,
  serveStatic: () => serveStatic
});
module.exports = __toCommonJS(serve_static_exports);
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
            return await sendFile(
              rev,
              (0, import_deps.decURIComponent)(dir + "/" + index),
              opts
            );
          } catch {
          }
        }
      }
    }
    return next();
  };
}
var serve_static_default = serveStatic;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendFile,
  serveStatic
});
