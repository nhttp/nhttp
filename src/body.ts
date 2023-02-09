import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { multiParser } from "./multipart_parser.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Handler,
  NextFunction,
  TBodyParser,
  TObject,
  TQueryFunc,
} from "./types.ts";
import {
  arrayBuffer,
  decoder,
  decURIComponent,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";

type TValidBody = boolean | number | string | undefined;

const defautl_size = "3mb";

async function verifyBody(
  req: TObject,
  limit: number | string,
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

function isValidBody(validate: TValidBody) {
  if (validate === false || validate === 0) return false;
  if (validate === undefined || validate === true) {
    validate = defautl_size;
  }
  return true;
}

async function jsonBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (!isValidBody(validate)) return next();
  try {
    const body = await verifyBody(rev.request, <string> validate);
    rev.body = JSON.parse(body);
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}

async function urlencodedBody(
  validate: TValidBody,
  parseQuery: TQueryFunc,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (!isValidBody(validate)) return next();
  try {
    const body = await verifyBody(
      rev.request,
      <string> validate,
    );
    const parse = parseQuery || parseQueryOri;
    rev.body = parse(body);
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}

async function rawBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (!isValidBody(validate)) return next();
  try {
    const body = await verifyBody(rev.request, <string> validate);
    try {
      rev.body = JSON.parse(body);
    } catch (_err) {
      rev.body = { _raw: body };
    }
    rev.bodyUsed = true;
    return next();
  } catch (error) {
    return next(error);
  }
}
async function multipartBody(
  validate: TValidBody,
  parseMultipart: TQueryFunc,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (validate === false || validate === 0) return next();
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
    return next();
  } catch (error) {
    return next(error);
  }
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
    if (acceptContentType(headers, "application/json")) {
      return jsonBody(opts.json, rev, next);
    }
    if (
      acceptContentType(headers, "application/x-www-form-urlencoded")
    ) {
      return urlencodedBody(opts.urlencoded, parseQuery, rev, next);
    }
    if (acceptContentType(headers, "text/plain")) {
      return rawBody(opts.raw, rev, next);
    }
    if (acceptContentType(headers, "multipart/form-data")) {
      return multipartBody(opts.multipart, parseMultipart, rev, next);
    }
    return next();
  };
  return ret;
}
