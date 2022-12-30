import { STATUS_LIST } from "./constant.ts";
import { TObject, TRet } from "./types.ts";

/**
 * Genarete error message from class HttpError.
 * @example
 * throw new HttpError(status?: number, message?: string, name?: string);
 */
export class HttpError extends Error {
  status: number;
  constructor(status?: number, message?: TRet, name?: string) {
    super(message);
    this.status = status ?? 500;
    this.message = message ?? STATUS_LIST[this.status] ?? "Http Error";
    this.name = name ??
      (STATUS_LIST[this.status] ?? "Http").replace(/\s/g, "");
    if (!name && !this.name.endsWith("Error")) {
      this.name += "Error";
    }
  }
}

/**
 * Give error object
 */
export function getError(err: TObject, isStack?: boolean) {
  let status: number = err.status || err.statusCode || err.code || 500;
  if (typeof status !== "number") status = 500;
  let stack = void 0;
  if (isStack) {
    const arr = err.stack ? err.stack.split("\n") : [""];
    arr.shift();
    stack = arr
      .filter((line: string | string[]) => line.indexOf("file://") !== -1)
      .map((line: string) => line.trim());
  }
  return {
    status,
    message: (err.message || "Something went wrong") as string,
    name: (err.name || "HttpError") as string,
    stack,
  };
}
