var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jwt_exports = {};
__export(jwt_exports, {
  Jwt: () => Jwt,
  default: () => jwt_default,
  jwt: () => jwt
});
module.exports = __toCommonJS(jwt_exports);
var import_jwt_simple = __toESM(require("jwt-simple"), 1);
var import_deps = require("./deps");
var import_controller = require("./controller");
class UnauthorizedError extends import_deps.HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}
const jwt = (secretOrOptions) => {
  const opts = typeof secretOrOptions === "string" ? { secret: secretOrOptions } : secretOrOptions;
  opts.algorithm ??= "HS256";
  opts.credentials ??= true;
  opts.noVerify ??= false;
  const auth = async (rev, next) => {
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
            throw new UnauthorizedError(
              "Format is Authorization: Bearer [token]"
            );
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
      decode = import_jwt_simple.default.decode(token, opts.secret, opts.noVerify, opts.algorithm);
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
  return opts.onAuth ? [auth, opts.onAuth] : auth;
};
function Jwt(secretOrOptions) {
  return (tgt, prop, des) => {
    (0, import_controller.joinHandlers)(tgt.constructor.name, prop, [jwt(secretOrOptions)]);
    return des;
  };
}
jwt.encode = import_jwt_simple.default.encode;
jwt.decode = import_jwt_simple.default.decode;
var jwt_default = jwt;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Jwt,
  jwt
});
