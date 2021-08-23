/**
 * Genarete error message from class HttpError.
 * @example
 * throw new HttpError(status?: number, message?: string, name?: string);
 */
export class HttpError extends Error {
  status: number;
  // deno-lint-ignore no-explicit-any
  constructor(status?: number, message?: any, name?: string) {
    super(message);
    this.message = message || "Http Error";
    this.status = status || 500;
    this.name = name || "HttpError";
  }
}

/**
 * Give error object
 */
// deno-lint-ignore no-explicit-any
export function getError(err: any, isStack?: boolean) {
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
