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
var trpc_exports = {};
__export(trpc_exports, {
  default: () => trpc_default,
  trpc: () => trpc
});
var import_fetch = require("@trpc/server/adapters/fetch");
const trpc = (opts) => {
  return async (rev, next) => {
    try {
      const ctx = opts.createContext?.(rev, next) ?? rev;
      const endpoint = opts.prefix ?? rev.__prefix ?? rev.path.substring(0, rev.path.lastIndexOf("/")) ?? "";
      return await (0, import_fetch.fetchRequestHandler)({
        endpoint,
        req: rev.newRequest,
        router: opts.router,
        createContext: () => ctx,
        batching: opts.batching,
        responseMeta: opts.responseMeta,
        onError: opts.onError
      });
    } catch {
      return next();
    }
  };
};
var trpc_default = trpc;
module.exports = __toCommonJS(trpc_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  trpc
});
