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
var cors_exports = {};
__export(cors_exports, {
  cors: () => cors,
  default: () => cors_default
});
const cors = (opts = {}) => (rev, next) => {
  if (opts.origin !== false) {
    if (opts.origin === true)
      opts.origin = "*";
    rev.response.setHeader("access-control-allow-origin", opts.origin?.toString() ?? "*");
  }
  opts.optionsStatus ??= 204;
  if (opts.credentials) {
    rev.response.setHeader("access-control-allow-credentials", "true");
  }
  if (opts.allowHeaders) {
    rev.response.setHeader("access-control-allow-headers", opts.allowHeaders.toString());
  }
  if (opts.allowMethods) {
    rev.response.setHeader("access-control-allow-methods", opts.allowMethods.toString());
  }
  if (opts.customHeaders)
    rev.response.header(opts.customHeaders);
  if (rev.request.method === "OPTIONS") {
    rev.response.status(opts.optionsStatus);
    return null;
  }
  return next();
};
var cors_default = cors;
module.exports = __toCommonJS(cors_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cors
});
