import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { multiParser } from "./multipart_parser.ts";
import { Handler, TBodyParser, TObject, TQueryFunc } from "./types.ts";
import {
  arrayBuffer,
  decoder,
  decURIComponent,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";

const defautl_size = "3mb";

async function verifyBody(
  req: TObject,
  limit: number | string = defautl_size,
) {
  const arrBuff = await arrayBuffer(req);
  if (limit && (arrBuff.byteLength > toBytes(limit))) {
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  const body = decURIComponent(decoder.decode(arrBuff));
  return body;
}
type CType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain";
export function acceptContentType(headers: Headers, cType: CType) {
  const type = headers.get?.("content-type") ??
    (headers as TObject)["content-type"];
  return type === cType || type?.includes(cType);
}

export function bodyParser(
  opts?: TBodyParser | boolean,
  parseQuery?: TQueryFunc,
  parseMultipart?: TQueryFunc,
) {
  const ret: Handler = (rev, next) => {
    if (
      rev.method === "GET" ||
      rev.method === "HEAD" ||
      opts === false ||
      !rev.bodyValid ||
      rev.bodyUsed
    ) return next();
    if (opts === void 0 || opts === true) opts = {};
    const headers = rev.headers;
    return (async () => {
      if (acceptContentType(headers, "application/json")) {
        if (opts.json === false || opts.json === 0) return next();
        try {
          const body = await verifyBody(rev.request, opts.json as number);
          rev.body = JSON.parse(body);
          rev.bodyUsed = true;
        } catch (error) {
          return next(error);
        }
      } else if (
        acceptContentType(headers, "application/x-www-form-urlencoded")
      ) {
        if (opts.urlencoded === false || opts.urlencoded === 0) return next();
        try {
          const body = await verifyBody(
            rev.request,
            opts.urlencoded as number,
          );
          const parse = parseQuery || parseQueryOri;
          rev.body = parse(body);
          rev.bodyUsed = true;
        } catch (error) {
          return next(error);
        }
      } else if (acceptContentType(headers, "text/plain")) {
        if (opts.raw === false || opts.raw === 0) return next();
        try {
          const body = await verifyBody(rev.request, opts.raw as number);
          try {
            rev.body = JSON.parse(body);
          } catch (_err) {
            rev.body = { _raw: body };
          }
          rev.bodyUsed = true;
        } catch (error) {
          return next(error);
        }
      } else if (acceptContentType(headers, "multipart/form-data")) {
        if (opts.multipart === false || opts.multipart === 0) return next();
        try {
          if (typeof rev.request.formData === "function") {
            const formData = await rev.request.formData();
            rev.body = await multipart.createBody(formData, {
              parse: parseMultipart,
            });
          } else {
            rev.body = (await multiParser(rev.request)) || {};
          }
          rev.bodyUsed = true;
        } catch (error) {
          return next(error);
        }
      }
      return next();
    })();
  };
  return ret;
}
