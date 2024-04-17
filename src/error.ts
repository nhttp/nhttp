import { STATUS_ERROR_LIST } from "./constant.ts";
import type { TObject, TRet } from "./types.ts";

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
    this.message = message ?? STATUS_ERROR_LIST[this.status] ?? "Http Error";
    this.name = name ??
      (STATUS_ERROR_LIST[this.status] ?? "Http").replace(/\s/g, "");
    if (!name && !this.name.endsWith("Error")) {
      this.name += "Error";
    }
  }
}

/**
 * Give error object
 */
export function getError(err: TObject, isStack?: boolean) {
  if (typeof err === "string") {
    return {
      status: 500,
      message: err,
      name: "HttpError",
      stack: [],
    };
  }
  let status: number = err.status ?? err.statusCode ?? err.code ?? 500;
  if (typeof status !== "number") status = 500;
  let stack;
  if (isStack) {
    const arr: string[] = err.stack?.split("\n") ?? [""];
    arr.shift();
    stack = arr
      .filter((l) => l.includes("file://"))
      .map((l) => l.trim());
  }
  return {
    status,
    message: (err.message ?? "Something went wrong") as string,
    name: (err.name ?? "HttpError") as string,
    stack,
  };
}
