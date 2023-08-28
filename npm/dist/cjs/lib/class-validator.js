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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var class_validator_exports = {};
__export(class_validator_exports, {
  Validate: () => Validate,
  default: () => class_validator_default,
  validate: () => validate
});
module.exports = __toCommonJS(class_validator_exports);
var import_class_validator = require("class-validator");
var import_deps = require("./deps");
var import_controller = require("./controller");
__reExport(class_validator_exports, require("class-validator"), module.exports);
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
      if (opts.onError) {
        return opts.onError(error, rev);
      }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validate,
  validate,
  ...require("class-validator")
});
