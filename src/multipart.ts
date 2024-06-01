// multipart.ts
import { revMimeList } from "./constant.ts";
import { HttpError } from "./error.ts";
import type { RequestEvent } from "./request_event.ts";
import type { Handler, NFile, TObject, TRet } from "./types.ts";
import { parseQuery, toBytes } from "./utils.ts";

const uid = (): string =>
  `${performance.now().toString(36)}${Math.random().toString(36).slice(5)}`
    .replace(".", "");
export type TMultipartUpload = {
  /**
   * fieldName.
   * @requires
   */
  name: string;
  /**
   * maxCount.
   * @default
   * not_set
   */
  maxCount?: number;
  /**
   * maxSize.
   * @default
   * not_set
   */
  maxSize?: number | string;
  /**
   * accept content-type.
   * @default
   * not_set
   */
  accept?: string | string[];
  /**
   * callback when upload.
   * @default
   * not_set
   */
  callback?: (file: File & { filename: string }) => void | Promise<void>;
  /**
   * destination folder uploads.
   * @default
   * "/"
   */
  dest?: string;
  /**
   * required fieldName.
   * @default
   * false
   */
  required?: boolean;
  /**
   * writeFile.
   * @default
   * true
   */
  writeFile?:
    | boolean
    | ((pathfile: string, data: Uint8Array) => void | Promise<void>);
  /**
   * custom storage function. (s3, supabase, gdrive, etc).
   * @default
   * not_set
   */
  storage?: (file: NFile) => void | Promise<void>;
};

class Multipart {
  /**
   * create body from formdata.
   */
  public createBody(formData: FormData): TRet {
    return parseQuery(formData);
  }
  private isFile(file: TRet): boolean {
    return typeof file === "object" && typeof file.arrayBuffer === "function";
  }
  private cleanUp(body: TObject): void {
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
  private validate(files: File[], opts: TMultipartUpload): void {
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
  private async privUpload(
    files: File[],
    opts: TMultipartUpload,
  ): Promise<void> {
    let i = 0;
    const len = files.length;
    while (i < len) {
      const file = <NFile> files[i];
      if (opts.callback) {
        await opts.callback(file);
      }
      opts.dest ??= "";
      if (opts.dest) {
        if (opts.dest[opts.dest.length - 1] !== "/") opts.dest += "/";
        if (opts.dest[0] === "/") opts.dest = opts.dest.substring(1);
      }
      file.filename ??= uid() + `.${revMimeList(file.type)}`;
      file.path ??= opts.dest + file.filename;
      file.pathfile = file.path;
      if (opts.storage) {
        await opts.storage(file);
      } else if (opts.writeFile !== false) {
        if (opts.writeFile === true) opts.writeFile = void 0;
        opts.writeFile ??= Deno.writeFile;
        const arrBuff = await file.arrayBuffer();
        await opts.writeFile(file.path, new Uint8Array(arrBuff));
      }
      i++;
    }
  }
  private async mutateBody(rev: RequestEvent): Promise<void> {
    const type = rev.headers.get("content-type");
    if (
      rev.request.bodyUsed === false &&
      type?.includes("multipart/form-data")
    ) {
      const formData = await rev.request.formData();
      rev.body = await this.createBody(formData);
      rev.__nbody = formData;
    }
  }
  private async handleArrayUpload(
    rev: RequestEvent,
    opts: TMultipartUpload[],
  ): Promise<void> {
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
  private async handleSingleUpload(
    rev: RequestEvent,
    obj: TMultipartUpload,
  ): Promise<void> {
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

/**
 * multipart for handle formdata.
 * @example
 * const upload = multipart.upload({ name: "image" });
 *
 * app.post("/save", upload, (rev) => {
 *    console.log("file", rev.file.image);
 *    console.log(rev.body);
 *    return "success upload";
 * });
 */
export const multipart: Multipart = new Multipart();
