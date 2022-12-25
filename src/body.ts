import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { multiParser } from "./multipart_parser.ts";
import { Handler, TBodyParser, TQueryFunc } from "./types.ts";
import {
  decoder,
  decURIComponent,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";

const defautl_size = "3mb";

async function verifyBody(
  request: Request,
  limit: number | string = defautl_size,
) {
  const arrBuff = await request.arrayBuffer();
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

function acceptContentType(headers: Headers, cType: string) {
  const type = headers.get("content-type");
  return type === cType || type?.startsWith(cType);
}

export function bodyParser(
  opts?: TBodyParser | boolean,
  parseQuery?: TQueryFunc,
  parseMultipart?: TQueryFunc,
) {
  const ret: Handler = async (rev, next) => {
    if (!rev.body) rev.body = {};
    if (
      rev.request.body && rev.request.bodyUsed == false &&
      typeof opts != "boolean"
    ) {
      if (opts == void 0) opts = {};
      const headers = rev.request.headers;
      if (acceptContentType(headers, "application/json")) {
        if (opts.json == false || opts.json == 0) return next();
        try {
          const body = await verifyBody(rev.request, opts.json as number);
          rev.body = JSON.parse(body);
        } catch (error) {
          return next(error);
        }
      } else if (
        acceptContentType(headers, "application/x-www-form-urlencoded")
      ) {
        if (opts.urlencoded == false || opts.urlencoded == 0) return next();
        try {
          const body = await verifyBody(
            rev.request,
            opts.urlencoded as number,
          );
          const parse = parseQuery || parseQueryOri;
          rev.body = parse(body);
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
        } catch (error) {
          return next(error);
        }
      } else if (acceptContentType(headers, "multipart/form-data")) {
        if (opts.multipart == false || opts.multipart == 0) return next();
        try {
          if (rev.request.formData) {
            const formData = await rev.request.formData();
            rev.body = await multipart.createBody(formData, {
              parse: parseMultipart,
            });
          } else {
            rev.body = (await multiParser(rev.request)) || {};
          }
        } catch (error) {
          return next(error);
        }
      }
    }
    return next();
  };

  return ret;
}
