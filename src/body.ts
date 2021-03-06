import { HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import {
  Handler,
  NextFunction,
  TBodyLimit,
  TObject,
  TQueryFunc,
} from "./types.ts";
import { parseQuery, toBytes } from "./utils.ts";

const decoder = new TextDecoder();

type TMultipartUpload = {
  name: string;
  maxCount?: number;
  maxSize?: number | string;
  accept?: string;
  callback?: (file: File & { filename: string }) => void;
  dest?: string;
  required?: boolean;
};

type TMultipartHandler = {
  parse?: TQueryFunc;
};

class Multipart {
  public createBody(
    formData: FormData,
    { parse }: TMultipartHandler = {},
  ) {
    return parse
      ? parse(Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          formData.getAll(key).length > 1
            ? formData.getAll(key)
            : formData.get(key),
        ]),
      ))
      : parseQuery(formData);
  }
  private cleanUp(body: TObject) {
    for (const key in body) {
      if (Array.isArray(body[key])) {
        const arr = body[key] as Array<unknown>;
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          if (el instanceof File) {
            delete body[key];
            break;
          }
        }
      } else if (body[key] instanceof File) {
        delete body[key];
      }
    }
  }
  private validate(files: File[], opts: TMultipartUpload) {
    let j = 0;
    const len = files.length;
    if (opts?.maxCount) {
      if (len > opts.maxCount) {
        throw new HttpError(
          400,
          `${opts.name} no more than ${opts.maxCount} file`,
          "BadRequestError",
        );
      }
    }
    while (j < len) {
      const file = files[j] as File;
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts?.accept) {
        if (!opts.accept.includes(ext)) {
          throw new HttpError(
            400,
            `${opts.name} only accept ${opts.accept}`,
            "BadRequestError",
          );
        }
      }
      if (opts?.maxSize) {
        if (file.size > toBytes(opts.maxSize)) {
          throw new HttpError(
            400,
            `${opts.name} to large, maxSize = ${opts.maxSize}`,
            "BadRequestError",
          );
        }
      }
      j++;
    }
  }
  private async privUpload(files: File[], opts: TMultipartUpload) {
    const cwd = Deno.cwd();
    let i = 0;
    const len = files.length;
    while (i < len) {
      const file = files[i] as File & { filename: string; path: string };
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts?.callback) opts.callback(file);
      let dest = opts.dest || "";
      if (dest.lastIndexOf("/") === -1) {
        dest += "/";
      }
      file.filename = file.filename ||
        Date.now() + file.lastModified.toString() + "_" +
          file.name.substring(0, 16).replace(/\./g, "") + "." + ext;
      file.path = file.path ||
        ((dest !== "/" ? dest : "") + file.filename);
      const arrBuff = await file.arrayBuffer();
      await Deno.writeFile(
        cwd + "/" + dest + file.filename,
        new Uint8Array(arrBuff),
      );
      i++;
    }
  }
  /**
   * upload handler multipart/form-data
   * @example
   * app.post("/hello", multipart.upload({ name: "image" }), ({ response, body, file }) => {
   *    console.log("file", file.image);
   *    console.log(body);
   *    return response.send("success upload");
   * });
   */
  public upload(options: TMultipartUpload | TMultipartUpload[]): Handler {
    return async (rev, next) => {
      if (rev.body === void 0) rev.body = {};
      if (rev.file === void 0) rev.file = {};
      if (
        rev.request.body &&
        rev.request.headers.get("content-type")?.includes("multipart/form-data")
      ) {
        if (rev.request.bodyUsed === false) {
          const formData = await rev.request.formData();
          rev.body = await this.createBody(formData, {
            parse: rev.__parseQuery as TQueryFunc,
          });
        }
        if (Array.isArray(options)) {
          let j = 0, i = 0;
          const len = options.length;
          while (j < len) {
            const obj = options[j] as TMultipartUpload;
            if (obj.required && rev.body[obj.name] === void 0) {
              throw new HttpError(
                400,
                `Field ${obj.name} is required`,
                "BadRequestError",
              );
            }
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              this.validate(files, obj);
            }
            j++;
          }
          while (i < len) {
            const obj = options[i] as TMultipartUpload;
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              await this.privUpload(files, obj);
              delete rev.body[obj.name];
            }
            i++;
          }
          this.cleanUp(rev.body);
        } else if (typeof options === "object") {
          const obj = options as TMultipartUpload;
          if (obj.required && rev.body[obj.name] === void 0) {
            throw new HttpError(
              400,
              `Field ${obj.name} is required`,
              "BadRequestError",
            );
          }
          if (rev.body[obj.name]) {
            rev.file[obj.name] = rev.body[obj.name];
            const objFile = rev.file[obj.name];
            const files = Array.isArray(objFile) ? objFile : [objFile];
            this.validate(files, obj);
            await this.privUpload(files, obj);
            delete rev.body[obj.name];
          }
          this.cleanUp(rev.body);
        }
      }
      return next();
    };
  }
}
async function verifyBody(request: Request, limit?: number | string) {
  const arrBuff = await request.arrayBuffer();
  if (limit && (arrBuff.byteLength > toBytes(limit))) {
    throw new HttpError(
      400,
      `Body is too large. max limit ${limit}`,
      "BadRequestError",
    );
  }
  const body = decoder.decode(arrBuff);
  return body;
}
export const multipart = new Multipart();
function acceptContentType(headers: Headers, cType: string) {
  const type = headers.get("content-type");
  return type === cType || type?.startsWith(cType);
}
export const withBody = async (
  rev: RequestEvent,
  next: NextFunction,
  parse: TQueryFunc,
  parseMultipart?: TQueryFunc,
  opts?: TBodyLimit,
) => {
  rev.body = {};
  if (rev.request.body && rev.request.bodyUsed === false) {
    const headers = rev.request.headers;
    if (acceptContentType(headers, "application/json")) {
      if (opts?.json !== 0) {
        try {
          const body = await verifyBody(rev.request, opts?.json || "3mb");
          rev.body = JSON.parse(body);
        } catch (error) {
          return next(error);
        }
      }
    } else if (
      acceptContentType(headers, "application/x-www-form-urlencoded")
    ) {
      if (opts?.urlencoded !== 0) {
        try {
          const body = await verifyBody(rev.request, opts?.urlencoded || "3mb");
          rev.body = parse(body);
        } catch (error) {
          return next(error);
        }
      }
    } else if (acceptContentType(headers, "text/plain")) {
      if (opts?.raw !== 0) {
        try {
          const body = await verifyBody(rev.request, opts?.raw || "3mb");
          try {
            rev.body = JSON.parse(body);
          } catch (_err) {
            rev.body = { _raw: body };
          }
        } catch (error) {
          return next(error);
        }
      }
    } else if (acceptContentType(headers, "multipart/form-data")) {
      if (opts?.multipart !== 0) {
        try {
          const formData = await rev.request.formData();
          rev.body = await multipart.createBody(formData, {
            parse: parseMultipart,
          });
        } catch (error) {
          return next(error);
        }
      }
    }
  }
  return next();
};
