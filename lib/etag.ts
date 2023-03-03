import {
  Handler,
  HttpResponse,
  MIME_LIST,
  RequestEvent,
  s_response,
  TObject,
  TRet,
} from "./deps.ts";
let fs_glob: TRet;
let s_glob: TRet;

export interface TOptsSendFile {
  weak?: boolean;
  stat?: (...args: TRet) => TRet;
  readFile?: (...args: TRet) => TRet;
  etag?: boolean;
}
const def = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
const encoder = new TextEncoder();
const JSON_TYPE = "application/json";
const build_date = new Date();
function cHash(entity: Uint8Array) {
  let hash = 0, i = entity.length - 1;
  while (i !== 0) hash += entity[i--] ?? 0;
  return hash;
}
function entityTag(entity: Uint8Array, type: string) {
  if (!entity) return def;
  if (entity.length == 0) return def;
  const hash = cHash(entity);
  return `"${entity.byteLength}-${hash}${type}"`;
}
export function getContentType(path: string) {
  const iof = path.lastIndexOf(".");
  if (iof <= 0) return MIME_LIST.arc;
  const ext = path.substring(path.lastIndexOf(".") + 1);
  return MIME_LIST[ext];
}
async function beforeFile(opts: TOptsSendFile, pathFile: string) {
  let stat = {}, subfix;
  const iof = pathFile.lastIndexOf("?");
  if (iof !== -1) {
    subfix = pathFile.substring(iof);
    pathFile = pathFile.substring(0, iof);
  }
  try {
    opts.readFile ??= (await getIo()).readFile;
    if (opts.etag === false) {
      return { stat: void 0, subfix, path: pathFile };
    }
    opts.stat ??= (await getIo()).stat;
    stat = await (opts.stat as TRet)(pathFile);
  } catch (_e) { /* noop */ }
  return { stat, subfix, path: pathFile };
}
function is304(
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
    subfix ? cHash(encoder.encode(subfix)) : ""
  }"`;
  const etag = weak ? `W/${hash}` : hash;
  response.header("last-modified", mtime.toUTCString());
  response.header("etag", etag);
  return nonMatch && nonMatch === etag;
}
export async function sendFile(
  rev: RequestEvent,
  pathFile: string,
  opts: TOptsSendFile = {},
) {
  try {
    opts.etag ??= true;
    const weak = opts.weak !== false;
    const { response, request } = rev;
    const { stat, subfix, path } = await beforeFile(opts, pathFile);
    if (stat === void 0) {
      const file = await opts.readFile?.(path);
      if (!file) {
        throw new Error("File error. please add options readFile");
      }
      response.type(response.header("content-type") ?? getContentType(path));
      return file;
    }
    const nonMatch = request.headers.get("if-none-match");
    const cd = response.header("content-disposition");
    if (is304(nonMatch, response, stat, weak, subfix, cd)) {
      return response.status(304).send();
    }
    const file = await opts.readFile?.(path);
    if (!file) {
      throw new Error("File error. please add options readFile");
    }
    response.type(response.header("content-type") ?? getContentType(path));
    return file;
  } catch (error) {
    throw error;
  }
}
export const etag = (
  opts: { weak?: boolean } = {},
): Handler => {
  return (rev, next) => {
    const weak = opts.weak !== false;
    const send = rev.send.bind(rev);
    rev.send = (body: TRet) => {
      if (body) {
        const { response, request } = rev;
        if (
          !response.header("etag") &&
          !(body instanceof ReadableStream || body instanceof Blob)
        ) {
          const nonMatch = request.headers.get("if-none-match");
          const type = response.header("content-type");
          if (
            typeof body === "object" &&
            !(body instanceof Uint8Array || body instanceof Response)
          ) {
            try {
              body = JSON.stringify(body);
            } catch (_e) { /* noop */ }
            if (!type) response.type(JSON_TYPE);
          }
          const hash = entityTag(
            body instanceof Uint8Array ? body : encoder.encode(body),
            type ? ("" + cHash(encoder.encode(type))) : "",
          );
          const _etag = weak ? `W/${hash}` : hash;
          response.header("etag", _etag);
          if (nonMatch && nonMatch == _etag) {
            response.status(304);
            if (response.end) {
              response.end();
              return;
            }
            return rev[s_response] = new Response(null, response.init);
          }
        }
      }
      send(body);
    };
    return next();
  };
};
async function getIo() {
  if (s_glob) return s_glob;
  s_glob = {};
  if (typeof Deno !== "undefined") {
    s_glob.readFile = Deno.readFile;
    s_glob.stat = Deno.stat;
    return s_glob;
  }
  fs_glob ??= await import("node:fs");
  s_glob.readFile = fs_glob.readFileSync;
  s_glob.stat = fs_glob.statSync;
  return s_glob;
}
