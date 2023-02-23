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
  validate: () => validate
});
var import_class_validator = require("class-validator");
var import_deps = require("./deps");
var import_controller = require("./controller");
__reExport(class_validator_exports, require("class-validator"));
function validate(_class, opts = {}) {
  return async (rev, next) => {
    const obj = new _class();
    Object.assign(obj, rev.body);
    try {
      await (0, import_class_validator.validateOrReject)(obj, opts);
    } catch (error) {
      throw new import_deps.HttpError(422, error);
    }
    return next();
  };
}
function Validate(_class, opts = {}) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    (0, import_controller.joinHandlers)(className, prop, [validate(_class, opts)]);
    return des;
  };
}
module.exports = __toCommonJS(class_validator_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validate,
  validate
});
