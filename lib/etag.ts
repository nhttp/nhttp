import {
  Handler,
  HttpResponse,
  MIME_LIST,
  RequestEvent,
  s_response,
  TObject,
  TRet,
} from "./deps.ts";

type TOptsSendFile = {
  weak?: boolean;
  stat?: (...args: TRet) => TRet;
  readFile?: (...args: TRet) => TRet;
};
const def = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
const encoder = new TextEncoder();
const JSON_TYPE_CHARSET = "application/json; charset=UTF-8";
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
function getContentType(path: string) {
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
    opts.readFile ??= Deno.readFile;
    opts.stat ??= Deno.stat;
    stat = await opts.stat(pathFile);
  } catch (_e) { /* noop */ }
  return { stat, subfix, path: pathFile };
}
function is304(
  nonMatch: string | undefined,
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
    const weak = opts.weak !== false;
    const { response, request } = rev;
    const nonMatch = request.headers?.get?.("if-none-match") ??
      (request.headers as TRet)["if-none-match"];
    const { stat, subfix, path } = await beforeFile(opts, pathFile);
    response.type(response.header("content-type") ?? getContentType(path));
    const cd = response.header("content-disposition");
    if (is304(nonMatch, response, stat, weak, subfix, cd)) {
      return response.status(304).send();
    }
    const file = await opts.readFile?.(path);
    if (!file) {
      throw new Error("File error. please add options readFile");
    }
    return response.send(file);
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
          const nonMatch = request.headers?.get?.("if-none-match") ??
            (request.headers as TRet)["if-none-match"];
          if (
            typeof body === "object" &&
            !(body instanceof Uint8Array || body instanceof Response)
          ) {
            try {
              body = JSON.stringify(body);
            } catch (_e) { /* noop */ }
            response.type(JSON_TYPE_CHARSET);
          }
          const type = response.header("content-type");
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
