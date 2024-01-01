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
var htmx_exports = {};
__export(htmx_exports, {
  htmx: () => htmx,
  useHtmx: () => useHtmx
});
module.exports = __toCommonJS(htmx_exports);
var import_render = require("./render");
var import_hook = require("./hook");
const useHtmx = (opts = {}) => {
  if (import_render.internal.htmx)
    return;
  import_render.internal.htmx = true;
  opts.src ??= "//unpkg.com/htmx.org";
  (0, import_hook.createHookLib)(opts);
};
const htmx = (opts = {}) => {
  import_render.internal.htmx = true;
  return (rev, next) => {
    opts.src ??= "//unpkg.com/htmx.org";
    (0, import_hook.createHookLib)(opts, rev);
    return next();
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  htmx,
  useHtmx
});
