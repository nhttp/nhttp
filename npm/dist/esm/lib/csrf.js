import crypto from "node:crypto";
import {
  HttpError
} from "./deps.js";
const rand = () => `${performance.now().toString(36)}${Math.random().toString(36).slice(5)}`.replace(".", "");
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
  9
];
const message = "Failed to verify csrf";
const csrf = (opts = {}) => {
  const cookie = opts.cookie;
  const autoVerify = opts.autoVerify ?? true;
  if (!cookie)
    opts.secret ??= rand();
  const cname = "__csrf__";
  const ignoreMethods = opts.ignoreMethods ?? ["GET", "HEAD", "OPTIONS", "TRACE"];
  const algo = opts.algo ?? "SHA1";
  return (rev, next) => {
    let origin = [];
    if (opts.origin !== false) {
      if (opts.origin === true || opts.origin == null)
        opts.origin = [];
      else if (typeof opts.origin === "string")
        opts.origin = [opts.origin];
      origin = [new URL(rev.request.url).origin].concat(opts.origin);
    }
    rev.csrfToken = () => {
      let secret = opts.secret ?? rand();
      if (typeof secret === "function")
        secret = secret();
      if (cookie) {
        rev.response.cookie(
          cname,
          secret,
          typeof cookie === "object" ? cookie : void 0
        );
      }
      return create(secret, opts.salt ?? 8, algo);
    };
    rev.csrfVerify = () => {
      if (ignoreMethods.includes(rev.method))
        return true;
      return origin.includes(rev.headers.get("origin") ?? "") || (() => {
        const value = opts.getValue?.(rev) ?? getDefaultValue(rev);
        if (value == null)
          return true;
        return verify(
          cookie ? rev.cookies[cname] : opts.secret,
          value,
          algo
        );
      })();
    };
    if (autoVerify) {
      if (rev.csrfVerify())
        return next();
      if (opts.onError)
        return opts.onError(new Error(message), rev);
      throw new HttpError(403, message);
    }
    return next();
  };
};
function toHash(str, algo) {
  return crypto.createHash(algo).update(str, "utf8").digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function create(secret, saltLen, algo) {
  const salt = new Array(saltLen).fill(void 0).map(() => CHARS[Math.random() * CHARS.length | 0]).join("");
  return `${salt}-${toHash(`${salt}-${secret}`, algo)}`;
}
function verify(secret, token, algo) {
  if (!~token.indexOf("-"))
    return false;
  const salt = token.substring(0, token.indexOf("-"));
  const expected = `${salt}-${toHash(`${salt}-${secret}`, algo)}`;
  return expected === token;
}
function getDefaultValue(rev) {
  return rev.body._csrf || rev.query._csrf || rev.request.headers.get("csrf-token") || rev.request.headers.get("xsrf-token") || rev.request.headers.get("x-csrf-token") || rev.request.headers.get("x-xsrf-token");
}
var csrf_default = csrf;
export {
  csrf,
  csrf_default as default
};
