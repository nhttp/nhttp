var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var logger_exports = {};
__export(logger_exports, {
  default: () => logger_default,
  logger: () => logger
});
module.exports = __toCommonJS(logger_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logger
});
