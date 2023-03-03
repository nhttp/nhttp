import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { multiParser } from "./multipart_parser.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Handler,
  NextFunction,
  TBodyParser,
  TQueryFunc,
  TValidBody,
} from "./types.ts";
import {
  arrayBuffer,
  decoder,
  decURIComponent,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";

// binary bytes (1mb)
const defautl_size = 1048576;
async function verifyBody(
  rev: RequestEvent,
  limit: number | string = defautl_size,
) {
  const arrBuff = await arrayBuffer(rev.request);
  if (arrBuff.byteLength > toBytes(limit)) {
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  const val = decoder.decode(arrBuff);
  return val ? decURIComponent(val) : void 0;
}
type CType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain";
export function acceptContentType(headers: Headers, cType: CType) {
  const type = headers.get("content-type");
  return type === cType || type?.includes(cType);
}

function isValidBody(validate: TValidBody) {
  if (validate === false || validate === 0) return false;
  return true;
}

async function jsonBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (!isValidBody(validate)) return next();
  try {
    const body = await verifyBody(rev, <number> validate);
    rev.bodyUsed = true;
    if (!body) return next();
    rev.body = JSON.parse(body);
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
      rev,
      <number> validate,
    );
    rev.bodyUsed = true;
    if (!body) return next();
    const parse = parseQuery || parseQueryOri;
    rev.body = parse(body);
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
    const body = await verifyBody(rev, <number> validate);
    rev.bodyUsed = true;
    if (!body) return next();
    try {
      rev.body = JSON.parse(body);
    } catch (_err) {
      rev.body = { _raw: body };
    }
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
    let body;
    if (typeof rev.request.formData === "function") {
      const formData = await rev.request.clone().formData();
      body = await multipart.createBody(formData, {
        parse: parseMultipart,
      });
    } else {
      body = await multiParser(rev.request);
    }
    rev.bodyUsed = true;
    if (!body) return next();
    rev.body = body;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function bodyParser(
  opts?: TBodyParser | boolean,
  parseQuery?: TQueryFunc,
  parseMultipart?: TQueryFunc,
): Handler {
  return (rev, next) => {
    if (opts === false || rev.bodyUsed) return next();
    if (opts === true) opts = {};
    if (acceptContentType(rev.request.headers, "application/json")) {
      return jsonBody(opts?.json, rev, next);
    }
    if (
      acceptContentType(
        rev.request.headers,
        "application/x-www-form-urlencoded",
      )
    ) {
      return urlencodedBody(opts?.urlencoded, parseQuery, rev, next);
    }
    if (acceptContentType(rev.request.headers, "text/plain")) {
      return rawBody(opts?.raw, rev, next);
    }
    if (acceptContentType(rev.request.headers, "multipart/form-data")) {
      return multipartBody(opts?.multipart, parseMultipart, rev, next);
    }
    return next();
  };
}
