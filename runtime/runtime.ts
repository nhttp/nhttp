import type { ListenOptions, TObject, TRet } from "../src/types.ts";

export const defineCallback = (
  opts: ListenOptions,
  cb?: (
    err: Error | undefined,
    opts: ListenOptions,
  ) => void | Promise<void>,
) =>
(err?: Error) => {
  if (cb) {
    cb(err, {
      ...opts,
      hostname: opts.hostname ?? "localhost",
    });
    return 1;
  }
  return;
};
export const isBun = (): boolean => "Bun" in globalThis;
export const isDeno = (): boolean => "Deno" in globalThis;
export const isNode = (): boolean => {
  return !isBun() && (<TRet> globalThis).process?.release?.name === "node";
};

export class RuntimeServer<T = TObject> {
  server!: T;
  onAbort(opts: ListenOptions) {
    if (opts.signal) {
      opts.signal.addEventListener("abort", () => {
        try {
          const server = this.server as TObject;
          server?.close?.();
          server?.stop?.();
        } catch { /* noop */ }
      }, { once: true });
    }
  }
}
