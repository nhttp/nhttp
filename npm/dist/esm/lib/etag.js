import {
  MIME_LIST
} from "./deps.js";
let fs_glob;
let s_glob;
let c_glob;
let b_glob;
const H_TYPE = "content-type";
const encoder = new TextEncoder();
const build_date = /* @__PURE__ */ new Date();
async function cHash(ab) {
  if (typeof crypto === "undefined")
    return await oldHash(ab);
  const buf = await crypto.subtle.digest("SHA-1", ab);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function getContentType(path) {
  const iof = path.lastIndexOf(".");
  if (iof <= 0)
    return MIME_LIST.arc;
  const ext = path.substring(path.lastIndexOf(".") + 1);
  return MIME_LIST[ext];
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
    subfix += cd;
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
const etag = (opts = {}) => {
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      const weak = opts.weak !== false;
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
      const ab = await res.clone().arrayBuffer();
      if (ab.byteLength === 0)
        return;
      const type = res.headers.get(H_TYPE);
      let etag2 = res.headers.get("etag");
      if (etag2 === null) {
        const hash = await cHash(ab);
        etag2 = weak ? `W/"${hash}"` : `"${hash}"`;
      }
      if (nonMatch !== null && nonMatch === etag2) {
        if (type !== null)
          response.setHeader(H_TYPE, type);
        response.setHeader("etag", etag2);
        response.status(304);
        response.init.statusText = "Not Modified";
        rev.respondWith(new Response(null, response.init));
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
export {
  etag_default as default,
  etag,
  getContentType,
  sendFile
};
