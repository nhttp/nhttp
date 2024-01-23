import {
  Handler,
  HttpResponse,
  MIME_LIST,
  RequestEvent,
  TObject,
  TRet,
} from "./deps.ts";
let fs_glob: TRet;
let s_glob: TRet;
let c_glob: TRet;
let b_glob: TRet;

export interface TOptsSendFile {
  weak?: boolean;
  stat?: (...args: TRet) => TRet;
  readFile?: (...args: TRet) => TRet;
  etag?: boolean;
  setHeaders?: (rev: RequestEvent, pathFile: string, stat: TRet) => void;
}
const encoder = new TextEncoder();
const build_date = new Date();
const isDeno = typeof Deno !== "undefined";
async function cHash(ab: Uint8Array | ArrayBuffer) {
  if (ab.byteLength === 0) return "47DEQpj8HBSa+/TImW+5JCeuQeR";
  let hash = "";
  if (typeof crypto === "undefined") {
    hash = await oldHash(ab);
  } else {
    const buf = await crypto.subtle.digest("SHA-1", ab);
    new Uint8Array(buf).forEach((el) => (hash += el.toString(16)));
  }
  return hash;
}
export function getContentType(path: string) {
  const iof = path.lastIndexOf(".");
  if (iof <= 0) return MIME_LIST.arc;
  const ext = path.substring(path.lastIndexOf(".") + 1);
  return MIME_LIST[ext];
}
async function beforeFile(opts: TOptsSendFile, pathFile: string) {
  let stat = {} as TObject, subfix;
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
  } catch (_e) { /* noop */ }
  return { stat, subfix, path: pathFile };
}
async function is304(
  nonMatch: string | undefined | null,
  response: HttpResponse,
  stat: TObject,
  weak: boolean,
  subfix = "",
  cd?: string,
) {
  if (!stat.size) return false;
  const mtime = stat.mtime ?? build_date;
  if (cd) subfix += cd;
  const hash = `"${stat.size}-${mtime.getTime()}${
    subfix ? (await cHash(encoder.encode(subfix))) : ""
  }"`;
  const etag = weak ? `W/${hash}` : hash;
  response.header("last-modified", mtime.toUTCString());
  response.header("etag", etag);
  return nonMatch && nonMatch === etag;
}

async function getFile(path: string, readFile?: (...args: TRet) => TRet) {
  const file = await readFile?.(path);
  if (file === void 0) {
    throw new Error("File error. please add options readFile");
  }
  return file;
}

export async function sendFile(
  rev: RequestEvent,
  pathFile: string,
  opts: TOptsSendFile = {},
) {
  try {
    opts.etag ??= true;
    const response = rev.response;
    const { stat, subfix, path } = await beforeFile(opts, pathFile);
    opts.setHeaders?.(rev, pathFile, stat);
    const cType = response.getHeader("content-type") ?? getContentType(path);
    if (stat === void 0) {
      const file = await getFile(path, opts.readFile);
      response.setHeader("content-type", cType);
      return file;
    }
    const request = rev.request;
    const weak = opts.weak !== false;
    if (request.headers.get("range") && stat.size) {
      const file = await getFile(path, opts.readFile);
      const start = 0;
      const end = stat.size - 1;
      if (start >= stat.size || end >= stat.size) {
        return response.status(416).header(
          "Content-Range",
          `bytes */${stat.size}`,
        ).send();
      }
      response.status(206).header({
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": (end - start + 1).toString(),
        "Accept-Ranges": response.header("Accept-Ranges") ?? "bytes",
      });
      response.setHeader("content-type", cType);
      return file;
    }
    const nonMatch = request.headers.get("if-none-match");
    const cd = response.header("content-disposition");
    const has304 = await is304(nonMatch, response, stat, weak, subfix, cd);
    if (has304) return response.status(304).send();
    const file = await getFile(path, opts.readFile);
    response.setHeader("content-type", cType);
    return file;
  } catch (error) {
    throw error;
  }
}
export type EtagOptions = { weak?: boolean; clone?: boolean };
/**
 * Etag middleware.
 * @example
 * app.use(etag());
 */
export const etag = ({ weak, clone }: EtagOptions = {}): Handler => {
  weak ??= true;
  clone ??= isDeno === false;
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      const { request, response } = rev;
      const nonMatch = request.headers.get("if-none-match");
      const send = rev.send.bind(rev);
      rev.send = async (body, lose) => {
        if (body instanceof ReadableStream) rev.__stopEtag = true;
        await send(body, lose);
      };
      const res = await next();
      if (rev.__stopEtag) return;
      let etag = res.headers.get("etag");
      let ab: TRet | undefined;
      if (etag === null) {
        if (clone) ab = await res.clone().arrayBuffer();
        else ab = await res.arrayBuffer();
        const hash = await cHash(ab);
        etag = weak ? `W/"${hash}"` : `"${hash}"`;
      }
      res.headers.forEach((v, k) => response.setHeader(k, v));
      response.setHeader("etag", etag);
      if (nonMatch !== null && nonMatch === etag) {
        response.status(304);
        rev.respondWith(new Response(null, response.init));
      } else if (isDeno && ab !== void 0) {
        rev.respondWith(new Response(ab, response.init));
      } else {
        try {
          res.headers.set("etag", etag);
        } catch { /* immutable */ }
      }
      return;
    }
    return next();
  };
};
async function oldHash(data: Uint8Array | ArrayBuffer) {
  c_glob ??= await import("node:crypto");
  b_glob ??= await import("node:buffer");
  return c_glob.createHash("sha1").update(b_glob.Buffer.from(data)).digest(
    "hex",
  );
}
async function getFs() {
  if (s_glob !== void 0) return s_glob;
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
  } catch { /* noop */ }
  return s_glob = {};
}

export default etag;
