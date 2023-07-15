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
var zod_validator_exports = {};
__export(zod_validator_exports, {
  Validate: () => Validate,
  default: () => zod_validator_default,
  validate: () => validate,
  z: () => import_zod.z
});
var import_zod = require("zod");
var import_controller = require("./controller");
var import_deps = require("./deps");
function validate(schema, target = "body") {
  return (rev, next) => {
    try {
      const tgt = rev[target];
      const res = schema.parse(tgt);
      if (typeof res === "object") {
        rev[target] = res;
      }
      return next();
    } catch (e) {
      throw new import_deps.HttpError(422, e.errors);
    }
  };
}
function Validate(schema, target = "body") {
  return (tgt, prop, des) => {
    (0, import_controller.joinHandlers)(tgt.constructor.name, prop, [validate(schema, target)]);
    return des;
  };
}
var zod_validator_default = validate;
module.exports = __toCommonJS(zod_validator_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validate,
  validate,
  z
});
