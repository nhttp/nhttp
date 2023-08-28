var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var twind_exports = {};
__export(twind_exports, {
  default: () => twind_default,
  install: () => install,
  useTwind: () => useTwind
});
module.exports = __toCommonJS(twind_exports);
var import_core = require("@twind/core");
var import_preset_autoprefix = __toESM(require("@twind/preset-autoprefix"), 1);
var import_preset_tailwind = __toESM(require("@twind/preset-tailwind"), 1);
var import_render = require("./render");
const install = (config = {}, isProduction) => {
  return (0, import_core.install)({
    presets: [(0, import_preset_autoprefix.default)(), (0, import_preset_tailwind.default)()],
    ...config
  }, isProduction);
};
install();
const useTwind = (opts) => {
  const hook = import_render.options.onRenderHtml;
  import_render.options.onRenderHtml = (html, rev) => {
    return hook((0, import_core.inline)(html, opts), rev);
  };
};
var twind_default = useTwind;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install,
  useTwind
});
