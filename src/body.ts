import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Handler,
  NextFunction,
  TBodyParser,
  TQueryFunc,
  TRet,
  TValidBody,
} from "./types.ts";
import {
  decoder,
  decURIComponent,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";
const c_types = [
  "application/json",
  "application/x-www-form-urlencoded",
  "text/plain",
  "multipart/form-data",
];
export const isTypeBody = (a: string, b: string) => {
  return a === b || a.includes(b);
};
function cloneReq(req: Request, body: TRet) {
  return new Request(req.url, {
    method: req.method,
    body,
    headers: req.headers,
  });
}

export function memoBody(req: Request, body: TRet) {
  try {
    req.json = () => Promise.resolve(JSON.parse(decoder.decode(body)));
    req.text = () => Promise.resolve(decoder.decode(body));
    req.arrayBuffer = () => cloneReq(req, body).arrayBuffer();
    req.formData = () => cloneReq(req, body).formData();
    req.blob = () => cloneReq(req, body).blob();
  } catch (_e) { /* no_^_op */ }
}
// binary bytes (1mb)
const defautl_size = 1048576;

async function verifyBody(
  rev: RequestEvent,
  limit: number | string = defautl_size,
) {
  const arrBuff = await rev.request.arrayBuffer();
  const len = arrBuff.byteLength;
  if (len > toBytes(limit)) {
    rev.body = {};
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  if (len === 0) return;
  memoBody(rev.request, arrBuff);
  return decURIComponent(decoder.decode(arrBuff));
}

const isNotValid = (v: TValidBody) => v === false || v === 0;

async function jsonBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  try {
    const body = await verifyBody(rev, <number> validate);
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
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  try {
    const body = await verifyBody(rev, <number> validate);
    if (!body) return next();
    const parse = parseQuery ?? parseQueryOri;
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
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  try {
    const body = await verifyBody(rev, <number> validate);
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
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  try {
    const formData = await rev.request.formData();
    const body = await multipart.createBody(formData, {
      parse: parseMultipart,
    });
    rev.body = body;
    memoBody(rev.request, formData);
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
    if (opts === false) return next();
    if (opts === true) opts = void 0;
    const type = (<TRet> rev.request).raw
      ? (<TRet> rev.request).raw.req.headers["content-type"]
      : rev.request.headers.get("content-type");
    if (!type) return next();
    if (isTypeBody(type, c_types[0])) {
      return jsonBody(opts?.json, rev, next);
    }
    if (isTypeBody(type, c_types[1])) {
      return urlencodedBody(opts?.urlencoded, parseQuery, rev, next);
    }
    if (isTypeBody(type, c_types[2])) {
      return rawBody(opts?.raw, rev, next);
    }
    if (isTypeBody(type, c_types[3])) {
      return multipartBody(opts?.multipart, parseMultipart, rev, next);
    }
    return next();
  };
}
