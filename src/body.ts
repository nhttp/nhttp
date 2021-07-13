import { BadRequestError } from "../error.ts";
import { RequestEvent } from "./request_event.ts";
import { Handler, NextFunction, TBodyLimit } from "./types.ts";
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
  parse?: (data: any, ...args: any) => any;
};

class Multipart {
  createBody = async (
    formData: FormData,
    { parse }: TMultipartHandler = {},
  ) => {
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
  };

  #cleanUp = (body: { [k: string]: any }) => {
    for (const key in body) {
      if (Array.isArray(body[key])) {
        for (let i = 0; i < body[key].length; i++) {
          const el = body[key][i];
          if (el instanceof File) {
            delete body[key];
            break;
          }
        }
      } else if (body[key] instanceof File) {
        delete body[key];
      }
    }
  };

  #validate = async (files: File[], opts: TMultipartUpload) => {
    let j = 0, len = files.length;
    if (opts?.maxCount) {
      if (len > opts.maxCount) {
        throw new BadRequestError(
          `${opts.name} no more than ${opts.maxCount} file`,
        );
      }
    }
    while (j < len) {
      const file = files[j] as File;
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (opts?.accept) {
        if (!opts.accept.includes(ext)) {
          throw new BadRequestError(
            `${opts.name} only accept ${opts.accept}`,
          );
        }
      }
      if (opts?.maxSize) {
        if (file.size > toBytes(opts.maxSize)) {
          throw new BadRequestError(
            `${opts.name} to large, maxSize = ${opts.maxSize}`,
          );
        }
      }
      j++;
    }
  };

  #upload = async (files: File[], opts: TMultipartUpload) => {
    const cwd = Deno.cwd();
    let i = 0, len = files.length;
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
  };

  /**
   * upload handler multipart/form-data
   * @example
   * const upload = multipart.upload({
   *    // required
   *    name: "image";
   *
   *    // optional
   *    maxCount: 10;
   *    maxSize: "2mb";
   *    accept: "png|jpg|jpeg";
   *    callback: (file) => {
   *        file.filename = Date.now() + file.name;
   *    };
   *    dest: "public/image";
   *    required: true;
   * });
   *
   * app.post("/hello", upload, ({ response, body, file }) => {
   *    console.log("path upload => ", file.image.path);
   *    console.log(body);
   *    response.send("success upload");
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
            parse: rev.__parseQuery,
          });
        }
        if (Array.isArray(options)) {
          let j = 0, i = 0, len = options.length;
          while (j < len) {
            const obj = options[j] as TMultipartUpload;
            if (obj.required && rev.body[obj.name] === void 0) {
              throw new BadRequestError(
                `Field ${obj.name} is required`,
              );
            }
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              await this.#validate(files, obj);
            }
            j++;
          }
          while (i < len) {
            const obj = options[i] as TMultipartUpload;
            if (rev.body[obj.name]) {
              rev.file[obj.name] = rev.body[obj.name];
              const objFile = rev.file[obj.name];
              const files = Array.isArray(objFile) ? objFile : [objFile];
              await this.#upload(files, obj);
              delete rev.body[obj.name];
            }
            i++;
          }
          this.#cleanUp(rev.body);
        } else if (typeof options === "object") {
          const obj = options as TMultipartUpload;
          if (obj.required && rev.body[obj.name] === void 0) {
            throw new BadRequestError(
              `Field ${obj.name} is required`,
            );
          }
          if (rev.body[obj.name]) {
            rev.file[obj.name] = rev.body[obj.name];
            const objFile = rev.file[obj.name];
            const files = Array.isArray(objFile) ? objFile : [objFile];
            await this.#validate(files, obj);
            await this.#upload(files, obj);
            delete rev.body[obj.name];
          }
          this.#cleanUp(rev.body);
        }
      }
      next();
    };
  }
}

async function verifyBody(request: Request, limit?: number | string) {
  const arrBuff = await request.arrayBuffer();
  if (limit && (arrBuff.byteLength > toBytes(limit))) {
    throw new BadRequestError(`Body is too large. max limit ${limit}`);
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
  parse: (query: any) => any,
  parseMultipart?: (query: any) => any,
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
          } catch (err) {
            rev.body = { _raw: body };
          }
        } catch (error) {
          return next(error);
        }
      }
    } else if (acceptContentType(headers, "multipart/form-data")) {
      if (opts?.multipart !== 0) {
        const formData = await rev.request.formData();
        rev.body = await multipart.createBody(formData, {
          parse: parseMultipart,
        });
      }
    }
  }
  next();
};
