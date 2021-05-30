import { HttpRequest, NextFunction, RespondWith } from "./types.ts";
import { parsequery as parsequeryOri } from "./utils.ts";

type TMultipart = { fileKey?: string | string[]; parse?: (data: any) => any };
type TUrlencoded = { parse?: (data: any) => any };

export function jsonBody() {
  return async (req: HttpRequest, rw: RespondWith, next: NextFunction) => {
    if (req.headers.get("content-type") === "application/json") {
      req.parsedBody = await req.json();
    }
    next();
  };
}

export function urlencodedBody({ parse = parsequeryOri }: TUrlencoded = {}) {
  return async (req: HttpRequest, rw: RespondWith, next: NextFunction) => {
    if (
      req.headers.get("content-type") === "application/x-www-form-urlencoded"
    ) {
      const str = await req.text();
      req.parsedBody = parse(str);
    }
    next();
  };
}

export function multipartBody(
  { fileKey, parse = (noop) => noop }: TMultipart = {},
) {
  return async (req: HttpRequest, rw: RespondWith, next: NextFunction) => {
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      let body = parse(Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          formData.getAll(key).length > 1
            ? formData.getAll(key)
            : formData.get(key),
        ]),
      ));
      req.file = {};
      if (Array.isArray(fileKey)) {
        for (const key of fileKey) {
          if (body[key]) {
            req.file[key] = body[key];
            delete body[key];
          }
        }
      }
      if (typeof fileKey === "string") {
        if (body[fileKey]) {
          req.file[fileKey] = body[fileKey];
          delete body[fileKey];
        }
      }
      req.parsedBody = body;
    }
    next();
  };
}
