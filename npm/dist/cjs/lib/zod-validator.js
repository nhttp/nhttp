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
var zod_validator_exports = {};
__export(zod_validator_exports, {
  Validate: () => Validate,
  default: () => zod_validator_default,
  validate: () => validate,
  z: () => import_zod.z
});
module.exports = __toCommonJS(zod_validator_exports);
var import_zod = require("zod");
var import_controller = require("./controller");
var import_deps = require("./deps");
function validate(schema, target = "body", onError) {
  return (rev, next) => {
    try {
      const tgt = rev[target];
      const res = schema.parse(tgt);
      if (typeof res === "object") {
        rev[target] = res;
      }
      return next();
    } catch (e) {
      if (onError) {
        return onError(e, rev);
      }
      throw new import_deps.HttpError(422, e.errors);
    }
  };
}
function Validate(schema, target = "body", onError) {
  return (tgt, prop, des) => {
    (0, import_controller.joinHandlers)(tgt.constructor.name, prop, [
      validate(schema, target, onError)
    ]);
    return des;
  };
}
var zod_validator_default = validate;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validate,
  validate,
  z
});
