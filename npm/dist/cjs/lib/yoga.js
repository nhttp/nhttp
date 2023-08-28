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
var yoga_exports = {};
__export(yoga_exports, {
  default: () => yoga_default,
  yogaHandler: () => yogaHandler
});
module.exports = __toCommonJS(yoga_exports);
const yogaHandler = (handler) => async (rev) => {
  const resp = await handler(rev.newRequest, rev);
  if (rev.request.raw === void 0)
    return resp;
  return new Response(resp.body, resp);
};
var yoga_default = yogaHandler;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  yogaHandler
});
