import crypto from "node:crypto";
import {
  type Cookie,
  type Handler,
  HttpError,
  type RequestEvent,
  type TRet,
} from "./deps.ts";

const rand = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(5)}`
    .replace(".", "");

const CHARS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
];

type Options = {
  /**
   * cookie. default to `false`.
   */
  cookie?: boolean | Cookie;
  /**
   * secret. default to random per-request.
   */
  secret?: string | (() => string);
  /**
   * Salt length. default `8`
   */
  salt?: number;
  /**
   * Custom get value
   */
  getValue?: (rev: RequestEvent) => string | undefined | null;
  /**
   * Custom Error.
   */
  onError?: (error: Error, rev: RequestEvent) => TRet;
  /**
   * ignore methods. default to `["GET", "HEAD", "OPTIONS", "TRACE"]`.
   */
  ignoreMethods?: string[];
  /**
   * auto verify csrf. default to `true`.
   */
  autoVerify?: boolean;
};
const message = "Failed to verify csrf";
/**
 * Cross-Site Request Forgery (CSRF) protected middleware.
 * @example
 * const MyForm: FC<{ csrf: string }> = (props) => {
 *   return (
 *     <form method="POST" action="/">
 *       <input name="_csrf" type="hidden" value={props.csrf} />
 *       <input name="name" />
 *       <button type="submit">Submit</button>
 *     </form>
 *   )
 * }
 *
 * const csrfProtect = csrf();
 *
 * app.get("/", csrfProtect, (rev) => {
 *   return <MyForm csrf={rev.csrfToken()}/>
 * });
 *
 * app.post("/", csrfProtect, (rev) => {
 *   return <MyForm csrf={rev.csrfToken()}/>
 * });
 */
export const csrf = (opts: Options = {}): Handler => {
  const cookie = opts.cookie;
  const autoVerify = opts.autoVerify ?? true;
  if (!cookie) opts.secret ??= rand();
  const cname = "__csrf__";
  const ignoreMethods = opts.ignoreMethods ??
    ["GET", "HEAD", "OPTIONS", "TRACE"];
  return (rev, next) => {
    rev.csrfToken = () => {
      let secret = opts.secret ?? rand();
      if (typeof secret === "function") secret = secret();
      if (cookie) {
        rev.response.cookie(
          cname,
          secret,
          typeof cookie === "object" ? cookie : void 0,
        );
      }
      return create(secret, opts.salt ?? 8);
    };
    rev.csrfVerify = () => {
      if (ignoreMethods.includes(rev.method)) {
        return true;
      }
      const value = opts.getValue?.(rev) ?? getDefaultValue(rev);
      if (value == null) return true;
      return verify(
        cookie ? rev.cookies[cname] : opts.secret,
        value,
      );
    };
    if (autoVerify) {
      if (rev.csrfVerify()) return next();
      if (opts.onError) return opts.onError(new Error(message), rev);
      throw new HttpError(403, message);
    }
    return next();
  };
};

function toHash(str: string) {
  return crypto
    .createHash("sha1")
    .update(str, "utf8")
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
function create(secret: string, saltLen: number) {
  const salt = new Array(saltLen)
    .fill(void 0)
    .map(() => CHARS[(Math.random() * CHARS.length) | 0])
    .join("");
  return `${salt}-${toHash(`${salt}-${secret}`)}`;
}

function verify(secret: string, token: string) {
  if (!~token.indexOf("-")) return false;
  const salt = token.substring(0, token.indexOf("-"));
  const expected = `${salt}-${toHash(`${salt}-${secret}`)}`;
  return expected === token;
}
function getDefaultValue(rev: RequestEvent): string | undefined | null {
  return rev.body._csrf ||
    rev.query._csrf ||
    rev.request.headers.get("csrf-token") ||
    rev.request.headers.get("xsrf-token") ||
    rev.request.headers.get("x-csrf-token") ||
    rev.request.headers.get("x-xsrf-token");
}

export default csrf;