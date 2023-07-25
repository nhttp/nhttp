import type { Handler, TRet } from "./deps";
type Log = {
    timing: string;
    route: string;
    method: string;
    path: string;
    status: number;
    log: TRet;
    [k: string]: TRet;
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
export declare const logger: (handler?: (log: Log, print: (log: Log, pretty?: boolean) => void) => Promise<void>) => Handler;
export default logger;
