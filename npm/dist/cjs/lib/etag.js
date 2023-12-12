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
var etag_exports = {};
__export(etag_exports, {
  default: () => etag_default,
  etag: () => etag,
  getContentType: () => getContentType,
  sendFile: () => sendFile
});
module.exports = __toCommonJS(etag_exports);
var import_deps = require("./deps");
let fs_glob;
let s_glob;
const def = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
const encoder = new TextEncoder();
const JSON_TYPE = "application/json";
const build_date = /* @__PURE__ */ new Date();
function cHash(entity) {
  let hash = 0, i = entity.length - 1;
  while (i !== 0)
    hash += entity[i--] ?? 0;
  return hash;
}
function entityTag(entity, type) {
  if (!entity)
    return def;
  if (entity.length == 0)
    return def;
  const hash = cHash(entity);
  return `"${entity.byteLength}-${hash}${type}"`;
}
function getContentType(path) {
  const iof = path.lastIndexOf(".");
  if (iof <= 0)
    return import_deps.MIME_LIST.arc;
  const ext = path.substring(path.lastIndexOf(".") + 1);
  return import_deps.MIME_LIST[ext];
}
async function beforeFile(opts, pathFile) {
  let stat = {}, subfix;
  const iof = pathFile.lastIndexOf("?");
  if (iof !== -1) {
    subfix = pathFile.substring(iof);
    pathFile = pathFile.substring(0, iof);
  }
  try {
    const { readFile, stat: statFn } = await getIo();
    opts.readFile ??= readFile;
    if (opts.etag === false) {
      return { stat: void 0, subfix, path: pathFile };
    }
    opts.stat ??= statFn;
    stat = await opts.stat?.(pathFile) ?? {};
  } catch (_e) {
  }
  return { stat, subfix, path: pathFile };
}
function is304(nonMatch, response, stat, weak, subfix = "", cd) {
  if (!stat.size)
    return false;
  const mtime = stat.mtime ?? build_date;
  if (cd)
    subfix += cd;
  const hash = `"${stat.size}-${mtime.getTime()}${subfix ? cHash(encoder.encode(subfix)) : ""}"`;
  const etag2 = weak ? `W/${hash}` : hash;
  response.header("last-modified", mtime.toUTCString());
  response.header("etag", etag2);
  return nonMatch && nonMatch === etag2;
}
async function getFile(path, readFile) {
  const file = await readFile?.(path);
  if (file === void 0) {
    throw new Error("File error. please add options readFile");
  }
  return file;
}
async function sendFile(rev, pathFile, opts = {}) {
  try {
    opts.etag ??= true;
    const response = rev.response;
    const { stat, subfix, path } = await beforeFile(opts, pathFile);
    opts.setHeaders?.(rev, pathFile, stat);
    const cType = response.getHeader("content-type") ?? getContentType(path);
    if (stat === void 0) {
      const file2 = await getFile(path, opts.readFile);
      response.setHeader("content-type", cType);
      return file2;
    }
    const request = rev.request;
    const weak = opts.weak !== false;
    if (request.headers.get("range") && stat.size) {
      const file2 = await getFile(path, opts.readFile);
      const start = 0;
      const end = stat.size - 1;
      if (start >= stat.size || end >= stat.size) {
        return response.status(416).header(
          "Content-Range",
          `bytes */${stat.size}`
        ).send();
      }
      response.status(206).header({
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": (end - start + 1).toString(),
        "Accept-Ranges": response.header("Accept-Ranges") ?? "bytes"
      });
      response.setHeader("content-type", cType);
      return file2;
    }
    const nonMatch = request.headers.get("if-none-match");
    const cd = response.header("content-disposition");
    if (is304(nonMatch, response, stat, weak, subfix, cd)) {
      return response.status(304).send();
    }
    const file = await getFile(path, opts.readFile);
    response.setHeader("content-type", cType);
    return file;
  } catch (error) {
    throw error;
  }
}
const etag = (opts = {}) => {
  return (rev, next) => {
    const weak = opts.weak !== false;
    const send = rev.send.bind(rev);
    rev.send = async (body, lose) => {
      if (body) {
        const { response, request } = rev;
        if (!response.header("etag") && !(body instanceof ReadableStream || body instanceof Blob || body instanceof Response)) {
          const nonMatch = request.headers.get("if-none-match");
          const type = response.header("content-type");
          if (typeof body === "object" && !(body instanceof Uint8Array)) {
            try {
              body = JSON.stringify(body);
            } catch (_e) {
            }
            if (!type)
              response.type(JSON_TYPE);
          }
          const hash = entityTag(
            body instanceof Uint8Array ? body : encoder.encode(body?.toString()),
            type ? "" + cHash(encoder.encode(type)) : ""
          );
          const _etag = weak ? `W/${hash}` : hash;
          response.header("etag", _etag);
          if (nonMatch && nonMatch === _etag) {
            response.status(304);
            rev[import_deps.s_response] = new Response(null, response.init);
            return;
          }
        }
      }
      await send(body, lose);
    };
    return next();
  };
};
async function getIo() {
  if (s_glob !== void 0)
    return s_glob;
  s_glob = {};
  if (typeof Deno !== "undefined") {
    s_glob.readFile = Deno.readFileSync;
    s_glob.stat = Deno.statSync;
    return s_glob;
  }
  try {
    fs_glob ??= await import("node:fs");
    s_glob.readFile = fs_glob.readFileSync;
    s_glob.stat = fs_glob.statSync;
    return s_glob;
  } catch {
  }
  return s_glob = {};
}
var etag_default = etag;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  etag,
  getContentType,
  sendFile
});
