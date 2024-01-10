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
var twind_exports = {};
__export(twind_exports, {
  default: () => twind_default,
  twind: () => twind,
  useTwind: () => useTwind
});
module.exports = __toCommonJS(twind_exports);
var import_hook = require("./hook");
var import_render = require("./render");
const useTwind = (opts = {}) => {
  if (import_render.internal.twind)
    return;
  import_render.internal.twind = true;
  opts.src ??= "//cdn.twind.style";
  (0, import_hook.createHookScript)(opts);
};
const twind = (opts = {}) => {
  opts.src ??= "//cdn.twind.style";
  return (rev, next) => {
    (0, import_hook.createHookScript)(opts, rev);
    return next();
  };
};
var twind_default = useTwind;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  twind,
  useTwind
});
