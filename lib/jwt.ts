import jwts from "https://esm.sh/jwt-simple@0.5.6";
import { Handler, HttpError, RequestEvent, TRet } from "./deps.ts";
import { NextFunction } from "../mod.ts";
import { joinHandlers, TDecorator } from "./controller.ts";

class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

type TOptions = {
  secret: string;
  algorithm?: jwts.TAlgorithm;
  noVerify?: boolean;
  credentials?: boolean;
  getToken?: (rev: RequestEvent) => string | Promise<string>;
  propertyName?: string;
  onExpired?: (
    err: UnauthorizedError,
    rev: RequestEvent,
    next: NextFunction,
  ) => TRet;
  onAuth?: Handler;
};

/**
 * jwt middleware.
 * @example
 * app.get("/admin", jwt({ secret: "my_secret" }), ...handlers);
 */
export const jwt = (
  secretOrOptions: string | TOptions,
): Handler | Handler[] => {
  const opts = typeof secretOrOptions === "string"
    ? { secret: secretOrOptions }
    : secretOrOptions;
  opts.algorithm ??= "HS256";
  opts.credentials ??= true;
  opts.noVerify ??= false;
  const auth = async (rev: RequestEvent, next: NextFunction) => {
    let token: string;
    if (
      rev.method === "OPTIONS" &&
      rev.headers.has("access-control-request-headers")
    ) {
      const headers = rev.headers.get("access-control-request-headers");
      const cc = headers?.split(",")
        .map((header) => header.trim().toLowerCase())
        .includes("authorization");
      if (cc) return next();
    }
    if (typeof opts.getToken === "function") {
      token = await opts.getToken(rev);
    } else {
      const authHeader = rev.headers.get("authorization");
      if (authHeader === null) throw new UnauthorizedError();
      const parts = authHeader.split(" ");
      if (parts.length == 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          if (opts.credentials) {
            throw new UnauthorizedError(
              "Format is Authorization: Bearer [token]",
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
    let decode: TRet;
    try {
      decode = jwts.decode(token, opts.secret, opts.noVerify, opts.algorithm);
      rev[prop] = decode;
    } catch (err) {
      const e = new UnauthorizedError(err.message ?? "Invalid token");
      if (
        typeof opts.onExpired === "function" && err.message.includes("expired")
      ) {
        return await opts.onExpired(e, rev, next);
      } else {
        throw e;
      }
    }
    return next();
  };
  return opts.onAuth ? [auth, opts.onAuth] : auth;
};

export function Jwt(secretOrOptions: string | TOptions): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [jwt(secretOrOptions)]);
    return des;
  };
}

jwt.encode = jwts.encode;
jwt.decode = jwts.decode;
export default jwt;
