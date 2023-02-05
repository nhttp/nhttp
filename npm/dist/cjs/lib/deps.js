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
var deps_exports = {};
__export(deps_exports, {
  HttpError: () => import__.HttpError,
  HttpResponse: () => import__.HttpResponse,
  MIME_LIST: () => import__.MIME_LIST,
  RequestEvent: () => import__.RequestEvent,
  findFns: () => import__.findFns,
  multipart: () => import__.multipart,
  s_response: () => import__.s_response
});
var import__ = require("./../index");
module.exports = __toCommonJS(deps_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpError,
  HttpResponse,
  MIME_LIST,
  RequestEvent,
  findFns,
  multipart,
  s_response
});
