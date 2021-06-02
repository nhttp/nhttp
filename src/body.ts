import { Handler, RequestEvent } from "./types.ts";
import { parsequery as parsequeryOri } from "./utils.ts";

type TMultipart = { fileKey?: string | string[]; parse?: (data: any) => any };
type TUrlencoded = { parse?: (data: any) => any };

function isBody(rev: RequestEvent) {
  if (rev.body === void 0) rev.body = {};
  if (rev.request.bodyUsed === false && rev.request.body) return true;
  return false;
}

export function jsonBody(): Handler {
  return async (rev, next) => {
    if (
      isBody(rev) &&
      rev.request.headers.get("content-type") === "application/json"
    ) {
      rev.body = await rev.request.json();
    }
    next();
  };
}

export function urlencodedBody(
  { parse = parsequeryOri }: TUrlencoded = {},
): Handler {
  return async (rev, next) => {
    if (
      isBody(rev) &&
      rev.request.headers.get("content-type") ===
        "application/x-www-form-urlencoded"
    ) {
      const str = await rev.request.text();
      rev.body = parse(str);
    }
    next();
  };
}

export function multipartBody(
  { fileKey, parse = (noop) => noop }: TMultipart = {},
): Handler {
  return async (rev, next) => {
    if (rev.file === void 0) rev.file = {};
    if (
      isBody(rev) &&
      rev.request.headers.get("content-type")?.includes("multipart/form-data")
    ) {
      const formData = await rev.request.formData();
      let body = parse(Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          formData.getAll(key).length > 1
            ? formData.getAll(key)
            : formData.get(key),
        ]),
      ));
      let _file = {} as any;
      if (Array.isArray(fileKey)) {
        for (const key of fileKey) {
          if (body[key]) {
            _file[key] = body[key];
            delete body[key];
          }
        }
      }
      if (typeof fileKey === "string") {
        if (body[fileKey]) {
          _file[fileKey] = body[fileKey];
          delete body[fileKey];
        }
      }
      rev.file = _file;
      rev.body = body;
    }
    next();
  };
}
