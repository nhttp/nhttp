const print = (log, pretty = true) => {
  const json = pretty ? log : JSON.stringify(log);
  if (log.status >= 500) {
    console.log("\x1B[41m", "ERROR =>", "\x1B[0m", json);
  } else {
    console.log("\x1B[44m", "INFO =>", "\x1B[0m", json);
  }
};
const logger = (handler) => async (rev, next) => {
  const start = Date.now();
  rev.log = (log2) => rev.__log ??= log2;
  const resp = await next();
  const ms = Date.now() - start;
  if (resp.status >= 400 && rev.__log === void 0) {
    try {
      rev.__log = await resp.clone().json();
    } catch {
    }
  }
  const log = {
    method: rev.method,
    path: rev.path,
    route: rev.route.path ?? "",
    status: resp.status,
    timing: `${ms}ms`
  };
  if (rev.__log)
    log.log = rev.__log;
  if (handler !== void 0)
    await handler(log, print);
  else
    print(log);
};
var logger_default = logger;
export {
  logger_default as default,
  logger
};
