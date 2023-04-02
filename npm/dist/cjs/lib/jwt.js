var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var jwt_exports = {};
__export(jwt_exports, {
  Jwt: () => Jwt,
  default: () => jwt_default,
  jwt: () => jwt
});
var import_jwt_simple = __toESM(require("jwt-simple"));
var import_deps = require("./deps");
var import_controller = require("./controller");
class UnauthorizedError extends import_deps.HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}
const jwt = (secret, opts = {}) => {
  opts.algorithm ??= "HS256";
  opts.credentials ??= true;
  opts.noVerify ??= false;
  return async (rev, next) => {
    let token;
    if (rev.method === "OPTIONS" && rev.headers.has("access-control-request-headers")) {
      const headers = rev.headers.get("access-control-request-headers");
      const cc = headers?.split(",").map((header) => header.trim().toLowerCase()).includes("authorization");
      if (cc)
        return next();
    }
    if (typeof opts.getToken === "function") {
      token = await opts.getToken(rev);
    } else {
      const authHeader = rev.headers.get("authorization");
      if (authHeader === null)
        throw new UnauthorizedError();
      const parts = authHeader.split(" ");
      if (parts.length == 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          if (opts.credentials) {
            throw new UnauthorizedError("Format is Authorization: Bearer [token]");
          } else {
            return next();
          }
        }
      } else {
        throw new UnauthorizedError("Format is Authorization: Bearer [token]");
      }
    }
    if (!token) {
      if (opts.credentials) {
        throw new UnauthorizedError("No authorization headers token was found");
      } else {
        return next();
      }
    }
    const prop = opts.propertyName ?? "auth";
    rev[prop] = {};
    let decode;
    try {
      decode = import_jwt_simple.default.decode(token, secret, opts.noVerify, opts.algorithm);
      rev[prop] = decode;
    } catch (err) {
      const e = new UnauthorizedError(err.message ?? "Invalid token");
      if (typeof opts.onExpired === "function" && err.message.includes("expired")) {
        return await opts.onExpired(e, rev, next);
      } else {
        throw e;
      }
    }
    return next();
  };
};
function Jwt(secret, opts = {}) {
  return (tgt, prop, des) => {
    (0, import_controller.joinHandlers)(tgt.constructor.name, prop, [jwt(secret, opts)]);
    return des;
  };
}
jwt.encode = import_jwt_simple.default.encode;
jwt.decode = import_jwt_simple.default.decode;
var jwt_default = jwt;
module.exports = __toCommonJS(jwt_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Jwt,
  jwt
});
