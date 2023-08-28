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
var deps_exports = {};
__export(deps_exports, {
  HttpError: () => import__.HttpError,
  HttpResponse: () => import__.HttpResponse,
  MIME_LIST: () => import__.MIME_LIST,
  RequestEvent: () => import__.RequestEvent,
  decURIComponent: () => import__.decURIComponent,
  findFns: () => import__.findFns,
  multipart: () => import__.multipart,
  s_response: () => import__.s_response
});
module.exports = __toCommonJS(deps_exports);
var import__ = require("./../index");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpError,
  HttpResponse,
  MIME_LIST,
  RequestEvent,
  decURIComponent,
  findFns,
  multipart,
  s_response
});
