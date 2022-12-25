import { HttpError } from "./error.ts";
import { multiParser } from "./multipart_parser.ts";
import { Handler, TObject, TQueryFunc, TRet } from "./types.ts";
import { parseQuery, toBytes } from "./utils.ts";

export type TMultipartUpload = {
  name: string;
  maxCount?: number;
  maxSize?: number | string;
  accept?: string;
  callback?: (file: File & { filename: string }) => void;
  dest?: string;
  required?: boolean;
  /**
   * writeFile. default `Deno.writeFile`.
   * @example
   * // example upload with Bun.
   * const upload = multipart.upload({
   *    name: "image",
   *    writeFile: Bun.write
   * });
   * app.post("/hello", upload, (rev) => {
   *    console.log(rev.file);
   *    return "success upload";
   * });
   */
  writeFile?: (pathfile: string, data: Uint8Array) => void | Promise<void>;
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

  private isFile(file: TRet) {
    return typeof file === "object" && typeof file.arrayBuffer === "function";
  }
  private cleanUp(body: TObject) {
    for (const key in body) {
      if (Array.isArray(body[key])) {
        const arr = body[key] as Array<unknown>;
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          if (this.isFile(el)) {
            delete body[key];
            break;
          }
        }
      } else if (this.isFile(body[key])) {
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
    let i = 0;
    const len = files.length;
    while (i < len) {
      const file = files[i] as File & { filename: string; path: string };
      if (opts?.callback) opts.callback(file);
      let dest = opts.dest || "";
      if (dest.lastIndexOf("/") === -1) {
        dest += "/";
      }
      if (dest[0] === "/") {
        dest = dest.substring(1);
      }
      if (!file.filename) {
        const prefix = Date.now() + file.lastModified.toString() + "_";
        file.filename = prefix + file.name;
      }
      if (!file.path) {
        file.path = dest + file.filename;
      }
      const arrBuff = await file.arrayBuffer();
      const data = new Uint8Array(arrBuff);
      if (!opts.writeFile) {
        opts.writeFile = Deno.writeFile;
      }
      await opts.writeFile(file.path, data);
      i++;
    }
  }
  /**
   * upload handler multipart/form-data
   * @example
   * app.post("/hello", multipart.upload({ name: "image" }), ({ response, body, file }) => {
   *    console.log("file", file.image);
   *    console.log(body);
   *    return "success upload";
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
          if (rev.request.formData) {
            const formData = await rev.request.formData();
            rev.body = await this.createBody(formData, {
              parse: rev.__parseQuery as TQueryFunc,
            });
          } else {
            rev.body = (await multiParser(rev.request)) || {};
          }
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

export const multipart = new Multipart();
