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
var trpc_exports = {};
__export(trpc_exports, {
  default: () => trpc_default,
  trpc: () => trpc
});
module.exports = __toCommonJS(trpc_exports);
var import_fetch = require("@trpc/server/adapters/fetch");
const trpc = (opts) => {
  return async (rev, next) => {
    try {
      const ctx = typeof opts.createContext === "function" ? await opts.createContext(rev, next) : rev;
      const endpoint = opts.endpoint ?? opts.prefix ?? rev.__prefix ?? rev.path.substring(0, rev.path.lastIndexOf("/")) ?? "";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  trpc
});
