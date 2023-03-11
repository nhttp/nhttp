import { memoBody } from "./body.ts";
import { revMimeList } from "./constant.ts";
import { HttpError } from "./error.ts";
import { RequestEvent } from "./request_event.ts";
import { Handler, TObject, TQueryFunc, TRet } from "./types.ts";
import { parseQuery, toBytes } from "./utils.ts";

const uid = () =>
  `${performance.now().toString(36)}${Math.random().toString(36).slice(5)}`
    .replace(".", "");
export type TMultipartUpload = {
  name: string;
  maxCount?: number;
  maxSize?: number | string;
  accept?: string | string[];
  callback?: (file: File & { filename: string }) => void | Promise<void>;
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
   *    console.log(rev.body);
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
      const file = files[j];
      if (opts?.accept) {
        const type = revMimeList(file.type);
        if (!opts.accept.includes(type)) {
          throw new HttpError(
            400,
            `${opts.name} only accept ${opts.accept.toString()}`,
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
      const file = <File & { filename: string; path: string }> files[i];
      if (opts.callback) {
        await opts.callback(file);
      }
      opts.dest ??= "";
      if (opts.dest) {
        if (opts.dest.lastIndexOf("/") === -1) opts.dest += "/";
        if (opts.dest[0] === "/") opts.dest = opts.dest.substring(1);
      }
      file.filename ??= uid() + `.${revMimeList(file.type)}`;
      file.path ??= opts.dest + file.filename;
      opts.writeFile ??= Deno.writeFile;
      const arrBuff = await file.arrayBuffer();
      await opts.writeFile(file.path, new Uint8Array(arrBuff));
      i++;
    }
  }
  private async mutateBody(rev: RequestEvent) {
    const type = rev.headers.get("content-type");
    if (
      rev.request.bodyUsed === false &&
      type?.includes("multipart/form-data")
    ) {
      const formData = await rev.request.formData();
      rev.body = await this.createBody(formData, {
        parse: rev.__parseMultipart as TQueryFunc,
      });
      memoBody(rev.request, formData);
    }
  }
  private async handleArrayUpload(rev: RequestEvent, opts: TMultipartUpload[]) {
    let j = 0, i = 0;
    const len = opts.length;
    while (j < len) {
      const obj = opts[j];
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
      const obj = opts[i] as TMultipartUpload;
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
  }
  private async handleSingleUpload(rev: RequestEvent, obj: TMultipartUpload) {
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
  /**
   * upload handler multipart/form-data.
   * @example
   * const upload = multipart.upload({ name: "image" });
   *
   * app.post("/save", upload, (rev) => {
   *    console.log("file", rev.file.image);
   *    console.log(rev.body);
   *    return "success upload";
   * });
   */
  public upload(options: TMultipartUpload | TMultipartUpload[]): Handler {
    return async (rev, next) => {
      if (rev.request.body !== null) {
        await this.mutateBody(rev);
        if (Array.isArray(options)) {
          await this.handleArrayUpload(rev, options);
        } else if (typeof options === "object") {
          await this.handleSingleUpload(rev, options);
        }
      }
      return next();
    };
  }
}

export const multipart = new Multipart();
