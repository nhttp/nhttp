import type { Handler, TRet } from "./deps.ts";

type Log = {
  timing: string;
  route: string | RegExp;
  method: string;
  path: string;
  status: number;
  log: TRet;
  [k: string]: TRet;
};
const print = (log: Log, pretty = true) => {
  const json = pretty ? log : JSON.stringify(log);
  if (log.status >= 500) {
    console.log("%cERROR =>", "color: red; font-weight: bold", json);
  } else {
    console.log("%cINFO =>", "color: green; font-weight: bold", json);
  }
};

/**
 * Simple Http loggers.
 * @example
 * // basic
 * app.use(logger());
 * // or with prefix
 * app.use("/api/v1", logger());
 *
 * // with handler
 * app.use(logger((log, print) => {
 *   // saveLog(log);
 *   print(log);
 * }));
 */
export const logger = (
  handler?: (
    log: Log,
    print: (log: Log, pretty?: boolean) => void,
  ) => Promise<void>,
): Handler =>
async (rev, next) => {
  const start = Date.now();
  rev.log = (log: TRet) => rev.__log ??= log;
  const resp = await next();
  const ms = Date.now() - start;
  if (resp.status >= 400 && rev.__log === void 0) {
    try {
      rev.__log = await resp.json();
    } catch { /* noop */ }
  }
  const log = {
    method: rev.method,
    path: rev.path,
    route: rev.route.path ?? "",
    status: resp.status,
    timing: `${ms}ms`,
  } as Log;
  if (rev.__log) log.log = rev.__log;
  if (handler !== void 0) await handler(log, print);
  else print(log);
};

export default logger;
