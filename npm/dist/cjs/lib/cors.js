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
var cors_exports = {};
__export(cors_exports, {
  cors: () => cors,
  default: () => cors_default
});
module.exports = __toCommonJS(cors_exports);
const cors = (opts = {}) => {
  opts.optionsStatus ??= 204;
  opts.preflightNext ??= false;
  opts.allowMethods ??= "GET,HEAD,PUT,PATCH,POST,DELETE";
  let origin = opts.origin ?? "*";
  const createOrigin = async (rev) => {
    let isCheck = false;
    if (typeof origin === "function") {
      origin = await origin(rev);
      if (origin !== false) {
        rev.response.setHeader("vary", "Origin");
      }
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
        rev.response.setHeader(
          "access-control-allow-origin",
          origin.toString()
        );
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
      response.setHeader(
        "access-control-expose-headers",
        opts.exposeHeaders.toString()
      );
    }
    if (opts.customHeaders)
      response.header(opts.customHeaders);
    if (request.method === "OPTIONS") {
      const allowHeaders = opts.allowHeaders ?? request.headers.get(
        "access-control-request-headers"
      ) ?? "";
      if (allowHeaders.length) {
        response.setHeader(
          "access-control-allow-headers",
          allowHeaders.toString()
        );
        response.header().append("vary", "Access-Control-Request-Headers");
      }
      if (opts.allowMethods?.length) {
        response.setHeader(
          "access-control-allow-methods",
          opts.allowMethods.toString()
        );
      }
      if (opts.maxAge !== void 0) {
        response.setHeader(
          "access-control-max-age",
          opts.maxAge.toString()
        );
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cors
});
