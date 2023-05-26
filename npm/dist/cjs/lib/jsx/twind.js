var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var twind_exports = {};
__export(twind_exports, {
  default: () => twind_default,
  install: () => install,
  useTwind: () => useTwind
});
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
  import_render.options.onRenderHtml = (html) => {
    return hook((0, import_core.inline)(html, opts));
  };
};
var twind_default = useTwind;
module.exports = __toCommonJS(twind_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install,
  useTwind
});
