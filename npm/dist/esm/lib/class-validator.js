import {
  validateOrReject
} from "class-validator";
import { HttpError } from "./deps.js";
import { joinHandlers } from "./controller.js";
export * from "class-validator";
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
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new HttpError(422, error);
    }
    return next();
  };
}
function Validate(cls, opts = {}, target = "body") {
  return (tgt, prop, des) => {
    joinHandlers(tgt.constructor.name, prop, [validate(cls, opts, target)]);
    return des;
  };
}
var class_validator_default = validate;
export {
  Validate,
  class_validator_default as default,
  validate
};
