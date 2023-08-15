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
const cors = (opts = {}) => {
  opts.optionsStatus ??= 204;
  opts.preflightNext ??= false;
  opts.allowMethods ??= "GET,HEAD,PUT,PATCH,POST,DELETE";
  let origin = opts.origin ?? "*";
  const createOrigin = async (rev) => {
    let isCheck = false;
    if (typeof origin === "function") {
      origin = await origin(rev);
      isCheck = true;
    }
    if (origin !== false) {
      if (origin === true)
        origin = "*";
      if (!isCheck && origin !== "*") {
        const reqOrigin = rev.request.headers.get("origin");
        if (reqOrigin !== null) {
          origin = origin.includes(reqOrigin) ? reqOrigin : "";
          rev.response.setHeader("vary", "Origin");
        } else {
          origin = "";
        }
      }
      if (origin.length) {
        rev.response.setHeader("access-control-allow-origin", origin.toString());
      }
    }
  };
  return async (rev, next) => {
    await createOrigin(rev);
    const { response, request } = rev;
    if (opts.credentials) {
      response.setHeader("access-control-allow-credentials", "true");
    }
    if (opts.exposeHeaders !== void 0) {
      response.setHeader("access-control-expose-headers", opts.exposeHeaders.toString());
    }
    if (opts.customHeaders)
      response.header(opts.customHeaders);
    if (request.method === "OPTIONS") {
      const allowHeaders = opts.allowHeaders ?? request.headers.get("access-control-request-headers") ?? "";
      if (allowHeaders.length) {
        response.setHeader("access-control-allow-headers", allowHeaders.toString());
        response.header().append("vary", "Access-Control-Request-Headers");
      }
      if (opts.allowMethods?.length) {
        response.setHeader("access-control-allow-methods", opts.allowMethods.toString());
      }
      if (opts.maxAge !== void 0) {
        response.setHeader("access-control-max-age", opts.maxAge.toString());
      }
      if (opts.preflightNext)
        return next();
      response.status(opts.optionsStatus ?? 204);
      return null;
    }
    return next();
  };
};
var cors_default = cors;
module.exports = __toCommonJS(cors_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cors
});
