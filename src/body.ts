import { C_TYPE } from "./constant.ts";
import { HttpError } from "./error.ts";
import { multipart } from "./multipart.ts";
import { RequestEvent } from "./request_event.ts";
import { Handler, TBodyParser, TQueryFunc, TRet, TValidBody } from "./types.ts";
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

export const isTypeBody = (a: string, b: string) => a === b || a?.includes(b);
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
  cb: (body: string) => void,
) {
  if (isNotValid(validate)) {
    rev.body = {};
  } else {
    const body = await verifyBody(rev, validate);
    if (body) cb(body);
  }
}
async function multipartBody(
  validate: TValidBody,
  rev: RequestEvent,
) {
  if (isNotValid(validate)) {
    rev.body = {};
  } else {
    const formData = await rev.request.formData();
    rev.body = await multipart.createBody(formData);
  }
}
export const getType = (req: TRet) => {
  return req.raw ? req.raw.req.headers[C_TYPE] : req.headers.get(C_TYPE);
};

export async function writeBody(
  rev: RequestEvent,
  type: string,
  opts?: TBodyParser,
  parseQuery?: TQueryFunc,
) {
  if (isTypeBody(type, c_types[0])) {
    await handleBody(opts?.json, rev, (body) => {
      rev.body = JSON.parse(body);
    });
  } else if (isTypeBody(type, c_types[1])) {
    await handleBody(opts?.urlencoded, rev, (body) => {
      const parse = parseQuery ?? parseQueryOri;
      rev.body = parse(body);
    });
  } else if (isTypeBody(type, c_types[2])) {
    await handleBody(opts?.raw, rev, (body) => {
      try {
        rev.body = JSON.parse(body);
      } catch {
        rev.body = { _raw: body };
      }
    });
  } else if (isTypeBody(type, c_types[3])) {
    await multipartBody(opts?.multipart, rev);
  }
}
export function bodyParser(
  opts?: TBodyParser | boolean,
  parseQuery?: TQueryFunc,
): Handler {
  return async (rev, next) => {
    if (typeof opts === "boolean") {
      if (opts === false) {
        rev.body = {};
        return next();
      }
      opts = undefined;
    }
    const type = getType(rev.request);
    if (type) {
      if (rev.request.bodyUsed) {
        if (opts !== void 0) {
          if (isTypeBody(type, c_types[0])) verify(rev, opts.json);
          else if (isTypeBody(type, c_types[1])) verify(rev, opts.urlencoded);
          else if (isTypeBody(type, c_types[2])) verify(rev, opts.raw);
        }
        return next();
      }
      try {
        await writeBody(rev, type, opts, parseQuery);
      } catch (e) {
        return next(e);
      }
    }
    return next();
  };
}
