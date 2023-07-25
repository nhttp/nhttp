var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var logger_exports = {};
__export(logger_exports, {
  default: () => logger_default,
  logger: () => logger
});
const print = (log, pretty = true) => {
  const json = pretty ? log : JSON.stringify(log);
  if (log.status >= 500) {
    console.log("%cERROR =>", "color: red; font-weight: bold", json);
  } else {
    console.log("%cINFO =>", "color: green; font-weight: bold", json);
  }
};
const logger = (handler) => async (rev, next) => {
  const start = Date.now();
  rev.log = (log2) => rev.__log ??= log2;
  const resp = await next();
  const ms = Date.now() - start;
  if (resp.status >= 400 && rev.__log === void 0) {
    try {
      rev.__log = await resp.json();
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
module.exports = __toCommonJS(logger_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logger
});
