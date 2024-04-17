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
let c_glob;
let b_glob;
const encoder = new TextEncoder();
const build_date = /* @__PURE__ */ new Date();
const isDeno = typeof Deno !== "undefined";
async function cHash(ab) {
  if (ab.byteLength === 0)
    return "47DEQpj8HBSa+/TImW+5JCeuQeR";
  let hash = "";
  if (typeof crypto === "undefined") {
    hash = await oldHash(ab);
  } else {
    const buf = await crypto.subtle.digest("SHA-1", ab);
    new Uint8Array(buf).forEach((el) => hash += el.toString(16));
  }
  return hash;
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
    const { readFile, stat: statFn } = await getFs();
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
async function is304(nonMatch, response, stat, weak, subfix = "", cd) {
  if (!stat.size)
    return false;
  const mtime = stat.mtime ?? build_date;
  if (cd)
    subfix += cd.toString();
  const hash = `"${stat.size}-${mtime.getTime()}${subfix ? await cHash(encoder.encode(subfix)) : ""}"`;
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
    const has304 = await is304(nonMatch, response, stat, weak, subfix, cd);
    if (has304)
      return response.status(304).send();
    const file = await getFile(path, opts.readFile);
    response.setHeader("content-type", cType);
    return file;
  } catch (error) {
    throw error;
  }
}
const etag = ({ weak, clone } = {}) => {
  weak ??= true;
  clone ??= isDeno === false;
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      const { request, response } = rev;
      const nonMatch = request.headers.get("if-none-match");
      const send = rev.send.bind(rev);
      rev.send = async (body, lose) => {
        if (body instanceof ReadableStream)
          rev.__stopEtag = true;
        await send(body, lose);
      };
      const res = await next();
      if (rev.__stopEtag)
        return;
      let etag2 = res.headers.get("etag");
      let ab;
      if (etag2 === null) {
        if (clone)
          ab = await res.clone().arrayBuffer();
        else
          ab = await res.arrayBuffer();
        const hash = await cHash(ab);
        etag2 = weak ? `W/"${hash}"` : `"${hash}"`;
      }
      const setHeader = () => {
        res.headers.forEach((v, k) => response.setHeader(k, v));
        response.setHeader("etag", etag2);
      };
      if (nonMatch !== null && nonMatch === etag2) {
        setHeader();
        response.status(304);
        rev.respondWith(new Response(null, response.init));
      } else if (isDeno && ab !== void 0) {
        setHeader();
        rev.respondWith(new Response(ab, response.init));
      } else {
        try {
          res.headers.set("etag", etag2);
        } catch {
        }
      }
      return;
    }
    return next();
  };
};
async function oldHash(data) {
  c_glob ??= await import("node:crypto");
  b_glob ??= await import("node:buffer");
  return c_glob.createHash("sha1").update(b_glob.Buffer.from(data)).digest(
    "hex"
  );
}
async function getFs() {
  if (s_glob !== void 0)
    return s_glob;
  s_glob = {};
  if (isDeno) {
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
