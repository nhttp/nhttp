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
var class_validator_exports = {};
__export(class_validator_exports, {
  Validate: () => Validate,
  default: () => class_validator_default,
  validate: () => validate
});
var import_class_validator = require("class-validator");
var import_deps = require("./deps");
var import_controller = require("./controller");
__reExport(class_validator_exports, require("class-validator"));
function validate(cls, opts = {}, target = "body") {
  return async (rev, next) => {
    try {
      let obj;
      if (opts.plainToClass) {
        obj = opts.plainToClass(cls, rev[target]);
        delete opts.plainToClass;
      } else {
        obj = new cls();
        Object.assign(obj, rev[target]);
      }
      await (0, import_class_validator.validateOrReject)(obj, opts);
    } catch (error) {
      throw new import_deps.HttpError(422, error);
    }
    return next();
  };
}
function Validate(cls, opts = {}, target = "body") {
  return (tgt, prop, des) => {
    (0, import_controller.joinHandlers)(tgt.constructor.name, prop, [validate(cls, opts, target)]);
    return des;
  };
}
var class_validator_default = validate;
module.exports = __toCommonJS(class_validator_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validate,
  validate
});
