// mod.ts
import jwts from "npm:jwt-simple@0.5.6";
import {
  type Handler,
  HttpError,
  type NextFunction,
  type RequestEvent,
  type TRet,
} from "jsr:@nhttp/nhttp@^0.0.2";
import {
  joinHandlers,
  type TDecorator,
} from "jsr:@nhttp/nhttp@^0.0.2/controller";

/**
 * UnauthorizedError.
 */
class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}
/**
 * type `JwtOptions`.
 */
export type JwtOptions = {
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
type JWT =
  & ((
    secretOrOptions: string | JwtOptions,
  ) => Handler | Handler[])
  & {
    /**
     * encode token.
     */
    encode: (
      payload: TRet,
      key: string,
      algorithm?: jwts.TAlgorithm | undefined,
      options?: jwts.IOptions | undefined,
    ) => string;
    /**
     * decode token.
     */
    decode: (
      token: string,
      key: string,
      noVerify?: boolean | undefined,
      algorithm?: jwts.TAlgorithm | undefined,
    ) => TRet;
  };
/**
 * jwt middleware.
 * @example
 * app.get("/admin", jwt({ secret: "my_secret" }), ...handlers);
 */
export const jwt: JWT = (secretOrOptions) => {
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

/**
 * Jwt decorator.
 * @example
 * ```ts
 * const Guard = () => Jwt({ secret: JWT_SECRET, onAuth: () => {...} });
 *
 * class HomeController {
 *
 *    ⁤@Guard()
 *    ⁤@Get("/home")
 *    home() {...}
 * }
 * ```
 */
export function Jwt(secretOrOptions: string | JwtOptions): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [jwt(secretOrOptions)]);
    return des;
  };
}

jwt.encode = jwts.encode;
jwt.decode = jwts.decode;
export default jwt;
