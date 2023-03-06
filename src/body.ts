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
    req.text = () => cloneReq(req, body).text();
    req.arrayBuffer = () => cloneReq(req, body).arrayBuffer();
    req.formData = () => cloneReq(req, body).formData();
    req.blob = () => cloneReq(req, body).blob();
  } catch (_e) { /* no_^_op */ }
}
// binary bytes (1mb)
const defautl_size = 1048576;
async function verifyBody(
  req: Request,
  limit: number | string = defautl_size,
) {
  const arrBuff = await req.arrayBuffer();
  if (arrBuff.byteLength > toBytes(limit)) {
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  const val = decoder.decode(arrBuff);
  if (!val) return;
  memoBody(req, arrBuff);
  return decURIComponent(val);
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
    const body = await verifyBody(rev.request, <number> validate);
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
      rev.request,
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
    const body = await verifyBody(rev.request, <number> validate);
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
    const formData = await rev.request.formData();
    const body = await multipart.createBody(formData, {
      parse: parseMultipart,
    });
    rev.bodyUsed = true;
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
