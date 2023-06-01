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
  encoder,
  parseQuery as parseQueryOri,
  toBytes,
} from "./utils.ts";
const c_types = [
  "application/json",
  "application/x-www-form-urlencoded",
  "text/plain",
  "multipart/form-data",
];
const TYPE = "content-type";
export const isTypeBody = (a: string, b: string) => a === b || a.includes(b);
function verify(rev: RequestEvent, limit: TValidBody, len?: number) {
  if (len === void 0) {
    len = encoder.encode(JSON.stringify(rev.body)).byteLength;
  }
  if (limit && len > toBytes(limit)) {
    rev.body = {};
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
    );
  }
}

async function verifyBody(
  rev: RequestEvent,
  limit: TValidBody,
) {
  const arrBuff = await rev.request.arrayBuffer();
  const len = arrBuff.byteLength;
  verify(rev, limit, len);
  if (len === 0) return;
  return decURIComponent(decoder.decode(arrBuff));
}

const isNotValid = (v: TValidBody) => v === false || v === 0;

async function handleBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
  cb: (body: string) => void,
) {
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  const body = await verifyBody(rev, validate);
  if (!body) return next();
  cb(body);
  return next();
}
async function jsonBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (validate === undefined) {
    rev.body = JSON.parse(await rev.request.text() || "{}");
    return next();
  }
  return await handleBody(validate, rev, next, (body) => {
    rev.body = JSON.parse(body);
  });
}
async function multipartBody(
  validate: TValidBody,
  rev: RequestEvent,
  next: NextFunction,
) {
  if (isNotValid(validate)) {
    rev.body = {};
    return next();
  }
  const formData = await rev.request.formData();
  rev.body = await multipart.createBody(formData);
  return next();
}

export function bodyParser(
  opts?: TBodyParser | boolean,
  parseQuery?: TQueryFunc,
): Handler {
  return function nhttpBodyParser(rev, next) {
    if (typeof opts === "boolean") {
      if (opts === false) return next();
      opts = void 0;
    }
    const type = (<TRet> rev.request).raw
      ? (<TRet> rev.request).raw.req.headers[TYPE]
      : rev.request.headers.get(TYPE);
    if (type) {
      if (rev._hasBody) {
        if (opts !== void 0) {
          if (isTypeBody(type, c_types[0])) verify(rev, opts.json);
          else if (isTypeBody(type, c_types[1])) verify(rev, opts.urlencoded);
          else if (isTypeBody(type, c_types[2])) verify(rev, opts.raw);
        }
        return next();
      }
      rev._hasBody = 1;
      if (isTypeBody(type, c_types[0])) {
        return jsonBody(opts?.json, rev, next).catch(next);
      }
      if (isTypeBody(type, c_types[1])) {
        return handleBody(opts?.urlencoded, rev, next, (body) => {
          const parse = parseQuery ?? parseQueryOri;
          rev.body = parse(body);
        }).catch(next);
      }
      if (isTypeBody(type, c_types[2])) {
        return handleBody(opts?.raw, rev, next, (body) => {
          try {
            rev.body = JSON.parse(body);
          } catch {
            rev.body = { _raw: body };
          }
        }).catch(next);
      }
      if (isTypeBody(type, c_types[3])) {
        return multipartBody(opts?.multipart, rev, next).catch(next);
      }
    }
    return next();
  };
}
